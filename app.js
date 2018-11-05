var canvas, context;
var tool, board, mouse;
var connection, connected;

//INITIAL FUNCTION//
function start(){
	
	//Get context
	canvas = document.getElementById("board");
	context = canvas.getContext("2d");
	
	//Stretch canvas to window size
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	
	//Create tool
	tool = new Tool();
	
	//Create board and clear screen
	board = new Board();
	board.clear(tool.color_clear);
	
	//Create mouse
	mouse = new Mouse();
	
	//Bind Colorpicker event
	document.getElementById("pickerDraw").addEventListener("change", pickerD_changed, false);
	document.getElementById("pickerClear").addEventListener("change", pickerC_changed, false);
	document.getElementById("rangeSlider").addEventListener("change", sliderT_changed, false);
	window.addEventListener("keydown", keydown, false);
	
	//Range Slider Value changing
	var slider = document.getElementById("rangeSlider");
	var output = document.getElementById("slider-value");
	
	output.innerHTML = slider.value;
	
	slider.oninput = function() {
	  output.innerHTML = this.value;
	}
	
	//Connect to Server
	connect();
}

//BOARD//
class Board {
	
	setLineStyle(color, size){
		
		context.strokeStyle = color;
		context.lineWidth = size;
		context.lineJoin = "round";
		context.lineCap = "round";
		context.shadowBlur = 2;
		context.shadowColor = color;
	}
	
	drawRect(posx, posy, size, color){
		
		context.fillStyle = color;
		context.fillRect(posx, posy, size, size);
	}
	
	drawImage(x, y, img, size){
		context.drawImage(document.getElementById(img), x, y, size, size);
	}
	
	drawText(x, y, txt, font, size, color){
		
		context.font = size.toString() + "px " + font;
		context.fillStyle = color;
		context.fillText(txt, x, y);
		
	}
	
	createTable(x1, y1, x2, y2, columnCount, rowCount, size, color){
		
		var tableSizeX = x2 -x1;
		var tableSizeY = y2 -y1;
		
		var columnSize = tableSizeX / columnCount;
		var rowSize = tableSizeY / rowCount;
		
		this.setLineStyle(color, size);
		
		rowCount++;
		columnCount++;
		
		for(var x = 0; x < columnCount; x++){
			var xx = (x * columnSize) + parseInt(x1);
			context.beginPath();
			context.moveTo(xx, y1);
			context.lineTo(xx, y2);
			context.stroke();
		}
		for(var y = 0; y < rowCount; y++){
			var yy = (y * rowSize) + parseInt(y1);
			context.beginPath();
			context.moveTo(x1, yy);
			context.lineTo(x2, yy);
			context.stroke();
		}
	}
	
	drawLine(x1, y1, x2, y2, size, color){
		
		this.setLineStyle(color, size);
		
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.stroke();
	}
	
	clear(color){
		
		//Clear screen
		context.fillStyle = color;
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	
}

//TOOL//
class Tool {
	
	constructor(){
		this.type = "pen";
		
		this.thickness = document.getElementById("rangeSlider").value;
		this.color_draw = document.getElementById("pickerDraw").value;
		this.color_clear = document.getElementById("pickerClear").value;
		
		this.newLine = true;
		this.newTable = true;
		
		this.cursorPosX = 0;
		this.cursorPosY = 0;
		this.textStartX = 0;
		
		this.textMultiplier = 10;
		this.stampMultiplier = 10;
		
		this.stamp = 0;
	}
	
	setType(type){
		this.type = type;
	}
	
	startNew(){
		this.newLine = true;
		this.newTable = true;
	}
	
	draw(){
		if(this.type == "pen")
			sendToServer("line " + mouse.oldx + " " + mouse.oldy + " " + mouse.x + " " + mouse.y + " " + this.thickness + " " + this.color_draw);
		else if(this.type == "rubber")
			sendToServer("line " + mouse.oldx + " " + mouse.oldy + " " + mouse.x + " " + mouse.y + " " + this.thickness + " " + this.color_clear);
		
	}
	
	enter(){
		if(this.type == "text"){
			this.cursorPosX = this.textStartX;
			this.cursorPosY += (this.thickness * this.textMultiplier);
		}
	}
	
	draw_key(key){
		if(this.type == "text"){
			var text_size = (this.thickness * this.textMultiplier);
			var font = "Calibri";
			
			sendToServer("text " + this.cursorPosX + " " + this.cursorPosY + " " + key + " " + font + " " + text_size + " " + this.color_draw);
			
			context.font = text_size.toString() + "px " + font;
			var w = context.measureText(key).width;
			this.cursorPosX += w;
		}
	}
	
	draw_click(){
		if(this.type == "line"){
			if(!this.newLine)
				sendToServer("line " + mouse.last_clicked_x + " " + mouse.last_clicked_y + " " + mouse.x + " " + mouse.y + " " + this.thickness + " " + this.color_draw);
			this.newLine = false;
		}else{
			this.newLine = true;
		}
		
		if(this.type == "table"){
			if(!this.newTable){
				sendToServer("table " + mouse.last_clicked_x + " " + mouse.last_clicked_y + " " + mouse.x + " " + mouse.y + " " + document.getElementById("tableColumn").value + " " + document.getElementById("tableRow").value + " " + this.thickness + " " + this.color_draw);
				this.startNew();
			}else
				this.newTable = false;
		}else{
			this.newTable = true;
		}
		
		if(this.type == "text"){
			this.cursorPosX = mouse.x;
			this.cursorPosY = mouse.y;
			this.textStartX = mouse.x;
		}
		
		if(this.type == "stamp"){
			var imageSize = this.thickness * this.stampMultiplier;
			var x = mouse.x -(imageSize / 2);
			var y = mouse.y -(imageSize / 2);
			sendToServer("stamp " + x + " " + y + " " + this.stamp + " " + imageSize);
		}
	}
	
}

//KEY LISTENERS//
function keydown(e){
	if(e.key.length == 1) 
		tool.draw_key(e.key);
	
	if(e.key == "Enter"){
		tool.enter();
	}
}

//MOUSE LISTENERS//
function mousedown(e){
	mouse.click();
	mouse.clicked = true;
}
function mouseup(e){
	mouse.clicked = false;
}
function mousemove(e){
	if(canvas){
		mouse.setPosition(e.clientX -canvas.getBoundingClientRect().left, 
			e.clientY -canvas.getBoundingClientRect().top);
		
		if(mouse.clicked)
			tool.draw();
	}
}

//MOUSE//
class Mouse {
	
	constructor() {
		this.x = 0;
		this.y = 0;
		this.oldx = 0;
		this.oldy = 0;
		this.clicked = false;
		this.last_clicked_x = 0;
		this.last_clicked_y = 0;
	}
	
	click(){
		tool.draw_click();
		
		this.last_clicked_x = this.x;
		this.last_clicked_y = this.y;
	}
	
	setPosition(x, y) {
		this.oldx = this.x;
		this.oldy = this.y;
		this.x = x;
		this.y = y;
	}
	
}

//NETWORK FUNCTIONS//
function connect(){
	
	//Connection for release
	connection = new WebSocket("wss:localhost:666");
	
	connection.onopen = function(){
		connected = true;
		sendToServer("setup");
	}
	
	connection.onmessage = function(e){
		var args = e.data.split(" ");
		drawNet(args);
	}
}
function sendToServer(msg){
	if(connected)
		connection.send(msg);
}
function drawNet(args){
	if(args[0] == "rect"){
		board.drawRect(args[1], args[2], args[3], args[4]);
	}else if(args[0] == "line"){
		board.drawLine(args[1], args[2], args[3], args[4], args[5], args[6]);
	}else if(args[0] == "clear"){
		board.clear(args[1]);
	}else if(args[0] == "table"){
		board.createTable(args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
	}else if(args[0] == "text"){
		board.drawText(args[1], args[2], args[3], args[4], args[5], args[6]);
	}else if(args[0] == "stamp"){
		board.drawImage(args[1], args[2], args[3], args[4]);
	}
}

//TOOLBAR LISTENERS//
function clear_bt(){
	sendToServer("clear " + tool.color_clear);
	tool.startNew();
}
function pen_bt(){
	tool.setType("pen");
}
function line_bt(){
	tool.setType("line");
	tool.startNew();
}
function table_bt(){
	tool.setType("table");
}
function text_bt(){
	tool.setType("text");
}
function rubber_bt(){
	tool.setType("rubber");
}
function pickerD_changed(e){
	tool.color_draw = e.target.value;
}
function pickerC_changed(e){
	tool.color_clear = e.target.value;
	sendToServer("clear " + tool.color_clear);
	tool.startNew();
}
function sliderT_changed(e){
	tool.thickness = e.target.value;
}
function stamp_bt(img){
	tool.setType("stamp");
	tool.stamp = img;
}

//WEBSITE FUNCTIONS//
function table_dropdown() {
	document.getElementById("table-dropdown").classList.toggle("show");
}