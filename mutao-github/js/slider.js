(function ($) {
	'use strict';

	function Slider($elem, options) {
		this.$elem = $elem;
		this.options = options;
		this.$item = this.$elem.find('.slider-item');
		this.$indicators = this.$elem.find('.slider-indicators');
		this.$control = this.$elem.find('.slider-control');
		this.curIndex = this._getCorrectIndex(this.options.activeIndex);
		this.itemNum = this.$item.length;

		this._init();
	}
	Slider.prototype._init = function () {
		var self = this;
		//init show
		this._activateIndicators(this.curIndex);

		this.$elem.trigger('slider-show',[self.curIndex, self.$item[self.curIndex]]);

		if (this.options.animation === 'fade') {//fade
			this.$elem.addClass('slider-fade');
			this.$item.eq(this.curIndex).show();

			this.to = this._fade;

			this.$item.showHide(this.options);

			//send message
			this.$item.on('show shown hide hidden', function (e) {
				self.$elem.trigger('slider-' + e.type, [self.$item.index(this), this]);
			});
		} else {//slide
			this.$elem.addClass('slider-slide');
			this.$item.eq(this.curIndex).css('left',0);

			this.to = this._slide;

			this.$item.move(this.options);

			//transition
			this.transitionClass = this.$item.hasClass('transition') ? 'transition' : '';
			this.itemWidth = this.$item.width();

			//send message
		    this.$item.on('move moved', function (e, $elem) {
		    	if (e.type === 'move') {
		    		if (self.curIndex === self.$item.index($elem)) {
			    		self.$elem.trigger('slider-hide',[self.$item.index($elem), this]);
			    	} else {
			    		self.$elem.trigger('slider-show',[self.$item.index($elem), this]);
			    	}
		    	}else {
		    		if (self.curIndex === self.$item.index($elem)) {
			    		self.$elem.trigger('slider-shown',[self.$item.index($elem), this]);
			    	} else {
			    		self.$elem.trigger('slider-hidden',[self.$item.index($elem), this]);
			    	}
		    	}
		    })
		}

		//bind event
		this.$elem.hover(function () {
			self.$control.show();
		}, function () {
			self.$control.hide();
		}).on('click', '.slider-control-left', function () {

			self.to(self._getCorrectIndex(self.curIndex - 1), 1);
		}).on('click', '.slider-control-right', function () {

			self.to(self._getCorrectIndex(self.curIndex + 1), -1);
		}).on('click', '.slider-indicators', function () {
			self.to(self.$indicators.index(this));
		});

		//auto
		if (this.options.autoInterval) {
			this.auto();
			this.$elem.hover($.proxy(this.pause,this), $.proxy(this.auto,this));
		}
	};
	Slider.prototype.to = function () {

	};
	Slider.prototype._fade = function (index) {
		this._activateIndicators(index);
		
		this.$item.eq(this.curIndex).showHide('hide');
		this.$item.eq(index).showHide('show');
	
		this.curIndex = index;
	};
	Slider.prototype._slide = function (index, direction) {
	    var self = this;		
		this._activateIndicators(index);

		if (!direction) {
			if (index > this.curIndex) {
				direction = -1;
			} else {
				direction = 1;
			}
		}
		this.$item.eq(index).removeClass(this.transitionClass).css('left', (-1)*direction*this.itemWidth);

		setTimeout(function () {
			self.$item.eq(self.curIndex).move('x', direction*self.itemWidth);
			self.$item.addClass(self.transitionClass).eq(index).move('x', 0);
			self.curIndex = index;
		},20);

	};
	Slider.prototype.auto = function () {
		var self = this;
		this.IntervalId = setInterval(function () {

			self.to(self._getCorrectIndex(self.curIndex + 1));
		},self.options.autoInterval);
	};
	Slider.prototype.pause = function () {
		clearInterval(this.IntervalId);
	}
	Slider.prototype._getCorrectIndex = function (index) {
		if (isNaN(Number(index))) return 0;
		if (this.curIndex === index) return;

		if (index < 0) {
			index = this.itemNum - 1;
		} else if (index > this.itemNum - 1) {
			index = 0;
		}
		return index;
	};
	Slider.prototype._activateIndicators = function (index) {
		this.$indicators.removeClass('slider-indicators-active');
		this.$indicators.eq(index).addClass('slider-indicators-active');
	}
	Slider.DEFAULTS = {
		css3: false,
		js: false,
		animation: 'fade',
		autoInterval: 0
	}
	$.fn.extend({
		slider: function (option) {
			return this.each(function () {
				var $this = $(this),
				options = $.extend({}, Slider.DEFAULTS, option),
				slider = $this.data('slider');

				if (!slider) {
					slider = $this.data('slider', slider = new Slider($this, options))
				};

				if (typeof slider[option] === 'function') {
					slider[option]();
				}
			})
		}
	})
})(jQuery);