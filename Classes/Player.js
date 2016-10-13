//	Index
var playerCount = 0;


function Player( Socket ) {
	var self = this;
	self.class = "Player";
	
	
	self.updatePlayer = () => {
		
		if (self.Socket) {
			
			self.Socket.emit("IDrequest_to_client", {ID:self.ID, room:(self.CurrentRoom ? self.CurrentRoom.name : undefined)});
		}
	}
	
	self.__defineGetter__( 'Socket', () => {return self._Socket;} )
	self.__defineSetter__( 'Socket', (val) => {
		
		self._Socket = val;
		
		if (self.Socket) {
			self.Socket.removeAllListeners('heartbeat');
			self.Socket.removeAllListeners('object_to_broadcaster');
			self.Socket.removeAllListeners('IDrequest_from_client');
			
			self.Socket.on('heartbeat', function() {
				
				if (self.CurrentRoom)
					self.lifetime = new Date().getTime() + self.CurrentRoom.maxIdle * 2;
				else
					self.lifetime = defaultValues.lifetime;
			});
			
			
			self.Socket.on('objects_to_broadcaster', function(data) {
				
				if (data && self.CurrentRoom) {
					
					for (var objectID in data) {
						
						self.CurrentRoom.setObject( self, ( objectID.indexOf(':') > 0 ? objectID : self.ID + ":" + objectID), data[ objectID ] );
					}
				} else console.log('something went wrong1: ' + data, self.CurrentRoom)
			})
			
			self.Socket.on('IDrequest_from_client', () => {
				
				self.updatePlayer();
			});
			self.updatePlayer();
			
			if (self.Socket && self.CurrentRoom)
				self.Socket.join(self.CurrentRoom.name);
		}
	})
	self.__defineGetter__( 'CurrentRoom', () => {return self._CurrentRoom;} )
	self.__defineSetter__( 'CurrentRoom', (val) => {
		
		if (self.Socket && self.CurrentRoom)
			self.Socket.leave(self.CurrentRoom.name)
		
		self._CurrentRoom = val;
		
		if (self.Socket && self.CurrentRoom)
			self.Socket.join(self.CurrentRoom.name);
		
		self.updatePlayer();
	} );
	
	self.ID = playerCount++;
	self.Socket = Socket;
	self.CurrentRoom = undefined;
	self.lifetime = defaultValues.lifetime;
	
	self.PersonalObjects = {};
}


var defaultValues = {
	lifetime: Infinity, //Miliseconds
}



exports.new = () => {
	return new Player();
}