//	Index
var Instance = require("./../Instance");
var roomCount = 0;


//	Functons

sendPackage = function( Player, listenerName, data ) {
	
	if (Player.Socket == undefined) {
		return false
	}
	
	
	Player.Socket.emit( listenerName, data );
}


function Room() {
	var self = this;
	self.class = "Room";
	
	
	//--Functions
	self.addPlayer = ( Player ) => {
		
		//Check if the player is valid
		if (typeof(Player) == "object" && Player.class == 'Player') {
			
			if (self.playerCount < self.maxPlayers) {
				
				ClearPersonalObjects( Player );
				
				Player.CurrentRoom = self;
				Player.lifetime = new Date().getTime() + defaultValues.maxIdle;
				self.players[ Player.ID ] = Player;
				self.playerCount++;
				
				self.broadcastPlayerlist();
				return true;
			}
			
		} else console.error("'Player' is not valid!");
		
		return false;
	};
	self.removePlayer = ( Player, reason ) => {
		
		//Check if the player is valid
		if (typeof(Player) == "object" && Player.class == 'Player') {
			
			if (self.players[ Player.ID ]) {
				
				ClearPersonalObjects( Player );
				
				Player.CurrentRoom = undefined;
				delete self.players[ Player.ID ];
				self.playerCount--;
				
				console.log("Player " + Player.ID + " Has been kicked from room " + self.name + ". Reason: " + reason);
				
				self.broadcastPlayerlist();
				return true;
			}
			
		} else console.error('Player is not valid!');
		
		return false;
	};
	self.broadcastPlayerlist = () => {
		
		var playerlist = {};
		for (var playerID in self.players) {
			
			playerlist[ playerID ] = true;
		}
		for (var playerID in self.players) {
			
			if (self.players[ playerID ].Socket != undefined)
				self.players[ playerID ].Socket.emit("updatePlayerlist", playerlist );
		}
	};
	self.name = roomCount++;
	self.players = {};
	self.playerCount = 0;
	self.maxPlayers = defaultValues.maxPlayers;
	self.maxIdle = defaultValues.maxIdle
	
	self.roomReplyTime = defaultValues.roomReplyTime;
	
	
	self.update = () => {
		
		for (var playerID in self.players) {
			
			if (new Date().getTime() > self.players[ playerID ].lifetime)
				self.removePlayer( self.players[ playerID ], defaultValues.reasons.idle );
		}
	}
	
	
	var workspaceRules = {
		readOnly: defaultValues.workspace.ReadOnly,
		clientsCanSpawnObjects: defaultValues.workspace.clientsCanSpawnObjects,
	}
	var workspace = {
		//ObjectID: Properties { }
		//GameObject's here
	}
	self.workspace = workspace;
	
	self.setObject = ( Player, objectID, properties ) => {
		
		//Check if object exists
		if (!workspace[ objectID ] && workspaceRules.clientsCanSpawnObjects) {
			
			//Create a new one if it doesn't
			var newObject = Instance.new( "GameObject" );
			newObject.classType = properties.classType;
			newObject.creator = Player.ID;
			newObject.ID = objectID;
			workspace[ objectID ] = newObject
			
			Player.PersonalObjects[ objectID ] = newObject
		} else if (!workspaceRules.clientsCanSpawnObjects) console.log("cannot spawn objects from client");
		
		//Set the properties
		for (var propertyName in properties) {
			
			//Check if the property is allowed to be set
			if (defaultValues.allowedProperties[ propertyName ] == true)
				workspace[ objectID ][ propertyName ] = properties[ propertyName ];
		}
		
		
		Que.addQue( objectID, workspace[ objectID ] );
	}
	self.removeObject = ( objectID ) => {
		
		if (workspace[ objectID ]) {
			delete workspace[ objectID ];
		}
	}
	
	
	var Que = Instance.new("Que");
	Que.sendTime = defaultValues.roomReplyTime;
	Que.addListener( "broadcastWorkspace", function(data) {
		
		for (playerID in self.players)
			sendPackage( self.players[ playerID ], "broadcastWorkspace", data );
	} )
}

function ClearPersonalObjects( Player ) {
	
	for (var i in Player.PersonalObjects) {
		
		if (Player.CurrentRoom)
			Player.CurrentRoom.removeObject( Player.PersonalObjects[ i ] );
		else
			Player.PersonalObjects[ i ].Destroy();
	}
}


//Values
var defaultValues = {
	roomReplyTime: 20, //Miliseconds
	maxIdle: 500000, //Miliseconds
	maxPlayers: 2, //Max connections
	reasons: {
		idle: 'For being idle too long',
	},
	
	workspace: {
		readOnly: false,
		clientsCanSpawnObjects: true,
	},
	allowedProperties: {
		position: true,
		velocity: true,
		size: true,
		scale: true,
		class: true,
		controller: true,
		sender: true,
		stageName: true,
		creator: true,
		hitbox: true,
	},
}



//Exports
exports.new = () => {
	
	return new Room();
}