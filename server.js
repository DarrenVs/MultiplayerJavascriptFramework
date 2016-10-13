//--		Index	   --\\

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Instance = require("./Instance");

// Send index.html
app.use(express.static(__dirname + '/JavascriptFramework2.0'));
app.get('/', function (req, res) {
	
	res.sendFile('index.html');
})
//Turn on the server
server.listen(80);









//--		Functions/Methods	   --\\

function GetRooms( SortOptions ) {
	
	return Rooms;
}


function newRoom() {
	var Room = Instance.new("Room");
	
	Rooms[ Room.name ] = Room;
	
	return Room;
}


function quickJoinRoom( Player ) {
	
	
	//Try to join any room starting from index 0;
	for (var roomIndex in GetRooms()) {
		console.log(Object.keys(Rooms[ roomIndex ].players).length);
		if (Rooms[roomIndex].addPlayer( Player ))
			break;
	}
	
	
	//If there are no rooms to join, Create a new room and join that one
	if (Player.CurrentRoom == undefined)
		newRoom().addPlayer( Player );
}





//Called on connecting players
function connectPlayer( Player ) {
	
	GlobalPlayerlist[ Player.ID ] = Player;
}
//Called on disconnecing players
function disconnectPlayer( Player, reason ) {
	
	//Kick the player from it's room
	Player.CurrentRoom.Players.removePlayer( Player, reason );
	
	//Remove the player from the connections list
	if (GlobalPlayerlist[ Player.ID ] != undefined)
		delete GlobalPlayerlist[ Player.ID ];
	
	//Disconnect the socket (if it has a socket. (dummy players support))
	if (Player.Socket != undefined)
		Player.Socket.disconnect( true );
}






//--		Values	  --\\


//Rooms for the players
var Rooms = {}
var GlobalPlayerlist = {
	//PlayerID: PlayerObject,
}





//--		Events	  
setInterval(() => {
	for (var roomName in Rooms)
		Rooms[roomName].update();
}, 1000)

//  When a client connects
io.sockets.on('connection', ( Socket ) => {
	
	//Create the Player object
	var Player = Instance.new("Player");
	Player.Socket = Socket;
	
	
	//Add the player to the connections list
	connectPlayer( Player );
	
	
	//Quickly join a room
	quickJoinRoom( Player );
	
	
	//Log Player info:
	console.log("----------");
	console.log("PlayerID: " + Player.ID);
	console.log("RoomName: " + Player.CurrentRoom.name);
})


var que = Instance.new("Que");

que.addQue( "test", 123 )
que.addListener( "testing", (data) => {
	
	console.log( data );
} )




//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
var connectedSockets = {}; //Connected sockets (for access to the socket's methods for example: disconnecting the socket or for a private emit)
var timeoutTime = 60000; //Ms seconds
var serverRepsonseTime = 10; //Ms seconds
var maxRoomConnectionCount = 4;


var objectPackages = "";


var rooms = {}



function CreateRoom( roomName ) {
	
	currentRoom = Object.keys(rooms).length;
	rooms[Object.keys(rooms).length] = {
		objectPackages: "",
		Players: {
			socketID: true,
		},
	}
}
function JoinRoom( roomName ) {
	
	
	
}

io.sockets.on('connection', function(socket) {
	
	//Set the client's ID
	var socketID = connectionCounter++;
	connectedSockets[socketID] = socket;
	console.log(socketID + " connected");
	
	//Set the client's room
	var currentRoom = undefined;
	for (var i in rooms) {
		if (Object.keys(rooms[i].Players).length < maxRoomConnectionCount) {
			
			rooms[i].Players[socketID] = timeoutTime;
			currentRoom = i;
		}
	}
	
	if (currentRoom == undefined) {
		
		currentRoom = Object.keys(rooms).length;
		rooms[Object.keys(rooms).length] = {
			objectPackages: "",
			Players: {
				[socketID]: timeoutTime,
			},
		}
	}
	
	//Join the current room
	socket.join(currentRoom);
	
	console.log("Room: " + currentRoom + " has a playercount of: " + Object.keys(rooms[currentRoom].Players).length);
	
	
	//Give the client's information
	socket.on('IDrequest_from_client', function() {
		
		socket.emit("IDrequest_to_client", {socketID:socketID, socketRoom:currentRoom});
	});
	
	
	socket.on('disconnect', function() {
		delete connectedSockets[socketID];
		delete rooms[currentRoom].Players[socketID];
		io.sockets.in(currentRoom).emit("UpdatePlayerlist", rooms[currentRoom].Players);
		
		console.log(socketID + " disconnected");
		console.log("Room: " + currentRoom + " has a playercount of: " + Object.keys(rooms[currentRoom].Players).length);
	});
	
	//On client request playerlist
	io.sockets.in(currentRoom).emit("UpdatePlayerlist", rooms[currentRoom].Players);
	
	
	//Give the socket a broadcaster
	socket.on('object_to_broadcaster', function(data) {
		
		rooms[currentRoom].objectPackages += (rooms[currentRoom].objectPackages ? ',' : '{' ) + '"' + objectCounter++ + '":' + data["stringifyedObject"];
	});
	
	
	
	//To check if the client is still connected
	socket.on('onHeartbeat', function() {
		
		rooms[currentRoom].Players[socketID] = timeoutTime;
	});
	
	//Broadcast events to other clients
	socket.on('event', function( data ) {
		io.sockets.in(currentRoom).emit("event", data);
	});
});



setInterval(function(){
	
	for (var i in rooms) {
		if (rooms[i].objectPackages) {
			io.sockets.in(i).emit("object_from_broadcaster", rooms[i].objectPackages + "}");
			rooms[i].objectPackages = "";
		}
		for (var socketID in rooms[i].Players) {
			rooms[i].Players[socketID] -= serverRepsonseTime;
			
			if (connectedSockets[socketID] == undefined) {
				console.log(socketID + "was undefined, Removing '" + socketID + "' from server");
				
				delete connectedSockets[socketID];
				if (rooms[i].Players[socketID] != undefined)
					delete rooms[i].Players[socketID];
				
				io.sockets.in(i).emit("UpdatePlayerlist", rooms[i].Players);
				
			} else if (rooms[i].Players[socketID] <= 0) {
				console.log("Socket: " + socketID + " died to no heartbeat in room: " + i + ". Disconnecing client..");
				connectedSockets[socketID].disconnect( true );
			}
		}
	}
}, serverRepsonseTime)
*/
