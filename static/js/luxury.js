/**
 * hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2013 Brian Cherne
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 **/
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var cfg = {
            interval: 100,
            sensitivity: 7,
            timeout: 0
        };

        if ( typeof handlerIn === "object" ) {
            cfg = $.extend(cfg, handlerIn );
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = 1;
                return cfg.over.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return cfg.out.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = jQuery.extend({},e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type == "mouseenter"
            if (e.type == "mouseenter") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

                // else e.type == "mouseleave"
            } else {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
})(jQuery);

/*
 * jQuery Superfish Menu Plugin
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
    "use strict";

    var methods = (function () {
        // private properties and methods go here
        var c = {
                bcClass: 'sf-breadcrumb',
                menuClass: 'sf-js-enabled',
                anchorClass: 'sf-with-ul',
                menuArrowClass: 'sf-arrows'
            },
            ios = (function () {
                var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                if (ios) {
                    // iOS clicks only bubble as far as body children
                    $(window).load(function () {
                        $('body').children().on('click', $.noop);
                    });
                }
                return ios;
            })(),
            wp7 = (function () {
                var style = document.documentElement.style;
                return ('behavior' in style && 'fill' in style && /iemobile/i.test(navigator.userAgent));
            })(),
            toggleMenuClasses = function ($menu, o) {
                var classes = c.menuClass;
                if (o.cssArrows) {
                    classes += ' ' + c.menuArrowClass;
                }
                $menu.toggleClass(classes);
            },
            setPathToCurrent = function ($menu, o) {
                return $menu.find('li.' + o.pathClass).slice(0, o.pathLevels)
                    .addClass(o.hoverClass + ' ' + c.bcClass)
                    .filter(function () {
                        return ($(this).children(o.popUpSelector).hide().show().length);
                    }).removeClass(o.pathClass);
            },
            toggleAnchorClass = function ($li) {
                $li.children('a').toggleClass(c.anchorClass);
            },
            toggleTouchAction = function ($menu) {
                var touchAction = $menu.css('ms-touch-action');
                touchAction = (touchAction === 'pan-y') ? 'auto' : 'pan-y';
                $menu.css('ms-touch-action', touchAction);
            },
            applyHandlers = function ($menu, o) {
                var targets = 'li:has(' + o.popUpSelector + ')';
                if ($.fn.hoverIntent && !o.disableHI) {
                    $menu.hoverIntent(over, out, targets);
                }
                else {
                    $menu
                        .on('mouseenter.superfish', targets, over)
                        .on('mouseleave.superfish', targets, out);
                }
                var touchevent = 'MSPointerDown.superfish';
                if (!ios) {
                    touchevent += ' touchend.superfish';
                }
                if (wp7) {
                    touchevent += ' mousedown.superfish';
                }
                $menu
                    .on('focusin.superfish', 'li', over)
                    .on('focusout.superfish', 'li', out)
                    .on(touchevent, 'a', o, touchHandler);
            },
            touchHandler = function (e) {
                var $this = $(this),
                    $ul = $this.siblings(e.data.popUpSelector);

                if ($ul.length > 0 && $ul.is(':hidden')) {
                    $this.one('click.superfish', false);
                    if (e.type === 'MSPointerDown') {
                        $this.trigger('focus');
                    } else {
                        $.proxy(over, $this.parent('li'))();
                    }
                }
            },
            over = function () {
                var $this = $(this),
                    o = getOptions($this);
                clearTimeout(o.sfTimer);
                $this.siblings().superfish('hide').end().superfish('show');
            },
            out = function () {
                var $this = $(this),
                    o = getOptions($this);
                if (ios) {
                    $.proxy(close, $this, o)();
                }
                else {
                    clearTimeout(o.sfTimer);
                    o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
                }
            },
            close = function (o) {
                o.retainPath = ($.inArray(this[0], o.$path) > -1);
                this.superfish('hide');

                if (!this.parents('.' + o.hoverClass).length) {
                    o.onIdle.call(getMenu(this));
                    if (o.$path.length) {
                        $.proxy(over, o.$path)();
                    }
                }
            },
            getMenu = function ($el) {
                return $el.closest('.' + c.menuClass);
            },
            getOptions = function ($el) {
                return getMenu($el).data('sf-options');
            };

        return {
            // public methods
            hide: function (instant) {
                if (this.length) {
                    var $this = this,
                        o = getOptions($this);
                    if (!o) {
                        return this;
                    }
                    var not = (o.retainPath === true) ? o.$path : '',
                        $ul = $this.find('li.' + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),
                        speed = o.speedOut;

                    if (instant) {
                        $ul.show();
                        speed = 0;
                    }
                    o.retainPath = false;
                    o.onBeforeHide.call($ul);
                    $ul.stop(true, true).animate(o.animationOut, speed, function () {
                        var $this = $(this);
                        o.onHide.call($this);
                    });
                }
                return this;
            },
            show: function () {
                var o = getOptions(this);
                if (!o) {
                    return this;
                }
                var $this = this.addClass(o.hoverClass),
                    $ul = $this.children(o.popUpSelector);

                o.onBeforeShow.call($ul);
                $ul.stop(true, true).animate(o.animation, o.speed, function () {
                    o.onShow.call($ul);
                });
                return this;
            },
            destroy: function () {
                return this.each(function () {
                    var $this = $(this),
                        o = $this.data('sf-options'),
                        $hasPopUp;
                    if (!o) {
                        return false;
                    }
                    $hasPopUp = $this.find(o.popUpSelector).parent('li');
                    clearTimeout(o.sfTimer);
                    toggleMenuClasses($this, o);
                    toggleAnchorClass($hasPopUp);
                    toggleTouchAction($this);
                    // remove event handlers
                    $this.off('.superfish').off('.hoverIntent');
                    // clear animation's inline display style
                    $hasPopUp.children(o.popUpSelector).attr('style', function (i, style) {
                        return style.replace(/display[^;]+;?/g, '');
                    });
                    // reset 'current' path classes
                    o.$path.removeClass(o.hoverClass + ' ' + c.bcClass).addClass(o.pathClass);
                    $this.find('.' + o.hoverClass).removeClass(o.hoverClass);
                    o.onDestroy.call($this);
                    $this.removeData('sf-options');
                });
            },
            init: function (op) {
                return this.each(function () {
                    var $this = $(this);
                    if ($this.data('sf-options')) {
                        return false;
                    }
                    var o = $.extend({}, $.fn.superfish.defaults, op),
                        $hasPopUp = $this.find(o.popUpSelector).parent('li');
                    o.$path = setPathToCurrent($this, o);

                    $this.data('sf-options', o);

                    toggleMenuClasses($this, o);
                    toggleAnchorClass($hasPopUp);
                    toggleTouchAction($this);
                    applyHandlers($this, o);

                    $hasPopUp.not('.' + c.bcClass).superfish('hide', true);

                    o.onInit.call(this);
                });
            }
        };
    })();

    $.fn.superfish = function (method, args) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        }
        else {
            return $.error('Method ' +  method + ' does not exist on jQuery.fn.superfish');
        }
    };

    $.fn.superfish.defaults = {
        popUpSelector: 'ul,.sf-mega', // within menu context
        hoverClass: 'sfHover',
        pathClass: 'overrideThisToUse',
        pathLevels: 1,
        delay: 800,
        animation: {opacity: 'show'},
        animationOut: {opacity: 'hide'},
        speed: 'normal',
        speedOut: 'fast',
        cssArrows: true,
        disableHI: false,
        onInit: $.noop,
        onBeforeShow: $.noop,
        onShow: $.noop,
        onBeforeHide: $.noop,
        onHide: $.noop,
        onIdle: $.noop,
        onDestroy: $.noop
    };

    // soon to be deprecated
    $.fn.extend({
        hideSuperfishUl: methods.hide,
        showSuperfishUl: methods.show
    });

})(jQuery);


/*
 * Supersubs v0.3b - jQuery plugin
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 *
 * This plugin automatically adjusts submenu widths of suckerfish-style menus to that of
 * their longest list item children. If you use this, please expect bugs and report them
 * to the jQuery Google Group with the word 'Superfish' in the subject line.
 *
 */

;(function($){ // $ will refer to jQuery within this closure

    $.fn.supersubs = function(options){
        var opts = $.extend({}, $.fn.supersubs.defaults, options);
        // return original object to support chaining
        return this.each(function() {
            // cache selections
            var $$ = $(this);
            // support metadata
            var o = $.meta ? $.extend({}, opts, $$.data()) : opts;
            // cache all ul elements and show them in preparation for measurements
            $ULs = $$.find('ul').show();
            // get the font size of menu.
            // .css('fontSize') returns various results cross-browser, so measure an em dash instead
            var fontsize = $('<li id="menu-fontsize">&#8212;</li>').css({
                'padding' : 0,
                'position' : 'absolute',
                'top' : '-999em',
                'width' : 'auto'
            }).appendTo($$)[0].clientWidth; //clientWidth is faster than .width()
            // remove em dash
            $('#menu-fontsize').remove();
            // loop through each ul in menu
            $ULs.each(function(i) {
                // cache this ul
                var $ul = $(this);
                // get all (li) children of this ul
                var $LIs = $ul.children();
                // get all anchor grand-children
                var $As = $LIs.children('a');
                // force content to one line and save current float property
                var liFloat = $LIs.css('white-space','nowrap').css('float');
                // remove width restrictions and floats so elements remain vertically stacked
                $ul.add($LIs).add($As).css({
                    'float' : 'none',
                    'width'	: 'auto'
                });
                // this ul will now be shrink-wrapped to longest li due to position:absolute
                // so save its width as ems.
                var emWidth = $ul[0].clientWidth / fontsize;
                // add more width to ensure lines don't turn over at certain sizes in various browsers
                emWidth += o.extraWidth;
                // restrict to at least minWidth and at most maxWidth
                if (emWidth > o.maxWidth)		{ emWidth = o.maxWidth; }
                else if (emWidth < o.minWidth)	{ emWidth = o.minWidth; }
                emWidth += 'em';
                // set ul to width in ems
                $ul.css('width',emWidth);
                // restore li floats to avoid IE bugs
                // set li width to full width of this ul
                // revert white-space to normal
                $LIs.css({
                    'float' : liFloat,
                    'width' : '100%',
                    'white-space' : 'normal'
                })
                    // update offset position of descendant ul to reflect new width of parent.
                    // set it to 100% in case it isn't already set to this in the CSS
                    .each(function(){
                        var $childUl = $(this).children('ul');
                        var offsetDirection = $childUl.css('left') !== undefined ? 'left' : 'right';
                        $childUl.css(offsetDirection,'100%');
                    });
            }).hide();

        });
    };
    // expose defaults
    $.fn.supersubs.defaults = {
        minWidth		: 9,		// requires em unit.
        maxWidth		: 25,		// requires em unit.
        extraWidth		: 0			// extra width can ensure lines don't sometimes turn over due to slight browser differences in how they round-off values
    };

})(jQuery); // plugin code ends

//////////////////////////////////////////////////////////////////////////////////
// Cloud Zoom V1.0.2.5
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// with enhancements by Philipp Andreas <https://github.com/smurfy/cloud-zoom>
//
// MIT License
//
// Please retain this copyright header in all versions of the software
//////////////////////////////////////////////////////////////////////////////////
(function($){function format(e){for(var t=1;t<arguments.length;t++){e=e.replace("%"+(t-1),arguments[t])}return e}function CloudZoom(e,t){var n=$("img",e);var r;var i;var s=null;var o=null;var u=null;var a=null;var f=null;var l=null;var c;var h=0;var p,d;var v=0;var m=0;var g=0;var y=0;var b=0;var w,E;var S=this,x;setTimeout(function(){if(o===null){var t=e.width();e.parent().append(format('<div style="width:%0px;position:absolute;top:75%;left:%1px;text-align:center" class="cloud-zoom-loading" >Loading...</div>',t/3,t/2-t/6)).find(":last").css("opacity",.5)}},200);var T=function(){if(l!==null){l.remove();l=null}};this.removeBits=function(){if(u){u.remove();u=null}if(a){a.remove();a=null}if(f){f.remove();f=null}T();$(".cloud-zoom-loading",e.parent()).remove()};this.destroy=function(){e.data("zoom",null);if(o){o.unbind();o.remove();o=null}if(s){s.remove();s=null}this.removeBits()};this.fadedOut=function(){if(s){s.remove();s=null}this.removeBits()};this.controlLoop=function(){if(u){var e=w-n.offset().left-p*.5>>0;var r=E-n.offset().top-d*.5>>0;if(e<0){e=0}else if(e>n.outerWidth()-p){e=n.outerWidth()-p}if(r<0){r=0}else if(r>n.outerHeight()-d){r=n.outerHeight()-d}u.css({left:e,top:r});u.css("background-position",-e+"px "+ -r+"px");v=e/n.outerWidth()*c.width>>0;m=r/n.outerHeight()*c.height>>0;y+=(v-y)/t.smoothMove;g+=(m-g)/t.smoothMove;s.css("background-position",-(y>>0)+"px "+(-(g>>0)+"px"))}h=setTimeout(function(){S.controlLoop()},30)};this.init2=function(e,t){b++;if(t===1){c=e}if(b===2){this.init()}};this.init=function(){$(".cloud-zoom-loading",e.parent()).remove();o=e.parent().append(format("<div class='mousetrap' style='background-image:url(\""+t.transparentImage+"\");z-index:999;position:absolute;width:%0px;height:%1px;left:%2px;top:%3px;'></div>",n.outerWidth(),n.outerHeight(),0,0)).find(":last");o.bind("mousemove",this,function(e){w=e.pageX;E=e.pageY});o.bind("mouseleave",this,function(e){clearTimeout(h);if(u){u.fadeOut(299)}if(a){a.fadeOut(299)}if(f){f.fadeOut(299)}s.fadeOut(300,function(){S.fadedOut()});return false});o.bind("mouseenter",this,function(r){w=r.pageX;E=r.pageY;x=r.data;if(s){s.stop(true,false);s.remove()}var i=t.adjustX,h=t.adjustY;var v=n.outerWidth();var m=n.outerHeight();var g=t.zoomWidth;var y=t.zoomHeight;if(t.zoomWidth=="auto"){g=v}if(t.zoomHeight=="auto"){y=m}var b=e.parent();switch(t.position){case"top":h-=y;break;case"right":i+=v;break;case"bottom":h+=m;break;case"left":i-=g;break;case"inside":g=v;y=m;break;default:b=$("#"+t.position);if(!b.length){b=e;i+=v;h+=m}else{g=b.innerWidth();y=b.innerHeight()}}s=b.append(format('<div id="cloud-zoom-big" class="cloud-zoom-big" style="display:none;position:absolute;left:%0px;top:%1px;width:%2px;height:%3px;background-image:url(\'%4\');z-index:99;"></div>',i,h,g,y,c.src)).find(":last");if(n.attr("title")&&t.showTitle){s.append(format('<div class="cloud-zoom-title">%0</div>',n.attr("title"))).find(":last").css("opacity",t.titleOpacity)}var S=/(msie) ([\w.]+)/.exec(navigator.userAgent);if(S){if((S[1]||"")=="msie"&&(S[2]||"0")<7){l=$('<iframe frameborder="0" src="#"></iframe>').css({position:"absolute",left:i,top:h,zIndex:99,width:g,height:y}).insertBefore(s)}}s.fadeIn(500);if(u){u.remove();u=null}p=n.outerWidth()/c.width*s.width();d=n.outerHeight()/c.height*s.height();u=e.append(format("<div class = 'cloud-zoom-lens' style='display:none;z-index:98;position:absolute;width:%0px;height:%1px;'></div>",p,d)).find(":last");o.css("cursor",u.css("cursor"));var T=false;if(t.tint){u.css("background",'url("'+n.attr("src")+'")');a=e.append(format('<div style="display:none;position:absolute; left:0px; top:0px; width:%0px; height:%1px; background-color:%2;" />',n.outerWidth(),n.outerHeight(),t.tint)).find(":last");a.css("opacity",t.tintOpacity);T=true;a.fadeIn(500)}if(t.softFocus){u.css("background",'url("'+n.attr("src")+'")');f=e.append(format('<div style="position:absolute;display:none;top:2px; left:2px; width:%0px; height:%1px;" />',n.outerWidth()-2,n.outerHeight()-2,t.tint)).find(":last");f.css("background",'url("'+n.attr("src")+'")');f.css("opacity",.5);T=true;f.fadeIn(500)}if(!T){u.css("opacity",t.lensOpacity)}if(t.position!=="inside"){u.fadeIn(500)}x.controlLoop();return})};r=new Image;$(r).load(function(){S.init2(this,0)});r.src=n.attr("src");i=new Image;$(i).load(function(){S.init2(this,1)});i.src=e.attr("href")}$(document).ready(function(){$(".cloud-zoom, .cloud-zoom-gallery").CloudZoom()});$.fn.CloudZoom=function(options){try{document.execCommand("BackgroundImageCache",false,true)}catch(e){}this.each(function(){var relOpts,opts;eval("var	a = {"+$(this).attr("rel")+"}");relOpts=a;if($(this).is(".cloud-zoom")){opts=$.extend({},$.fn.CloudZoom.defaults,options);opts=$.extend({},opts,relOpts);$(this).css({position:"relative",display:"block"});$("img",$(this)).css({display:"block"});if(!$(this).parent().hasClass("cloud-zoom-wrap")&&opts.useWrapper){$(this).wrap('<div class="cloud-zoom-wrap"></div>')}$(this).data("zoom",new CloudZoom($(this),opts))}else if($(this).is(".cloud-zoom-gallery")){opts=$.extend({},relOpts,options);$(this).data("relOpts",opts);$(this).bind("click",$(this),function(e){var t=e.data.data("relOpts");$("#"+t.useZoom).data("zoom").destroy();$("#"+t.useZoom).attr("href",e.data.attr("href"));$("#"+t.useZoom+" img").attr("src",e.data.data("relOpts").smallImage);$("#"+e.data.data("relOpts").useZoom).CloudZoom();return false})}});return this};$.fn.CloudZoom.defaults={zoomWidth:"auto",zoomHeight:"auto",position:"right",transparentImage:".",useWrapper:true,tint:false,tintOpacity:.5,lensOpacity:.5,softFocus:false,smoothMove:3,showTitle:true,titleOpacity:.5,adjustX:0,adjustY:0}})(jQuery);

/*
 Thumbnail scroller jQuery plugin
 Author: malihu [http://manos.malihu.gr]
 Homepage: manos.malihu.gr/jquery-thumbnail-scroller
 */
(function($){
    $.fn.thumbnailScroller=function(options){
        var defaults={ //default options
            scrollerType:"hoverPrecise", //values: "hoverPrecise", "hoverAccelerate", "clickButtons"
            scrollerOrientation:"horizontal", //values: "horizontal", "vertical"
            scrollEasing:"easeOutCirc", //easing type
            scrollEasingAmount:800, //value: milliseconds
            acceleration:2, //value: integer
            scrollSpeed:600, //value: milliseconds
            noScrollCenterSpace:0, //value: pixels
            autoScrolling:0, //value: integer
            autoScrollingSpeed:8000, //value: milliseconds
            autoScrollingEasing:"easeInOutQuad", //easing type
            autoScrollingDelay:2500 //value: milliseconds
        };
        var options=$.extend(defaults,options);
        return this.each(function(){
            //cache vars
            var $this=$(this);
            var $scrollerContainer=$this.children(".jTscrollerContainer");
            var $scroller=$this.children(".jTscrollerContainer").children(".jTscroller");
            var $scrollerNextButton=$this.children(".jTscrollerNextButton");
            var $scrollerPrevButton=$this.children(".jTscrollerPrevButton");
            //set scroller width
            if(options.scrollerOrientation=="horizontal"){
                $scrollerContainer.css("width",999999);
                var totalWidth=$scroller.outerWidth(true);
                $scrollerContainer.css("width",totalWidth);
            }else{
                var totalWidth=$scroller.outerWidth(true);
            }
            var totalHeight=$scroller.outerHeight(true); //scroller height
            //do the scrolling
            if(totalWidth>$this.width() || totalHeight>$this.height()){ //needs scrolling
                var pos;
                var mouseCoords;
                var mouseCoordsY;
                if(options.scrollerType=="hoverAccelerate"){ //type hoverAccelerate
                    var animTimer;
                    var interval=8;
                    $this.hover(function(){ //mouse over
                        $this.mousemove(function(e){
                            pos=findPos(this);
                            mouseCoords=(e.pageX-pos[1]);
                            mouseCoordsY=(e.pageY-pos[0]);
                        });
                        clearInterval(animTimer);
                        animTimer = setInterval(Scrolling,interval);
                    },function(){  //mouse out
                        clearInterval(animTimer);
                        $scroller.stop();
                    });
                    $scrollerPrevButton.add($scrollerNextButton).hide(); //hide buttons
                }else if(options.scrollerType=="clickButtons"){
                    ClickScrolling();
                }else{ //type hoverPrecise
                    pos=findPos(this);
                    $this.mousemove(function(e){
                        mouseCoords=(e.pageX-pos[1]);
                        mouseCoordsY=(e.pageY-pos[0]);
                        var mousePercentX=mouseCoords/$this.width(); if(mousePercentX>1){mousePercentX=1;}
                        var mousePercentY=mouseCoordsY/$this.height(); if(mousePercentY>1){mousePercentY=1;}
                        var destX=Math.round(-((totalWidth-$this.width())*(mousePercentX)));
                        var destY=Math.round(-((totalHeight-$this.height())*(mousePercentY)));
                        $scroller.stop(true,false).animate({left:destX,top:destY},options.scrollEasingAmount,options.scrollEasing);
                    });
                    $scrollerPrevButton.add($scrollerNextButton).hide(); //hide buttons
                }
                //auto scrolling
                if(options.autoScrolling>0){
                    AutoScrolling();
                }
            } else {
                //no scrolling needed
                $scrollerPrevButton.add($scrollerNextButton).hide(); //hide buttons
            }
            //"hoverAccelerate" scrolling fn
            var scrollerPos;
            var scrollerPosY;
            function Scrolling(){
                if((mouseCoords<$this.width()/2) && ($scroller.position().left>=0)){
                    $scroller.stop(true,true).css("left",0);
                }else if((mouseCoords>$this.width()/2) && ($scroller.position().left<=-(totalWidth-$this.width()))){
                    $scroller.stop(true,true).css("left",-(totalWidth-$this.width()));
                }else{
                    if((mouseCoords<=($this.width()/2)-options.noScrollCenterSpace) || (mouseCoords>=($this.width()/2)+options.noScrollCenterSpace)){
                        scrollerPos=Math.round(Math.cos((mouseCoords/$this.width())*Math.PI)*(interval+options.acceleration));
                        $scroller.stop(true,true).animate({left:"+="+scrollerPos},interval,"linear");
                    }else{
                        $scroller.stop(true,true);
                    }
                }
                if((mouseCoordsY<$this.height()/2) && ($scroller.position().top>=0)){
                    $scroller.stop(true,true).css("top",0);
                }else if((mouseCoordsY>$this.height()/2) && ($scroller.position().top<=-(totalHeight-$this.height()))){
                    $scroller.stop(true,true).css("top",-(totalHeight-$this.height()));
                }else{
                    if((mouseCoordsY<=($this.height()/2)-options.noScrollCenterSpace) || (mouseCoordsY>=($this.height()/2)+options.noScrollCenterSpace)){
                        scrollerPosY=Math.cos((mouseCoordsY/$this.height())*Math.PI)*(interval+options.acceleration);
                        $scroller.stop(true,true).animate({top:"+="+scrollerPosY},interval,"linear");
                    }else{
                        $scroller.stop(true,true);
                    }
                }
            }
            //auto scrolling fn
            var autoScrollingCount=0;
            function AutoScrolling(){
                $scroller.delay(options.autoScrollingDelay).animate({left:-(totalWidth-$this.width()),top:-(totalHeight-$this.height())},options.autoScrollingSpeed,options.autoScrollingEasing,function(){
                    $scroller.animate({left:0,top:0},options.autoScrollingSpeed,options.autoScrollingEasing,function(){
                        autoScrollingCount++;
                        if(options.autoScrolling>1 && options.autoScrolling!=autoScrollingCount){
                            AutoScrolling();
                        }
                    });
                });
            }
            //click scrolling fn
            function ClickScrolling(){
                $scrollerPrevButton.hide();
                $scrollerNextButton.show();
                $scrollerNextButton.click(function(e){ //next button
                    e.preventDefault();
                    var posX=$scroller.position().left;
                    var diffX=totalWidth+(posX-$this.width());
                    var posY=$scroller.position().top;
                    var diffY=totalHeight+(posY-$this.height());
                    $scrollerPrevButton.stop().show("fast");
                    if(options.scrollerOrientation=="horizontal"){
                        if(diffX>=$this.width()){
                            $scroller.stop().animate({left:"-="+$this.width()},options.scrollSpeed,options.scrollEasing,function(){
                                if(diffX==$this.width()){
                                    $scrollerNextButton.stop().hide("fast");
                                }
                            });
                        } else {
                            $scrollerNextButton.stop().hide("fast");
                            $scroller.stop().animate({left:$this.width()-totalWidth},options.scrollSpeed,options.scrollEasing);
                        }
                    }else{
                        if(diffY>=$this.height()){
                            $scroller.stop().animate({top:"-="+$this.height()},options.scrollSpeed,options.scrollEasing,function(){
                                if(diffY==$this.height()){
                                    $scrollerNextButton.stop().hide("fast");
                                }
                            });
                        } else {
                            $scrollerNextButton.stop().hide("fast");
                            $scroller.stop().animate({top:$this.height()-totalHeight},options.scrollSpeed,options.scrollEasing);
                        }
                    }
                });
                $scrollerPrevButton.click(function(e){ //previous button
                    e.preventDefault();
                    var posX=$scroller.position().left;
                    var diffX=totalWidth+(posX-$this.width());
                    var posY=$scroller.position().top;
                    var diffY=totalHeight+(posY-$this.height());
                    $scrollerNextButton.stop().show("fast");
                    if(options.scrollerOrientation=="horizontal"){
                        if(posX+$this.width()<=0){
                            $scroller.stop().animate({left:"+="+$this.width()},options.scrollSpeed,options.scrollEasing,function(){
                                if(posX+$this.width()==0){
                                    $scrollerPrevButton.stop().hide("fast");
                                }
                            });
                        } else {
                            $scrollerPrevButton.stop().hide("fast");
                            $scroller.stop().animate({left:0},options.scrollSpeed,options.scrollEasing);
                        }
                    }else{
                        if(posY+$this.height()<=0){
                            $scroller.stop().animate({top:"+="+$this.height()},options.scrollSpeed,options.scrollEasing,function(){
                                if(posY+$this.height()==0){
                                    $scrollerPrevButton.stop().hide("fast");
                                }
                            });
                        } else {
                            $scrollerPrevButton.stop().hide("fast");
                            $scroller.stop().animate({top:0},options.scrollSpeed,options.scrollEasing);
                        }
                    }
                });
            }
        });
    };
})(jQuery);
//global js functions
//find element Position
function findPos(obj){
    var curleft=curtop=0;
    if (obj.offsetParent){
        curleft=obj.offsetLeft
        curtop=obj.offsetTop
        while(obj=obj.offsetParent){
            curleft+=obj.offsetLeft
            curtop+=obj.offsetTop
        }
    }
    return [curtop,curleft];
}

/*! fancyBox v2.1.5 fancyapps.com | fancyapps.com/fancybox/#license */
(function(r,G,f,v){var J=f("html"),n=f(r),p=f(G),b=f.fancybox=function(){b.open.apply(this,arguments)},I=navigator.userAgent.match(/msie/i),B=null,s=G.createTouch!==v,t=function(a){return a&&a.hasOwnProperty&&a instanceof f},q=function(a){return a&&"string"===f.type(a)},E=function(a){return q(a)&&0<a.indexOf("%")},l=function(a,d){var e=parseInt(a,10)||0;d&&E(a)&&(e*=b.getViewport()[d]/100);return Math.ceil(e)},w=function(a,b){return l(a,b)+"px"};f.extend(b,{version:"2.1.5",defaults:{padding:15,margin:20,
    width:800,height:600,minWidth:100,minHeight:100,maxWidth:9999,maxHeight:9999,pixelRatio:1,autoSize:!0,autoHeight:!1,autoWidth:!1,autoResize:!0,autoCenter:!s,fitToView:!0,aspectRatio:!1,topRatio:0.5,leftRatio:0.5,scrolling:"auto",wrapCSS:"",arrows:!0,closeBtn:!0,closeClick:!1,nextClick:!1,mouseWheel:!0,autoPlay:!1,playSpeed:3E3,preload:3,modal:!1,loop:!0,ajax:{dataType:"html",headers:{"X-fancyBox":!0}},iframe:{scrolling:"auto",preload:!0},swf:{wmode:"transparent",allowfullscreen:"true",allowscriptaccess:"always"},
    keys:{next:{13:"left",34:"up",39:"left",40:"up"},prev:{8:"right",33:"down",37:"right",38:"down"},close:[27],play:[32],toggle:[70]},direction:{next:"left",prev:"right"},scrollOutside:!0,index:0,type:null,href:null,content:null,title:null,tpl:{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',image:'<img class="fancybox-image" src="{href}" alt="" />',iframe:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen'+
        (I?' allowtransparency="true"':"")+"></iframe>",error:'<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',closeBtn:'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',next:'<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',prev:'<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'},openEffect:"fade",openSpeed:250,openEasing:"swing",openOpacity:!0,
    openMethod:"zoomIn",closeEffect:"fade",closeSpeed:250,closeEasing:"swing",closeOpacity:!0,closeMethod:"zoomOut",nextEffect:"elastic",nextSpeed:250,nextEasing:"swing",nextMethod:"changeIn",prevEffect:"elastic",prevSpeed:250,prevEasing:"swing",prevMethod:"changeOut",helpers:{overlay:!0,title:!0},onCancel:f.noop,beforeLoad:f.noop,afterLoad:f.noop,beforeShow:f.noop,afterShow:f.noop,beforeChange:f.noop,beforeClose:f.noop,afterClose:f.noop},group:{},opts:{},previous:null,coming:null,current:null,isActive:!1,
    isOpen:!1,isOpened:!1,wrap:null,skin:null,outer:null,inner:null,player:{timer:null,isActive:!1},ajaxLoad:null,imgPreload:null,transitions:{},helpers:{},open:function(a,d){if(a&&(f.isPlainObject(d)||(d={}),!1!==b.close(!0)))return f.isArray(a)||(a=t(a)?f(a).get():[a]),f.each(a,function(e,c){var k={},g,h,j,m,l;"object"===f.type(c)&&(c.nodeType&&(c=f(c)),t(c)?(k={href:c.data("fancybox-href")||c.attr("href"),title:c.data("fancybox-title")||c.attr("title"),isDom:!0,element:c},f.metadata&&f.extend(!0,k,
        c.metadata())):k=c);g=d.href||k.href||(q(c)?c:null);h=d.title!==v?d.title:k.title||"";m=(j=d.content||k.content)?"html":d.type||k.type;!m&&k.isDom&&(m=c.data("fancybox-type"),m||(m=(m=c.prop("class").match(/fancybox\.(\w+)/))?m[1]:null));q(g)&&(m||(b.isImage(g)?m="image":b.isSWF(g)?m="swf":"#"===g.charAt(0)?m="inline":q(c)&&(m="html",j=c)),"ajax"===m&&(l=g.split(/\s+/,2),g=l.shift(),l=l.shift()));j||("inline"===m?g?j=f(q(g)?g.replace(/.*(?=#[^\s]+$)/,""):g):k.isDom&&(j=c):"html"===m?j=g:!m&&(!g&&
        k.isDom)&&(m="inline",j=c));f.extend(k,{href:g,type:m,content:j,title:h,selector:l});a[e]=k}),b.opts=f.extend(!0,{},b.defaults,d),d.keys!==v&&(b.opts.keys=d.keys?f.extend({},b.defaults.keys,d.keys):!1),b.group=a,b._start(b.opts.index)},cancel:function(){var a=b.coming;a&&!1!==b.trigger("onCancel")&&(b.hideLoading(),b.ajaxLoad&&b.ajaxLoad.abort(),b.ajaxLoad=null,b.imgPreload&&(b.imgPreload.onload=b.imgPreload.onerror=null),a.wrap&&a.wrap.stop(!0,!0).trigger("onReset").remove(),b.coming=null,b.current||
        b._afterZoomOut(a))},close:function(a){b.cancel();!1!==b.trigger("beforeClose")&&(b.unbindEvents(),b.isActive&&(!b.isOpen||!0===a?(f(".fancybox-wrap").stop(!0).trigger("onReset").remove(),b._afterZoomOut()):(b.isOpen=b.isOpened=!1,b.isClosing=!0,f(".fancybox-item, .fancybox-nav").remove(),b.wrap.stop(!0,!0).removeClass("fancybox-opened"),b.transitions[b.current.closeMethod]())))},play:function(a){var d=function(){clearTimeout(b.player.timer)},e=function(){d();b.current&&b.player.isActive&&(b.player.timer=
        setTimeout(b.next,b.current.playSpeed))},c=function(){d();p.unbind(".player");b.player.isActive=!1;b.trigger("onPlayEnd")};if(!0===a||!b.player.isActive&&!1!==a){if(b.current&&(b.current.loop||b.current.index<b.group.length-1))b.player.isActive=!0,p.bind({"onCancel.player beforeClose.player":c,"onUpdate.player":e,"beforeLoad.player":d}),e(),b.trigger("onPlayStart")}else c()},next:function(a){var d=b.current;d&&(q(a)||(a=d.direction.next),b.jumpto(d.index+1,a,"next"))},prev:function(a){var d=b.current;
        d&&(q(a)||(a=d.direction.prev),b.jumpto(d.index-1,a,"prev"))},jumpto:function(a,d,e){var c=b.current;c&&(a=l(a),b.direction=d||c.direction[a>=c.index?"next":"prev"],b.router=e||"jumpto",c.loop&&(0>a&&(a=c.group.length+a%c.group.length),a%=c.group.length),c.group[a]!==v&&(b.cancel(),b._start(a)))},reposition:function(a,d){var e=b.current,c=e?e.wrap:null,k;c&&(k=b._getPosition(d),a&&"scroll"===a.type?(delete k.position,c.stop(!0,!0).animate(k,200)):(c.css(k),e.pos=f.extend({},e.dim,k)))},update:function(a){var d=
        a&&a.type,e=!d||"orientationchange"===d;e&&(clearTimeout(B),B=null);b.isOpen&&!B&&(B=setTimeout(function(){var c=b.current;c&&!b.isClosing&&(b.wrap.removeClass("fancybox-tmp"),(e||"load"===d||"resize"===d&&c.autoResize)&&b._setDimension(),"scroll"===d&&c.canShrink||b.reposition(a),b.trigger("onUpdate"),B=null)},e&&!s?0:300))},toggle:function(a){b.isOpen&&(b.current.fitToView="boolean"===f.type(a)?a:!b.current.fitToView,s&&(b.wrap.removeAttr("style").addClass("fancybox-tmp"),b.trigger("onUpdate")),
        b.update())},hideLoading:function(){p.unbind(".loading");f("#fancybox-loading").remove()},showLoading:function(){var a,d;b.hideLoading();a=f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");p.bind("keydown.loading",function(a){if(27===(a.which||a.keyCode))a.preventDefault(),b.cancel()});b.defaults.fixed||(d=b.getViewport(),a.css({position:"absolute",top:0.5*d.h+d.y,left:0.5*d.w+d.x}))},getViewport:function(){var a=b.current&&b.current.locked||!1,d={x:n.scrollLeft(),
        y:n.scrollTop()};a?(d.w=a[0].clientWidth,d.h=a[0].clientHeight):(d.w=s&&r.innerWidth?r.innerWidth:n.width(),d.h=s&&r.innerHeight?r.innerHeight:n.height());return d},unbindEvents:function(){b.wrap&&t(b.wrap)&&b.wrap.unbind(".fb");p.unbind(".fb");n.unbind(".fb")},bindEvents:function(){var a=b.current,d;a&&(n.bind("orientationchange.fb"+(s?"":" resize.fb")+(a.autoCenter&&!a.locked?" scroll.fb":""),b.update),(d=a.keys)&&p.bind("keydown.fb",function(e){var c=e.which||e.keyCode,k=e.target||e.srcElement;
        if(27===c&&b.coming)return!1;!e.ctrlKey&&(!e.altKey&&!e.shiftKey&&!e.metaKey&&(!k||!k.type&&!f(k).is("[contenteditable]")))&&f.each(d,function(d,k){if(1<a.group.length&&k[c]!==v)return b[d](k[c]),e.preventDefault(),!1;if(-1<f.inArray(c,k))return b[d](),e.preventDefault(),!1})}),f.fn.mousewheel&&a.mouseWheel&&b.wrap.bind("mousewheel.fb",function(d,c,k,g){for(var h=f(d.target||null),j=!1;h.length&&!j&&!h.is(".fancybox-skin")&&!h.is(".fancybox-wrap");)j=h[0]&&!(h[0].style.overflow&&"hidden"===h[0].style.overflow)&&
        (h[0].clientWidth&&h[0].scrollWidth>h[0].clientWidth||h[0].clientHeight&&h[0].scrollHeight>h[0].clientHeight),h=f(h).parent();if(0!==c&&!j&&1<b.group.length&&!a.canShrink){if(0<g||0<k)b.prev(0<g?"down":"left");else if(0>g||0>k)b.next(0>g?"up":"right");d.preventDefault()}}))},trigger:function(a,d){var e,c=d||b.coming||b.current;if(c){f.isFunction(c[a])&&(e=c[a].apply(c,Array.prototype.slice.call(arguments,1)));if(!1===e)return!1;c.helpers&&f.each(c.helpers,function(d,e){if(e&&b.helpers[d]&&f.isFunction(b.helpers[d][a]))b.helpers[d][a](f.extend(!0,
        {},b.helpers[d].defaults,e),c)});p.trigger(a)}},isImage:function(a){return q(a)&&a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)},isSWF:function(a){return q(a)&&a.match(/\.(swf)((\?|#).*)?$/i)},_start:function(a){var d={},e,c;a=l(a);e=b.group[a]||null;if(!e)return!1;d=f.extend(!0,{},b.opts,e);e=d.margin;c=d.padding;"number"===f.type(e)&&(d.margin=[e,e,e,e]);"number"===f.type(c)&&(d.padding=[c,c,c,c]);d.modal&&f.extend(!0,d,{closeBtn:!1,closeClick:!1,nextClick:!1,arrows:!1,
        mouseWheel:!1,keys:null,helpers:{overlay:{closeClick:!1}}});d.autoSize&&(d.autoWidth=d.autoHeight=!0);"auto"===d.width&&(d.autoWidth=!0);"auto"===d.height&&(d.autoHeight=!0);d.group=b.group;d.index=a;b.coming=d;if(!1===b.trigger("beforeLoad"))b.coming=null;else{c=d.type;e=d.href;if(!c)return b.coming=null,b.current&&b.router&&"jumpto"!==b.router?(b.current.index=a,b[b.router](b.direction)):!1;b.isActive=!0;if("image"===c||"swf"===c)d.autoHeight=d.autoWidth=!1,d.scrolling="visible";"image"===c&&(d.aspectRatio=
        !0);"iframe"===c&&s&&(d.scrolling="scroll");d.wrap=f(d.tpl.wrap).addClass("fancybox-"+(s?"mobile":"desktop")+" fancybox-type-"+c+" fancybox-tmp "+d.wrapCSS).appendTo(d.parent||"body");f.extend(d,{skin:f(".fancybox-skin",d.wrap),outer:f(".fancybox-outer",d.wrap),inner:f(".fancybox-inner",d.wrap)});f.each(["Top","Right","Bottom","Left"],function(a,b){d.skin.css("padding"+b,w(d.padding[a]))});b.trigger("onReady");if("inline"===c||"html"===c){if(!d.content||!d.content.length)return b._error("content")}else if(!e)return b._error("href");
        "image"===c?b._loadImage():"ajax"===c?b._loadAjax():"iframe"===c?b._loadIframe():b._afterLoad()}},_error:function(a){f.extend(b.coming,{type:"html",autoWidth:!0,autoHeight:!0,minWidth:0,minHeight:0,scrolling:"no",hasError:a,content:b.coming.tpl.error});b._afterLoad()},_loadImage:function(){var a=b.imgPreload=new Image;a.onload=function(){this.onload=this.onerror=null;b.coming.width=this.width/b.opts.pixelRatio;b.coming.height=this.height/b.opts.pixelRatio;b._afterLoad()};a.onerror=function(){this.onload=
        this.onerror=null;b._error("image")};a.src=b.coming.href;!0!==a.complete&&b.showLoading()},_loadAjax:function(){var a=b.coming;b.showLoading();b.ajaxLoad=f.ajax(f.extend({},a.ajax,{url:a.href,error:function(a,e){b.coming&&"abort"!==e?b._error("ajax",a):b.hideLoading()},success:function(d,e){"success"===e&&(a.content=d,b._afterLoad())}}))},_loadIframe:function(){var a=b.coming,d=f(a.tpl.iframe.replace(/\{rnd\}/g,(new Date).getTime())).attr("scrolling",s?"auto":a.iframe.scrolling).attr("src",a.href);
        f(a.wrap).bind("onReset",function(){try{f(this).find("iframe").hide().attr("src","//about:blank").end().empty()}catch(a){}});a.iframe.preload&&(b.showLoading(),d.one("load",function(){f(this).data("ready",1);s||f(this).bind("load.fb",b.update);f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();b._afterLoad()}));a.content=d.appendTo(a.inner);a.iframe.preload||b._afterLoad()},_preloadImages:function(){var a=b.group,d=b.current,e=a.length,c=d.preload?Math.min(d.preload,
        e-1):0,f,g;for(g=1;g<=c;g+=1)f=a[(d.index+g)%e],"image"===f.type&&f.href&&((new Image).src=f.href)},_afterLoad:function(){var a=b.coming,d=b.current,e,c,k,g,h;b.hideLoading();if(a&&!1!==b.isActive)if(!1===b.trigger("afterLoad",a,d))a.wrap.stop(!0).trigger("onReset").remove(),b.coming=null;else{d&&(b.trigger("beforeChange",d),d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());b.unbindEvents();e=a.content;c=a.type;k=a.scrolling;f.extend(b,{wrap:a.wrap,skin:a.skin,
        outer:a.outer,inner:a.inner,current:a,previous:d});g=a.href;switch(c){case "inline":case "ajax":case "html":a.selector?e=f("<div>").html(e).find(a.selector):t(e)&&(e.data("fancybox-placeholder")||e.data("fancybox-placeholder",f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()),e=e.show().detach(),a.wrap.bind("onReset",function(){f(this).find(e).length&&e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder",!1)}));break;case "image":e=a.tpl.image.replace("{href}",
        g);break;case "swf":e='<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="'+g+'"></param>',h="",f.each(a.swf,function(a,b){e+='<param name="'+a+'" value="'+b+'"></param>';h+=" "+a+'="'+b+'"'}),e+='<embed src="'+g+'" type="application/x-shockwave-flash" width="100%" height="100%"'+h+"></embed></object>"}(!t(e)||!e.parent().is(a.inner))&&a.inner.append(e);b.trigger("beforeShow");a.inner.css("overflow","yes"===k?"scroll":
        "no"===k?"hidden":k);b._setDimension();b.reposition();b.isOpen=!1;b.coming=null;b.bindEvents();if(b.isOpened){if(d.prevMethod)b.transitions[d.prevMethod]()}else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();b.transitions[b.isOpened?a.nextMethod:a.openMethod]();b._preloadImages()}},_setDimension:function(){var a=b.getViewport(),d=0,e=!1,c=!1,e=b.wrap,k=b.skin,g=b.inner,h=b.current,c=h.width,j=h.height,m=h.minWidth,u=h.minHeight,n=h.maxWidth,p=h.maxHeight,s=h.scrolling,q=h.scrollOutside?
        h.scrollbarWidth:0,x=h.margin,y=l(x[1]+x[3]),r=l(x[0]+x[2]),v,z,t,C,A,F,B,D,H;e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");x=l(k.outerWidth(!0)-k.width());v=l(k.outerHeight(!0)-k.height());z=y+x;t=r+v;C=E(c)?(a.w-z)*l(c)/100:c;A=E(j)?(a.h-t)*l(j)/100:j;if("iframe"===h.type){if(H=h.content,h.autoHeight&&1===H.data("ready"))try{H[0].contentWindow.document.location&&(g.width(C).height(9999),F=H.contents().find("body"),q&&F.css("overflow-x","hidden"),A=F.outerHeight(!0))}catch(G){}}else if(h.autoWidth||
        h.autoHeight)g.addClass("fancybox-tmp"),h.autoWidth||g.width(C),h.autoHeight||g.height(A),h.autoWidth&&(C=g.width()),h.autoHeight&&(A=g.height()),g.removeClass("fancybox-tmp");c=l(C);j=l(A);D=C/A;m=l(E(m)?l(m,"w")-z:m);n=l(E(n)?l(n,"w")-z:n);u=l(E(u)?l(u,"h")-t:u);p=l(E(p)?l(p,"h")-t:p);F=n;B=p;h.fitToView&&(n=Math.min(a.w-z,n),p=Math.min(a.h-t,p));z=a.w-y;r=a.h-r;h.aspectRatio?(c>n&&(c=n,j=l(c/D)),j>p&&(j=p,c=l(j*D)),c<m&&(c=m,j=l(c/D)),j<u&&(j=u,c=l(j*D))):(c=Math.max(m,Math.min(c,n)),h.autoHeight&&
        "iframe"!==h.type&&(g.width(c),j=g.height()),j=Math.max(u,Math.min(j,p)));if(h.fitToView)if(g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height(),h.aspectRatio)for(;(a>z||y>r)&&(c>m&&j>u)&&!(19<d++);)j=Math.max(u,Math.min(p,j-10)),c=l(j*D),c<m&&(c=m,j=l(c/D)),c>n&&(c=n,j=l(c/D)),g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height();else c=Math.max(m,Math.min(c,c-(a-z))),j=Math.max(u,Math.min(j,j-(y-r)));q&&("auto"===s&&j<A&&c+x+q<z)&&(c+=q);g.width(c).height(j);e.width(c+x);a=e.width();
        y=e.height();e=(a>z||y>r)&&c>m&&j>u;c=h.aspectRatio?c<F&&j<B&&c<C&&j<A:(c<F||j<B)&&(c<C||j<A);f.extend(h,{dim:{width:w(a),height:w(y)},origWidth:C,origHeight:A,canShrink:e,canExpand:c,wPadding:x,hPadding:v,wrapSpace:y-k.outerHeight(!0),skinSpace:k.height()-j});!H&&(h.autoHeight&&j>u&&j<p&&!c)&&g.height("auto")},_getPosition:function(a){var d=b.current,e=b.getViewport(),c=d.margin,f=b.wrap.width()+c[1]+c[3],g=b.wrap.height()+c[0]+c[2],c={position:"absolute",top:c[0],left:c[3]};d.autoCenter&&d.fixed&&
        !a&&g<=e.h&&f<=e.w?c.position="fixed":d.locked||(c.top+=e.y,c.left+=e.x);c.top=w(Math.max(c.top,c.top+(e.h-g)*d.topRatio));c.left=w(Math.max(c.left,c.left+(e.w-f)*d.leftRatio));return c},_afterZoomIn:function(){var a=b.current;a&&(b.isOpen=b.isOpened=!0,b.wrap.css("overflow","visible").addClass("fancybox-opened"),b.update(),(a.closeClick||a.nextClick&&1<b.group.length)&&b.inner.css("cursor","pointer").bind("click.fb",function(d){!f(d.target).is("a")&&!f(d.target).parent().is("a")&&(d.preventDefault(),
        b[a.closeClick?"close":"next"]())}),a.closeBtn&&f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb",function(a){a.preventDefault();b.close()}),a.arrows&&1<b.group.length&&((a.loop||0<a.index)&&f(a.tpl.prev).appendTo(b.outer).bind("click.fb",b.prev),(a.loop||a.index<b.group.length-1)&&f(a.tpl.next).appendTo(b.outer).bind("click.fb",b.next)),b.trigger("afterShow"),!a.loop&&a.index===a.group.length-1?b.play(!1):b.opts.autoPlay&&!b.player.isActive&&(b.opts.autoPlay=!1,b.play()))},_afterZoomOut:function(a){a=
        a||b.current;f(".fancybox-wrap").trigger("onReset").remove();f.extend(b,{group:{},opts:{},router:!1,current:null,isActive:!1,isOpened:!1,isOpen:!1,isClosing:!1,wrap:null,skin:null,outer:null,inner:null});b.trigger("afterClose",a)}});b.transitions={getOrigPosition:function(){var a=b.current,d=a.element,e=a.orig,c={},f=50,g=50,h=a.hPadding,j=a.wPadding,m=b.getViewport();!e&&(a.isDom&&d.is(":visible"))&&(e=d.find("img:first"),e.length||(e=d));t(e)?(c=e.offset(),e.is("img")&&(f=e.outerWidth(),g=e.outerHeight())):
    (c.top=m.y+(m.h-g)*a.topRatio,c.left=m.x+(m.w-f)*a.leftRatio);if("fixed"===b.wrap.css("position")||a.locked)c.top-=m.y,c.left-=m.x;return c={top:w(c.top-h*a.topRatio),left:w(c.left-j*a.leftRatio),width:w(f+j),height:w(g+h)}},step:function(a,d){var e,c,f=d.prop;c=b.current;var g=c.wrapSpace,h=c.skinSpace;if("width"===f||"height"===f)e=d.end===d.start?1:(a-d.start)/(d.end-d.start),b.isClosing&&(e=1-e),c="width"===f?c.wPadding:c.hPadding,c=a-c,b.skin[f](l("width"===f?c:c-g*e)),b.inner[f](l("width"===
    f?c:c-g*e-h*e))},zoomIn:function(){var a=b.current,d=a.pos,e=a.openEffect,c="elastic"===e,k=f.extend({opacity:1},d);delete k.position;c?(d=this.getOrigPosition(),a.openOpacity&&(d.opacity=0.1)):"fade"===e&&(d.opacity=0.1);b.wrap.css(d).animate(k,{duration:"none"===e?0:a.openSpeed,easing:a.openEasing,step:c?this.step:null,complete:b._afterZoomIn})},zoomOut:function(){var a=b.current,d=a.closeEffect,e="elastic"===d,c={opacity:0.1};e&&(c=this.getOrigPosition(),a.closeOpacity&&(c.opacity=0.1));b.wrap.animate(c,
    {duration:"none"===d?0:a.closeSpeed,easing:a.closeEasing,step:e?this.step:null,complete:b._afterZoomOut})},changeIn:function(){var a=b.current,d=a.nextEffect,e=a.pos,c={opacity:1},f=b.direction,g;e.opacity=0.1;"elastic"===d&&(g="down"===f||"up"===f?"top":"left","down"===f||"right"===f?(e[g]=w(l(e[g])-200),c[g]="+=200px"):(e[g]=w(l(e[g])+200),c[g]="-=200px"));"none"===d?b._afterZoomIn():b.wrap.css(e).animate(c,{duration:a.nextSpeed,easing:a.nextEasing,complete:b._afterZoomIn})},changeOut:function(){var a=
    b.previous,d=a.prevEffect,e={opacity:0.1},c=b.direction;"elastic"===d&&(e["down"===c||"up"===c?"top":"left"]=("up"===c||"left"===c?"-":"+")+"=200px");a.wrap.animate(e,{duration:"none"===d?0:a.prevSpeed,easing:a.prevEasing,complete:function(){f(this).trigger("onReset").remove()}})}};b.helpers.overlay={defaults:{closeClick:!0,speedOut:200,showEarly:!0,css:{},locked:!s,fixed:!0},overlay:null,fixed:!1,el:f("html"),create:function(a){a=f.extend({},this.defaults,a);this.overlay&&this.close();this.overlay=
    f('<div class="fancybox-overlay"></div>').appendTo(b.coming?b.coming.parent:a.parent);this.fixed=!1;a.fixed&&b.defaults.fixed&&(this.overlay.addClass("fancybox-overlay-fixed"),this.fixed=!0)},open:function(a){var d=this;a=f.extend({},this.defaults,a);this.overlay?this.overlay.unbind(".overlay").width("auto").height("auto"):this.create(a);this.fixed||(n.bind("resize.overlay",f.proxy(this.update,this)),this.update());a.closeClick&&this.overlay.bind("click.overlay",function(a){if(f(a.target).hasClass("fancybox-overlay"))return b.isActive?
    b.close():d.close(),!1});this.overlay.css(a.css).show()},close:function(){var a,b;n.unbind("resize.overlay");this.el.hasClass("fancybox-lock")&&(f(".fancybox-margin").removeClass("fancybox-margin"),a=n.scrollTop(),b=n.scrollLeft(),this.el.removeClass("fancybox-lock"),n.scrollTop(a).scrollLeft(b));f(".fancybox-overlay").remove().hide();f.extend(this,{overlay:null,fixed:!1})},update:function(){var a="100%",b;this.overlay.width(a).height("100%");I?(b=Math.max(G.documentElement.offsetWidth,G.body.offsetWidth),
    p.width()>b&&(a=p.width())):p.width()>n.width()&&(a=p.width());this.overlay.width(a).height(p.height())},onReady:function(a,b){var e=this.overlay;f(".fancybox-overlay").stop(!0,!0);e||this.create(a);a.locked&&(this.fixed&&b.fixed)&&(e||(this.margin=p.height()>n.height()?f("html").css("margin-right").replace("px",""):!1),b.locked=this.overlay.append(b.wrap),b.fixed=!1);!0===a.showEarly&&this.beforeShow.apply(this,arguments)},beforeShow:function(a,b){var e,c;b.locked&&(!1!==this.margin&&(f("*").filter(function(){return"fixed"===
    f(this).css("position")&&!f(this).hasClass("fancybox-overlay")&&!f(this).hasClass("fancybox-wrap")}).addClass("fancybox-margin"),this.el.addClass("fancybox-margin")),e=n.scrollTop(),c=n.scrollLeft(),this.el.addClass("fancybox-lock"),n.scrollTop(e).scrollLeft(c));this.open(a)},onUpdate:function(){this.fixed||this.update()},afterClose:function(a){this.overlay&&!b.coming&&this.overlay.fadeOut(a.speedOut,f.proxy(this.close,this))}};b.helpers.title={defaults:{type:"float",position:"bottom"},beforeShow:function(a){var d=
    b.current,e=d.title,c=a.type;f.isFunction(e)&&(e=e.call(d.element,d));if(q(e)&&""!==f.trim(e)){d=f('<div class="fancybox-title fancybox-title-'+c+'-wrap">'+e+"</div>");switch(c){case "inside":c=b.skin;break;case "outside":c=b.wrap;break;case "over":c=b.inner;break;default:c=b.skin,d.appendTo("body"),I&&d.width(d.width()),d.wrapInner('<span class="child"></span>'),b.current.margin[2]+=Math.abs(l(d.css("margin-bottom")))}d["top"===a.position?"prependTo":"appendTo"](c)}}};f.fn.fancybox=function(a){var d,
    e=f(this),c=this.selector||"",k=function(g){var h=f(this).blur(),j=d,k,l;!g.ctrlKey&&(!g.altKey&&!g.shiftKey&&!g.metaKey)&&!h.is(".fancybox-wrap")&&(k=a.groupAttr||"data-fancybox-group",l=h.attr(k),l||(k="rel",l=h.get(0)[k]),l&&(""!==l&&"nofollow"!==l)&&(h=c.length?f(c):e,h=h.filter("["+k+'="'+l+'"]'),j=h.index(this)),a.index=j,!1!==b.open(h,a)&&g.preventDefault())};a=a||{};d=a.index||0;!c||!1===a.live?e.unbind("click.fb-start").bind("click.fb-start",k):p.undelegate(c,"click.fb-start").delegate(c+
    ":not('.fancybox-item, .fancybox-nav')","click.fb-start",k);this.filter("[data-fancybox-start=1]").trigger("click");return this};p.ready(function(){var a,d;f.scrollbarWidth===v&&(f.scrollbarWidth=function(){var a=f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),b=a.children(),b=b.innerWidth()-b.height(99).innerWidth();a.remove();return b});if(f.support.fixedPosition===v){a=f.support;d=f('<div style="position:fixed;top:20px;"></div>').appendTo("body");var e=20===
    d[0].offsetTop||15===d[0].offsetTop;d.remove();a.fixedPosition=e}f.extend(b.defaults,{scrollbarWidth:f.scrollbarWidth(),fixed:f.support.fixedPosition,parent:f("body")});a=f(r).width();J.addClass("fancybox-lock-test");d=f(r).width();J.removeClass("fancybox-lock-test");f("<style type='text/css'>.fancybox-margin{margin-right:"+(d-a)+"px;}</style>").appendTo("head")})})(window,document,jQuery);

/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:v()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:50,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(p()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",B),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&I(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},p=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},v=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.delegate("a","click",q)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.delegate(".bx-start","click",k),o.controls.autoEl.delegate(".bx-stop","click",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},q=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},I=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),"horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0)}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},B=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider())};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&I(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",51).fadeIn(o.settings.speed,function(){t(this).css("zIndex",50),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",p()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),I(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",B))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);

/*!
 *  GMAP3 Plugin for JQuery
 *  Version   : 5.1.1
 *  Date      : 2013-05-25
 *  Licence   : GPL v3 : http://www.gnu.org/licenses/gpl.html
 *  Author    : DEMONTE Jean-Baptiste
 *  Contact   : jbdemonte@gmail.com
 *  Web site  : http://gmap3.net
 *
 *  Copyright (c) 2010-2012 Jean-Baptiste DEMONTE
 *  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above
 *     copyright notice, this list of conditions and the following
 *     disclaimer in the documentation and/or other materials provided
 *     with the distribution.
 *   - Neither the name of the author nor the names of its contributors
 *     may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
;(function ($, undef) {

    /***************************************************************************/
    /*                           GMAP3 DEFAULTS                                */
    /***************************************************************************/
    // defaults are defined later in the code to pass the rails asset pipeline and
    //jasmine while google library is not loaded
    var defaults, gId = 0;

    function initDefaults() {
        if (!defaults) {
            defaults = {
                verbose: false,
                queryLimit: {
                    attempt: 5,
                    delay: 250, // setTimeout(..., delay + random);
                    random: 250
                },
                classes: {
                    Map               : google.maps.Map,
                    Marker            : google.maps.Marker,
                    InfoWindow        : google.maps.InfoWindow,
                    Circle            : google.maps.Circle,
                    Rectangle         : google.maps.Rectangle,
                    OverlayView       : google.maps.OverlayView,
                    StreetViewPanorama: google.maps.StreetViewPanorama,
                    KmlLayer          : google.maps.KmlLayer,
                    TrafficLayer      : google.maps.TrafficLayer,
                    BicyclingLayer    : google.maps.BicyclingLayer,
                    GroundOverlay     : google.maps.GroundOverlay,
                    StyledMapType     : google.maps.StyledMapType,
                    ImageMapType      : google.maps.ImageMapType
                },
                map: {
                    mapTypeId : google.maps.MapTypeId.ROADMAP,
                    center: [46.578498, 2.457275],
                    zoom: 2
                },
                overlay: {
                    pane: "floatPane",
                    content: "",
                    offset: {
                        x: 0,
                        y: 0
                    }
                },
                geoloc: {
                    getCurrentPosition: {
                        maximumAge: 60000,
                        timeout: 5000
                    }
                }
            }
        }
    }

    function globalId(id, simulate){
        return id !== undef ? id : "gmap3_" + (simulate ? gId + 1 : ++gId);
    }

    /**
     * Return true if current version of Google Maps is equal or above to these in parameter
     * @param version {string} Minimal version required
     * @return {Boolean}
     */
    function googleVersionMin(version) {
        var i,
            gmVersion = google.maps.version.split(".");
        version = version.split(".");
        for(i = 0; i < gmVersion.length; i++) {
            gmVersion[i] = parseInt(gmVersion[i], 10);
        }
        for(i = 0; i < version.length; i++) {
            version[i] = parseInt(version[i], 10);
            if (gmVersion.hasOwnProperty(i)) {
                if (gmVersion[i] < version[i]) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * attach events from a container to a sender
     * todo[
     *  events => { eventName => function, }
     *  onces  => { eventName => function, }
     *  data   => mixed data
     * ]
     **/
    function attachEvents($container, args, sender, id, senders){
        if (args.todo.events || args.todo.onces) {
            var context = {
                id: id,
                data: args.todo.data,
                tag: args.todo.tag
            };
            if (args.todo.events){
                $.each(args.todo.events, function(name, f){
                    var that = $container, fn = f;
                    if ($.isArray(f)) {
                        that = f[0];
                        fn = f[1]
                    }
                    google.maps.event.addListener(sender, name, function(event) {
                        fn.apply(that, [senders ? senders : sender, event, context]);
                    });
                });
            }
            if (args.todo.onces){
                $.each(args.todo.onces, function(name, f){
                    var that = $container, fn = f;
                    if ($.isArray(f)) {
                        that = f[0];
                        fn = f[1]
                    }
                    google.maps.event.addListenerOnce(sender, name, function(event) {
                        fn.apply(that, [senders ? senders : sender, event, context]);
                    });
                });
            }
        }
    }

    /***************************************************************************/
    /*                                STACK                                    */
    /***************************************************************************/

    function Stack (){
        var st = [];
        this.empty = function (){
            return !st.length;
        };
        this.add = function(v){
            st.push(v);
        };
        this.get = function (){
            return st.length ? st[0] : false;
        };
        this.ack = function (){
            st.shift();
        };
    }

    /***************************************************************************/
    /*                                TASK                                     */
    /***************************************************************************/

    function Task(ctx, onEnd, todo){
        var session = {},
            that = this,
            current,
            resolve = {
                latLng:{ // function => bool (=> address = latLng)
                    map:false,
                    marker:false,
                    infowindow:false,
                    circle:false,
                    overlay: false,
                    getlatlng: false,
                    getmaxzoom: false,
                    getelevation: false,
                    streetviewpanorama: false,
                    getaddress: true
                },
                geoloc:{
                    getgeoloc: true
                }
            };

        if (typeof todo === "string"){
            todo =  unify(todo);
        }

        function unify(todo){
            var result = {};
            result[todo] = {};
            return result;
        }

        function next(){
            var k;
            for(k in todo){
                if (k in session){ // already run
                    continue;
                }
                return k;
            }
        }

        this.run = function (){
            var k, opts;
            while(k = next()){
                if (typeof ctx[k] === "function"){
                    current = k;
                    opts = $.extend(true, {}, defaults[k] || {}, todo[k].options || {});
                    if (k in resolve.latLng){
                        if (todo[k].values){
                            resolveAllLatLng(todo[k].values, ctx, ctx[k], {todo:todo[k], opts:opts, session:session});
                        } else {
                            resolveLatLng(ctx, ctx[k], resolve.latLng[k], {todo:todo[k], opts:opts, session:session});
                        }
                    } else if (k in resolve.geoloc){
                        geoloc(ctx, ctx[k], {todo:todo[k], opts:opts, session:session});
                    } else {
                        ctx[k].apply(ctx, [{todo:todo[k], opts:opts, session:session}]);
                    }
                    return; // wait until ack
                } else {
                    session[k] = null;
                }
            }
            onEnd.apply(ctx, [todo, session]);
        };

        this.ack = function(result){
            session[current] = result;
            that.run.apply(that, []);
        };
    }

    function getKeys(obj){
        var k, keys = [];
        for(k in obj){
            keys.push(k);
        }
        return keys;
    }

    function tuple(args, value){
        var todo = {};

        // "copy" the common data
        if (args.todo){
            for(var k in args.todo){
                if ((k !== "options") && (k !== "values")){
                    todo[k] = args.todo[k];
                }
            }
        }
        // "copy" some specific keys from value first else args.todo
        var i, keys = ["data", "tag", "id", "events",  "onces"];
        for(i=0; i<keys.length; i++){
            copyKey(todo, keys[i], value, args.todo);
        }

        // create an extended options
        todo.options = $.extend({}, args.opts || {}, value.options || {});

        return todo;
    }

    /**
     * copy a key content
     **/
    function copyKey(target, key){
        for(var i=2; i<arguments.length; i++){
            if (key in arguments[i]){
                target[key] = arguments[i][key];
                return;
            }
        }
    }

    /***************************************************************************/
    /*                             GEOCODERCACHE                               */
    /***************************************************************************/

    function GeocoderCache(){
        var cache = [];

        this.get = function(request){
            if (cache.length){
                var i, j, k, item, eq,
                    keys = getKeys(request);
                for(i=0; i<cache.length; i++){
                    item = cache[i];
                    eq = keys.length == item.keys.length;
                    for(j=0; (j<keys.length) && eq; j++){
                        k = keys[j];
                        eq = k in item.request;
                        if (eq){
                            if ((typeof request[k] === "object") && ("equals" in request[k]) && (typeof request[k] === "function")){
                                eq = request[k].equals(item.request[k]);
                            } else{
                                eq = request[k] === item.request[k];
                            }
                        }
                    }
                    if (eq){
                        return item.results;
                    }
                }
            }
        };

        this.store = function(request, results){
            cache.push({request:request, keys:getKeys(request), results:results});
        };
    }

    /***************************************************************************/
    /*                                OVERLAYVIEW                              */
    /***************************************************************************/
    function OverlayView(map, opts, latLng, $div) {
        var that = this, listeners = [];

        defaults.classes.OverlayView.call(this);
        this.setMap(map);

        this.onAdd = function() {
            var panes = this.getPanes();
            if (opts.pane in panes) {
                $(panes[opts.pane]).append($div);
            }
            $.each("dblclick click mouseover mousemove mouseout mouseup mousedown".split(" "), function(i, name){
                listeners.push(
                    google.maps.event.addDomListener($div[0], name, function(e) {
                        $.Event(e).stopPropagation();
                        google.maps.event.trigger(that, name, [e]);
                        that.draw();
                    })
                );
            });
            listeners.push(
                google.maps.event.addDomListener($div[0], "contextmenu", function(e) {
                    $.Event(e).stopPropagation();
                    google.maps.event.trigger(that, "rightclick", [e]);
                    that.draw();
                })
            );
        };
        this.getPosition = function(){
            return latLng;
        };
        this.setPosition = function(newLatLng){
            latLng = newLatLng;
            this.draw();
        };
        this.draw = function() {
            var ps = this.getProjection().fromLatLngToDivPixel(latLng);
            $div
                .css("left", (ps.x+opts.offset.x) + "px")
                .css("top" , (ps.y+opts.offset.y) + "px");
        };
        this.onRemove = function() {
            for (var i = 0; i < listeners.length; i++) {
                google.maps.event.removeListener(listeners[i]);
            }
            $div.remove();
        };
        this.hide = function() {
            $div.hide();
        };
        this.show = function() {
            $div.show();
        };
        this.toggle = function() {
            if ($div) {
                if ($div.is(":visible")){
                    this.show();
                } else {
                    this.hide();
                }
            }
        };
        this.toggleDOM = function() {
            if (this.getMap()) {
                this.setMap(null);
            } else {
                this.setMap(map);
            }
        };
        this.getDOMElement = function() {
            return $div[0];
        };
    }

    /***************************************************************************/
    /*                              CLUSTERING                                 */
    /***************************************************************************/

    /**
     * Usefull to get a projection
     * => done in a function, to let dead-code analyser works without google library loaded
     **/
    function newEmptyOverlay(map, radius){
        function Overlay(){
            this.onAdd = function(){};
            this.onRemove = function(){};
            this.draw = function(){};
            return defaults.classes.OverlayView.apply(this, []);
        }
        Overlay.prototype = defaults.classes.OverlayView.prototype;
        var obj = new Overlay();
        obj.setMap(map);
        return obj;
    }

    /**
     * Class InternalClusterer
     * This class manage clusters thanks to "todo" objects
     *
     * Note:
     * Individuals marker are created on the fly thanks to the todo objects, they are
     * first set to null to keep the indexes synchronised with the todo list
     * This is the "display" function, set by the gmap3 object, which uses theses data
     * to create markers when clusters are not required
     * To remove a marker, the objects are deleted and set not null in arrays
     *    markers[key]
     *      = null : marker exist but has not been displayed yet
     *      = false : marker has been removed
     **/
    function InternalClusterer($container, map, raw){
        var updating = false,
            updated = false,
            redrawing = false,
            ready = false,
            enabled = true,
            that = this,
            events =  [],
            store = {},   // combin of index (id1-id2-...) => object
            ids = {},     // unique id => index
            idxs = {},    // index => unique id
            markers = [], // index => marker
            todos = [],   // index => todo or null if removed
            values = [],  // index => value
            overlay = newEmptyOverlay(map, raw.radius),
            timer, projection,
            ffilter, fdisplay, ferror; // callback function

        main();

        function prepareMarker(index) {
            if (!markers[index]) {
                delete todos[index].options.map;
                markers[index] = new defaults.classes.Marker(todos[index].options);
                attachEvents($container, {todo: todos[index]}, markers[index], todos[index].id);
            }
        }

        /**
         * return a marker by its id, null if not yet displayed and false if no exist or removed
         **/
        this.getById = function(id){
            if (id in ids) {
                prepareMarker(ids[id]);
                return  markers[ids[id]];
            }
            return false;
        };

        /**
         * remove one object from the store
         **/
        this.rm = function (id) {
            var index = ids[id];
            if (markers[index]){ // can be null
                markers[index].setMap(null);
            }
            delete markers[index];
            markers[index] = false;

            delete todos[index];
            todos[index] = false;

            delete values[index];
            values[index] = false;

            delete ids[id];
            delete idxs[index];
            updated = true;
        };

        /**
         * remove a marker by its id
         **/
        this.clearById = function(id){
            if (id in ids){
                this.rm(id);
                return true;
            }
        };

        /**
         * remove objects from the store
         **/
        this.clear = function(last, first, tag){
            var start, stop, step, index, i,
                list = [],
                check = ftag(tag);
            if (last) {
                start = todos.length - 1;
                stop = -1;
                step = -1;
            } else {
                start = 0;
                stop =  todos.length;
                step = 1;
            }
            for (index = start; index != stop; index += step) {
                if (todos[index]) {
                    if (!check || check(todos[index].tag)){
                        list.push(idxs[index]);
                        if (first || last) {
                            break;
                        }
                    }
                }
            }
            for (i = 0; i < list.length; i++) {
                this.rm(list[i]);
            }
        };

        // add a "marker todo" to the cluster
        this.add = function(todo, value){
            todo.id = globalId(todo.id);
            this.clearById(todo.id);
            ids[todo.id] = markers.length;
            idxs[markers.length] = todo.id;
            markers.push(null); // null = marker not yet created / displayed
            todos.push(todo);
            values.push(value);
            updated = true;
        };

        // add a real marker to the cluster
        this.addMarker = function(marker, todo){
            todo = todo || {};
            todo.id = globalId(todo.id);
            this.clearById(todo.id);
            if (!todo.options){
                todo.options = {};
            }
            todo.options.position = marker.getPosition();
            attachEvents($container, {todo:todo}, marker, todo.id);
            ids[todo.id] = markers.length;
            idxs[markers.length] = todo.id;
            markers.push(marker);
            todos.push(todo);
            values.push(todo.data || {});
            updated = true;
        };

        // return a "marker todo" by its index
        this.todo = function(index){
            return todos[index];
        };

        // return a "marker value" by its index
        this.value = function(index){
            return values[index];
        };

        // return a marker by its index
        this.marker = function(index){
            if (index in markers) {
                prepareMarker(index);
                return  markers[index];
            }
            return false;
        };

        // return a marker by its index
        this.markerIsSet = function(index){
            return Boolean(markers[index]);
        };

        // store a new marker instead if the default "false"
        this.setMarker = function(index, marker){
            markers[index] = marker;
        };

        // link the visible overlay to the logical data (to hide overlays later)
        this.store = function(cluster, obj, shadow){
            store[cluster.ref] = {obj:obj, shadow:shadow};
        };

        // free all objects
        this.free = function(){
            for(var i = 0; i < events.length; i++){
                google.maps.event.removeListener(events[i]);
            }
            events = [];

            $.each(store, function(key){
                flush(key);
            });
            store = {};

            $.each(todos, function(i){
                todos[i] = null;
            });
            todos = [];

            $.each(markers, function(i){
                if (markers[i]){ // false = removed
                    markers[i].setMap(null);
                    delete markers[i];
                }
            });
            markers = [];

            $.each(values, function(i){
                delete values[i];
            });
            values = [];

            ids = {};
            idxs = {};
        };

        // link the display function
        this.filter = function(f){
            ffilter = f;
            redraw();
        };

        // enable/disable the clustering feature
        this.enable = function(value){
            if (enabled != value){
                enabled = value;
                redraw();
            }
        };

        // link the display function
        this.display = function(f){
            fdisplay = f;
        };

        // link the errorfunction
        this.error = function(f){
            ferror = f;
        };

        // lock the redraw
        this.beginUpdate = function(){
            updating = true;
        };

        // unlock the redraw
        this.endUpdate = function(){
            updating = false;
            if (updated){
                redraw();
            }
        };

        // extends current bounds with internal markers
        this.autofit = function(bounds){
            for(var i=0; i<todos.length; i++){
                if (todos[i]){
                    bounds.extend(todos[i].options.position);
                }
            }
        };

        // bind events
        function main(){
            projection = overlay.getProjection();
            if (!projection){
                setTimeout(function(){
                        main.apply(that, []);
                    },
                    25);
                return;
            }
            ready = true;
            events.push(google.maps.event.addListener(map, "zoom_changed", function(){delayRedraw();}));
            events.push(google.maps.event.addListener(map, "bounds_changed", function(){delayRedraw();}));
            redraw();
        }

        // flush overlays
        function flush(key){
            if (typeof store[key] === "object"){ // is overlay
                if (typeof(store[key].obj.setMap) === "function") {
                    store[key].obj.setMap(null);
                }
                if (typeof(store[key].obj.remove) === "function") {
                    store[key].obj.remove();
                }
                if (typeof(store[key].shadow.remove) === "function") {
                    store[key].obj.remove();
                }
                if (typeof(store[key].shadow.setMap) === "function") {
                    store[key].shadow.setMap(null);
                }
                delete store[key].obj;
                delete store[key].shadow;
            } else if (markers[key]){ // marker not removed
                markers[key].setMap(null);
                // don't remove the marker object, it may be displayed later
            }
            delete store[key];
        }

        /**
         * return the distance between 2 latLng couple into meters
         * Params :
         *  Lat1, Lng1, Lat2, Lng2
         *  LatLng1, Lat2, Lng2
         *  Lat1, Lng1, LatLng2
         *  LatLng1, LatLng2
         **/
        function distanceInMeter(){
            var lat1, lat2, lng1, lng2, e, f, g, h;
            if (arguments[0] instanceof google.maps.LatLng){
                lat1 = arguments[0].lat();
                lng1 = arguments[0].lng();
                if (arguments[1] instanceof google.maps.LatLng){
                    lat2 = arguments[1].lat();
                    lng2 = arguments[1].lng();
                } else {
                    lat2 = arguments[1];
                    lng2 = arguments[2];
                }
            } else {
                lat1 = arguments[0];
                lng1 = arguments[1];
                if (arguments[2] instanceof google.maps.LatLng){
                    lat2 = arguments[2].lat();
                    lng2 = arguments[2].lng();
                } else {
                    lat2 = arguments[2];
                    lng2 = arguments[3];
                }
            }
            e = Math.PI*lat1/180;
            f = Math.PI*lng1/180;
            g = Math.PI*lat2/180;
            h = Math.PI*lng2/180;
            return 1000*6371 * Math.acos(Math.min(Math.cos(e)*Math.cos(g)*Math.cos(f)*Math.cos(h)+Math.cos(e)*Math.sin(f)*Math.cos(g)*Math.sin(h)+Math.sin(e)*Math.sin(g),1));
        }

        // extend the visible bounds
        function extendsMapBounds(){
            var radius = distanceInMeter(map.getCenter(), map.getBounds().getNorthEast()),
                circle = new google.maps.Circle({
                    center: map.getCenter(),
                    radius: 1.25 * radius // + 25%
                });
            return circle.getBounds();
        }

        // return an object where keys are store keys
        function getStoreKeys(){
            var keys = {}, k;
            for(k in store){
                keys[k] = true;
            }
            return keys;
        }

        // async the delay function
        function delayRedraw(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                    redraw();
                },
                25);
        }

        // generate bounds extended by radius
        function extendsBounds(latLng) {
            var p = projection.fromLatLngToDivPixel(latLng),
                ne = projection.fromDivPixelToLatLng(new google.maps.Point(p.x+raw.radius, p.y-raw.radius)),
                sw = projection.fromDivPixelToLatLng(new google.maps.Point(p.x-raw.radius, p.y+raw.radius));
            return new google.maps.LatLngBounds(sw, ne);
        }

        // run the clustering process and call the display function
        function redraw(){
            if (updating || redrawing || !ready){
                return;
            }

            var keys = [], used = {},
                zoom = map.getZoom(),
                forceDisabled = ("maxZoom" in raw) && (zoom > raw.maxZoom),
                previousKeys = getStoreKeys(),
                i, j, k, indexes, check = false, bounds, cluster, position, previous, lat, lng, loop;

            // reset flag
            updated = false;

            if (zoom > 3){
                // extend the bounds of the visible map to manage clusters near the boundaries
                bounds = extendsMapBounds();

                // check contain only if boundaries are valid
                check = bounds.getSouthWest().lng() < bounds.getNorthEast().lng();
            }

            // calculate positions of "visibles" markers (in extended bounds)
            for(i=0; i<todos.length; i++){
                if (todos[i] && (!check || bounds.contains(todos[i].options.position)) && (!ffilter || ffilter(values[i]))){
                    keys.push(i);
                }
            }

            // for each "visible" marker, search its neighbors to create a cluster
            // we can't do a classical "for" loop, because, analysis can bypass a marker while focusing on cluster
            while(1){
                i=0;
                while(used[i] && (i<keys.length)){ // look for the next marker not used
                    i++;
                }
                if (i == keys.length){
                    break;
                }

                indexes = [];

                if (enabled && !forceDisabled){
                    loop = 10;
                    do{
                        previous = indexes;
                        indexes = [];
                        loop--;

                        if (previous.length){
                            position = bounds.getCenter()
                        } else {
                            position = todos[ keys[i] ].options.position;
                        }
                        bounds = extendsBounds(position);

                        for(j=i; j<keys.length; j++){
                            if (used[j]){
                                continue;
                            }
                            if (bounds.contains(todos[ keys[j] ].options.position)){
                                indexes.push(j);
                            }
                        }
                    } while( (previous.length < indexes.length) && (indexes.length > 1) && loop);
                } else {
                    for(j=i; j<keys.length; j++){
                        if (used[j]){
                            continue;
                        }
                        indexes.push(j);
                        break;
                    }
                }

                cluster = {indexes:[], ref:[]};
                lat = lng = 0;
                for(k=0; k<indexes.length; k++){
                    used[ indexes[k] ] = true;
                    cluster.indexes.push(keys[indexes[k]]);
                    cluster.ref.push(keys[indexes[k]]);
                    lat += todos[ keys[indexes[k]] ].options.position.lat();
                    lng += todos[ keys[indexes[k]] ].options.position.lng();
                }
                lat /= indexes.length;
                lng /= indexes.length;
                cluster.latLng = new google.maps.LatLng(lat, lng);

                cluster.ref = cluster.ref.join("-");

                if (cluster.ref in previousKeys){ // cluster doesn't change
                    delete previousKeys[cluster.ref]; // remove this entry, these still in this array will be removed
                } else { // cluster is new
                    if (indexes.length === 1){ // alone markers are not stored, so need to keep the key (else, will be displayed every time and marker will blink)
                        store[cluster.ref] = true;
                    }
                    fdisplay(cluster);
                }
            }

            // flush the previous overlays which are not still used
            $.each(previousKeys, function(key){
                flush(key);
            });
            redrawing = false;
        }
    }

    /**
     * Class Clusterer
     * a facade with limited method for external use
     **/
    function Clusterer(id, internalClusterer){
        this.id = function(){
            return id;
        };
        this.filter = function(f){
            internalClusterer.filter(f);
        };
        this.enable = function(){
            internalClusterer.enable(true);
        };
        this.disable = function(){
            internalClusterer.enable(false);
        };
        this.add = function(marker, todo, lock){
            if (!lock) {
                internalClusterer.beginUpdate();
            }
            internalClusterer.addMarker(marker, todo);
            if (!lock) {
                internalClusterer.endUpdate();
            }
        };
        this.getById = function(id){
            return internalClusterer.getById(id);
        };
        this.clearById = function(id, lock){
            var result;
            if (!lock) {
                internalClusterer.beginUpdate();
            }
            result = internalClusterer.clearById(id);
            if (!lock) {
                internalClusterer.endUpdate();
            }
            return result;
        };
        this.clear = function(last, first, tag, lock){
            if (!lock) {
                internalClusterer.beginUpdate();
            }
            internalClusterer.clear(last, first, tag);
            if (!lock) {
                internalClusterer.endUpdate();
            }
        };
    }
    /***************************************************************************/
    /*                                STORE                                    */
    /***************************************************************************/

    function Store(){
        var store = {}, // name => [id, ...]
            objects = {}; // id => object

        function normalize(res) {
            return {
                id: res.id,
                name: res.name,
                object:res.obj,
                tag:res.tag,
                data:res.data
            };
        }

        /**
         * add a mixed to the store
         **/
        this.add = function(args, name, obj, sub){
            var todo = args.todo || {},
                id = globalId(todo.id);
            if (!store[name]){
                store[name] = [];
            }
            if (id in objects){ // object already exists: remove it
                this.clearById(id);
            }
            objects[id] = {obj:obj, sub:sub, name:name, id:id, tag:todo.tag, data:todo.data};
            store[name].push(id);
            return id;
        };

        /**
         * return a stored object by its id
         **/
        this.getById = function(id, sub, full){
            if (id in objects){
                if (sub) {
                    return objects[id].sub
                } else if (full) {
                    return normalize(objects[id]);
                }
                return objects[id].obj;

            }
            return false;
        };

        /**
         * return a stored value
         **/
        this.get = function(name, last, tag, full){
            var n, id, check = ftag(tag);
            if (!store[name] || !store[name].length){
                return null;
            }
            n = store[name].length;
            while(n){
                n--;
                id = store[name][last ? n : store[name].length - n - 1];
                if (id && objects[id]){
                    if (check && !check(objects[id].tag)){
                        continue;
                    }
                    return full ? normalize(objects[id]) : objects[id].obj;
                }
            }
            return null;
        };

        /**
         * return all stored values
         **/
        this.all = function(name, tag, full){
            var result = [],
                check = ftag(tag),
                find = function(n){
                    var i, id;
                    for(i=0; i<store[n].length; i++){
                        id = store[n][i];
                        if (id && objects[id]){
                            if (check && !check(objects[id].tag)){
                                continue;
                            }
                            result.push(full ? normalize(objects[id]) : objects[id].obj);
                        }
                    }
                };
            if (name in store){
                find(name);
            } else if (name === undef){ // internal use only
                for(name in store){
                    find(name);
                }
            }
            return result;
        };

        /**
         * hide and remove an object
         **/
        function rm(obj){
            // Google maps element
            if (typeof(obj.setMap) === "function") {
                obj.setMap(null);
            }
            // jQuery
            if (typeof(obj.remove) === "function") {
                obj.remove();
            }
            // internal (cluster)
            if (typeof(obj.free) === "function") {
                obj.free();
            }
            obj = null;
        }

        /**
         * remove one object from the store
         **/
        this.rm = function(name, check, pop){
            var idx, id;
            if (!store[name]) {
                return false;
            }
            if (check){
                if (pop){
                    for(idx = store[name].length - 1; idx >= 0; idx--){
                        id = store[name][idx];
                        if ( check(objects[id].tag) ){
                            break;
                        }
                    }
                } else {
                    for(idx = 0; idx < store[name].length; idx++){
                        id = store[name][idx];
                        if (check(objects[id].tag)){
                            break;
                        }
                    }
                }
            } else {
                idx = pop ? store[name].length - 1 : 0;
            }
            if ( !(idx in store[name]) ) {
                return false;
            }
            return this.clearById(store[name][idx], idx);
        };

        /**
         * remove object from the store by its id
         **/
        this.clearById = function(id, idx){
            if (id in objects){
                var i, name = objects[id].name;
                for(i=0; idx === undef && i<store[name].length; i++){
                    if (id === store[name][i]){
                        idx = i;
                    }
                }
                rm(objects[id].obj);
                if(objects[id].sub){
                    rm(objects[id].sub);
                }
                delete objects[id];
                store[name].splice(idx, 1);
                return true;
            }
            return false;
        };

        /**
         * return an object from a container object in the store by its id
         * ! for now, only cluster manage this feature
         **/
        this.objGetById = function(id){
            var result;
            if (store["clusterer"]) {
                for(var idx in store["clusterer"]){
                    if ((result = objects[store["clusterer"][idx]].obj.getById(id)) !== false){
                        return result;
                    }
                }
            }
            return false;
        };

        /**
         * remove object from a container object in the store by its id
         * ! for now, only cluster manage this feature
         **/
        this.objClearById = function(id){
            if (store["clusterer"]) {
                for(var idx in store["clusterer"]){
                    if (objects[store["clusterer"][idx]].obj.clearById(id)){
                        return true;
                    }
                }
            }
            return null;
        };

        /**
         * remove objects from the store
         **/
        this.clear = function(list, last, first, tag){
            var k, i, name, check = ftag(tag);
            if (!list || !list.length){
                list = [];
                for(k in store){
                    list.push(k);
                }
            } else {
                list = array(list);
            }
            for(i=0; i<list.length; i++){
                name = list[i];
                if (last){
                    this.rm(name, check, true);
                } else if (first){
                    this.rm(name, check, false);
                } else { // all
                    while(this.rm(name, check, false));
                }
            }
        };

        /**
         * remove object from a container object in the store by its tags
         * ! for now, only cluster manage this feature
         **/
        this.objClear = function(list, last, first, tag){
            if (store["clusterer"] && ($.inArray("marker", list) >= 0 || !list.length)) {
                for(var idx in store["clusterer"]){
                    objects[store["clusterer"][idx]].obj.clear(last, first, tag);
                }
            }
        };
    }

    /***************************************************************************/
    /*                           GMAP3 GLOBALS                                 */
    /***************************************************************************/

    var services = {},
        geocoderCache = new GeocoderCache();

    //-----------------------------------------------------------------------//
    // Service tools
    //-----------------------------------------------------------------------//

    function geocoder(){
        if (!services.geocoder) {
            services.geocoder = new google.maps.Geocoder();
        }
        return services.geocoder;
    }

    function directionsService(){
        if (!services.directionsService) {
            services.directionsService = new google.maps.DirectionsService();
        }
        return services.directionsService;
    }

    function elevationService(){
        if (!services.elevationService) {
            services.elevationService = new google.maps.ElevationService();
        }
        return services.elevationService;
    }

    function maxZoomService(){
        if (!services.maxZoomService) {
            services.maxZoomService = new google.maps.MaxZoomService();
        }
        return services.maxZoomService;
    }

    function distanceMatrixService(){
        if (!services.distanceMatrixService) {
            services.distanceMatrixService = new google.maps.DistanceMatrixService();
        }
        return services.distanceMatrixService;
    }

    //-----------------------------------------------------------------------//
    // Unit tools
    //-----------------------------------------------------------------------//

    function error(){
        if (defaults.verbose){
            var i, err = [];
            if (window.console && (typeof console.error === "function") ){
                for(i=0; i<arguments.length; i++){
                    err.push(arguments[i]);
                }
                console.error.apply(console, err);
            } else {
                err = "";
                for(i=0; i<arguments.length; i++){
                    err += arguments[i].toString() + " " ;
                }
                alert(err);
            }
        }
    }

    /**
     * return true if mixed is usable as number
     **/
    function numeric(mixed){
        return (typeof(mixed) === "number" || typeof(mixed) === "string") && mixed !== "" && !isNaN(mixed);
    }

    /**
     * convert data to array
     **/
    function array(mixed){
        var k, a = [];
        if (mixed !== undef){
            if (typeof(mixed) === "object"){
                if (typeof(mixed.length) === "number") {
                    a = mixed;
                } else {
                    for(k in mixed) {
                        a.push(mixed[k]);
                    }
                }
            } else{
                a.push(mixed);
            }
        }
        return a;
    }

    /**
     * create a function to check a tag
     */
    function ftag(tag){
        if (tag){
            if (typeof tag === "function"){
                return tag;
            }
            tag = array(tag);
            return function(val){
                if (val === undef){
                    return false;
                }
                if (typeof val === "object"){
                    for(var i=0; i<val.length; i++){
                        if($.inArray(val[i], tag) >= 0){
                            return true;
                        }
                    }
                    return false;
                }
                return $.inArray(val, tag) >= 0;
            }
        }
    }

    /**
     * convert mixed [ lat, lng ] objet to google.maps.LatLng
     **/
    function toLatLng (mixed, emptyReturnMixed, noFlat){
        var empty = emptyReturnMixed ? mixed : null;
        if (!mixed || (typeof mixed === "string")){
            return empty;
        }
        // defined latLng
        if (mixed.latLng) {
            return toLatLng(mixed.latLng);
        }
        // google.maps.LatLng object
        if (mixed instanceof google.maps.LatLng) {
            return mixed;
        }
        // {lat:X, lng:Y} object
        else if ( numeric(mixed.lat) ) {
            return new google.maps.LatLng(mixed.lat, mixed.lng);
        }
        // [X, Y] object
        else if ( !noFlat && $.isArray(mixed)){
            if ( !numeric(mixed[0]) || !numeric(mixed[1]) ) {
                return empty;
            }
            return new google.maps.LatLng(mixed[0], mixed[1]);
        }
        return empty;
    }

    /**
     * convert mixed [ sw, ne ] object by google.maps.LatLngBounds
     **/
    function toLatLngBounds(mixed){
        var ne, sw;
        if (!mixed || mixed instanceof google.maps.LatLngBounds) {
            return mixed || null;
        }
        if ($.isArray(mixed)){
            if (mixed.length == 2){
                ne = toLatLng(mixed[0]);
                sw = toLatLng(mixed[1]);
            } else if (mixed.length == 4){
                ne = toLatLng([mixed[0], mixed[1]]);
                sw = toLatLng([mixed[2], mixed[3]]);
            }
        } else {
            if ( ("ne" in mixed) && ("sw" in mixed) ){
                ne = toLatLng(mixed.ne);
                sw = toLatLng(mixed.sw);
            } else if ( ("n" in mixed) && ("e" in mixed) && ("s" in mixed) && ("w" in mixed) ){
                ne = toLatLng([mixed.n, mixed.e]);
                sw = toLatLng([mixed.s, mixed.w]);
            }
        }
        if (ne && sw){
            return new google.maps.LatLngBounds(sw, ne);
        }
        return null;
    }

    /**
     * resolveLatLng
     **/
    function resolveLatLng(ctx, method, runLatLng, args, attempt){
        var latLng = runLatLng ? toLatLng(args.todo, false, true) : false,
            conf = latLng ?  {latLng:latLng} : (args.todo.address ? (typeof(args.todo.address) === "string" ? {address:args.todo.address} : args.todo.address) : false),
            cache = conf ? geocoderCache.get(conf) : false,
            that = this;
        if (conf){
            attempt = attempt || 0; // convert undefined to int
            if (cache){
                args.latLng = cache.results[0].geometry.location;
                args.results = cache.results;
                args.status = cache.status;
                method.apply(ctx, [args]);
            } else {
                if (conf.location){
                    conf.location = toLatLng(conf.location);
                }
                if (conf.bounds){
                    conf.bounds = toLatLngBounds(conf.bounds);
                }
                geocoder().geocode(
                    conf,
                    function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK){
                            geocoderCache.store(conf, {results:results, status:status});
                            args.latLng = results[0].geometry.location;
                            args.results = results;
                            args.status = status;
                            method.apply(ctx, [args]);
                        } else if ( (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) && (attempt < defaults.queryLimit.attempt) ){
                            setTimeout(
                                function(){
                                    resolveLatLng.apply(that, [ctx, method, runLatLng, args, attempt+1]);
                                },
                                defaults.queryLimit.delay + Math.floor(Math.random() * defaults.queryLimit.random)
                            );
                        } else {
                            error("geocode failed", status, conf);
                            args.latLng = args.results = false;
                            args.status = status;
                            method.apply(ctx, [args]);
                        }
                    }
                );
            }
        } else {
            args.latLng = toLatLng(args.todo, false, true);
            method.apply(ctx, [args]);
        }
    }

    function resolveAllLatLng(list, ctx, method, args){
        var that = this, i = -1;

        function resolve(){
            // look for next address to resolve
            do{
                i++;
            }while( (i < list.length) && !("address" in list[i]) );

            // no address found, so run method
            if (i >= list.length){
                method.apply(ctx, [args]);
                return;
            }

            resolveLatLng(
                that,
                function(args){
                    delete args.todo;
                    $.extend(list[i], args);
                    resolve.apply(that, []); // resolve next (using apply avoid too much recursion)
                },
                true,
                {todo:list[i]}
            );
        }
        resolve();
    }

    /**
     * geolocalise the user and return a LatLng
     **/
    function geoloc(ctx, method, args){
        var is_echo = false; // sometime, a kind of echo appear, this trick will notice once the first call is run to ignore the next one
        if (navigator && navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                function(pos) {
                    if (is_echo){
                        return;
                    }
                    is_echo = true;
                    args.latLng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
                    method.apply(ctx, [args]);
                },
                function() {
                    if (is_echo){
                        return;
                    }
                    is_echo = true;
                    args.latLng = false;
                    method.apply(ctx, [args]);
                },
                args.opts.getCurrentPosition
            );
        } else {
            args.latLng = false;
            method.apply(ctx, [args]);
        }
    }

    /***************************************************************************/
    /*                                GMAP3                                    */
    /***************************************************************************/

    function Gmap3($this){
        var that = this,
            stack = new Stack(),
            store = new Store(),
            map = null,
            task;

        //-----------------------------------------------------------------------//
        // Stack tools
        //-----------------------------------------------------------------------//

        /**
         * store actions to execute in a stack manager
         **/
        this._plan = function(list){
            for(var k = 0; k < list.length; k++) {
                stack.add(new Task(that, end, list[k]));
            }
            run();
        };

        /**
         * if not running, start next action in stack
         **/
        function run(){
            if (!task && (task = stack.get())){
                task.run();
            }
        }

        /**
         * called when action in finished, to acknoledge the current in stack and start next one
         **/
        function end(){
            task = null;
            stack.ack();
            run.call(that); // restart to high level scope
        }

        //-----------------------------------------------------------------------//
        // Tools
        //-----------------------------------------------------------------------//

        /**
         * execute callback functions
         **/
        function callback(args){
            if (args.todo.callback) {
                var params = Array.prototype.slice.call(arguments, 1);
                if (typeof args.todo.callback === "function") {
                    args.todo.callback.apply($this, params);
                } else if ($.isArray(args.todo.callback)) {
                    if (typeof args.todo.callback[1] === "function") {
                        args.todo.callback[1].apply(args.todo.callback[0], params);
                    }
                }
            }
        }

        /**
         * execute ending functions
         **/
        function manageEnd(args, obj, id){
            if (id){
                attachEvents($this, args, obj, id);
            }
            callback(args, obj);
            task.ack(obj);
        }

        /**
         * initialize the map if not yet initialized
         **/
        function newMap(latLng, args){
            args = args || {};
            if (map) {
                if (args.todo && args.todo.options){
                    if (args.todo.options.center) {
                        args.todo.options.center = toLatLng(args.todo.options.center);
                    }
                    map.setOptions(args.todo.options);
                }
            } else {
                var opts = args.opts || $.extend(true, {}, defaults.map, args.todo && args.todo.options ? args.todo.options : {});
                opts.center = latLng || toLatLng(opts.center);
                map = new defaults.classes.Map($this.get(0), opts);
            }
        }

        /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
         => function with latLng resolution
         = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

        /**
         * Initialize google.maps.Map object
         **/
        this.map = function(args){
            newMap(args.latLng, args);
            attachEvents($this, args, map);
            manageEnd(args, map);
        };

        /**
         * destroy an existing instance
         **/
        this.destroy = function(args){
            store.clear();
            $this.empty();
            if (map){
                map = null;
            }
            manageEnd(args, true);
        };

        /**
         * add an infowindow
         **/
        this.infowindow = function(args){
            var objs = [], multiple = "values" in args.todo;
            if (!multiple){
                if (args.latLng) {
                    args.opts.position = args.latLng;
                }
                args.todo.values = [{options:args.opts}];
            }
            $.each(args.todo.values, function(i, value){
                var id, obj, todo = tuple(args, value);
                todo.options.position = todo.options.position ? toLatLng(todo.options.position) : toLatLng(value.latLng);
                if (!map){
                    newMap(todo.options.position);
                }
                obj = new defaults.classes.InfoWindow(todo.options);
                if (obj && ((todo.open === undef) || todo.open)){
                    if (multiple){
                        obj.open(map, todo.anchor ? todo.anchor : undef);
                    } else {
                        obj.open(map, todo.anchor ? todo.anchor : (args.latLng ? undef : (args.session.marker ? args.session.marker : undef)));
                    }
                }
                objs.push(obj);
                id = store.add({todo:todo}, "infowindow", obj);
                attachEvents($this, {todo:todo}, obj, id);
            });
            manageEnd(args, multiple ? objs : objs[0]);
        };

        /**
         * add a circle
         **/
        this.circle = function(args){
            var objs = [], multiple = "values" in args.todo;
            if (!multiple){
                args.opts.center = args.latLng || toLatLng(args.opts.center);
                args.todo.values = [{options:args.opts}];
            }
            if (!args.todo.values.length){
                manageEnd(args, false);
                return;
            }
            $.each(args.todo.values, function(i, value){
                var id, obj, todo = tuple(args, value);
                todo.options.center = todo.options.center ? toLatLng(todo.options.center) : toLatLng(value);
                if (!map){
                    newMap(todo.options.center);
                }
                todo.options.map = map;
                obj = new defaults.classes.Circle(todo.options);
                objs.push(obj);
                id = store.add({todo:todo}, "circle", obj);
                attachEvents($this, {todo:todo}, obj, id);
            });
            manageEnd(args, multiple ? objs : objs[0]);
        };

        /**
         * add an overlay
         **/
        this.overlay = function(args, internal){
            var objs = [], multiple = "values" in args.todo;
            if (!multiple){
                args.todo.values = [{latLng: args.latLng, options: args.opts}];
            }
            if (!args.todo.values.length){
                manageEnd(args, false);
                return;
            }
            if (!OverlayView.__initialised) {
                OverlayView.prototype = new defaults.classes.OverlayView();
                OverlayView.__initialised = true;
            }
            $.each(args.todo.values, function(i, value){
                var id, obj, todo = tuple(args, value),
                    $div = $(document.createElement("div")).css({
                        border: "none",
                        borderWidth: "0px",
                        position: "absolute"
                    });
                $div.append(todo.options.content);
                obj = new OverlayView(map, todo.options, toLatLng(todo) || toLatLng(value), $div);
                objs.push(obj);
                $div = null; // memory leak
                if (!internal){
                    id = store.add(args, "overlay", obj);
                    attachEvents($this, {todo:todo}, obj, id);
                }
            });
            if (internal){
                return objs[0];
            }
            manageEnd(args, multiple ? objs : objs[0]);
        };

        /**
         * returns address structure from latlng
         **/
        this.getaddress = function(args){
            callback(args, args.results, args.status);
            task.ack();
        };

        /**
         * returns latlng from an address
         **/
        this.getlatlng = function(args){
            callback(args, args.results, args.status);
            task.ack();
        };

        /**
         * return the max zoom of a location
         **/
        this.getmaxzoom = function(args){
            maxZoomService().getMaxZoomAtLatLng(
                args.latLng,
                function(result) {
                    callback(args, result.status === google.maps.MaxZoomStatus.OK ? result.zoom : false, status);
                    task.ack();
                }
            );
        };

        /**
         * return the elevation of a location
         **/
        this.getelevation = function(args){
            var i, locations = [],
                f = function(results, status){
                    callback(args, status === google.maps.ElevationStatus.OK ? results : false, status);
                    task.ack();
                };

            if (args.latLng){
                locations.push(args.latLng);
            } else {
                locations = array(args.todo.locations || []);
                for(i=0; i<locations.length; i++){
                    locations[i] = toLatLng(locations[i]);
                }
            }
            if (locations.length){
                elevationService().getElevationForLocations({locations:locations}, f);
            } else {
                if (args.todo.path && args.todo.path.length){
                    for(i=0; i<args.todo.path.length; i++){
                        locations.push(toLatLng(args.todo.path[i]));
                    }
                }
                if (locations.length){
                    elevationService().getElevationAlongPath({path:locations, samples:args.todo.samples}, f);
                } else {
                    task.ack();
                }
            }
        };

        /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
         => function without latLng resolution
         = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

        /**
         * define defaults values
         **/
        this.defaults = function(args){
            $.each(args.todo, function(name, value){
                if (typeof defaults[name] === "object"){
                    defaults[name] = $.extend({}, defaults[name], value);
                } else {
                    defaults[name] = value;
                }
            });
            task.ack(true);
        };

        /**
         * add a rectangle
         **/
        this.rectangle = function(args){
            var objs = [], multiple = "values" in args.todo;
            if (!multiple){
                args.todo.values = [{options:args.opts}];
            }
            if (!args.todo.values.length){
                manageEnd(args, false);
                return;
            }
            $.each(args.todo.values, function(i, value){
                var id, obj, todo = tuple(args, value);
                todo.options.bounds = todo.options.bounds ? toLatLngBounds(todo.options.bounds) : toLatLngBounds(value);
                if (!map){
                    newMap(todo.options.bounds.getCenter());
                }
                todo.options.map = map;

                obj = new defaults.classes.Rectangle(todo.options);
                objs.push(obj);
                id = store.add({todo:todo}, "rectangle", obj);
                attachEvents($this, {todo:todo}, obj, id);
            });
            manageEnd(args, multiple ? objs : objs[0]);
        };

        /**
         * add a polygone / polyline
         **/
        function poly(args, poly, path){
            var objs = [], multiple = "values" in args.todo;
            if (!multiple){
                args.todo.values = [{options:args.opts}];
            }
            if (!args.todo.values.length){
                manageEnd(args, false);
                return;
            }
            newMap();
            $.each(args.todo.values, function(_, value){
                var id, i, j, obj, todo = tuple(args, value);
                if (todo.options[path]){
                    if (todo.options[path][0][0] && $.isArray(todo.options[path][0][0])){
                        for(i=0; i<todo.options[path].length; i++){
                            for(j=0; j<todo.options[path][i].length; j++){
                                todo.options[path][i][j] = toLatLng(todo.options[path][i][j]);
                            }
                        }
                    } else {
                        for(i=0; i<todo.options[path].length; i++){
                            todo.options[path][i] = toLatLng(todo.options[path][i]);
                        }
                    }
                }
                todo.options.map = map;
                obj = new google.maps[poly](todo.options);
                objs.push(obj);
                id = store.add({todo:todo}, poly.toLowerCase(), obj);
                attachEvents($this, {todo:todo}, obj, id);
            });
            manageEnd(args, multiple ? objs : objs[0]);
        }

        this.polyline = function(args){
            poly(args, "Polyline", "path");
        };

        this.polygon = function(args){
            poly(args, "Polygon", "paths");
        };

        /**
         * add a traffic layer
         **/
        this.trafficlayer = function(args){
            newMap();
            var obj = store.get("trafficlayer");
            if (!obj){
                obj = new defaults.classes.TrafficLayer();
                obj.setMap(map);
                store.add(args, "trafficlayer", obj);
            }
            manageEnd(args, obj);
        };

        /**
         * add a bicycling layer
         **/
        this.bicyclinglayer = function(args){
            newMap();
            var obj = store.get("bicyclinglayer");
            if (!obj){
                obj = new defaults.classes.BicyclingLayer();
                obj.setMap(map);
                store.add(args, "bicyclinglayer", obj);
            }
            manageEnd(args, obj);
        };

        /**
         * add a ground overlay
         **/
        this.groundoverlay = function(args){
            args.opts.bounds = toLatLngBounds(args.opts.bounds);
            if (args.opts.bounds){
                newMap(args.opts.bounds.getCenter());
            }
            var id, obj = new defaults.classes.GroundOverlay(args.opts.url, args.opts.bounds, args.opts.opts);
            obj.setMap(map);
            id = store.add(args, "groundoverlay", obj);
            manageEnd(args, obj, id);
        };

        /**
         * set a streetview
         **/
        this.streetviewpanorama = function(args){
            if (!args.opts.opts){
                args.opts.opts = {};
            }
            if (args.latLng){
                args.opts.opts.position = args.latLng;
            } else if (args.opts.opts.position){
                args.opts.opts.position = toLatLng(args.opts.opts.position);
            }
            if (args.todo.divId){
                args.opts.container = document.getElementById(args.todo.divId)
            } else if (args.opts.container){
                args.opts.container = $(args.opts.container).get(0);
            }
            var id, obj = new defaults.classes.StreetViewPanorama(args.opts.container, args.opts.opts);
            if (obj){
                map.setStreetView(obj);
            }
            id = store.add(args, "streetviewpanorama", obj);
            manageEnd(args, obj, id);
        };

        this.kmllayer = function(args){
            var objs = [], multiple = "values" in args.todo;
            if (!multiple){
                args.todo.values = [{options:args.opts}];
            }
            if (!args.todo.values.length){
                manageEnd(args, false);
                return;
            }
            $.each(args.todo.values, function(i, value){
                var id, obj, options, todo = tuple(args, value);
                if (!map){
                    newMap();
                }
                options = todo.options;
                // compatibility 5.0-
                if (todo.options.opts) {
                    options = todo.options.opts;
                    if (todo.options.url) {
                        options.url = todo.options.url;
                    }
                }
                // -- end --
                options.map = map;
                if (googleVersionMin("3.10")) {
                    obj = new defaults.classes.KmlLayer(options);
                } else {
                    obj = new defaults.classes.KmlLayer(options.url, options);
                }
                objs.push(obj);
                id = store.add({todo:todo}, "kmllayer", obj);
                attachEvents($this, {todo:todo}, obj, id);
            });
            manageEnd(args, multiple ? objs : objs[0]);
        };

        /**
         * add a fix panel
         **/
        this.panel = function(args){
            newMap();
            var id, x= 0, y=0, $content,
                $div = $(document.createElement("div"));

            $div.css({
                position: "absolute",
                zIndex: 1000,
                visibility: "hidden"
            });

            if (args.opts.content){
                $content = $(args.opts.content);
                $div.append($content);
                $this.first().prepend($div);

                if (args.opts.left !== undef){
                    x = args.opts.left;
                } else if (args.opts.right !== undef){
                    x = $this.width() - $content.width() - args.opts.right;
                } else if (args.opts.center){
                    x = ($this.width() - $content.width()) / 2;
                }

                if (args.opts.top !== undef){
                    y = args.opts.top;
                } else if (args.opts.bottom !== undef){
                    y = $this.height() - $content.height() - args.opts.bottom;
                } else if (args.opts.middle){
                    y = ($this.height() - $content.height()) / 2
                }

                $div.css({
                    top: y,
                    left: x,
                    visibility: "visible"
                });
            }

            id = store.add(args, "panel", $div);
            manageEnd(args, $div, id);
            $div = null; // memory leak
        };

        /**
         * Create an InternalClusterer object
         **/
        function createClusterer(raw){
            var internalClusterer = new InternalClusterer($this, map, raw),
                todo = {},
                styles = {},
                thresholds = [],
                isInt = /^[0-9]+$/,
                calculator,
                k;

            for(k in raw){
                if (isInt.test(k)){
                    thresholds.push(1*k); // cast to int
                    styles[k] = raw[k];
                    styles[k].width = styles[k].width || 0;
                    styles[k].height = styles[k].height || 0;
                } else {
                    todo[k] = raw[k];
                }
            }
            thresholds.sort(function (a, b) { return a > b});

            // external calculator
            if (todo.calculator){
                calculator = function(indexes){
                    var data = [];
                    $.each(indexes, function(i, index){
                        data.push(internalClusterer.value(index));
                    });
                    return todo.calculator.apply($this, [data]);
                };
            } else {
                calculator = function(indexes){
                    return indexes.length;
                };
            }

            // set error function
            internalClusterer.error(function(){
                error.apply(that, arguments);
            });

            // set display function
            internalClusterer.display(function(cluster){
                var i, style, atodo, obj, offset,
                    cnt = calculator(cluster.indexes);

                // look for the style to use
                if (raw.force || cnt > 1) {
                    for(i = 0; i < thresholds.length; i++) {
                        if (thresholds[i] <= cnt) {
                            style = styles[thresholds[i]];
                        }
                    }
                }

                if (style){
                    offset = style.offset || [-style.width/2, -style.height/2];
                    // create a custom overlay command
                    // nb: 2 extends are faster that a deeper extend
                    atodo = $.extend({}, todo);
                    atodo.options = $.extend({
                            pane: "overlayLayer",
                            content:style.content ? style.content.replace("CLUSTER_COUNT", cnt) : "",
                            offset:{
                                x: ("x" in offset ? offset.x : offset[0]) || 0,
                                y: ("y" in offset ? offset.y : offset[1]) || 0
                            }
                        },
                        todo.options || {});

                    obj = that.overlay({todo:atodo, opts:atodo.options, latLng:toLatLng(cluster)}, true);

                    atodo.options.pane = "floatShadow";
                    atodo.options.content = $(document.createElement("div")).width(style.width+"px").height(style.height+"px").css({cursor:"pointer"});
                    shadow = that.overlay({todo:atodo, opts:atodo.options, latLng:toLatLng(cluster)}, true);

                    // store data to the clusterer
                    todo.data = {
                        latLng: toLatLng(cluster),
                        markers:[]
                    };
                    $.each(cluster.indexes, function(i, index){
                        todo.data.markers.push(internalClusterer.value(index));
                        if (internalClusterer.markerIsSet(index)){
                            internalClusterer.marker(index).setMap(null);
                        }
                    });
                    attachEvents($this, {todo:todo}, shadow, undef, {main:obj, shadow:shadow});
                    internalClusterer.store(cluster, obj, shadow);
                } else {
                    $.each(cluster.indexes, function(i, index){
                        internalClusterer.marker(index).setMap(map);
                    });
                }
            });

            return internalClusterer;
        }
        /**
         *  add a marker
         **/
        this.marker = function(args){
            var multiple = "values" in args.todo,
                init = !map;
            if (!multiple){
                args.opts.position = args.latLng || toLatLng(args.opts.position);
                args.todo.values = [{options:args.opts}];
            }
            if (!args.todo.values.length){
                manageEnd(args, false);
                return;
            }
            if (init){
                newMap();
            }

            if (args.todo.cluster && !map.getBounds()){ // map not initialised => bounds not available : wait for map if clustering feature is required
                google.maps.event.addListenerOnce(map, "bounds_changed", function() { that.marker.apply(that, [args]); });
                return;
            }
            if (args.todo.cluster){
                var clusterer, internalClusterer;
                if (args.todo.cluster instanceof Clusterer){
                    clusterer = args.todo.cluster;
                    internalClusterer = store.getById(clusterer.id(), true);
                } else {
                    internalClusterer = createClusterer(args.todo.cluster);
                    clusterer = new Clusterer(globalId(args.todo.id, true), internalClusterer);
                    store.add(args, "clusterer", clusterer, internalClusterer);
                }
                internalClusterer.beginUpdate();

                $.each(args.todo.values, function(i, value){
                    var todo = tuple(args, value);
                    todo.options.position = todo.options.position ? toLatLng(todo.options.position) : toLatLng(value);
                    if (todo.options.position) {
                        todo.options.map = map;
                        if (init){
                            map.setCenter(todo.options.position);
                            init = false;
                        }
                        internalClusterer.add(todo, value);
                    }
                });

                internalClusterer.endUpdate();
                manageEnd(args, clusterer);

            } else {
                var objs = [];
                $.each(args.todo.values, function(i, value){
                    var id, obj, todo = tuple(args, value);
                    todo.options.position = todo.options.position ? toLatLng(todo.options.position) : toLatLng(value);
                    if (todo.options.position) {
                        todo.options.map = map;
                        if (init){
                            map.setCenter(todo.options.position);
                            init = false;
                        }
                        obj = new defaults.classes.Marker(todo.options);
                        objs.push(obj);
                        id = store.add({todo:todo}, "marker", obj);
                        attachEvents($this, {todo:todo}, obj, id);
                    }
                });
                manageEnd(args, multiple ? objs : objs[0]);
            }
        };

        /**
         * return a route
         **/
        this.getroute = function(args){
            args.opts.origin = toLatLng(args.opts.origin, true);
            args.opts.destination = toLatLng(args.opts.destination, true);
            directionsService().route(
                args.opts,
                function(results, status) {
                    callback(args, status == google.maps.DirectionsStatus.OK ? results : false, status);
                    task.ack();
                }
            );
        };

        /**
         * add a direction renderer
         **/
        this.directionsrenderer = function(args){
            args.opts.map = map;
            var id, obj = new google.maps.DirectionsRenderer(args.opts);
            if (args.todo.divId){
                obj.setPanel(document.getElementById(args.todo.divId));
            } else if (args.todo.container){
                obj.setPanel($(args.todo.container).get(0));
            }
            id = store.add(args, "directionsrenderer", obj);
            manageEnd(args, obj, id);
        };

        /**
         * returns latLng of the user
         **/
        this.getgeoloc = function(args){
            manageEnd(args, args.latLng);
        };

        /**
         * add a style
         **/
        this.styledmaptype = function(args){
            newMap();
            var obj = new defaults.classes.StyledMapType(args.todo.styles, args.opts);
            map.mapTypes.set(args.todo.id, obj);
            manageEnd(args, obj);
        };

        /**
         * add an imageMapType
         **/
        this.imagemaptype = function(args){
            newMap();
            var obj = new defaults.classes.ImageMapType(args.opts);
            map.mapTypes.set(args.todo.id, obj);
            manageEnd(args, obj);
        };

        /**
         * autofit a map using its overlays (markers, rectangles ...)
         **/
        this.autofit = function(args){
            var bounds = new google.maps.LatLngBounds();
            $.each(store.all(), function(i, obj){
                if (obj.getPosition){
                    bounds.extend(obj.getPosition());
                } else if (obj.getBounds){
                    bounds.extend(obj.getBounds().getNorthEast());
                    bounds.extend(obj.getBounds().getSouthWest());
                } else if (obj.getPaths){
                    obj.getPaths().forEach(function(path){
                        path.forEach(function(latLng){
                            bounds.extend(latLng);
                        });
                    });
                } else if (obj.getPath){
                    obj.getPath().forEach(function(latLng){
                        bounds.extend(latLng);""
                    });
                } else if (obj.getCenter){
                    bounds.extend(obj.getCenter());
                } else if (obj instanceof Clusterer){
                    obj = store.getById(obj.id(), true);
                    if (obj){
                        obj.autofit(bounds);
                    }
                }
            });

            if (!bounds.isEmpty() && (!map.getBounds() || !map.getBounds().equals(bounds))){
                if ("maxZoom" in args.todo){
                    // fitBouds Callback event => detect zoom level and check maxZoom
                    google.maps.event.addListenerOnce(
                        map,
                        "bounds_changed",
                        function() {
                            if (this.getZoom() > args.todo.maxZoom){
                                this.setZoom(args.todo.maxZoom);
                            }
                        }
                    );
                }
                map.fitBounds(bounds);
            }
            manageEnd(args, true);
        };

        /**
         * remove objects from a map
         **/
        this.clear = function(args){
            if (typeof args.todo === "string"){
                if (store.clearById(args.todo) || store.objClearById(args.todo)){
                    manageEnd(args, true);
                    return;
                }
                args.todo = {name:args.todo};
            }
            if (args.todo.id){
                $.each(array(args.todo.id), function(i, id){
                    store.clearById(id) || store.objClearById(id);
                });
            } else {
                store.clear(array(args.todo.name), args.todo.last, args.todo.first, args.todo.tag);
                store.objClear(array(args.todo.name), args.todo.last, args.todo.first, args.todo.tag);
            }
            manageEnd(args, true);
        };

        /**
         * run a function on each items selected
         **/
        this.exec = function(args){
            var that = this;
            $.each(array(args.todo.func), function(i, func){
                $.each(that.get(args.todo, true, args.todo.hasOwnProperty("full") ? args.todo.full : true), function(j, res){
                    func.call($this, res);
                });
            });
            manageEnd(args, true);
        };

        /**
         * return objects previously created
         **/
        this.get = function(args, direct, full){
            var name, res,
                todo = direct ? args : args.todo;
            if (!direct) {
                full = todo.full;
            }
            if (typeof todo === "string"){
                res = store.getById(todo, false, full) || store.objGetById(todo);
                if (res === false){
                    name = todo;
                    todo = {};
                }
            } else {
                name = todo.name;
            }
            if (name === "map"){
                res = map;
            }
            if (!res){
                res = [];
                if (todo.id){
                    $.each(array(todo.id), function(i, id) {
                        res.push(store.getById(id, false, full) || store.objGetById(id));
                    });
                    if (!$.isArray(todo.id)) {
                        res = res[0];
                    }
                } else {
                    $.each(name ? array(name) : [undef], function(i, aName) {
                        var result;
                        if (todo.first){
                            result = store.get(aName, false, todo.tag, full);
                            if (result) res.push(result);
                        } else if (todo.all){
                            $.each(store.all(aName, todo.tag, full), function(i, result){
                                res.push(result);
                            });
                        } else {
                            result = store.get(aName, true, todo.tag, full);
                            if (result) res.push(result);
                        }
                    });
                    if (!todo.all && !$.isArray(name)) {
                        res = res[0];
                    }
                }
            }
            res = $.isArray(res) || !todo.all ? res : [res];
            if (direct){
                return res;
            } else {
                manageEnd(args, res);
            }
        };

        /**
         * return the distance between an origin and a destination
         *
         **/
        this.getdistance = function(args){
            var i;
            args.opts.origins = array(args.opts.origins);
            for(i=0; i<args.opts.origins.length; i++){
                args.opts.origins[i] = toLatLng(args.opts.origins[i], true);
            }
            args.opts.destinations = array(args.opts.destinations);
            for(i=0; i<args.opts.destinations.length; i++){
                args.opts.destinations[i] = toLatLng(args.opts.destinations[i], true);
            }
            distanceMatrixService().getDistanceMatrix(
                args.opts,
                function(results, status) {
                    callback(args, status === google.maps.DistanceMatrixStatus.OK ? results : false, status);
                    task.ack();
                }
            );
        };

        /**
         * trigger events on the map
         **/
        this.trigger = function(args){
            if (typeof args.todo === "string"){
                google.maps.event.trigger(map, args.todo);
            } else {
                var options = [map, args.todo.eventName];
                if (args.todo.var_args) {
                    $.each(args.todo.var_args, function(i, v){
                        options.push(v);
                    });
                }
                google.maps.event.trigger.apply(google.maps.event, options);
            }
            callback(args);
            task.ack();
        };
    }

    /**
     * Return true if get is a direct call
     * it means :
     *   - get is the only key
     *   - get has no callback
     * @param obj {Object} The request to check
     * @return {Boolean}
     */
    function isDirectGet(obj) {
        var k;
        if (!typeof obj === "object" || !obj.hasOwnProperty("get")){
            return false;
        }
        for(k in obj) {
            if (k !== "get") {
                return false;
            }
        }
        return !obj.get.hasOwnProperty("callback");
    }

    //-----------------------------------------------------------------------//
    // jQuery plugin
    //-----------------------------------------------------------------------//

    $.fn.gmap3 = function(){
        var i, list = [], empty = true, results = [];

        // init library
        initDefaults();

        // store all arguments in a todo list
        for(i=0; i<arguments.length; i++){
            if (arguments[i]){
                list.push(arguments[i]);
            }
        }

        // resolve empty call - run init
        if (!list.length) {
            list.push("map");
        }

        // loop on each jQuery object
        $.each(this, function() {
            var $this = $(this), gmap3 = $this.data("gmap3");
            empty = false;
            if (!gmap3){
                gmap3 = new Gmap3($this);
                $this.data("gmap3", gmap3);
            }
            if (list.length === 1 && (list[0] === "get" || isDirectGet(list[0]))){
                if (list[0] === "get") {
                    results.push(gmap3.get("map", true));
                } else {
                    results.push(gmap3.get(list[0].get, true, list[0].get.full));
                }
            } else {
                gmap3._plan(list);
            }
        });

        // return for direct call only
        if (results.length){
            if (results.length === 1){ // 1 css selector
                return results[0];
            } else {
                return results;
            }
        }

        return this;
    }

})(jQuery);

/**
 * BxSlider v4.1.1 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2013, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:v()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:50,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(p()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",B),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&I(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},p=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},v=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.delegate("a","click",q)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.delegate(".bx-start","click",k),o.controls.autoEl.delegate(".bx-stop","click",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},q=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},I=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),"horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0)}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},B=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider())};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&I(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",51).fadeIn(o.settings.speed,function(){t(this).css("zIndex",50),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",p()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),I(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",B))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);


//********************PUSHY JS MOBILE NAV*******************************

/*! Pushy - v0.9.2 - 2014-9-13
* Pushy is a responsive off-canvas navigation menu using CSS transforms & transitions.
* https://github.com/christophery/pushy/
* by Christopher Yee */

$(function() {
    var pushy = $('.pushy'), //menu css class
        body = $('body'),
        container = $('#container'), //container css class
        push = $('.push'), //css class to add pushy capability
        siteOverlay = $('.site-overlay'), //site overlay
        pushyClass = "pushy-left pushy-open", //menu position & menu open class
        pushyActiveClass = "pushy-active", //css class to toggle site overlay
        containerClass = "container-push", //container open class
        pushClass = "push-push", //css class to add pushy capability
        menuBtn = $('.menu-btn'), //css classes to toggle the menu
        menuSpeed = 200, //jQuery fallback menu speed
        menuWidth = pushy.width() + "px"; //jQuery fallback menu width

    function togglePushy(){
        body.toggleClass(pushyActiveClass); //toggle site overlay
        pushy.toggleClass(pushyClass);
        container.toggleClass(containerClass);
        push.toggleClass(pushClass); //css class to add pushy capability
    }

    function openPushyFallback(){
        body.addClass(pushyActiveClass);
        pushy.animate({left: "0px"}, menuSpeed);
        container.animate({left: menuWidth}, menuSpeed);
        push.animate({left: menuWidth}, menuSpeed); //css class to add pushy capability
    }

    function closePushyFallback(){
        body.removeClass(pushyActiveClass);
        pushy.animate({left: "-" + menuWidth}, menuSpeed);
        container.animate({left: "0px"}, menuSpeed);
        push.animate({left: "0px"}, menuSpeed); //css class to add pushy capability
    }

    //checks if 3d transforms are supported removing the modernizr dependency
    cssTransforms3d = (function csstransforms3d(){
        var el = document.createElement('p'),
        supported = false,
        transforms = {
            'webkitTransform':'-webkit-transform',
            'OTransform':'-o-transform',
            'msTransform':'-ms-transform',
            'MozTransform':'-moz-transform',
            'transform':'transform'
        };

        // Add it to the body to get the computed style
        document.body.insertBefore(el, null);

        for(var t in transforms){
            if( el.style[t] !== undefined ){
                el.style[t] = 'translate3d(1px,1px,1px)';
                supported = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (supported !== undefined && supported.length > 0 && supported !== "none");
    })();

    if(cssTransforms3d){
        //toggle menu
        menuBtn.click(function() {
            togglePushy();
        });
        //close menu when clicking site overlay
        siteOverlay.click(function(){ 
            togglePushy();
        });
    }else{
        //jQuery fallback
        pushy.css({left: "-" + menuWidth}); //hide menu by default
        container.css({"overflow-x": "hidden"}); //fixes IE scrollbar issue

        //keep track of menu state (open/close)
        var state = true;

        //toggle menu
        menuBtn.click(function() {
            if (state) {
                openPushyFallback();
                state = false;
            } else {
                closePushyFallback();
                state = true;
            }
        });

        //close menu when clicking site overlay
        siteOverlay.click(function(){ 
            if (state) {
                openPushyFallback();
                state = false;
            } else {
                closePushyFallback();
                state = true;
            }
        });
    }
});