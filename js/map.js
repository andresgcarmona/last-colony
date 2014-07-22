if(!LC){
	var LC = {};
}

LC.Map = (function(APP, w){
	//Private variables and dependencies
	var utils = APP.utils;

	var Map = function Map(loader, mapImage){
		if(loader && mapImage){
			this.mapImage = loader.loadImage(mapImage);
		}
	};

	Map.prototype = (function(){
		return {
			getMapImage: function(){
				return this.mapImage;
			}
		};
	})();

	return Map;
})(LC, window);
