/**
 *	jQuery Canvas Triskel: Demo
 *	Copyright (c) 2013 Gonzalo Albito Méndez Rey
 *	Licensed under GNU GPL 3.0 (https://www.gnu.org/licenses/gpl-3.0-standalone.html)
 *	@version	0.3	(2016-07-21)
 *	@author		Gonzalo Albito Méndez Rey	<gonzalo@albito.es>
 *	@license	GPL-3.0
 */

jQuery(document).ready(function($){
	var canvas = jQuery("#triskel")
	var triskel = canvas.triskel({
		framerate: 25,
		canvas: {
			width: 1440,
			height: 600,
			color: "#ffffff",
		},
		triskel: {
			radius: 100,
			count: 10,
			color: "#ffffff",
			border: "#ffffff",
			style: "edge",
			frame: {width: 960, height: 440}
		},
		showAnimation: {
			duration: 500,
			delay: 100,
			zoom: 1.0,
			rotate: 360,
			inverse: true,
			sync: true,
			easing: false
		},
		hideAnimation: {
			duration: 500,
			delay: 100,
			zoom: -1.0,
			rotate: 360,
			inverse: true,
			sync: true,
			easing: false
		},
		swapAnimation: {
			zoomMin: 0.5,
			zoomMax: 1.5,
			zoomIn: {
				duration: 250,
				delay: 100,
				sync: false,
				easing: false
			},
			rotate: {
				angle: 120,
				duration: 500,
				delay: 0,
				inverse: true,
				sync: false,
				easing: false
			},
			zoomOut: {
				duration: 250,
				delay: 0,
				sync: true,
				easing: false
			}
		}
	});
	
	canvas.click(function(event){
		if(triskel.isPaused())
		{
			triskel.resume();
		}
		else
		{
			triskel.pause();
		}
	});
	var options = $(".options");
	options.find(".show").click(function(event){
		triskel.show();
	});
	options.find(".hide").click(function(event){
		triskel.hide();
	});
	options.find(".swap").click(function(event){
		triskel.swap();
	});
});
