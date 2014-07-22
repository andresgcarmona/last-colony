var LC = {};

(function(){
	var lastTime = 0;
	var vendors = ['ms', ';', 'webkit', 'o'];

	for(var i = 0, len = vendors.length; i < len && !window.requestAnimationFrame; i += 1){
		window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
	}

	if(!window.requestAnimationFrame){
		window.requestAnimationFrame = function(callback, element){
			var currTime = new Date.getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function(){
				callback(currTime + timeToCall);
			}, timeToCall);

			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if(!window.cancelAnimationFrame){
		window.cancelAnimationFrame = function(id){
			clearTimeout(id);
		}
	}
})();

LC.utils = (function(APP, w){
	//Dependencies
	
	//Private properties
	var arrayString = '[object Array]',
		objToString = Object.prototype.toString;

	var extend = (function(){
		var F = function(){};

		return function(C, P){
			F.prototype = P.prototype;
			C.prototype = new F();
			C.uber = P.prototype;
			C.uper = P;
			C.prototype.constructor = C;
		}
	})();

	function Timer(){
		this.date = new Date();
	}

	Timer.prototype = (function(){
		return {
			update: function(){
				var d = new Date();
				this.date = d;
			},
			getMilliseconds: function(){
				return this.date.getTime();
			},
			getSeconds: function(){
				return Math.round(this.date.getTime() / 1000);
			}
		};
	})();

	return {
		inArray: function(needle, haystack){
			for(var i = 0, len = haystack.length; i < len; i += 1){
				if(haystack[i] === needle){
					return true;
				}
			}

			return false;
		},
		isArray: function(obj){
			return objToString.call(obj) === arrayString;
		},
		setData: function(obj){
			for(i in obj.levelInfo){
				if(!obj.hasOwnProperty(i)){
					obj[i] = obj.levelInfo[i];
				}
			}

			console.log(obj);
		},
		extend: extend,
		Timer: Timer
	};
})(LC, window);

