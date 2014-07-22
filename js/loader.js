if(!LC){
	var LC = {};
}

LC.loader = (function(APP, w){
	//Private variables and dependencies
	var game = undefined;

	return {
		loaded: false,
		loadedCount: 0,
		totalCount: 0,
		soundFileExt: '.mp3',
		init: function(g){
			game = g;
			console.log('Initializing loader...');

			var mp3Support, oggSupport;
			var audio = document.createElement('audio');

			if(audio.canPlayType){
				mp3Support = "" != audio.canPlayType('audio/mpeg');
				oggSupport = "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
			}
			else{
				mp3Support = false;
				oggSupport = false;
			}
	
			this.soundFileExt = oggSupport ? '.ogg' : mp3Support ? '.mp3' : undefined;

			return this;
		},
		loadImage: function(url){
			this.totalCount += 1;
			this.loaded = false;
			game.$loadingScreen.show();

			var image = new Image();
			image.src = url;
			image.onload = this.itemLoaded;

			return image;
		},
		loadSound: function(url){
			this.totalCount += 1;
			this.loaded = false;
			game.$loadingScreen.show();

			var audio = new Audio();
			audio.src = url + loader.soundFileExt;
			audio.addEventListender('canplaythrough', this.itemLoaded, false);

			return audio;
		},
		itemLoaded: function(){
			LC.loader.loadedCount += 1;
			game.$loadingMessage.html('Loaded ' + LC.loader.loadedCount + ' of ' + LC.loader.totalCount);

			if(LC.loader.loadedCount === LC.loader.totalCount){
				LC.loader.loaded = true;
				game.$loadingScreen.hide();

				if(LC.loader.onload){
					LC.loader.onload();
					LC.loader.onload = undefined;
				}
			}
		}
	};
})(LC, window);
