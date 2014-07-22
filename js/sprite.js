if(!LC){
	var LC = {};
}

LC.Sprite = (function(APP, w){
	//Private variables and dependencies
	var utils = APP.utils,
		Timer = utils.Timer;

	var Sprite = function Sprite(src, w, h, absOffsetX, offsetX, offsetY, frames, duration, direction){
		this.spritesheet = null;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.absOffsetX = absOffsetX;
		this.width = w;
		this.height= h;
		this.frames = frames;
		this.currentFrame = this.currentFrame || 0;
		this.duration = this.duration || duration;
		this.x = this.x || 0;
		this.y = this.y || 0;
		this.display = this.display || true;
		this.zoomLevel = 1;
		this.direction = direction || 'normal';
		
		if(this.direction === 'reverse'){
			this.currentFrame = this.frames;
		}

		this.setSpritesheet(src);
		this.updateFTime();
	};

	Sprite.prototype = (function(){
		return {
			updateFTime: function(){
				var d = new Date();

				if(this.duration > 0 && this.frames > 0){
					this.ftime = d.getTime() + (this.duration / this.frames);
				}
				else{
					this.ftime = 0;
				}
			},
			setSpritesheet: function(src){
				if(src instanceof Image){
					this.spritesheet = src;
				}
				else{
					this.spritesheet = new Image();
					this.spritesheet.src = src;
				}
			},
			setPosition: function(x, y){
				this.x = x;
				this.y = y;
			},
			setOffset: function(x, y){
				this.offsetX = x;
				this.offsetY = y;
			},
			setFrames: function(numFrames){
				this.currentFrame = 0;
				this.frames = numFrames;
			},
			setDuration: function(duration){
				this.duration = duration;
			},
			animate: function(c, t){
				if(t.getMilliseconds() > this.ftime){
					this.nextFrame();
				}

				this.draw(c);
			},
			nextFrame: function(){
				if(this.duration > 0){
					this.updateFTime();
					
					if(this.direction === 'normal'){
						this.offsetX = this.absOffsetX + (this.width * this.currentFrame);
					}
					else{
						this.offsetX = this.absOffsetX - (this.width * this.currentFrame);
					}
					
					if(this.currentFrame === (this.frames - 1)){
						this.currentFrame = 0;
						
						if(this.animationCallback){
							this.animationCallback(this);
						}
					}
					else{
						this.currentFrame += 1;
					}
					
					//if(this.name === 'starport' && this.direction === 'reverse') console.log(this.direction, this.currentFrame, this.offsetX);
				}
			},
			draw: function(c){
				if(this.display){
					c.drawImage(this.spritesheet,
								this.offsetX,
								this.offsetY,
								this.width,
								this.height,
								this.x,
								this.y,
								this.width * this.zoomLevel,
								this.height * this.zoomLevel);
				}
			}
		};
	})();

	return Sprite;
})(LC, window);
