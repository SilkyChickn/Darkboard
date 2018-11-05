<!DOCTYPE html>

<?php
	session_start();
	if(isset($_SESSION['username'])){
?>

<html lang="en">

<head>
	<title>Darkboard</title>
	<meta charset="utf-8">
	
	<!-- Override css -->
	<link rel="stylesheet" type="text/css" href="style.css" />

</head>

<body onload="start();">

	<!-- Top Darkboard Box -->
	<div id="darkboard-box-top">
		<div class="logo"></div>
		
		<div class="darkboard-infobar">
			<div class="darkboard-info">
				<h2>Darkboard </h2>
			</div>
		</div>
	</div><!-- Top Darkboard Box -->
	
	<!-- Left Toolbar Box -->
	<div id="toolbar-box-left">
		<div class="main-toolbar toolbar">
			<ul class="tools-menu">
			
				<!-- Pen Color -->
				<li class="tool-item">
					<div class="item-border color-border">
						<input type="color" class="color-item" id="pickerDraw" value="#ffffff"></input>
					</div>
				</li>
				
				<!-- Pencil Tool -->
				<li class="tool-item">
					<div class="item-border">
						<input type="button" class="pencil item" onclick="pen_bt();"></input>
					</div>
				</li>
				
				<!-- Line Tool -->
				<li class="tool-item">
					<div class="item-border">
						<input type="button" class="line item" onclick="line_bt();"></input>
					</div>
				</li>
				
				<!-- Table Tool -->
				<li class="tool-item">
					<div class="item-border dropdown">
						<input type="button" class="table item dropbtn" onclick="table_dropdown();"></input>
						
						<div id="table-dropdown" class="dropdown-content">
							<ul class="table-properties">
								<li class="table-item">
									<div class="table-item-border">
										<p>Column</p>
										<input id="tableColumn" class="table-input column" min="1" max="20" value="4" type="number">
									</div>
								</li>
								<li class="table-item">
									<div class="table-item-border">
										<p>Row</p>
										<input id="tableRow" class="table-input row" min="1" max="20" value="4" type="number">
									</div>
								</li>
							</ul>
							<div class="table-submit">
								<button type="button" class="table-btn" onclick="table_bt();">Table</button>
							</div>
						</div>
					</div>
				</li>
				
				<!-- Text Tool -->
				<li class="tool-item">
					<div class="item-border">
						<input type="button" class="text item" onclick="text_bt();"></input>
					</div>
				</li>
				
				<!-- Rubber Tool -->
				<li class="tool-item">
					<div class="item-border">
						<input type="button" class="rubber item" onclick="rubber_bt();"></input>
					</div>
				</li>
				
				<!-- Canvas Color -->
				<li class="tool-item">
					<div class="item-border color-border">
						<input type="color" class="color-item" id="pickerClear" value="#000000"></input>
					</div>
				</li>
				
				<!-- Clear Tool -->
				<li class="tool-item">
					<div class="item-border">
						<input type="button" class="clear item" onclick="clear_bt();" ></input>
					</div>
				</li>
			</ul>
		</div>
	</div><!-- Left Toolbar Box -->
	
	<!-- Bottom Toolbar Box -->
	<div id="toolbar-box-bottom">
		<div class="toolbar">
			<div class="range-slider-container">
				<p class="slider-title">Pen size: <span id="slider-value"></span></p>
				<div class="range-slider">
					<input type="range" min="1" max="100" value="5" class="slider" id="rangeSlider"></input>
				</div>
			</div>
		</div>
	</div><!-- Bottom Toolbar Box -->
	
	<!-- Canvas Container -->
	<div id="canvas-container">
	
		<!-- Darkboard Canvas -->
		<canvas id="board" onmousemove="mousemove(event);" onmousedown="mousedown(event);" onmouseup="mouseup(event);" onmouseleave="mouseup(event);" >
			Your browser is shit and does not supporting canvas!
		</canvas><!-- Darkboard Canvas -->
	</div><!-- Canvas Container -->
	
	<!-- Scripts -->
	<script src="app.js"></script>
	
</body>

</html>

<?php } else {
	header('Location: ../../index.php');
} ?>