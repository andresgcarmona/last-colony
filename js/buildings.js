if(!LC){
	var LC = {};
}

LC.Building = (function(APP, w){
	//Private variables and dependencies
	var utils = APP.utils,
		Timer = utils.Timer;

	var Building = function Building(args){	
		this.type = 'buildings';
		this.animationIndex = 0;
		this.direction = 'normal';
		this.duration = args.duration || 1000;
		this.orders = {type: 'stand'};
		this.action = 'stand';
		this.selected = false;
		this.selectable = true;
		this.initX = 0;
		this.initY = 0;
		this.team = 'blue';
		this.display = true;
		this.offsetX = 0;
		this.offsetY = 0;
		this.imageOffset = 0;
		
		if(arguments){
			$.extend(this, arguments[0]);
		}
		
		Building.uper.apply(this, [this.type]);
	};
	
	utils.extend(Building, APP.Item);
	
	Building.prototype.animate = function(){
		Building.uber.animate.apply(this, [this.game.fgContext, this.game.timer]);
	};

	Building.prototype.draw = function(){
		var x = (this.initX * this.game.gridSize) - this.game.offsetX - this.pixelOffsetX;
		var y = (this.initY * this.game.gridSize) - this.game.offsetY - this.pixelOffsetY;

		this.colorIndex = (this.team == 'blue') ? 0 : 1;
		this.offsetY = this.colorIndex * this.pixelHeight;
		this.x = x;
		this.y = y;
		
		Building.uber.draw.apply(this, [this.game.fgContext]);
	};
	
	Building.prototype.setAction = function(action){
		this.action = action;
	};

	return Building;
})(LC, window);

LC.Base = (function(APP, w){
	var utils = APP.utils,
		Timer = utils.Timer;

	var Base = function Base(defaults){
		console.log('Initializing new Base...');
		
		this.name = 'base';
		this.pixelWidth = 60;
		this.pixelHeight = 60;
		this.baseWidth = 40;
		this.baseHeight = 40;
		this.pixelOffsetX = 0;
		this.pixelOffsetY = 20;
		this.buildableGrid = [
			[1, 1],
			[1, 1]
		];
		this.passableGrid = [
			[1, 1],
			[1, 1]
		];
		this.sight = 3;
		this.hitPoints = 500;
		this.cost = 5000;
		this.duration = 300;
		this.spriteImages = {
			'healthy': {name: 'healthy', count: 4},
			'damaged': {name: 'damaged', count: 1},
			'constructing': {name: 'constructing', count: 3}
		};
		
		if(defaults){
			$.extend(this, defaults);
		}
		
		if(!this.life){
			this.life = this.hitPoints;
		}
		
		this.setDefaultActions(false);
		
		var args = Array.prototype.slice.apply(arguments);
		args[0].duration = this.duration;

		Base.uper.apply(this, args);
	};

	utils.extend(Base, APP.Building);
	
	Base.prototype.setDefaultActions = function(execCallbacks){
		if(this.life > this.hitPoints * 0.4){
			this.imageCode = 'healthy';
			this.imageOffset = 0;
		}
		else if(this.life <= 0){
			this.imageCode = 'dead';
			this.game.remove(this);
			return;
		}
		else{
			this.imageCode = 'damaged';
			this.imageOffset = 4;
		}
		
		switch(this.action){
			case 'stand':
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				break;
			case 'construct':
				this.imageOffset = 5;
				this.imageCode = 'constructing';
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				this.duration = 1000;
				
				if(execCallbacks){
					this.animationCallback = function(item){
						item.duration = 300;
						item.setAction('stand');
					};
				}
				break;
		}
	};
	
	Base.prototype.draw = function(){
		Base.uber.draw.apply(this);
	};
	
	Base.prototype.animate = function(){
		this.setDefaultActions(true);	
		Base.uber.animate.apply(this);
	};

	return Base;
})(LC, window);

LC.StarPort = (function(APP, w){
	var utils = APP.utils,
		Timer = utils.Timer;

	var StarPort = function StarPort(defaults){
		console.log('Initializing new StarPort...');
		
		this.name = 'starport';
		this.pixelWidth = 40;
		this.pixelHeight = 60;
		this.baseWidth = 40;
		this.baseHeight = 55;
		this.pixelOffsetX = 1;
		this.pixelOffsetY = 5;
		this.buildableGrid = [
			[1, 1],
			[1, 1],
			[1, 1]
		];
		this.passableGrid = [
			[1, 1],
			[0, 0],
			[0, 0]
		];
		this.sight = 3;
		this.cost = 2000;
		this.hitPoints = 300;
		this.duration = 900;
		this.spriteImages =  {
			'teleport': {name: 'teleport', count: 9},
			'closing': {name: 'closing', count: 18},
			'opening': {name: 'opening', count: 18},
			'healthy': {name: 'healthy', count: 2},
			'damaged': {name: 'damaged', count: 1},
			'constructing': {name: 'constructing', count: 3}
		};
	
		if(defaults){
			$.extend(this, defaults);
		}
		
		if(!this.life){
			this.life = this.hitPoints;
		}
		
		this.setDefaultActions(false);
		
		var args = Array.prototype.slice.apply(arguments);
		args[0].duration = this.duration;

		StarPort.uper.apply(this, args);
	};

	utils.extend(StarPort, APP.Building);
	
	StarPort.prototype.setDefaultActions = function(execCallbacks){
		if(this.life > this.hitPoints * 0.4){
			this.imageCode = 'healthy';
			this.imageOffset = 27;
			this.duration = 300;
		}
		else if(this.life <= 0){
			this.imageCode = 'dead';
			this.game.remove(this);
			return;
		}
		else{
			this.imageCode = 'damaged';
			this.imageOffset = 31;
		}
		
		switch(this.action){
			case 'stand':
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				break;
			case 'construct':
				this.imageOffset = 28;
				this.imageCode = 'constructing';
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				this.duration = 1000;
				
				if(execCallbacks){
					this.animationCallback = function(item){
						item.duration = 300;
						item.setAction('stand');
					};
				}
				break;
			case 'teleport':
				this.imageOffset = 0;
				this.imageCode = 'teleport';
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				this.duration = 1000;
				
				if(execCallbacks){
					this.animationCallback = function(item){
						item.duration = 300;
						item.imageOffset = 27;
						
						if(item.canAtack){
							item.setAction('guard');
						}
						else{
							item.setAction('stand');
						}
					};
				}
				break;
			case 'close':
				this.imageOffset = 9;
				this.imageCode = 'closing';
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				this.duration = 1200;
				
				if(execCallbacks){
					this.animationCallback = function(item){
						item.setAction('stand');
					};
				}
				break;
			case 'open':
				this.imageOffset = 27;
				this.direction = 'reverse';
				this.imageCode = 'opening';
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				this.duration = 1200;
				
				if(execCallbacks){
					this.animationCallback = function(item){
						item.direction = 'normal';
						item.setAction('close');
					};
				}
				break;
		}
	};

	StarPort.prototype.draw = function(){
		StarPort.uber.draw.apply(this);
	};
	
	StarPort.prototype.animate = function(){
		this.setDefaultActions(true);
		StarPort.uber.animate.apply(this);
	};

	return StarPort;
})(LC, window);

LC.Harvester = (function(APP, w){
	var utils = APP.utils,
		Timer = utils.Timer;

	var Harvester = function Harvester(defaults){
		console.log('Initializing new Harvester...');
		
		this.name = 'harvester';
		this.pixelWidth = 40;
		this.pixelHeight = 60;
		this.baseWidth = 40;
		this.baseHeight = 20;
		this.pixelOffsetX = -2;
		this.pixelOffsetY = 40;
		this.buildableGrid = [
			[1, 1]
		];
		this.passableGrid = [
			[1, 1]
		];
		this.sight = 3;
		this.hitPoints = 300;
		this.cost = 5000;
		this.duration = 300;
		this.spriteImages = {
			'deploy': {name: 'deploy', count: 17},
			'healthy': {name: 'healthy', count: 3},
			'damaged': {name: 'damaged', count: 1}
		};
		
		if(defaults){
			$.extend(this, defaults);
		}
		
		if(!this.life){
			this.life = this.hitPoints;
		}
		
		this.setDefaultActions(false);
		
		var args = Array.prototype.slice.apply(arguments);
		args[0].duration = this.duration;

		Harvester.uper.apply(this, args);
	};

	utils.extend(Harvester, APP.Building);
	
	Harvester.prototype.setDefaultActions = function(execCallbacks){
		if(this.life > this.hitPoints * 0.4){
			this.imageCode = 'healthy';
			this.imageOffset = 17;
			this.duration = 1200;
		}
		else if(this.life <= 0){
			this.imageCode = 'dead';
			this.game.remove(this);
			return;
		}
		else{
			this.imageCode = 'damaged';
			this.imageOffset = 20;
		}
		
		switch(this.action){
			case 'stand':
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				break;
			case 'deploy':
				this.imageCode = 'deploy';
				this.imageOffset = 0;
				this.duration = 2000;
				this.absOffsetX = this.pixelWidth * this.imageOffset;
				
				if(execCallbacks){
					this.animationCallback = function(item){
						item.setAction('stand');
					};
				}
				break;
		}
	};
	
	Harvester.prototype.draw = function(){
		Harvester.uber.draw.apply(this);
	};
	
	Harvester.prototype.animate = function(){
		this.setDefaultActions(true);	
		Harvester.uber.animate.apply(this);
	};

	return Harvester;
})(LC, window);
