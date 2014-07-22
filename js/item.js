if(!LC){
	var LC = {};
}

LC.Item = (function(APP, w){
	//Private variables and dependencies
	var utils = APP.utils,
		Timer = utils.Timer;

	var Item = function Item(type){
		this.type = type;
		this.src = '../images/' + this.type + '/' + this.name + '.png';
		this.frames = this.spriteImages[this.imageCode].count;
		
		Item.uper.apply(this, [this.src, this.pixelWidth, this.pixelHeight, this.absOffsetX, this.offsetX, this.offsetY, this.frames, this.duration, this.direction]);
	};
	
	utils.extend(Item, APP.Sprite);

	Item.prototype.animate = function(c, t){
		this.frames = this.spriteImages[this.imageCode].count;
		Item.uber.animate.apply(this, [c, t]);
	};

	Item.prototype.draw = function(c){
		Item.uber.draw.apply(this, [c]);
	};

	return Item;
})(LC, window);
