//	Index
var playerCount = 0;


function Player( Socket ) {
	var self = this;
	self.class = "Player";
	
	
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
						
						self.CurrentRoom.setObject( objectID, data[ objectID ] );
					}
				} else console.log('something went wrong1: ' + data, self.CurrentRoom)
			})
			
			self.Socket.on('IDrequest_from_client', () => {
				
				self.Socket.emit("IDrequest_to_client", {ID:self.ID, room:self.CurrentRoom.name});
			});
			self.Socket.emit("IDrequest_to_client", self.ID);
			
			if (self.CurrentRoom) {
				self.CurrentRoom.broadcastPlayerlist();
				self.Socket.emit("IDrequest_to_client", {ID:self.ID, room:self.CurrentRoom.name});
			}
		}
	})
	
	self.ID = playerCount++;
	self.Socket = Socket;
	self.CurrentRoom = undefined;
	self.lifetime = defaultValues.lifetime;
}


var defaultValues = {
	lifetime: Infinity, //Miliseconds
}



exports.new = () => {
	return new Player();
}