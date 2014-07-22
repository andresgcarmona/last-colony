<!DOCTYPE html>
<html lang="es">
	<head>
		<meta chartset="utf8">
		<title>Last Colony</title>
		<script src="js/jquery-2.1.1.js"></script>
		<script src="js/init.js"></script>
		<script src="js/loader.js"></script>
		<script src="js/map.js"></script>
		<script src="js/level.js"></script>
		<script src="js/player.js"></script>
		<script src="js/mouse.js"></script>
		<script src="js/game.js"></script>
		<script src="js/sprite.js"></script>
		<script src="js/item.js"></script>
		<script src="js/buildings.js"></script>
		<link rel="stylesheet" href="css/styles.css" type="text/css" media="screen">
	</head>
	<body>
		<div id="gameContainer">
			<div id="gameStartScreen" class="gameLayer">
				<span id="singleplayer">Campaign</span>
				<span id="multiplayer">Multiplayer</span>
			</div>
			<div id="missionScreen" class="gameLayer">
				<input type="button" id="enterMission" disabled="disabled">
				<input type="button" id="exitMission" disabled="disabled">
				<div id="missionBriefing">
				</div>
			</div>
			<div id="loadingScreen" class="gameLayer">
				<div id="loadingMessage"></div>
			</div>
			<div id="gameInterfaceScreen" class="gameLayer">
				<div id="gameMessages"></div>
				<div id="callerPicture"></div>
				<div id="cash"></div>
				<div id="sidebarButtons"></div>
				<canvas id="gameBackgroundCanvas" height="400" width="480"></canvas>
				<canvas id="gameForegroundCanvas" height="400" width="480"></canvas>
			</div>
		</div>
		<script>
			$(window).on('load', function(){
				var game = LC.game;

				if(game){
					game.init();
				}
			});
		</script>
	</body>
</html>
