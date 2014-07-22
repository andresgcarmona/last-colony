if(!LC){
	var LC = {};
}

LC.Level = (function(APP, w){
	//Private variables and dependencies
	var utils = APP.utils;	

	var Level = function Level(levelInfo, loader){
		if(levelInfo && loader){
			this.levelInfo = levelInfo;
			this.map = new LC.Map(loader, this.levelInfo.mapImage);

			utils.setData(this);
		}
	};

	Level.prototype = (function(){
		return {
			getMap: function(){
				return this.map;
			}
		};
	})();

	return Level;
})(LC, window);
