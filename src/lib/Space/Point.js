var SPACE = (function(Module) {
    
    'use strict';
    
    var Point = {};
    
    ////
    // Point.Cartesian
    ////
    
    Point.Cartesian = function(x, y, z){
        this.x = Math.round(x) || 0;
        this.y = Math.round(y) || 0;
        this.z = Math.round(z) || 0;
    };
    
    // Convert to Spherical
    
    Point.Cartesian.prototype.r = function(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    };
    
    Point.Cartesian.prototype.phi = function(){
        return Math.atan2(this.y, this.x);
    };
    
    Point.Cartesian.prototype.theta = function(){
        return Math.acos(this.z/this.r());
    };
    
    Point.Cartesian.prototype.toSpherical = function(){
        return new Point.Spherical(this.r(), this.phi(), this.theta());
    };

    // Geographical
    // https://vvvv.org/blog/polar-spherical-and-geographic-coordinates
    
    Point.Cartesian.prototype.lat = function(){
        return this.phi() - (Math.PI/2);
    };
    
    Point.Cartesian.prototype.lng = function(){
        return this.theta();
    };
    
    // Ops
    
	Point.Cartesian.prototype.clone = function() {
		return new Point.Cartesian( this.x, this.y, this.z );
	};
    
	Point.Cartesian.prototype.multiply = function(p) {
		this.x *= p.x;
		this.y *= p.y;
		this.z *= p.z;
	};
    
	Point.Cartesian.prototype.add = function(p) {
		this.x += p.x;
		this.y += p.y;
		this.z += p.z;
	};
    
	Point.Cartesian.prototype.substract = function(p) {
		this.x -= p.x;
		this.y -= p.y;
		this.z -= p.z;
	};
    
    ////
    // Point.Spherical
    ////
    
    Point.Spherical = function(r, phi, theta){
        this.r = r || 0;            // distance
        this.phi = phi || 0;        // polar angle
        this.theta = theta || 0;    // azimuthal angle 
    };
    
    //// Point.Spherical conversions
    
    // Cartesian
    
    Point.Spherical.prototype.x = function(){
        return this.r * Math.sin(this.theta) * Math.cos(this.phi);
    };
    
    Point.Spherical.prototype.y = function(){
        return this.r * Math.sin(this.theta) * Math.sin(this.phi);
    };
    
    Point.Spherical.prototype.z = function(){
        return this.r * Math.cos(this.theta);
    };
    
    Point.Spherical.prototype.toCartesian = function(){
        return new Point.Cartesian(this.x(), this.y(), this.z());
    };
    
    // Geographical
    // https://vvvv.org/blog/polar-spherical-and-geographic-coordinates
    
    Point.Spherical.prototype.lat = function(){
        return this.phi - (Math.PI/2);
    };
    
    Point.Spherical.prototype.lng = function(){
        return this.theta;
    };
    
    ////
    // Expose
    ////
    
    Module.Point = Point;
    return Module;
    
}(SPACE || {}));
