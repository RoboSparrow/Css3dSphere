/**
 * @TODO:
 * x form events
 * - responsive
 * x clean css
 * - css theme
 * - nore rotate css
 * -row css
 * -ie (modernizr)
 * -timeout draw
 * -acknowledge
 * - cleaner lines
 * - cleaner addNode
 */

(function(window){

    var Sphere = function(wrapper, options){

        this.defaults = function(){
            return {
                columns: 12,
                rows: 6,
                radius: 300,
                perspective: 800,
                translateX: 0,
                translateY: 0,
                translateZ: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                animation: 'rotateY',
                poleCaps: [90, 270] //pole caps (degree) .5* PI, 1.5 * PI;
            };
        };

        this.state = this.defaults();

        this.merge = function(state, options){
            for(var key in options){
                if(options.hasOwnProperty(key)){
                    state[key] = options[key];
                }
            }
            return state;
        };
        
        var cache = {};
        this.cache = {
            get: function(key){
                return (cache.hasOwnProperty(key)) ? cache[key] : null;
            },
            set: function(key, value){
                cache[key] = value;
            },
            purge: function(key){
                key = key || false;
                if(key){
                    delete(cache[key]);
                }else{
                    cache = {};
                }
            },
        };
        
        this.merge(this.state, options || {});

        this.nodes = {
            scene: document.createElement('div'),
            sphere: document.createElement('div'),
            container: document.createElement('div'),
            columns: []
        };

        this.nodes.scene.className = 'scene';
        this.nodes.sphere.className = 'sphere';
        this.nodes.container.className = 'container';

        wrapper.appendChild(this.nodes.scene);
        this.nodes.scene.appendChild(this.nodes.sphere);
        this.nodes.sphere.appendChild(this.nodes.container);

        this.draw();

    };

    Sphere.prototype.updateState = function(values){
        if(Object.prototype.toString.call(values) !== '[object Object]'){
            return false;
        }

        var reference = this.defaults();
        var refType;
        var valType;

        // type casting to defaults
        for (var key in values){
            if(!values.hasOwnProperty(key)){
                continue;
            }
            if(!reference.hasOwnProperty(key)){
                continue;
            }

            refType = Object.prototype.toString.call(reference[key]);
            valType = Object.prototype.toString.call(values[key]);

            if(valType === refType && refType !== '[object Number]'){
                continue;
            }

            if(refType === '[object Number]'){
                values[key] = parseInt(values[key], 10);
                if(isNaN(values[key])){
                    delete(values[key]);
                }
            }
        }

        this.merge(this.state, values);
        this.draw();
    };

    Sphere.prototype.draw = function(){
            //flush
            this.nodes.columns = [];
            this.nodes.container.innerHTML = '';

            this.nodes.scene.style.minWidth = (2 * this.state.radius) + 'px';
            this.nodes.scene.style.minHeight = (2 * this.state.radius) + 'px';

            var rotate = {
                row: 360/this.state.columns,
                column: (360/2)/this.state.rows
            };

            var translate = {
                z: (this.state.radius/2) / Math.tan(rotate.column * Math.PI/180)
            };

            var row;
            var column;
            var columnCell;

            this.coordinates();

            for(var r = 0; r < this.state.rows; r++) {
                row = this.renderRow(r, rotate.row);
                this.nodes.container.appendChild(row);
                for(var c = 0; c < this.state.columns; c++) {
                    column = this.renderColumn(r, c, rotate.column, translate);
                    if(column){
                        row.appendChild(column);
                        columnCell = this.renderColumnCell();
                        column.appendChild(columnCell);
                        this.nodes.columns.push(columnCell);
                    }
                }
            }

            this.nodes.scene.style.perspective = this.state.perspective + 'px';
            
            this.sphereClass();
            this.sphereTransforms();
            this.sphereAnimation();
    };

    Sphere.prototype.renderRow = function(index, angle){
        var rotate = {
            x: index * angle
        };
        var node = document.createElement('div');
        node.className = 'sphere-row row-' + index;
        node.style.transform = "rotateX("+ rotate.x + "deg)";
        return node;
    };

    Sphere.prototype.renderColumn = function(rowIndex, columnIndex, angle, translate){
        var rotate = {
            y: columnIndex * angle
        };

        if(!this.isDisplayableColumn(rowIndex, rotate.y)){
            return false;
        }

        var node = document.createElement('div');
        node.className = 'sphere-column row-' + rowIndex +' col-' + columnIndex;
        node.style.transform = "rotateY("+ rotate.y +"deg) translateZ("+ translate.z +"px)";
        return node;
    };
    
    Sphere.prototype.renderColumnCell = function(){
        var node = document.createElement('div');
        node.className = 'column-content';
        return node;
    };

    Sphere.prototype.isDisplayableColumn = function(rowIndex, columnYangle){

        var isPoleCap = (this.state.poleCaps.indexOf(columnYangle) > -1);

        if(isPoleCap && rowIndex !== 0){
            return false;
        }

        var isPolar = false;
        for(var i = 0; i < this.state.poleCaps.length; i++) {
            isPolar = (Math.abs(this.state.poleCaps[i] - columnYangle) <= 30);
            if(isPolar){
                break;
            }
        }

        if(isPolar && (rowIndex % 2)){
            return false;
        }

        return true;
    };

    Sphere.prototype.sphereTransforms = function(){
        var state = this.state;
        var styles = [];
        var transform = function(){
            var unit = arguments[0];
            var r = [];
            for(var i = 1; i < arguments.length; i++) {
                r.push(arguments[i] + '(' + state[arguments[i]] + unit + ')');
            }
            return r;
        };

        styles = styles.concat(transform('px', 'translateX', 'translateY', 'translateZ'));
        styles = styles.concat(transform('deg', 'rotateX', 'rotateY', 'rotateZ'));

        if(styles.length){
            this.nodes.container.style.transform = styles.join(' ');
        }

    };
    
    Sphere.prototype.sphereAnimation = function(){
        if(this.state.animation){
            this.nodes.sphere.style.animation = this.state.animation + ' 25s infinite linear';
        }else{
            this.nodes.sphere.style.animation = null;
        }
    };
    
    Sphere.prototype.sphereClass = function(name){
        name = name || null;
        var cached = this.cache.get('sphereClass');
        this.cache.purge('sphereClass');     
        if(cached){
            this.nodes.sphere.classList.remove(cached);
        }
        if(!name){
            return;
        }
        this.nodes.sphere.classList.add(name);
        this.cache.set('sphereClass', name);
    };
    
    Sphere.prototype.reset = function(){
        this.state = this.defaults();
        this.sphereClass();
        this.draw();
    };
    
    /**
     * @param {object|string} node HtmlElement object or html string
     * @param {number|false} index inedx of column to be updated, If not set or falsythe all columns arre assined the node
     * @returns {number} index of affected column or last index of columns when all affected, -1 if node columncouln't be attached
     */
     
    Sphere.prototype.columContent = function(node, index){
        index = (typeof index === 'number') ? index : -1;
        var columns = this.nodes.columns;console.log(index, node);
        
        var addNode = function(index, node){
            if(typeof columns[index] === 'undefined'){
                return -1;
            }

            while (columns[index].firstChild) {
                columns[index].removeChild(columns[index].firstChild);
            }
            
            if(typeof node === 'string'){
                columns[index].innerHTML = node;
            }else{
                columns[index].appendChild(node);
            }
            
            return index;
        };
        
        // single
        if(index > -1){
            return addNode(index, node);
        }
        
        // all
        for(var i = 0; i < columns.length; i++) {
            addNode(i, node);
        }
        return columns.length -1;
    };

    Sphere.prototype.line = function(width, color){
        color = color || 'rgb(255, 255, 255)';

        var node = document.createElement('div');
        node.className = 'sphere-line';
        node.style.position = 'absolute';
        node.style.width = width;
        node.style.left = 0;
        node.style.top = '50%';
        node.style.height = '1px';
        node.style.borderBottomWidth = '1px';
        node.style.borderBottomStyle = 'solid';
        node.style.borderBottomColor = color;
        node.style.backfaceVisibility = 'visible';

        return node;
    };

    Sphere.prototype.coordinates = function(){

        var node = document.createElement('div');
        node.className = 'sphere-coordinates';
        node.style.position = 'absolute';

        node.style.width = '100%';
        node.style.height = '100%';
        //node.style.transform = 'translate3d(' + (-this.nodes.scene.clientWidth/2) + 'px,' + this.nodes.container.clientHeight/2 + 'px,0)';
        this.nodes.container.appendChild(node);

        var lineWidth = '100%';
        var x = this.line(lineWidth, 'red');
        node.appendChild(x);

        var y = this.line(lineWidth, 'blue');
        y.style.transform = 'rotateY(90deg)';
        node.appendChild(y);

        var z = this.line(lineWidth, 'green');
        z.style.transform = 'rotateZ(90deg)';
        node.appendChild(z);

        return node;
    };

    window.Sphere = Sphere;

}(window));
