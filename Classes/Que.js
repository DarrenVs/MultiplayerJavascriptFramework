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
	
	var data = {};
	var sendTime = 0;
	self.cooldown = defaultValues.cooldown;
	
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
			sendTime = time + self.cooldown
			
			
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
	
	
	var listeners = {};
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
		sendTime = new Date().getTime() + self.cooldown
		ques[ ID ] = self;
	}
}


//Values
var defaultValues = {
	cooldown: 16,
}



//Exports
exports.new = () => {
	
	return new Que();
}