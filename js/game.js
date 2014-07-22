if(!LC){
	var LC = {};
}

LC.game = (function(APP, w){
	//Private variables and dependencies
	var print = true,
		k = 1;
	
	var utils = APP.utils,
		Timer = utils.Timer,
		game = {	
			loader: null,
			mouse: null,
			running: false,
			gridSize: 20,
			backgroundChanged: true,
			animationTimeout: 100,
			offsetX: 0,
			offsetY: 0,
			panningThreshold: 60,
			panningSpeed: 10,
			currentLevelNumber: 0,
			type: 'singleplayer',
			timer: null,
			players: [],
			player: null,
			currentLevel: null,
			gameMode: 'singleplayer',
			levelJSON: null,
			itemCounter: 0,
			init: function(){
				console.log('Initializing game...');
				var game = this;
				game.mouse = LC.mouse.init(game);
				game.timer = new Timer();
				
				//UI
				this.$gameContainer = $('#gameContainer');
				this.$gameLayer = $('.gameLayer');
				this.$gameStartScreen = $('#gameStartScreen');
				this.$gameInterfaceScreen = $('#gameInterfaceScreen');
				this.$singlePlayer = $('#singleplayer');
				this.$enterMission = $('#enterMission');
				this.$missionBriefing = $('#missionBriefing');
				this.$missionScreen = $('#missionScreen');
				this.$loadingScreen = $('#loadingScreen');
				this.$loadingMessage = $('#loadingMessage');

				//Canvas
				this.bgCanvas = $('#gameBackgroundCanvas')[0];
				this.fgCanvas = $('#gameForegroundCanvas')[0];
				this.bgContext = this.bgCanvas.getContext('2d');
				this.fgContext = this.fgCanvas.getContext('2d');

				//Canvas width and height
				this.canvasWidth = this.bgCanvas.width;
				this.canvasHeight = this.bgCanvas.height;
				
				this.$gameLayer.hide();
				this.$gameStartScreen.show();

				this.$singlePlayer.on('click', function(e){
					game.singlePlayer();
				});

				this.$enterMission.on('click', function(e){
					if(game.gameMode === 'singleplayer'){
						game.player.play();
					}
					else if(game.gameMode === 'multiplayer'){
					}
				});

				this.initPlayers();
			},
			singlePlayer: function(){
				var game = this,
					player = new LC.Player(this);
				
				//Load level info
				this.loadLevelInfo(function(levelInfo){
					if(levelInfo){
						game.currentLevel = new LC.Level(levelInfo[game.currentLevelNumber], game.loader);
						game.player = player;

						game.$gameContainer.on('game:levelstarted', function(){
							game.$enterMission.prop('disabled', false);
						});

						game.player.startLevel();
					}
				});
			},
			multiPlayer: function(){
			},
			loadLevelInfo: function(callback){
				//Loading levels info
				console.log('Loading levels info...');
				
				if(!this.levelJSON){
					var game = this;
					var xhr = $.getJSON('data/levels.json').done(function(levelInfo){
						if(callback){
							game.levelJSON = levelInfo;
							callback(levelInfo);
						}
					}).fail(function(data, status, error){
						console.log('failed', arguments, error);
					});
				}
				else{
					callback(this.levelJSON);
				}
			},
			start: function(){
				var game = this;

				this.$gameLayer.hide();
				this.$gameInterfaceScreen.show();
				
				this.running = true;
				this.refreshBackground = true;
				this.drawingLoop.call(this);
			},
			initPlayers: function(){
				if(this.players.length){
					for(p in this.players){
						var player = this.players[p],
							that = this;

						player.setGame(this);
					}
				}
			},	
			showMissionBriefing: function(){
				this.$enterMission.prop('disabled', false);
				this.$missionBriefing.html(this.currentLevel.briefing.replace(/\n/g, '<br>'));
				this.$missionScreen.show();
			},
			drawingLoop: function(){
				LC.game.timer.update();
				LC.game.handlePanning();
				
				if(LC.game.refreshBackground){
					LC.game.bgContext.drawImage(LC.game.currentMap.getMapImage(),
												LC.game.offsetX,
												LC.game.offsetY,
												LC.game.canvasWidth,
												LC.game.canvasHeight,
												0,
												0,
												LC.game.canvasWidth,
												LC.game.canvasHeight);

					LC.game.refreshBackground = false;
				}
				
				LC.game.fgContext.clearRect(0, 0, LC.game.canvasWidth, LC.game.canvasHeight);
				
				for(var i = LC.game.sortedItems.length - 1; i >= 0; i -= 1){
					LC.game.sortedItems[i].animate();
				}
				
				LC.game.mouse.draw();

				if(LC.game.running){
					/*if(k <= 4){
						setTimeout(function(){
							k += 1;
							LC.game.drawingLoop.call(LC.game);
						}, 500);
					}*/
					
					requestAnimationFrame(LC.game.drawingLoop);
				}
			},
			animationLoop: function(){
				LC.game.sortedItems = $.extend([], LC.game.items);
				LC.game.sortedItems.sort(function(a, b){
					return b.y - a.y + ((b.y == a.y) ? (a.x - b.x) : 0);
				});
			},
			handlePanning: function(){
				if(!this.mouse.insideCanvas){
					return;
				}
				
				if(this.mouse.x <= this.panningThreshold){
					if(this.offsetX >= LC.game.panningSpeed){
						this.refreshBackground = true;
						this.offsetX -= this.panningSpeed;
					}
				}
				else if(this.mouse.x >= this.canvasWidth - this.panningThreshold){
					if(this.offsetX + this.canvasWidth + this.panningSpeed <= this.currentMap.getMapImage().width){
						this.refreshBackground = true;
						this.offsetX += this.panningSpeed;
					}
				}

				if(this.mouse.y <= this.panningThreshold){
					if(this.offsetY >= this.panningSpeed){
						this.refreshBackground = true;
						this.offsetY -= this.panningSpeed;
					}
				}
				else if(this.mouse.y >= this.canvasHeight - this.panningThreshold){
					if(this.offsetY + this.canvasHeight + this.panningSpeed <= this.currentMap.getMapImage().height){
						this.refreshBackground = true;
						this.offsetY += this.panningSpeed;
					}
				}

				if(this.refreshBackground){
					this.mouse.calculateGameCoordinates();
				}
			},
			resetArrays: function(){
				game.counter = 1;
				game.items = [];
				game.sortedItems = [];
				game.buildings = [];
				game.vehicles = [];
				game.aircraft = [];
				game.terrain = [];
				game.tiggeredEvents = [];
				game.selectedItems = [];
				game.sortedItems = [];
			},
			addItem: function(item){
				if(!item.uid){
					item.uid = this.itemCounter += 1;
				}
				
				this.items.push(item);
				
				if(!this[item.type]){
					this[item.type] = [];
				}
				
				this[item.type].push(item);
			},
			removeItem: function(item){
				item.selected = false;
				
				for(var i = this.selectedItems.length - 1; i >= 0; i -= 1){
					if(this.selectedItems[i].uid === item.uid){
						this.selectedItems.splice(i, 1);
						break;
					}
				}
		
				for(var i = this.items.length - 1; i >= 0; i -= 1){
					if(this.items[i].uid === item.uid){
						this.items.splice(i, 1);
						break;
					}
				}
		
				for(var i = this[item.type].length - 1; i >= 0; i -= 1){
					if(this[item.type][i].uid === item.uid){
						this[item.type].splice(i, 1);
						break;
					}
				}
			}
		};

		game.loader = LC.loader.init(game);

	return game;
})(LC, window);
