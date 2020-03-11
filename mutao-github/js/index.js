(function($) {

var dropdown = {};
dropdown.$menu = $('.menu');

dropdown.$menu.dropdown({
	css3: true,
	js: false
});

dropdown.$menu.on('dropdown-show', function (e) {
     dropdown.loadOnce($(this), dropdown.getMenuLayer);   
});


dropdown.$cart = $('#cart-dropdown');

dropdown.$cart.dropdown({
    css3: true,
    js:false,
    active: 'cart'
});


dropdown.$cart.on('dropdown-show', function (e) {
    dropdown.loadOnce($(this), dropdown.getCartLayer);
});
dropdown.$category = $('.category-dropdown');
dropdown.$category.dropdown({
    css3: true,
    js: false
});

dropdown.$category.on('dropdown-show', function (e) {
    dropdown.loadOnce($(this), dropdown.getCategoryLayer)
});
dropdown.loadOnce = function ($elem, success) {
        dataLoad = $elem.data('load');

        if (!dataLoad) return;

        if (!$elem.data('loaded')) {
            var html = '',
            $layer = $elem.find('.dropdown-layer');
            $.getJSON(dataLoad).done(function (data) {

                if (typeof success === 'function') success($elem, data);
                /*console.log(success)*/
                $elem.data('loaded', true);
            }).fail(function () {
                $elem.data('loaded', false);
            })
        };
}
dropdown.getMenuLayer = function ($elem, data) {
    var html = ''
    for (var i = 0; i < data.length; i++) {
        html += '<li><a href="' + data[i].url + '" target="_blank" class="menu-item">' + data[i].name + '</a></li>';
    }

      setTimeout(function () {
        $elem.find('.dropdown-layer').html(html);
    },1000);
}
dropdown.getCategoryLayer = function ($elem, data) {

    var html = '';
     html += '<ul class="detail-content">';

            for (var i = 0; i < data.length ; i++) {
                
                html += '<li class="detail-content-col">';
                html += '<p class="detail-content-title"><b>' + data[i].title + '</b></p>';
                    for (var j = 0; j < data[i].items.length; j++)
                        html += '<a href="###" class="detail-content-item">' + data[i].items[j] +'</a>';
                 html +='</li>';
                }
                html += '</ul>';

        setTimeout(function () {
        $elem.find('.dropdown-layer').html(html);
    },1000);
}
dropdown.getCartLayer = function ($elem, data) {
    var html = '';
     html += '<p class="cart-layer-title">最新加入的商品</p>'+
                        '<div class="cart-list">'
                                            
        for (var i = 0; i < data.length ; i++) {
            html += '<div class="dropdown-item cart-item">'+
                        '<img class="fl" src="' + data[i].src + '" alt="">'+
                          '<div class="cart-item-intro">'+
                            '<p class="cart-item-name ">' + data[i].name + '</p>'+
                            '<p class="cart-item-price"><b>￥' + data[i].price + '</b></p>'+
                          '</div>'+
                        '<a href="##" class="cart-item-close fr">×</a>'+
                   ' </div>'
        }
        html += '</div>'+
                '<div class="cart-total">'+
                    '<span class="cart-total-num">共 <b>0</b> 件商品</span>'+
                    '<span class="cart-total-price">共计<b>￥0.00</b></span>'+
                    '<div class="cart-btn fr">去购物车</div>'+
                '</div>'
        setTimeout(function () {
        $elem.find('.dropdown-layer').html(html);
    },1000);
}

/*search*/
var search = {};
    search.$search = $('#header-search');

    search.$search.on('search-getData', function (e, data) {
        var maxNum = 10;
        html = createHeaderSearchLayer(data, maxNum);
        
        search.$search.search('appendLayer', html);
        
        if (html) {
            search.$search.search('showLayer');
        } else {
            console.log('hide')
            search.$search.search('hideLayer');
        }
        
    }).on('search-noData', function (e) {
        search.$search.search('hideLayer').search('appendLayer', '');
    })
    .on('click', '.search-layer-item', function () {
        var $this = $(this);
        search.$search.search('setInputVal', $this.html());
        search.$search.search('submit', $this.html());
    })
    search.$search.search({
        css3: true,
        js:false,
        autocomplete: true,
        getDataInterval: 200
    });
    function createHeaderSearchLayer(data, maxNum) {
        var html = '',
            dataNum = data['result'].length;

        if (dataNum === 0) return '';

        for (var i = 0;i < dataNum; i++) {
            if (i > maxNum) break;

            html += '<li class="search-layer-item">' + data['result'][i][0] + '</li>';
        }
        return html;
    }
/* lazyLoad*/
/*lazyload用于项目加载*/
 var lazyLoad = {};
    //接收id-show trigger id-loadItems id-itemsLoaded
    lazyLoad.lazyLoad = function (options) {
        var $elem = options.$container,
        triggerEvent = options.triggerEvent,
        itemstotalNum = options.itemstotalNum,
        id = options.id;

        $elem.items = {};
        $elem.itemsLoadNum = 0;

        //'id-show'
        $elem.on(triggerEvent, $elem.loadItem = function (e, i, elem) {
            if ($elem.items[i] !== 'loaded') {
                //trigger id-loadItems [i,elem, success]
                $elem.trigger(id + '-loadItems',[i, elem, function () {
                  $elem.itemsLoadNum++;
                  $elem.items[i] = 'loaded';

                  if ($elem.itemsLoadNum === itemstotalNum) {
                     $elem.trigger(id + '-itemsLoaded');
                  }
                }]);
            }
        });
        $elem.on(id + '-itemsLoaded', function () {
             $elem.off(triggerEvent, $elem.loadItem);
             console.log(id + '-loaded');
        })
    };
/*imageLoader*/
    var imageLoader = {};
    //用于后台加载图片
    imageLoader.loadImageInbackground = function (url, imageLoad, imageFail) {
        var image = new Image();

        image.onerror = function () {
            imageFail(url)
        }
        image.onload = function () {
            imageLoad(url);
        };

        setTimeout(function () {
            image.src = url;
        },400);
    };
    //加载图片，请将id-loadItem的success一并传入,将$img以及url传入fail 自行定义
    imageLoader.loadImg = function ($imgs, success, fail) {

            $imgs.each(function (_, el) {

                var $img = $(el),
                dataLoad = $img.data('src');

                if (!dataLoad) return false;

                imageLoader.loadImageInbackground(dataLoad, function (url) {
                    //核心语句 获取真正的图片路径
                    $img.attr('src', url);
                    success();
                }, function (url) {
                    fail($img, url);
                   
                })
            })  
    }
   
    
/*slider 幻灯片*/
    var slider = {};
    slider.$bannerSlider = $('#banner-slider');
    slider.$todaysSlider = $('#todays-slider');

    lazyLoad.lazyLoad({
        $container: slider.$bannerSlider,
        itemstotalNum: slider.$bannerSlider.find('.slider-img').length,
        id: 'banner',
        triggerEvent: 'slider-show'
    });
    lazyLoad.lazyLoad({
        $container: slider.$todaysSlider,
        itemstotalNum: slider.$todaysSlider.find('.slider-img').length,
        id: 'todays',
        triggerEvent: 'slider-show'
    }); 

    slider.$bannerSlider.on('banner-loadItems',function (e, index, elem, success) {
        var $imgs = $(elem).find('.slider-img');

            imageLoader.loadImg($imgs, success, function ($img, url) {
                console.log('fail loaded from' + url);
                $img.attr('src', '../img/slider/placeholder.png');
            })
    });
    slider.$bannerSlider.slider({
        css3: true,
        js:false,
        animation : 'slide',
        activeIndex: 1,
        autoInterval: 0
    });
    slider.$todaysSlider.on('todays-loadItems',function (e, index, elem, success) {
        var $imgs = $(elem).find('.slider-img');

            imageLoader.loadImg($imgs, success, function ($img, url) {
                console.log('fail loaded from' + url);
            })
    });
    slider.$todaysSlider.slider({
        css3: true,
        js:false,
        animation : 'slide',
        activeIndex: 1,
        autoInterval: 0
    });

   

    /*browser*/
    /*用于判断元素是否出现在可视窗*/
    var browser = {};
    browser.$win = $(window);
    browser.$doc = $(document);

    browser.floorIsVisible = function (floorData) {
        var $win = browser.$win;
        if (floorData.offsetTop < floorData.winHeight + $win.scrollTop() && $win.scrollTop() < floorData.offsetTop + floorData.winHeight) {
            return true
        }
    };
    browser.timeToshowFloor = function () {
        
        floor.$floor.each(function (index, elem) {

        if (browser.floorIsVisible(floor.floorData[index])) {
            browser.$doc.trigger('floor-show', [index, elem]);
            
        }
    });
    };
    browser.footerIsVisible = function () {
        var $win = browser.$win;
        if (footer.$footer.offset().top < browser.$win.height() + $win.scrollTop() && $win.scrollTop() < footer.$footer.offset().top + browser.$win.height()) {
            return true
        }
    };
    browser.timeToshowFooter = function () {
        if (browser.footerIsVisible()) {
            browser.$doc.trigger('footer-show');
        }
    };
    browser.scrollShow = function (id,control) {
        var timetoShow = 'timeToshow' + id;
        var scrollEvent = id + 'ScrollEvent';
        //刷新显示
        browser[timetoShow]();
        //滚动显示
        browser.$win.on('scroll resize', scrollEvent = function (e) {
            //清除事件流
            
            clearTimeout(control.timer);
                control.timer = setTimeout(function () {
                browser[timetoShow]();
             },250)
         });
    }
    /*floor*/
    var floor = {};
    floor.$floor = $('.floor');
    floor.floorData = [{
        offsetTop: floor.$floor.eq(0).offset().top,
        winHeight : browser.$win.height()
    },{
        offsetTop: floor.$floor.eq(1).offset().top,
        winHeight : browser.$win.height()
    },{
        offsetTop: floor.$floor.eq(2).offset().top,
        winHeight : browser.$win.height()
    },{
        offsetTop: floor.$floor.eq(3).offset().top,
        winHeight : browser.$win.height()
    },{
        offsetTop: floor.$floor.eq(4).offset().top,
        winHeight : browser.$win.height()
    },]

    //生成floor html标签
    floor.buildFloor = function (floorData) {
        var html = '';

        html = '<div class="container">'
        html += floor.buildFloorHead(floorData);
        html += floor.buildFloorBody(floorData);
        html += '</div>'

        return html;
    };
    floor.buildFloorHead = function (floorData) {
        var html = '';

        html += '<div class="floor-title">'  +
                ' <div class="fl">'  +
                    '<span class="floor-num">'+ floorData.num +'F</span>' +
                   ' <span class="floor-title-name">' + floorData.text + '</span>' +
                '</div>' +
                '<div class="floor-tab-toggle fr">'
                   for (var i = 0; i < floorData.tabs.length; i++) {
                       html+='<a href="###" class="floor-toggle-item">' + floorData.tabs[i] +'</a>' 
                            
                        //最后一个不加分割线
                        if (i !== floorData.tabs.length - 1) {
                            html+= '<i class="floor-tab-line">|</i>';
                        }
                   }
                    
               html+= '</div>'
           html+= '</div>'
           return html;
    };
    floor.buildFloorBody = function (floorData) {
        var html = '';

        html += '<div class="floor-body">' 
            for (var i = 0; i < floorData.items.length; i++) {
               html+= '<ul class="floor-panel">'
               for (var j = 0; j < floorData.items[i].length; j++) {
                    html+= '<li class="fl floor-goods-item">'
                    html+=      '<a href="##">'
                    //i从0开始循环，文件名从1开始，所以i + 1
                    html+=          '<img src="img/floor/loading.gif" data-src="img/floor/' + floorData.num + '/' + (i+1) + '/' + (j+1) + '.png" alt="" class="floor-img">'
                    html+=          '<p class="floor-goods-name">' + floorData.items[i][j].name + '</p>'
                    html+=          '<p class="floor-goods-price">￥' + floorData.items[i][j].price + '</p>'
                    html+=      '</a>'
                    html+=  '</li>'
               }
               html+= '</ul>'               
            }
        html += '</div>'
        return html;
    };

    
    /*lazyLoad(options:$doc) -> trigger:floors-loaditems -> $doc.on:floors-loaditems 完成floors加载:success(); lazyLoad:(options:$floor)*/
    /*trigger tab-loaditems(elem, success) -> on tab-loaditems($(elem).find('floor-img'),success) 完成tab加载 执行loadImg -> loadImg ($img) $img.each(success()); ->loadImageInbackground */
    floor.$floor.on('tab-loadItems', function (e, index, elem, success) {
        imageLoader.loadImg($(elem).find('.floor-img'), success, function ($img, url) {
            console.log('fail loaded from' + url);
            $img.attr('src', '../img/floor/placeholder.png');
        })
  
    });
    browser.$doc.on('floors-loadItems', function (e, index, elem, success) {
        var dataLoad = $(elem).data('load');

            if (!dataLoad) return false;

            $.getJSON(dataLoad).done(function (data) {
                var html = floor.buildFloor(data[index]),
                $elem = $(elem);

                success();
                setTimeout(function () {
                    //载入html标签
                    $elem.html(html);

                    //加载图片
                     lazyLoad.lazyLoad({
                        $container: $elem,
                        itemstotalNum: $elem.find('.floor-img').length,
                        id: 'tab',
                        triggerEvent: 'tab-show'
                    });
                    
                    $elem.tab({
                        event: 'mouseenter', // mouseenter或click
                        css3: false,
                        js: false,
                        animation: 'fade',
                        activeIndex: 0
                    });

                
                }, 1000);
            });
    });
    browser.$doc.on('floors-itemsLoaded', function () {
        browser.$win.off('scroll resize', floor.scrollEvent);
    });

    lazyLoad.lazyLoad({
        $container: browser.$doc,
        itemstotalNum: browser.$doc.find('.floor').length + 1,
        id: 'floors',
        triggerEvent: 'floor-show'
    });

    browser.scrollShow('Floor',floor);

    /*footer*/
    var footer = {};
    footer.$footer = $('#footer');
    footer.footerData = ['合作伙伴','营销中心','廉政举报','联系客服','开放平台','诚征英才','联系我们','网站声明','知识产权','法律声明'];

    footer.buildFooter = function (footerData) {
        var html = "";

        html += '<div class="footer-content">';
        for (var i = 0; i < footerData.length; i++) {
            html += '<a href="###" class="footer-link">' + footerData[i] +'</a>';
        }
        html += '</div>';
        html += '<p class="copyright">2020 imooc.com All Rights Reserve</p>';
        return html;
    };

    browser.$doc.on('footer-loadItems', function (e, index, elem, success) {
        var html = footer.buildFooter(footer.footerData);
        footer.$footer.html(html);
        success();

    });
    lazyLoad.lazyLoad({
        $container: browser.$doc,
        itemstotalNum: footer.$footer.length,
        id: 'footer',
        triggerEvent: 'footer-show'
    });

    browser.scrollShow('Footer',footer);

    /*elevator 左侧电梯区域 用于楼层切换 显示当前楼层*/
    var ele = {};
    ele.$elevator = $('.elevator');
    ele.$eleItem = $('.elevator-item');

    floor.whichFloor = function () {
        var num = -1;

        floor.$floor.each(function (index,elem) {
            var floorData = floor.floorData[index];
            //到可视窗的一半就显示
            if (floorData.offsetTop < floorData.winHeight/2 + browser.$win.scrollTop()) {
                num = index;
            }
        });
        return num;
    }

    ele.$elevator.on('click','.elevator-wrap', function () {
        $('html, body').animate({
            scrollTop:floor.floorData[$(this).index()].offsetTop
        })
    })

    browser.timeToshowElevator = function () {
        var index = floor.whichFloor();
        if (floor.whichFloor() >= 0) {
            ele.$elevator.fadeIn();
            ele.$eleItem.removeClass('elevator-item-active');
            ele.$eleItem.eq(index).addClass('elevator-item-active');
        } else {
            ele.$elevator.fadeOut();
        }
    } 
   
    
    browser.scrollShow('Elevator',ele);

    
    //右侧工具栏回到顶部
    $('#backtoTop').on('click', function () {
        $('html, body').animate({
            scrollTop:0
        })
    })

})(jQuery);