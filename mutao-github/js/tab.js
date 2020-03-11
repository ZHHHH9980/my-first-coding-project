(function ($) {

	function Tab($elem, options) {
		this.$elem = $elem;
		this.options = options;

		this.$panel = this.$elem.find('.floor-panel')
		this.$items = this.$elem.find('.floor-toggle-item');

		this.curIndex = this._getCorrectIndex(this.options.activeIndex);
		this.itemNum = this.$items.length;

		this._init();
	};
	Tab.prototype._init = function () {
		var self = this;
		//init show
		this._activateItems(this.curIndex);
		this.$panel.eq(this.curIndex).show();

		//showHide
		this.$panel.showHide(this.options);

		this.options.event = 'mouseenter'? 'mouseenter' : 'click';

		this.$elem.on(this.options.event,'.floor-toggle-item', function () {
			self.toggle(self.$items.index(this));
		});

		//send message
		this.$elem.trigger('tab-show', [self.curIndex, self.$panel.eq(self.curIndex)]);
		this.$panel.on('show shown hide hidden', function (e) {
			self.$elem.trigger('tab-' + e.type, [self.$panel.index(this), this]);
		})


	}
	Tab.prototype.toggle = function (index) {
		if (this.curIndex === index) return;

		this.$panel.eq(this.curIndex).showHide('hide');
		this.$panel.eq(index).showHide('show');

		this._activateItems(index);

		this.curIndex = index;
	}
	Tab.prototype._activateItems = function (index) {
		this.$items.removeClass('floor-item-active');
		this.$items.eq(index).addClass('floor-item-active');
	}
	Tab.prototype._getCorrectIndex = function (index) {
		if (isNaN(Number(index))) return 0;

		if (index > this.itemNum) index = 0;
		if (index < 0) index = this.itemNum - 1;
		return index;

	}


	Tab.DEFAULTS = {
		event: 'mouseenter',   //click
        css3: false,
        js: false,
        animation : 'fade',
        activeIndex: 0
	};

	$.fn.extend({
		tab: function (option) {
			return this.each(function () {
				var $this = $(this),
				options = $.extend({}, Tab.DEFAULTS, option),
				tab = $this.data('tab');

				if (!tab) {
					$this.data('tab', tab = new Tab($this, options))
				};

				if (typeof tab[option] === 'function') {
					tab[option]();
				}
			})
		}
	})
})(jQuery)