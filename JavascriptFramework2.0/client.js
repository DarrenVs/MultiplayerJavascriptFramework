
//		Index		
var socketio = io.connect(window.location.host);
var Playerlist = {};
var clientID = -1;
var room = -1;


socketio.on("updatePlayerlist", (data) => {
	
	Playerlist = data;
});
socketio.on("broadcastWorkspace", (data) => {
	
	for (var objectID in data) {
		
		if (Game.PingPong && data[ objectID ].sender != clientID) {
			if (!Game.PingPong.childs[ objectID ]) {
				if ([data.classType] == undefined)
					console.error("cannot make this object, classType is undefined. " + data.classType);
				
				console.log("Making a new " + data.classType);
				[data.classType]().parent = Game.PingPong;
			}
			
			for (var propertyName in data[ objectID ]) {
				
				if (allowedProperties[ propertyName ] == true)
					Game.PingPong.childs[ objectID ][ propertyName ] = data[ objectID ][ propertyName ];
				
			}
		}
	}
});
allowedProperties = {
	
	position: true,
	velocity: true,
	size: true,
	scale: true,
	controller: true,
	sender: true,
}

//Request the ID
socketio.on("IDrequest_to_client", function (data) {
    
	clientID = data.ID;
	room = data.room;
});
socketio.emit("IDrequest_from_client");


window.setInterval(() => {
	
	socketio.emit("heartbeat");
}, 1000);





function PackageObject( Obj ) {
	
	var package = {}
	for (propertyName in allowedProperties) {
		
		package[ propertyName ] = Obj[ propertyName ];
	}
	
	
	return package;
}







//		QueClass
//	Index
quesCounter = 0;
setInterval(() => {
	
	for (var queID in ques)
		ques[ queID ].update();
}, 10)
var ques = {
	//queID: QueObject,
}


//	Functons
function Que() {
	var self = this;
	self.class = "Que";
	
	var ID = quesCounter++;
	
	var data = {}
	var sendTime = 0;
	
	//Add data item
	self.addQue = (key, value) => {
		
		data[ key ] = value;
	}
	self.deleteQueItem = (key) => {
		
		delete data[ key ];
	}
	self.deleteQue = (key) => {
		
		data = {};
	}
	
	self.update = () => {
		
		var time = new Date().getTime();
		
		//Check for the cooldown
		if (time > sendTime) {
			
			//Reset timer
			sendTime = time + defaultValues.sendTime
			
			
			//Check if the list isn't empty
			if (Object.keys(data).length > 0) {
				
				
				//Fire events
				for (var index in listeners)
					listeners[index]( data )
				
				//Make a new data object incase the listeners are using the old data object
				data = {};
			}
		}
	}
	
	
	listeners = {};
	self.addListener = ( name, funct ) => {
		
		if (name != undefined && typeof(funct) == "function")
			listeners[ name ] = funct;
		else console.error( "funct or name is missing or invalid" )
	}
	self.removeListener = ( name ) => {
		
		if (listeners[ name ])
			delete listeners[ name ];
	}
	
	
	//To stop/start the data
	ques[ ID ] = self;
	self.stop = () => {
		delete ques[ ID ];
	}
	self.start = () => {
		sendTime = new Date().getTime() + defaultValues.sendTime
		ques[ ID ] = self;
	}
}


//Values
var defaultValues = {
	sendTime: 100,
}




function SendObject( Obj ) {
	
	Obj.sender = clientID;
	sendQue.addQue( Obj.ID, PackageObject(Obj) );
}






var sendQue = new Que()
sendQue.addListener( "replicator", (data) => {
	
	socketio.emit("objects_to_broadcaster", data);
} )