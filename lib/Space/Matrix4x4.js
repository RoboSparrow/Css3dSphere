/*
 * MDN: The matrix3d() CSS function describes a 3D transform as a 4x4 homogeneous matrix. The 16 parameters are described in the column-major order.
 */
 
var SPACE = (function(Module) {
    
    'use strict';
    
    var idendityMatrix = function(){
        var m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        return m;
    };
    idendityMatrix();
 
    var Matrix4x4 = function(){
        this.m = idendityMatrix();
    };
    
    // to one-dimensional array
    Matrix4x4.prototype.flatten = function(){
        var r = [];
        for(var i = 0; i < 4; i++){
            r.concat(this.m[i]);
        }
        return r;
    };
    
    // css matrix3d function string
    Matrix4x4.prototype.matrix3d = function(){
        var r = this.flatten();
        return 'matrix3d(' + r.join(',') + ')';
    };
    
    Matrix4x4.prototype.pretty = function(){
        var r = [];
        for(var i = 0; i < 4; i++){
            r.push(this.m[i].join(', ' ));
        }
        return r.join("\n");
    };
       
    /**
     * 
     */   
   
    Matrix4x4.prototype.transformPoint = function(p){
        var x = p.x;
        var y = p.y;
        var z = p.z; 
        var d = p.d || 1; //point, position    
        p.x  = (this.m[0][0] * x) + (this.m[0][1] * y) + (this.m[0][2] * z) + (this.m[0][3] * d);
        p.y  = (this.m[1][0] * x) + (this.m[1][1] * y) + (this.m[1][2] * z) + (this.m[1][3] * d);
        p.z  = (this.m[2][0] * x) + (this.m[2][1] * y) + (this.m[2][2] * z) + (this.m[2][3] * d);
        p.d  = (this.m[3][0] * x) + (this.m[3][1] * y) + (this.m[3][2] * z) + (this.m[3][3] * d);
        return p;
    };
       
    /**
     * The transpose of matrix is the matrix generated when every element in
     * the matrix is swapped with the opposite relative to the major diagonal
     */   
   
    Matrix4x4.prototype.transpose = function(){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(i !== j){
                    this.m[i][j] = -1 * this.m[i][j];
                }
            }
        }
    };
    
    /**
     * Adding two matrices
     * Rule: "add row and column to row and column"
     */   
   
    Matrix4x4.prototype.add = function(m){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                this.m[i][j] += m[i][j];
            }
        }
    };

    /**
     * Subtracting two matrices
     * Rule: "subtract row and column from row and column"
     */   
   
    Matrix4x4.prototype.substract = function(m){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                this.m[i][j] -= m[i][j];
            }
        }
    };
    
    ////
    // Point.Cartesian
    ////
    
    Module.Matrix4x4 = Matrix4x4;
    return Module;
    
}(SPACE || {}));
