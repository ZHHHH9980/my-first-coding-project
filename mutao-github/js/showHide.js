(function ($){
	var transition = window.mt.transition ;

function init($elem, initCallback) {
	if ($elem.is(':hidden')) { //hidden
		$elem.data('status','hide');
		if(typeof initCallback === 'function') initCallback();
	}else { // show
		$elem.data('status','show');
	}
}
function show($elem, showCallback) {
	if ($elem.data('status') === 'show') return;
    if ($elem.data('status') === 'shown') return;
    $elem.data('status','show').trigger('show');
    showCallback();
}
function hide($elem, hideCallback) {
	if ($elem.data('status') === 'hide') return;
	if ($elem.data('status') === 'hidden') return;

	$elem.data('status','hide').trigger('hide');
	hideCallback();
}		
var silent = {
		init: init,
		show: function ($elem) {
			show($elem, function () {
				$elem.show();
				$elem.data('status','shown').trigger('shown');
			});
		},
		hide: function ($elem) {
			hide($elem, function () {
				$elem.hide();
			    $elem.data('status','hidden').trigger('hidden');
			})
			
		}
}
var css3 = {
	fade: {
		init: function ($elem) {
			css3._init($elem, 'fadeOut');
	    },
		show: function ($elem) {
			css3._show($elem, 'fadeOut');
		},
		hide: function ($elem) {
			css3._hide($elem, 'fadeOut');	
		}
	},
	slideUpDown: {
		init: function ($elem) {
			$elem.height($elem.height());
			css3._init($elem, 'slideUpDownCollapse');
	    },
		show: function ($elem) {
			css3._show($elem, 'slideUpDownCollapse');
		},
		hide: function ($elem) {
			css3._hide($elem, 'slideUpDownCollapse');	
		}
	},
	slideLeftRight: {
		init: function ($elem) {
			$elem.width($elem.width());
			css3._init($elem, 'slideLeftRightCollapse');
	    },
		show: function ($elem) {
			css3._show($elem, 'slideLeftRightCollapse');
		},
		hide: function ($elem) {
			css3._hide($elem, 'slideLeftRightCollapse');	
		}
	},
	fadeSlideUpDown: {
		init: function ($elem) {
			$elem.height($elem.height());
			css3._init($elem, 'fadeOut slideUpDownCollapse');
	    },
		show: function ($elem) {
			css3._show($elem, 'fadeOut slideUpDownCollapse');
		},
		hide: function ($elem) {
			css3._hide($elem, 'fadeOut slideUpDownCollapse');	
		}
	},
	fadeSlideLeftRight: {
		init: function ($elem) {
			$elem.width($elem.width());
			css3._init($elem, 'fadeOut slideLeftRightCollapse');
	    },
		show: function ($elem) {
			css3._show($elem, 'fadeOut slideLeftRightCollapse');
		},
		hide: function ($elem) {
			css3._hide($elem, 'fadeOut slideLeftRightCollapse');	
		}
	}
}
css3._init = function ($elem, className) {
			$elem.addClass('transition');
			init($elem, function () {
				$elem.addClass(className);
			});
	    }
css3._show = function ($elem, className) {
			show($elem, function () {
				$elem.off(transition.end).one(transition.end, function () {
					$elem.trigger('shown');
				});
				$elem.show();
				setTimeout(function () {
					$elem.removeClass(className);					
				},20);
		});
}
css3._hide = function ($elem, className) {
			hide($elem, function () {
                    $elem.off(transition.end).one(transition.end, function () {
					$elem.hide();
					$elem.trigger('hidden');
				});
				$elem.addClass(className);
			});	
		}
var js = {
	fade: {
		init: function($elem) {
			js._init($elem);	
	    },
		show: function ($elem) {
			js._show($elem, 'fadeIn');
		},
		hide: function ($elem) {
			js._hide($elem, 'fadeOut');
		}
	},
	slideUpDown: {
		init: function($elem) {
			js._init($elem);	
	    },
		show: function ($elem) {
			js._show($elem, 'slideDown');
		},
		hide: function ($elem) {
			js._hide($elem, 'slideUp');
		}
	},
	slideLeftRight: {
		init: function($elem) {
			js._customInit($elem, {
				'width': 0,
				'padding-left': 0,
				'padding-right': 0
			});	
	    },
		show: function ($elem) {
			js._customShow($elem);
		},
		hide: function ($elem) {
			js._customHide($elem,{
				'width' : 0,
				'padding-left': 0,
				'padding-right': 0
			});
		}
	},
	fadeSlideUpDown: {
		init: function($elem) {
			js._customInit($elem, {
				'opacity': 0,
				'height': 0,
				'padding-top': 0,
				'padding-bottom': 0
			});
	    },
		show: function ($elem) {
			js._customShow($elem,{
				'opacity': 0,
				'height': 0,
				'padding-top': 0,
				'padding-bottom': 0
			});
		},
		hide: function ($elem) {
			js._customHide($elem, {
				'opacity': 0,
				'height': 0,
				'padding-top': 0,
				'padding-bottom': 0
			});
		}
	},
	fadeSlideLeftRight: {
		init: function($elem) {
			js._customInit($elem, {
				'opacity': 0,
				'width': 0,
				'padding-left': 0,
				'padding-right': 0
			});
	    },
		show: function ($elem) {
			js._customShow($elem,{
				'opacity': 0,
				'width': 0,
				'padding-left': 0,
				'padding-right': 0
			});
		},
		hide: function ($elem) {
			js._customHide($elem, {
				'opacity': 0,
				'width': 0,
				'padding-left': 0,
				'padding-right': 0
			});
		}
	}
};
js._customInit = function ($elem, options) {
	var styles = {};
			
	for(var p in options) {
		styles[p] = $elem.css(p);
	}
	$elem.data('styles', styles);

	js._init($elem,function () {
		$elem.css(options);
	});	
}
js._customShow = function ($elem) {
	show($elem, function() {

		$elem.show();
		$elem.stop().animate($elem.data('styles'),function () {
			$elem.data('status', 'shown').trigger('shown');
		});
	});
}
js._customHide = function ($elem, options) {
	hide($elem, function() {
				
	$elem.stop().animate(options,function () {
		$elem.hide();
		$elem.data('status', 'hidden').trigger('hidden');
	});
 });
}
js._init = function ($elem, hiddenCallback) {
	$elem.removeClass('transition');
	init($elem, hiddenCallback);
}
js._show = function ($elem, mode) {
	show($elem, function () {
			$elem.stop()[mode](function() {
				$elem.data('status', 'shown').trigger('shown');
			});
		});
}
js._hide = function ($elem, mode) {
	hide($elem, function () {
		$elem.stop()[mode](function() {
			$elem.data('status', 'hidden').trigger('hidden');
		});
	});	
}

/*var defaults = {
	css3: true,
	js: false,
	animate: 'fade'
}
function showHide($elem, options) {
	var mode = null;
	

	if (options.css3 && transition.isSupport) {// css3 transition
		mode = css3[options.animate] || css3[defaults.animate]; 
	}else if (options.js) {//js
		mode = js[options.animate] || js[defaults.animate];
	}else {
		mode = silent;
	}

	mode.init($elem);
		return {
			show: $.proxy(mode.show, this, $elem),
			hide: $.proxy(mode.hide, this, $elem)
		}
}

$.fn.extend({
	showHide: function (option) {
		return this.each(function () {
			var $this = $(this),
			    mode = $this.data('showHide'),
			    options = $.extend({}, defaults, typeof option === 'object' && option);;

			    if (!mode) {
			    	$this.data('showHide', mode = showHide($this, options));
			    }
			    

			    if (typeof mode[option] === 'function') {
			    	mode[option]();
			    }
		})
	}
})*/
var defaults = {
        css3: true,
        js: true,
        animation: 'fade'
    };

    function showHide($elem, options) {
        var mode = null;
        // options = $.extend({}, defaults, options);
        if (options.css3 && transition.isSupport) { //css3 transition
            // css3[options.animation].init($elem);
            mode = css3[options.animation] || css3[defaults.animation];
            // return {
            //     // show:css3[options.animation].show,
            //     // hide:css3[options.animation].hide
            // };
        } else if (options.js) { //js animation
            // js[options.animation].init($elem);
            // return {
            //     show: js[options.animation].show,
            //     hide: js[options.animation].hide
            // };
            mode = js[options.animation] || js[defaults.animation];
        } else { // no animation
            // silent.init($elem);
            // return {
            //     show: silent.show,
            //     hide: silent.hide
            // };
            mode = silent;

        }
        mode.init($elem);
        return {
            // show: mode.show,
            // hide: mode.hide
            show: $.proxy(mode.show, this, $elem),
            hide: $.proxy(mode.hide, this, $elem),
        };
    }
    
    $.fn.extend({
        showHide: function (option) {
            return this.each(function () {
                var $this = $(this),
                    options = $.extend({}, defaults, typeof option === 'object' && option),
                    mode = $this.data('showHide');

                if (!mode) {
                    $this.data('showHide', mode = showHide($this, options));
                }

                if (typeof mode[option] === 'function') {
                    mode[option]();
                }
            });
        }
    });
/*window.mt = window.mt || {};
window.mt.showHide = showHide;*/

})(jQuery)