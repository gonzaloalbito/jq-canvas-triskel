/**
 *	jQuery Canvas Triskel
 *	Copyright (c) 2013 Gonzalo Albito Méndez Rey
 *	Licensed under GNU GPL 3.0 (https://www.gnu.org/licenses/gpl-3.0-standalone.html)
 *	@version	0.3	(2013-05-01)
 *	@author		Gonzalo Albito Méndez Rey	<gonzalo@albito.es>
 *	@license	GPL-3.0
 */

(function(jQuery){
	jQuery.fn.extend({
		triskel: function(options){
			var defaults = {
				context: "2d",
				framerate: 60,
				canvas: {
					width: 960,
					height: 400,
					color: "#ffffff",
					fitWindow: false,
					framed: false
					
				},
				triskel: {
					radius: 100,
					count: 10,
					color: "#ffffff",	//color or false
					border: "#000000",	//color or false
					style: "normal"	//normal, edge, left, right, edgeLeft, edgeRight
				},
				showAnimation: {
					duration: 1000,
					delay: 100,
					zoom: 1.0,
					rotate: 360,
					inverse: false,
					sync: false,
					easing: false
				},
				hideAnimation: {
					duration: 1000,
					delay: 100,
					zoom: -1.0,
					rotate: 360,
					inverse: false,
					sync: false,
					easing: false
				},
				swapAnimation: {
					zoomMin: 0.5,
					zoomMax: 1.5,
					zoomIn: {
						duration: 500,
						delay: 0,
						sync: false,
						easing: false
					},
					rotate: {
						angle: 360,
						duration: 1000,
						delay: 0,
						inverse: false,
						sync: false,
						easing: false
					},
					zoomOut: {
						duration: 500,
						delay: 0,
						sync: false,
						easing: false
					}
				}
			};
			var options = jQuery.extend(true, {}, defaults, options);
			var element = jQuery(this);
			return new Triskel(element, options);
		}
	});
	
	function Triskel(element, settings){
		var _this = this;
		var object = element;
		var options = settings;
		var canvas = null;
		var paused = true;
		var delta = 1000/options.framerate;
		var frame = 0;
		var drawables = [];
		var drawableFrame = null;
		var locked = false;
		
		this.getCanvas = function(){
			return canvas;
		};
		
		this.show = function(){
			showAnimation();
		};
		
		this.hide = function(){
			hideAnimation();
		};
		
		this.swap = function(){
			swapAnimation();
		};
		
		this.isPaused = function(){
			return paused;
		};
		
		this.pause = function(){
			paused = true;
			drawPlay();
		};
			
		this.resume = function(){
			paused = false;
			loop();
		};
		
		var drawPlay = function(){
			canvas.fillStyle = "#666666";
			canvas.fillRect(15, 55, 40, 40);
			if(paused)
			{
				canvas.fillStyle = "#ff0000";
				canvas.fillRect(20, 60, 10, 30);
				canvas.fillRect(40, 60, 10, 30);
			}
			else
			{
				canvas.fillStyle = "#00ff00";
				canvas.moveTo(20, 60);
				canvas.beginPath();
				canvas.lineTo(50, 75);
				canvas.lineTo(20, 90);
				canvas.lineTo(20, 60);
				canvas.closePath();
				canvas.fill();
				canvas.moveTo(0, 0);
			}
		};
		
		var loop = function(){
			if(!paused)
			{
				clear();
				update();
				draw();
				drawPlay();
				setTimeout(loop, delta);
				frame++;
			}
		};
			
		var update = function(){
			for(var i=0; i<drawables.length; i++)
			{
				drawables[i].update(delta);
			}
			if(drawableFrame)
			{
				drawableFrame.update(delta);
			}
		};
			
		var draw = function(){
			for(var i=0; i<drawables.length; i++)
			{
				drawables[i].draw(canvas);
			}
			if(drawableFrame)
			{
				drawableFrame.draw(canvas);
			}
		};
		
		var clear = function(){
			canvas.setTransform(1, 0, 0, 1, 0, 0);
			var w = object[0].width;
			var h = object[0].height;
			canvas.clearRect(0, 0, w, h);
			if(options.canvas.fitWindow)
			{
				var t = object.parent().offset().top;
				var l = object.parent().offset().left;
				canvas.setTransform(1, 0, 0, 1, l, t);
			}
		};
			
		var showAnimation = function(){
			if(!locked)
			{
				locked = true;
				var iMax = drawables.length-1;
				var delayMax = Math.abs(iMax*options.showAnimation.delay);
				for(var i=0; i<drawables.length; i++)
				{
					var delay = (options.showAnimation.delay>0? i : iMax-i)*options.showAnimation.delay;
					
					var duration = options.showAnimation.duration + (options.showAnimation.sync? delayMax-delay : 0);
					
					var rotate = options.showAnimation.rotate*((!options.showAnimation.inverse || i%2)? 1 : -1);
					
					var animation = {
						duration: duration,
						delay: delay,
						queue: true,
						scale: options.showAnimation.zoom,
						rotate: rotate,
						easing: options.showAnimation.easing
					};
					if(i==iMax)
					{
						animation.complete = function(drawable){ 
							locked = false;
							object.removeClass("hidden");
							object.parent().removeClass("triskel-hidden");
						};
					}
					drawables[i].animate(animation);
				}
			}
		};
			
		var hideAnimation = function(){
			if(!locked)
			{
				locked = true;
				object.addClass("hidden");
				object.parent().addClass("triskel-hidden");
				var iMax = drawables.length-1;
				var delayMax = Math.abs(iMax*options.hideAnimation.delay);
				for(var i=0; i<drawables.length; i++)
				{
					var delay = (options.hideAnimation.delay>0? i : i-iMax)*options.hideAnimation.delay;
					
					var duration = options.hideAnimation.duration + (options.hideAnimation.sync? delayMax-delay : 0);
					
					var rotate = options.hideAnimation.rotate*((!options.hideAnimation.inverse || i%2)? 1 : -1);
					
					var animation = {
							duration: duration,
							delay: delay,
							queue: true,
							scale: options.hideAnimation.zoom,
							rotate: rotate,
							easing: options.hideAnimation.easing
						};
					if(i==iMax)
					{
						animation.complete = function(drawable){
							locked = false;
						};
					}
					drawables[i].animate(animation);
				}
			}
		};
		
		var swapAnimation = function(){
			if(!locked)
			{
				locked = true;
				object.addClass("hidden");
				object.parent().addClass("triskel-hidden");
				var iMax = drawables.length-1;
				var delayMax0 = Math.abs(iMax*options.swapAnimation.zoomIn.delay);
				var delayMax1 = Math.abs(iMax*options.swapAnimation.rotate.delay);
				var delayMax2 = Math.abs(iMax*options.swapAnimation.zoomOut.delay);
				var zoomDiff = options.swapAnimation.zoomMax-options.swapAnimation.zoomMin;
				for(var i=0; i<drawables.length; i++)
				{
					var iDiff = i-iMax;
					var delay0 = (options.swapAnimation.zoomIn.delay>0? i : iDiff)*options.swapAnimation.zoomIn.delay;
					var delay1 = (options.swapAnimation.rotate.delay>0? i : iDiff)*options.swapAnimation.rotate.delay;
					var delay2 = (options.swapAnimation.zoomOut.delay>0? i : iDiff)*options.swapAnimation.zoomOut.delay;
					
					var delayDiff = delayMax0-delay0;
					var duration0 = options.swapAnimation.zoomIn.duration + (options.swapAnimation.zoomIn.sync? delayDiff : 0);
					delayDiff += delayMax1-delay1;
					var duration1 = options.swapAnimation.rotate.duration + (options.swapAnimation.rotate.sync? delayDiff : 0);
					delayDiff += delayMax2-delay2;
					var duration2 = options.swapAnimation.zoomOut.duration + (options.swapAnimation.zoomOut.sync? delayDiff : 0);
					
					var zoom = ((i/iMax)*zoomDiff)+options.swapAnimation.zoomMin-1;
					
					var rotate = options.swapAnimation.rotate.angle*((!options.swapAnimation.rotate.inverse || i%2)? 1 : -1);
					
					var animation0 = {
						duration: duration0,
						delay: delay0,
						queue: true,
						scale: zoom,
						easing: options.swapAnimation.zoomIn.easing
					};
					var animation1 = {
						duration: duration1,
						delay: delay1,
						queue: true,
						rotate: rotate,
						easing: options.swapAnimation.rotate.easing
					};
					var animation2 = {
						duration: duration2,
						delay: delay2,
						queue: true,
						scale: -zoom,
						easing: options.swapAnimation.zoomOut.easing
					};
					if(i==iMax)
					{
						animation2.complete = function(drawable){
							locked = false;
							object.removeClass("hidden");
							object.parent().removeClass("triskel-hidden");
						};
					}
					drawables[i].animate(animation0);
					drawables[i].animate(animation1);
					drawables[i].animate(animation2);
				}
				if(drawableFrame)
				{
					var animation0 = {
						duration: options.swapAnimation.zoomIn.duration+delayMax0,
						delay: 0,
						queue: true,
						scale: zoomDiff,
						easing: options.swapAnimation.zoomIn.easing
					};
					var animation1 = {
						duration: options.swapAnimation.zoomOut.duration+delayMax2,
						delay: options.swapAnimation.rotate.duration+delayMax1,
						queue: true,
						scale: -zoomDiff,
						easing: options.swapAnimation.zoomOut.easing
					};
					drawableFrame.animate(animation0);
					drawableFrame.animate(animation1);
				}
			}
		};
		
		var fillDrawables = function(){
			var triskelParams = {
				fill: options.triskel.color,
				stroke: options.triskel.border,
				position: {x: options.canvas.width/2, y: options.canvas.height/2},
				style: options.triskel.style,
				border: options.triskel.radius,
				frame: options.triskel.frame
			};
			for(var i=0; i<options.triskel.count; i++)
			{
				triskelParams.radius = (i+1)*options.triskel.radius;
				var triskel = new DrawableTriskel(triskelParams);
				drawables.push(triskel);
			}
		};
		
		var updateMeasures = function(){
			if(options.canvas.fitWindow)
			{
				object[0].width = jQuery(window).outerWidth();//options.canvas.width;
				object[0].height = jQuery(window).outerHeight();//options.canvas.height;
			}
			else
			{
				object[0].width = options.canvas.width;
				object[0].height = options.canvas.height;
			}
		};
		
		var init = function(){
			options.canvas.width = options.canvas.width? options.canvas.width : object.innerWidth();
			options.canvas.height = options.canvas.height? options.canvas.height : object.innerHeight();
			if(options.canvas.fitWindow)
			{
				object.css({position:"absolute",top:"0px",left:"0px",width:"100%",height:"100%"});
				jQuery(window).resize(function(){updateMeasures();});
			}
			if(options.canvas.framed)
			{
				drawableFrame = new DrawableFrame({
						fill: "#000000",
						//stroke: "#000000",
						position: {x: options.canvas.width/2, y: options.canvas.height/2},
						width: options.canvas.width,
						height: options.canvas.height
					});
			}
			updateMeasures();
			canvas = object[0].getContext(options.context);
			fillDrawables();
			_this.resume();
		};
		
		init();
	};
		
	function Drawable(child){
		var _this = this;
		this.parent = _this;
		this.options = {
			position: {x: 0, y: 0},
			scale: 1.0,
			rotate: 0,
			stroke: false,
			strokeWidth: 1,
			fill: false,
			shadow: false,
			shadowBlur: 0,
			shadowOffset: {x: 0, y: 0}
		};
		
		var animations = [];
		
		this.animate = function(animation){
			var anim = {
				duration: 0,
				delay: 0,
				queue: false,
				position: {x: false, y: false},
				move: {x: false, y: false},
				scale: false,
				rotate: false,
				loop: false,
				restore: false,
				easing: false,
				complete: function(drawable){},
				elapsed: 0
			};
			anim = jQuery.extend(true, {}, anim, animation);
			anim.move.x = anim.position.x? anim.position.x-_this.options.position.x : anim.move.x;
			anim.move.y = anim.position.y? anim.position.y-_this.options.position.y : anim.move.y;
			anim.easing = anim.easing? anim.easing : function(elapsed, duration){ return (elapsed%(duration+1))/duration; };
			
			anim.last = {
				move: {x: 0, y: 0},
				scale: 0,
				rotate: 0
			};
			
			animations.push(anim);
			return anim;
		};
		
		this.update = function(delta){
			var queued = false;
			for(var i=0; i<animations.length; i++)
			{
				var animation = animations[i];
				if(!animation.queue || !queued)
				{
					queued |= animation.queue;
					
					animation.elapsed += delta;
					var elapsed = animation.elapsed-animation.delay;
					if(elapsed>=0)
					{
						if(elapsed<=animation.duration)
						{
							var prop = animation.easing(elapsed, animation.duration);
							var values = {
									move: {x: prop*animation.move.x, y: prop*animation.move.y},
									scale: prop*animation.scale,
									rotate: prop*animation.rotate
								};
							_this.options.position.x += values.move.x-animation.last.move.x;
							_this.options.position.y += values.move.y-animation.last.move.y;
							_this.options.scale += values.scale-animation.last.scale;
							_this.options.rotate += values.rotate-animation.last.rotate;
							
							animation.last = values;
						}
						else
						{
							var values = {
									move: {x: animation.move.x, y: animation.move.y},
									scale: animation.scale,
									rotate: animation.rotate
								};
							
							if(animation.restore)
							{
								_this.options.position.x -= animation.last.move.x;
								_this.options.position.y -= animation.last.move.y;
								_this.options.scale -= animation.last.scale;
								_this.options.rotate -= animation.last.rotate;
							}
							else
							{
								_this.options.position.x += values.move.x-animation.last.move.x;
								_this.options.position.y += values.move.y-animation.last.move.y;
								_this.options.scale += values.scale-animation.last.scale;
								_this.options.rotate += values.rotate-animation.last.rotate;
							}
							animation.last = values;
							
							if(animation.loop)
							{
								animation.loop = animation.loop-(animation.loop>0? 1 : 0);
							}
							else
							{
								animations.splice(i, 1);
							}
							if(animation.complete)
							{
								animation.complete(_this);
							}
						}
					}
				}
			}
		};
			
		this.define = function(canvas){
			//Nothing to do
		};
		
		this.draw = function(canvas){
			if(_this.options.scale>0)
			{
				var rotate = _this.options.rotate*Math.PI/180;
				canvas.translate(_this.options.position.x, _this.options.position.y);
				canvas.rotate(rotate);
				
				_this.define(canvas);
				
				canvas.rotate(-rotate);
				canvas.translate(-_this.options.position.x, -_this.options.position.y);

				if(_this.options.shadow)
				{
					canvas.shadowColor = _this.options.shadow;
					canvas.shadowBlur = _this.options.shadowBlur;
					canvas.shadowOffsetX = _this.options.shadowOffset.x;
					canvas.shadowOffsetY = _this.options.shadowOffset.y;
				}
				if(_this.options.stroke)
				{
					canvas.lineWidth = _this.options.strokeWidth;
					canvas.strokeStyle = _this.options.stroke;
					canvas.stroke();
				}
				if(_this.options.fill)
				{
					canvas.fillStyle = _this.options.fill;
					canvas.fill();
				}
			}
		};
		
		var init = function(child){
			if(child)
			{
				child.options = child.options? jQuery.extend(true, {}, _this.options, child.options) : _this.options;
				child.animate= child.animate? child.animate : _this.animate;
				child.update = child.update? child.update : _this.update;
				child.define = child.define? child.define : _this.define;
				child.draw = child.draw? child.draw : _this.draw;
				child.parent = child.parent? child.parent : _this;
				_this = child;
			}
		};
			
		init(child);
	};
		
	function DrawableGroup(child){
		var _this = this;
		
		var drawables = [];
		
		this.animate = function(animation){
			var anim = animation;
			var complete = anim.complete;
			anim.complete = false;
			for(var i=0; i<drawables.length; i++)
			{
				anim = drawables.animate(animation);
			}
			anim.complete = complete;
			return anim;
		};
		
		this.update = function(delta){
			for(var i=0; i<drawables.length; i++)
			{
				drawables.update(delta);
			}
		};
			
		this.define = function(canvas){
			for(var i=0; i<drawables.length; i++)
			{
				drawables.define(canvas);
			}
		};
		
		this.draw = function(canvas){
			for(var i=0; i<drawables.length; i++)
			{
				drawables.draw(canvas);
			}
		};
		
		var init = function(child){
			this.prototype = new Drawable(_this);
			if(child)
			{
				child.options = child.options? jQuery.extend(true, {}, _this.options, child.options) : _this.options;
				child.animate= child.animate? child.animate : _this.animate;
				child.update = child.update? child.update : _this.update;
				child.define = child.define? child.define : _this.define;
				child.draw = child.draw? child.draw : _this.draw;
				child.parent = child.parent? child.parent : _this;
				_this = child;
			}
		};
			
		init(child);
	};
	
	function DrawableFrame(settings){
		var _this = this;
		this.options = jQuery.extend(true, {}, {
			width: 100,
			height: 100
		}, settings);

		ARC360: 2*Math.PI;
		
		this.define = function(canvas){
			_this.parent.define(canvas);
			var w = _this.options.width*_this.options.scale;
			var h = _this.options.height*_this.options.scale;
			var x = w/-2;
			var y = h/-2;
			canvas.beginPath();
			canvas.rect(x, y, w, h);
			canvas.closePath();
		};
			
		this.draw = function(canvas){
			canvas.globalCompositeOperation = "destination-in";
			_this.parent.draw(canvas);
			canvas.globalCompositeOperation = "source-over";
		};
			
		var init = function(){
			this.prototype = new Drawable(_this);
		};
			
		init();
	};
	
	function DrawableTriskel(settings){
		var _this = this;
		this.options = jQuery.extend(true, {}, {
			radius: 100,
			style: "normal",
			border: false,
			frame: false
		}, settings);

		var TRI = {
			ARC30: Math.PI/6,
			ARC60: Math.PI/3,
			ARC90: Math.PI/2,
			SEN30: Math.sin(Math.PI/6),
			COS30: Math.cos(Math.PI/6)
		};
		
		var ARCS = [0, -TRI.ARC60, -2*TRI.ARC60, -3*TRI.ARC60, -4*TRI.ARC60, -5*TRI.ARC60, -TRI.ARC90];
		
		var STYLES = {
			normal: {center: [2,0,1], arc: [[2,5],[0,3],[4,1]]},
			left: {center: [2,0,1], arc: [[2,4],[6,3],[4,5]]},
			right: {center: [2,0,1], arc: [[4,5],[0,6],[5,1]]},
			edge: {center: [2,0,1,2,0,1], arc: [[2,3],[2,3],[4,5],[4,5],[0,1],[0,1]]},
			edgeLeft: {center: [2,0,1], arc: [[2,3],[2,3],[4,5]]},
			edgeRight: {center: [2,0,1], arc: [[4,5],[0,1],[0,1]]}
		};

		var getArcs = function(x, y, radius, style, border){
			var arcs = [];
			//Triskel data
			var sqrt3 = Math.sqrt(3);
			var r = radius*(sqrt3/2);
			var d = r/sqrt3;
			//Aux data to calc centers...
			var xDiff = (d*TRI.COS30);
			var yDiff = y-(d*TRI.SEN30);
			//Centers list
			var centers = [{x: x, y: y+d}, {x: x-xDiff, y: yDiff}, {x: x+xDiff, y: yDiff}];
			
			for(var i=0; i<style.center.length; i++)
			{
				arcs.push({center: centers[style.center[i]], radius: r, arc: {start: ARCS[style.arc[i][0]], end: ARCS[style.arc[i][1]]}, direction: true});
			}
			border = radius-border;
			if(border>0)
			{
				r = border*(sqrt3/2);
				d = r/sqrt3;
				xDiff = (d*TRI.COS30);
				yDiff = y-(d*TRI.SEN30);
				centers = [{x: x, y: y+d}, {x: x-xDiff, y: yDiff}, {x: x+xDiff, y: yDiff}];
				
				for(var i=style.center.length-1; i>=0; i--)
				{
					arcs.push({center: centers[style.center[i]], radius: r, arc: {start: ARCS[style.arc[i][1]], end: ARCS[style.arc[i][0]]}, direction: false});
				}
			}
			return arcs;
		};
		
		this.update = function(delta){
			_this.parent.update(delta);
		};
		
		this.define = function(canvas){
			_this.parent.define(canvas);
			var arcs = getArcs(0, 0, _this.options.radius*_this.options.scale, STYLES[_this.options.style], _this.options.border*_this.options.scale);
			canvas.beginPath();
			for(var i=0; i<arcs.length; i++)
			{
				var arc = arcs[i];
				canvas.arc(arc.center.x, arc.center.y, arc.radius, arc.arc.start, arc.arc.end, arc.direction);
			}
			canvas.closePath();
		};
		
		var drawRectangle = function(canvas){
			if(_this.options.frame && _this.options.scale>0)
			{
				var w = _this.options.frame.width*_this.options.scale;
				var h = _this.options.frame.height*_this.options.scale;
				var x = _this.options.position.x-(w/2);
				var y = _this.options.position.y-(h/2);

				canvas.beginPath();
				canvas.rect(x, y, w, h);
				canvas.closePath();
				canvas.globalCompositeOperation = "source-in";
				canvas.fill();
				canvas.globalCompositeOperation = "source-over";
			}
		};
		
		this.draw = function(canvas){
			_this.parent.draw(canvas);
			drawRectangle(canvas);
		};
			
		var init = function(){
			this.prototype = new Drawable(_this);
		};
			
		init();
	};
	
})(jQuery);
