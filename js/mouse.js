if(!LC){
	var LC = {};
}

LC.mouse = (function(APP, w){
	//Private variables and dependencies
	var game = undefined;
	
	return {
		x: 0,
		y: 0,
		gameX: 0,
		gameY: 0,
		gridX: 0,
		gridY: 0,
		buttonPressed: false,
		dragSelect: false,
		insideCanvas: false,
		init: function(g){
			var $mouseCanvas = $('#gameForegroundCanvas'),
				mouse = this;
				
			game = g;
			console.log('Initializing mouse...');
			
			$mouseCanvas.on('mousemove', function(e){
				var offset = $mouseCanvas.offset();
	
				mouse.x = e.pageX - offset.left;
				mouse.y = e.pageY - offset.top;
	
				mouse.calculateGameCoordinates();
	
				if(mouse.buttonPressed){
					if((Math.abs(mouse.dragX - mouse.gameX) > 4 || Math.abs(mouse.dragY - mouse.gameY) > 4)){
						mouse.dragSelect = true;
					}
				}
				else{
					mouse.dragSelect = false;
				}
			});
	
			$mouseCanvas.on('click', function(e){
				mouse.click(e, false);
				mouse.dragSelect = false;
	
				return false;
			});
	
			$mouseCanvas.on('mousedown', function(e){
				console.log(e.which);
	
				if(e.which == 1){
					mouse.buttonPressed = true;
					mouse.dragX = mouse.gameX;
					mouse.dragY = mouse.gameY;
				}
	
				return false;
			});
	
			$mouseCanvas.on('contextmenu', function(e){
				console.log('contextmenu');
				mouse.click(e, true);
				return false;
			});
	
			$mouseCanvas.on('mouseup', function(e){
				console.log('mouseup');
				var shiftPressed = e.shiftKey;
	
				if(e.which == 1){
					mouse.buttonPressed = false;
					mouse.dragSelect = false;
				}
	
				return false;
			});
	
			$mouseCanvas.on('mouseleave', function(e){
				console.log('mouseleave');
				mouse.insideCanvas = false;
			});
			
			$mouseCanvas.on('mouseenter', function(e){
				console.log('mouseenter');
				mouse.insideCanvas = true;
				mouse.buttonPressed = false;
			});
			
			return this;
		},
		click: function(ev, rightClick){
		},
		draw: function(){
			if(this.dragSelect){
				var x = Math.min(this.gameX, this.dragX);
				var y = Math.min(this.gameY, this.dragY);
				var width = Math.abs(this.gameX - this.dragX);
				var height = Math.abs(this.gameY - this.dragY);
				
				game.fgContext.strokeStyle = 'white';
				game.fgContext.strokeRect(x - game.offsetX, y - game.offsetY, width, height);
			}
		},
		calculateGameCoordinates: function(){
			this.gameX = this.x + game.offsetX;
			this.gameY = this.y + game.offsetY;
			this.gridX = Math.floor((this.gameX) / game.gridSize);
			this.gridY = Math.floor((this.gameY) / game.gridSize);
		}
	};
})(LC, window);
