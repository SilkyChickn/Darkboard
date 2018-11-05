'use strict';

var WebSocketServer = require('ws');
var http = require('http');
var fs = require('fs');

var server = http.createServer();
server.listen(666);

console.log("Server Started...");

//Clients
var clients = [];

// create the server
var wsServer = new WebSocketServer.Server({server});

//Steps Since Clear
var steps = [];

//WebSocket server
wsServer.on('connection', function(connection) {

	//New Client Connected
	clients.push(new Client(connection));
	console.log("New Client Connected!");
});

/*
function sendToAllExceptCon(connection, msg){
	clients.forEach(function(c){
		if(c.connection != connection){
			c.send(msg);
		}
	});
}
*/

function sendToAll(msg){
	clients.forEach(function(c){
		c.send(msg);
	});
}

class Client {

	constructor(connection){
		this.connection = connection;
		
		//Getting Message From Client
		connection.on('message', function(msg){
			
			if (msg == "setup"){
				steps.forEach(function(e){
					connection.send(e);
				});
			}else if(msg == "back"){
				
				if(steps.length > 0) steps.pop(); //Remove Last Step
				sendToAll("clear black"); //Clear Screen
				
				//Send All Steps Without last
				steps.forEach(function(e){
					sendToAll(e);
				});
			}else {
				steps.push(msg);
				sendToAll(msg);
			}
		});
		
		//Client Disconnected
		connection.on('close', function(connection) {
			console.log("Client Disconnected!");
		});
	}
	
	send(msg){
		try{
			this.connection.send(msg);
		}catch(e){}
	}
}
