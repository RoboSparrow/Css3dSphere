/* jshint node: true */
/* global SPACE */

// !commonJS
var vm = require('vm');
var fs = require('fs');
var script = fs.readFileSync('lib/Space/Point.js');
vm.runInThisContext(script);

// load assertions
var expect = require('chai').expect;

describe('new SPACE.Point.Cartesian conversions', function() {
    
  it('should convert between cartesian and spherical (maintain: 1)', function() {
    var cP = new SPACE.Point.Cartesian(1, 1, 1);
    var sP = cP.toSpherical();
    var cP1 = sP.toCartesian();
    //console.log(cP,sP,cP1);

    expect(cP1.x).to.be.equal(cP.x);
    expect(cP1.y).to.be.equal(cP.y);
    expect(cP1.z).to.be.equal(cP.z);
  });
  
  it('should convert between cartesian and spherical (maintain: 0)', function() {
    var cP = new SPACE.Point.Cartesian(0, 0, 0);
    var sP = cP.toSpherical();
    var cP1 = sP.toCartesian();
    //console.log(cP,sP,cP1);

    expect(cP1.x).to.be.equal(cP.x);
    expect(cP1.y).to.be.equal(cP.y);
    expect(cP1.z).to.be.equal(cP.z);
  });
  
  it('should convert between cartesian and spherical (maintain: float)', function() {
    var cP = new SPACE.Point.Cartesian(22.22, 33.33, 44.44);
    var sP = cP.toSpherical();
    var cP1 = sP.toCartesian();
    //console.log(cP,sP,cP1);

    expect(cP1.x).to.be.equal(cP.x);
    expect(cP1.y).to.be.equal(cP.y);
    expect(cP1.z).to.be.equal(cP.z);
  });
  
  it('should convert between cartesian and spherical (maintain: negative)', function() {
    var cP = new SPACE.Point.Cartesian(-22.22, -33.33, -44.44);
    var sP = cP.toSpherical();
    var cP1 = sP.toCartesian();
    //console.log(cP,sP,cP1);

    expect(cP1.x).to.be.equal(cP.x);
    expect(cP1.y).to.be.equal(cP.y);
    expect(cP1.y).to.be.equal(cP.y);
  });
  
});

describe('new SPACE.Point.Cartesian operations', function() {
    
  it('should create an independent clone', function() {
    var p = new SPACE.Point.Cartesian(5, 5, 5);
    var clone = p.clone();
    expect(p.x).to.be.equal(clone.x);
    expect(p.y).to.be.equal(clone.y);
    expect(p.y).to.be.equal(clone.y);
    
    clone.y = 0;
    expect(p.y).not.to.be.equal(clone.y);
  });

});

describe('new SPACE.Point.Spherical conversions', function() {
    
  it('should convert between spherical and cartesian (maintain: 1)', function() {
    var sP = new SPACE.Point.Spherical(1, 1, 1);
    var cP = sP.toCartesian();
    var sP1 = cP.toSpherical();
    //console.log(cP,sP,cP1);

    expect(sP1.x).to.be.equal(sP.x);
    expect(sP1.y).to.be.equal(sP.y);
    expect(sP1.z).to.be.equal(sP.z);
  });
  
  it('should convert between spherical and cartesian (maintain: 0)', function() {
    var sP = new SPACE.Point.Spherical(0, 0, 0);
    var cP = sP.toCartesian();
    var sP1 = cP.toSpherical();
    //console.log(cP,sP,cP1);

    expect(sP1.x).to.be.equal(sP.x);
    expect(sP1.y).to.be.equal(sP.y);
    expect(sP1.z).to.be.equal(sP.z);
  });
  
  it('should convert between spherical and cartesian (maintain: float)', function() {
    var sP = new SPACE.Point.Spherical(22.22, Math.Pi/2,  Math.Pi/2);
    var cP = sP.toCartesian();
    var sP1 = cP.toSpherical();
    //console.log(cP,sP,cP1);

    expect(sP1.x).to.be.equal(sP.x);
    expect(sP1.y).to.be.equal(sP.y);
    expect(sP1.z).to.be.equal(sP.z);
  });
  
  it('should convert between spherical and cartesian (maintain: negative)', function() {
    var sP = new SPACE.Point.Spherical(-22.22, -Math.Pi/2, -Math.Pi/2);
    var cP = sP.toCartesian();
    var sP1 = cP.toSpherical();
    //console.log(cP,sP,cP1);

    expect(sP1.x).to.be.equal(sP.x);
    expect(sP1.y).to.be.equal(sP.y);
    expect(sP1.z).to.be.equal(sP.z);
  });
  
});

