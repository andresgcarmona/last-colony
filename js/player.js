if(!LC){
	var	LC = {};
}

LC.Player = (function(APP, w){
	//Private variables and dependencies
	var utils = APP.utils;

	var Player = function Player(game, name, team){
		this.game = game || null;
		this.name = name || 'anonymous';
		this.team = team || 'blue';
	};

	Player.prototype = (function(){
		return {
			getName: function(){
				return this.name;
			},
			getTeam: function(){
				return this.team;
			},
			setGame: function(game){
				this.game = game;
				return this;
			},
			startLevel: function(){
				var player = this;
				
				this.game.showMissionBriefing();
				
				//Set map object
				this.game.currentMap = this.game.currentLevel.getMap();
				this.game.offsetX = this.game.currentLevel.startX * this.game.gridSize;
				this.game.offsetY = this.game.currentLevel.startY * this.game.gridSize;

				//Load level requirements
				this.game.resetArrays();

				for(var i in this.game.currentLevel.items){
					var item = this.game.currentLevel.items[i],
						name = item['name'];
						
					item.game = this.game;

					switch(name){
						case 'base':
							var item = new APP.Base(item);
							console.log(item);
							
							this.game.items.push(item);
							break;
						case 'starport':
							var item = new APP.StarPort(item);
							console.log(item);
							
							this.game.items.push(item);
							break;
						case 'harvester':
							var item = new APP.Harvester(item);
							console.log(item);
							
							this.game.items.push(item);
							break;
					}
				}

				if(this.game.loader.loaded){
					this.game.$gameContainer.trigger('game:levelstarted', this);	
				}
				else{
					this.game.loader.onload = function(){
						player.game.$gameContainer.trigger('game:levelstarted', this);
					};
				}
			},
			play: function(){
				this.game.animationLoop();
				this.game.animationInterval = setInterval(this.game.animationLoop, this.game.animationTimeout);
				this.game.start();
			}
		};
	})();

	return Player;
})(LC, window);
