'use strict';

var WebSocketServer = require('ws');
var https = require('https');
var fs = require('fs');

var server = https.createServer({
	cert: fs.readFileSync('../../ssl/public.pem'),
	key: fs.readFileSync('../../ssl/private.pem')
});
server.listen(666);

console.log("Server Started...");

//Clients
var clients = [];

// create the server
var wsServer = new WebSocketServer.Server({server});

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
				//Send picture//
			} else {
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
