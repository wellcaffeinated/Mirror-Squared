/*
 * pQuery physics library v@VERSION
 * https://github.com/wellcaffeinated/pQuery
 * 
 * Copyright 2012, Jasper Palfree
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
define(
	[
		'../../util/class',
		'./basic'
	],
	function(
		Class,
		Basic
	){

		var Sphere = Class({
				
			_type: 'sphere'
			
			,Sphere: function(){

				Sphere.prototype.__extends__.call( this );

				this._.radius = 0;
			}

			,__extends__: Basic

			,dimensions: function( r ){

				if ( r !== undefined ){

					this._.radius = r || r.radius || 0;
					
				}

				return {

					radius: this._.radius
				};
			}

			,AABB: function(){

				var _ = this._;

				return {
					x: _.radius,
					y: _.radius,
					z: _.radius
				};
			}

		}, 'Sphere');

		return Sphere;
	}
);