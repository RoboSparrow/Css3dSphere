/*
 * @TODO:
 * - timeout draw || init animation
 * - responsive (z-translate)
 * - reset single props
 * - manipulate transforms of single columns
 * - compute colums
 * - rewrite: updateState draw vs update
 * - remove spereAnimation() -> only stop and play
 * - name nodes.columns to cells
 * - update column styles/reset
 * - ie, modernizr
 * - cleaner lines (and thickness param)
 * - jsdoc
 * x FlickrFeed
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
                sphereClass: null,
                poleCaps: [90, 270] //pole caps (degree) .5* PI, 1.5 * PI;
            };
        };

        this.state = this.defaults();
   
        this.debug = false;
        
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
            get: function(key, _default){
                _default = _default || null;
                return (cache.hasOwnProperty(key)) ? cache[key] : _default;
            },
            set: function(key, value){
                var type = Object.prototype.toString.call(value);
                if(type === '[object Object]' || type === '[object Array]'){
                    value = JSON.parse(JSON.stringify(value));
                }
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
        this.cache.set('initState', this.state);
        
        this.nodes = {
            wrapper: wrapper,
            scene: document.createElement('div'),
            sphere: document.createElement('div'),
            container: document.createElement('div'),
            centre: null,
            columns: []
        };

        this.nodes.scene.className = 'scene';
        this.nodes.sphere.className = 'sphere';
        this.nodes.container.className = 'container';

        this.nodes.wrapper.appendChild(this.nodes.scene);
        this.nodes.scene.appendChild(this.nodes.sphere);
        this.nodes.sphere.appendChild(this.nodes.container);

        this.draw();

    };
    
    Sphere.prototype.reset = function(){
        this.state = (typeof this.cache.initState !== 'undefined') ? this.cache.initState : this.defaults();
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
        this.draw(this.nodes.columns);
    };

    Sphere.prototype.draw = function(contents){
        contents = contents || [];
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
        
        var column;
        var content;
        
        this.nodes.centre = this.renderCentre();
        this.nodes.container.appendChild(this.nodes.centre);
        
        for(var r = 0; r < this.state.rows; r++) {
    
            for(var c = 0; c < this.state.columns; c++) {
                column = this.renderColumn(r, c, rotate, translate);
                if(column){
                    this.nodes.container.appendChild(column);
                    if(contents.length){
                        content = contents.shift();
                        this.columnContent(content, this.nodes.columns.length - 1);
                    }
                }
            }
        }

        this.nodes.scene.style.perspective = this.state.perspective + 'px';
        
        this.sphereClass();
        this.sphereTransforms();
        this.sphereAnimation();
    };

    Sphere.prototype.renderCentre = function(){
        var centre = document.createElement('div');
        centre.className = 'sphere-centre';
        var content = document.createElement('div');
        content.className = 'centre-content';
        centre.appendChild(content);
        return centre;
    };

    Sphere.prototype.renderColumn = function(rowIndex, columnIndex, _rotate, translate){
        var rotate = {
            x: rowIndex * _rotate.row,
            y: columnIndex * _rotate.column
        };
        
        if(!this.isDisplayableColumn(rowIndex, rotate.y)){
            return false;
        }
 
        var column = document.createElement('div');
        column.className = 'sphere-column row-' + rowIndex +' col-' + columnIndex;
        column.style.transform = 'rotateX(' + rotate.x + 'deg )rotateY(' + rotate.y + 'deg) translateZ(' + translate.z + 'px)';
        
        var cell = this.renderColumnCell(rowIndex);
        column.appendChild(cell);
  
        if(this.debug){
            cell.innerText = 'row ' + rowIndex + ' col '+ columnIndex;
        }
        
        return column;
    };
    
    Sphere.prototype.renderColumnCell = function(){
        var cell = document.createElement('div');
        var index = this.nodes.columns.push(cell);
        cell.className = 'column-content';
        cell.dataset.cellIndex = index;
        return cell;
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

    Sphere.prototype.sphereTransforms = function(property, value){
        
        var state = this.state;
        
        if(typeof property !== 'undefined' && this.state.hasOwnProperty(property)){
            state[property] = value;
        }
        
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
        
        return true;
    };
    
    Sphere.prototype.sphereAnimation = function(animation){

        if(this.state.animation && animation === 'stop'){
            this.nodes.sphere.classList.add('paused');
            return;
        }
        
        if(this.state.animation && animation === 'play'){
            this.nodes.sphere.classList.remove('paused');
            return;
        }
        
        if(this.state.animation){
            this.nodes.sphere.classList.remove(this.state.animation);
        }
        
        if(typeof animation !== 'undefined'){
            this.state.animation = animation;
        }

        if(this.state.animation){
            this.nodes.sphere.classList.add(this.state.animation);
        }
    };
    
    Sphere.prototype.sphereClass = function(sphereClass){

        if(this.state.sphereClass){
            this.nodes.sphere.classList.remove(this.state.sphereClass);
        }  
        
        if(typeof sphereClass !== 'undefined'){
            this.state.sphereClass = sphereClass;
        }
        
        if(this.state.sphereClass){
            this.nodes.sphere.classList.add(this.state.sphereClass);
        }
    };

    /**
     * @param {object|string} node HtmlElement object or html string
     * @param {number|false} index inedx of column to be updated, If not set or falsythe all columns arre assined the node
     * @returns {number} index of affected column or last index of columns when all affected, -1 if node columncouln't be attached
     */
     
    Sphere.prototype.columnContent = function(node, index){
    
        index = (typeof index === 'number') ? index : -1;
        var columns = this.nodes.columns;
        
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
    
    Sphere.prototype.centreContent = function(node, append){
        append = append || false;
        var content = this.nodes.centre.firstChild;
        if(!append){
            while (content.firstChild) {
                content.removeChild(content.firstChild);
            }
        }
        
        if(!node){
            return this.nodes.centre;
        }
        
        if(typeof node === 'string'){
            content.innerHTML += node;
        }else{
            content.appendChild(node);
        }
        
        return this.nodes.centre;
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

        var lineWidth = '100%';
        var x = this.line(lineWidth, 'red');
        this.centreContent(x, true);

        var y = this.line(lineWidth, 'blue');
        y.style.transform = 'rotateY(90deg)';
        this.centreContent(y, true);

        var z = this.line(lineWidth, 'green');
        z.style.transform = 'rotateZ(90deg)';
        this.centreContent(z, true);

        return this.nodes.centre;
    };

    window.Sphere = Sphere;

}(window));
