(function ($) {
	'use strict';
	var transition = window.mt.transition;

	function init($elem) {
		this.$elem = $elem;

		this.curX = parseFloat(this.$elem.css('left'));
		this.curY = parseFloat(this.$elem.css('top'));
	}
	function to(x,y,callback) {
		
		if (isNaN(x)) x = this.curX;
		if (isNaN(y)) y = this.curY;
		if (x === this.curX && y === this.curY) return;

		this.$elem.trigger('move',[this.$elem]);
		if (typeof callback === 'function') callback();

		this.curX = x;
		this.curY = y;
	} 
	var Silent = function ($elem) {
		init.call(this,$elem);
		this.$elem.removeClass('transition');
		
	};
	Silent.prototype.to = function (x,y) {
		var self = this;
		to.call(this, x, y, function () {
			self.$elem.css({
				left: x,
				top: y
			});
			self.$elem.trigger('moved',[self.$elem]);
		})
	};
	Silent.prototype.x = function (x) {
		this.to(x);
	};
	Silent.prototype.y = function (y) {
		this.to(null,y);
	};
	var Css3 = function ($elem) {
		init.call(this,$elem);
		this.$elem.addClass('transition');
	};
	Css3.prototype.to = function (x,y) {
		var self = this;

		to.call(this, x, y, function () {
		    self.$elem.css({
				left: x,
				top: y
			});
			self.$elem.off(transition.end).one(transition.end, function () {		
				self.$elem.trigger('moved',[self.$elem]);
			})
		});
	};
	Css3.prototype.x = function (x) {
		this.to(x);
	};
	Css3.prototype.y = function (y) {
		this.to(null,y);
	};
	var Js = function ($elem) {
		init.call(this,$elem);
		this.$elem.removeClass('transition');
	};
	Js.prototype.to = function (x,y) {
		var self = this;

		to.call(this, x, y, function () {
		    self.$elem.stop().animate({
				left:x,
				top: y
			}, function () {
				self.$elem.trigger('moved',[self.$elem]);
			});
		});
		
	};
	Js.prototype.x = function (x) {
		this.to(x);
	};
	Js.prototype.y = function (y) {
		this.to(null,y);
	};

	function Move($elem, options) {
		var mode = null;
		if (options.css3 && transition.isSupport) {
			mode = new Css3($elem);
		} else if (options.js) {
			mode = new Js($elem);
		} else {
			mode = new Silent($elem);
		}

		return {
			to: $.proxy(mode.to, mode),
			x: $.proxy(mode.x, mode),
			y: $.proxy(mode.y, mode)
		}
	}
	Move.DEFAULTS = {
		css3: false,
		js: false
	}
	$.fn.extend({
		move: function (option, x, y) {
			return this.each(function () {
				var $this = $(this),
				options = $.extend({}, Move.DEFAULTS, option),
				move = $this.data('move');

				if (!move) {
					move = $this.data('move', move = new Move($this, options))
				};

				if (typeof move[option] === 'function') {
					move[option](x, y);
				}
			})
		}
	})
})(jQuery);