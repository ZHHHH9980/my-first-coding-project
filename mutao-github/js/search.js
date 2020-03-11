(function ($) {

	var cache = {
		data: {},
		count: 0,
		addData: function (key, data) {
			if (!this.data[key]) {
				this.data[key] = data;
			    this.count++;
			}
		},
		readData: function (key) {
			return this.data[key];
		},
		deleteDataByKey: function (key) {
			delete this.data[key];
			this.count--;
		},
		deleteDataByOrder: function (num) {
			var count = 0;

			for (var p in this.data) {
				if (count > num) {
					break;
				}
				this.deleteDataBykey(p);
				count++;
			}
		}
	};
	function Search($elem, options) {
		this.$elem = $elem;
		this.options = options;

	    this.$input = this.$elem.find('.input-box');
	    this.$btn = this.$elem.find('.input-btn');
	    this.$layer = this.$elem.find('.search-layer');
	    this.$form = this.$elem.find('.search-form');
	    
	    this.loaded = false;

	    this.$btn.on('click', $.proxy(this.submit, this));
	    if (this.options.autocomplete) {//自动完成
	    	this.autocomplete();
	    }

	}
	Search.prototype.submit = function () {
		//去除多余空格
		if (this.getInputVal() === '') return false;

		this.$form.submit();
	};
	Search.prototype.autocomplete = function () {
		var self = this;
		var timer = null;

		this.$input
		.on('input', function () {
			if (self.options.getDataInterval) {
				//延迟获取数据
				clearTimeout(timer);
				timer = setTimeout(function () {
					self.getData();
				},self.options.getDataInterval);
			} else {
				self.getData();
			}
		})
		.on('focus', $.proxy(this.showLayer,this))
		.on('click', function () {
			return false;
		});

		this.$layer.showHide(this.options);
		$(document).on('click', $.proxy(this.hideLayer,this));		
	};
	Search.prototype.getData = function () {
		var self = this;
		var inputVal = this.getInputVal();

		if (!inputVal) return;

		if (cache.readData(inputVal)) {
			return self.$elem.trigger('search-getData', [cache.readData(inputVal)]);
		}
		//终止上一次异常的ajax请求
		if (this.jqXHR) this.jqXHR.abort();
		this.jqXHR = $.ajax({
			url: this.options.url + inputVal,
			dataType: 'jsonp'
		}).done(function (data) {
			cache.addData(inputVal, data);
			self.$elem.trigger('search-getData', [data]);	
		}).fail(function () {
			self.$elem.trigger('search-noData',);
		}).always(function () {
			self.jqXHR = null;
		})
	};
	Search.prototype.showLayer = function () {	
		if (!this.loaded) return false;
		this.$layer.showHide('show');
	};
	Search.prototype.hideLayer = function () {
		this.$layer.showHide('hide');
	};
	Search.prototype.getInputVal = function () {

		return $.trim(this.$input.val());
	};
	Search.prototype.setInputVal = function (val) {
		this.$input.val(removeHtmlTagName(val));

		//移除item内字符串的多余标签
		function removeHtmlTagName(str) {
			return str.replace(/<?:([^>'"]|"[^"]*"|'[^']*'>)*/g, '');
		}
	}
	Search.prototype.appendLayer = function (html) {
		this.$layer.html(html);
		this.loaded = !!html;
	}
	Search.DEFAULTS = {
		css3: false,
		js: false,
		autocomplete: false,
		getDataInterval: 0,
		url: 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1582514472621_888&callback=jsonp889&k=1&area=c2c&bucketid=2&q='
	}
	$.fn.extend({
		search: function (option, val) {
			return this.each(function () {
				var $this = $(this),
				    options = $.extend({}, Search.DEFAULTS, option),
				    search = $this.data('search');

				    if (!search) {
				    	$this.data('search', search = new Search($this, options));
				    }

				    if (typeof search[option] === 'function') {
				    	search[option](val);
				    }
			})
		}
	})
	














	/*var $search = $('#index-search'),
	    $input = $search.find('.input-box'),
	    $btn = $search.find('.input-btn'),
	    $layer = $search.find('.search-layer'),
	    $form = $search.find('.search-form');

	    //验证
	    $form.on('submit', function () {
	    	console.log($.trim($input.val()))
	    	if ($.trim($input.val()) === '') return false;
	    });

	    //自动完成
	    $input.on('input', function () {
	    	var url = 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1582514472621_888&callback=jsonp889&k=1&area=c2c&bucketid=2&q=';

	    	$.ajax({
	    		url: url + $.trim($input.val()),
	    		dataType: 'jsonp'
	    	}).done(function (data) {

	    		var html = '',
	    		    dataNum = data['result'].length,
	    		    maxNum = 10;

	    		    for (var i = 0; i < dataNum; i++) {
	    		    	if (i > maxNum) break;

	    		    	html += '<li class="search-layer-item">' + data['result'][i][0] + '</li>';
	    		    }

	    		    $layer.html(html).show();


	    	}).fail(function () {
	    		$layer.hide().html();
	    	}).always(function () {

	    	})
	    }).on('focus', function () {
	    	$layer.show();
	    }).on('click', function () {
	    	return false;
	    });

	    $(document).on('click', function () {
	    	$layer.hide();
	    });

	    $layer.on('click', '.search-layer-item', function () {
            $input.val(removeHtmlTagNames($(this).html()));
            $form.submit();

            function removeHtmlTagNames(str) {
            	return str.replace(/<?:([^>'"]|"[^"]*"|'[^']*')*///g, '');
            //}    
	    //})*/
})(jQuery);