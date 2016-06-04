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
 * x ie, modernizr
 * - cleaner lines (and thickness param)
 * - jsdoc
 * x FlickrFeed
 */

(function(window){

    var Style = {
        el: null,
        props: {},
        prefixes:  ['ms', 'Moz', 'Webkit'], //opera is now Webkit
        
        test: function(prop){
            if(!this.el){          
                this.el = document.createElement('div');
            }
            if(typeof this.el.style[prop] !== 'undefined'){
                this.props[prop] = prop;
                return prop;
            }
            var slug = prop[0].toUpperCase() + prop.slice(1);
            var _prop;
            for(var i = 0; i < this.prefixes.length; i++){
                _prop = this.prefixes[i] + slug;
                if(typeof this.el.style[_prop] !== 'undefined'){
                    this.props[prop] = _prop;
                    return _prop;
                }
            }
            this.props[prop] = false;
            
            return false; 
        },
        
        // ie < edge test
        supportsPreserve3d: function(){
            if(!this.test('transformStyle')){
                return false;
            }
            var prop = this.prefix('transformStyle');
            var el = document.createElement('div');
            el.style[prop] = 'preserve-3d';
            // browsers set only EUNUM (valid) values
            return typeof el.style[prop] !== 'undefined' && el.style[prop] === 'preserve-3d';
        },
        
        // get prefix if if exist, test fails the original prop will be returned
        prefix: function(prop){
            var test;
            if(typeof Style.props[prop] === 'undefined'){
                 test = Style.test(prop);
            }
            test = Style.props[prop];
            return (test) ? test : prop;
        }
    }; 
    
    //shorthand
    var prefix = Style.prefix;

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
                containerClass: null,
                poleCaps: [90, 270] //pole caps (degree) .5* PI, 1.5 * PI;
            };
        };

        this.state = this.defaults();
   
        this.debug = false;
        this.errors = [];
        
        var css3 = ['transform', 'transformStyle', 'transition', 'backfaceVisibility', 'perspective'];
        for(var i = 0; i < css3.length; i++){
            if(!Style.test(css3[i])){
                this.errors.push(css3[i]);
            }
        }
        if(!Style.supportsPreserve3d()){
            this.errors.push('transformStyle: preserve-3d');
        }
        
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
            centre: document.createElement('div'),
            columns: []
        };
        
        this.nodes.scene.className = 'scene';
        this.nodes.sphere.className = 'sphere';
        this.nodes.container.className = 'container';
        this.nodes.centre.className = 'sphere-centre';
        
        this.nodes.wrapper.appendChild(this.nodes.scene);
        this.nodes.scene.appendChild(this.nodes.sphere);
        this.nodes.sphere.appendChild(this.nodes.container);
        this.nodes.container.appendChild(this.nodes.centre);
        
        if(this.ok(true)){
            this.draw();
        }

    };
    
    Sphere.prototype.ok = function(warn){
        warn = warn || false;
        if(this.errors.length){
            if(warn){
                console.warn('css3sphere: not supported by this browser: ' + this.errors.join(', '));
            }
            return false;
        }
        return true;
    };
    
    Sphere.prototype.merge = function(state, options){
        for(var key in options){
            if(options.hasOwnProperty(key)){
                state[key] = options[key];
            }
        }
        return state;
    };
    
    /**
     * (awkward) method for crossBrowser support of classList with multiple classes
     *  - limited supprt for classList.add|remove(class1,class2 .. n);
     *  - dynamic method call not supported (i.e node.classList['add'])
     */

    Sphere.prototype.nodeClasses = function(node, action, classes){
        if(!classes){
            return false;
        } 
        
        if(typeof node === 'string'){
            node = (typeof this.nodes[node] !== 'undefined') ? this.nodes[node] : null;
        }
        
        if(typeof node.classList === 'undefined'){
           return false;
        }
        
        classes = classes.split(' ');
        for(var i = 0; i < classes.length; i++){
            if(!classes[i]){
                continue;
            }
            switch(action){
                case 'add':
                    node.classList.add(classes[i]);
                break;
                case 'remove':
                    node.classList.remove(classes[i]);
                break;
                case 'toggle':
                    node.classList.toggle(classes[i]);
                break;
                default:
                    return false;
            }
        }
        return node.className;
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
        
        if(!this.ok()){
            return;
        }
        
        contents = contents || [];
        //flush
        this.nodes.columns = [];
        this.nodes.container.innerHTML = '';

        this.nodes.scene.style.minWidth = (2 * this.state.radius) + 'px';
        this.nodes.scene.style.minHeight = (2 * this.state.radius) + 'px';
        this.nodes.container.appendChild(this.nodes.centre);
        var rotate = {
            row: 360/this.state.columns,
            column: (360/2)/this.state.rows
        };

        var translate = {
            z: (this.state.radius/2) / Math.tan(rotate.column * Math.PI/180)
        };
        
        var column;
        var content;
        
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

        this.nodes.scene.style[prefix('perspective')] = this.state.perspective + 'px';
        
        this.containerClass();
        this.sphereClass();
        this.sphereTransforms();
        this.sphereAnimation();
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
        column.style[prefix('transform')] = 'rotateX(' + rotate.x + 'deg) rotateY(' + rotate.y + 'deg) translateZ(' + Math.round(translate.z) + 'px)';
        
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
            this.nodes.container.style[prefix('transform')] = styles.join(' ');
        }
        
        return true;
    };
  
    Sphere.prototype.sphereAnimation = function(animation){
        
        if(typeof animation === 'undefined'){
            animation = this.state.animation;
        }
        
        if(this.state.animation && animation === 'stop'){
            this.nodeClasses('sphere', 'add', 'paused');
            return;
        }
        
        if(this.state.animation && animation === 'play'){
            this.nodeClasses('sphere', 'remove', 'paused');
            return;
        }
        
        if(animation !== this.state.animation){
            this.nodeClasses('sphere', 'remove', this.state.animation);
        }
        
        this.state.animation = animation;

        if(this.state.animation){
            this.nodeClasses('sphere', 'add', this.state.animation);
        }
      
    };
   
    Sphere.prototype.containerClass = function(containerClass){

        if(this.state.containerClass){
            this.nodeClasses('container', 'remove', this.state.containerClass);
        }  
        
        if(typeof containerClass !== 'undefined'){
            this.state.containerClass = containerClass;
        }
        
        if(this.state.containerClass){
            this.nodeClasses('container', 'add', this.state.containerClass);
        }
    };
   
    Sphere.prototype.sphereClass = function(sphereClass){

        if(this.state.sphereClass){
            this.nodeClasses('sphere', 'remove', this.state.sphereClass);
        }  
        
        if(typeof sphereClass !== 'undefined'){
            this.state.sphereClass = sphereClass;
        }
        
        if(this.state.sphereClass){
            this.nodeClasses('sphere', 'add', this.state.sphereClass);
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
    
    Sphere.prototype.centreContent = function(node){
   
        if(this.nodes.centre.firstChild){
            while (this.nodes.centre.firstChild) {
                this.nodes.centre.removeChild(this.nodes.centre.firstChild);
            }
        }
                
        if(!node){
            return this.nodes.centre;//cleared
        }
        
        var content = document.createElement('div');
        content.className = 'centre-content';
        this.nodes.centre.appendChild(content);
        
        if(typeof node === 'string'){
            content.innerHTML += node;
        }else{
            content.appendChild(node);
        }
        
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
        node.style[prefix('backfaceVisibility')] = 'visible';

        return node;
    };

    Sphere.prototype.coordinates = function(){

        var lineWidth = '100%';
        var x = this.line(lineWidth, 'red');
        this.centreContent(x, true);

        var y = this.line(lineWidth, 'blue');
        y.style[prefix('transform')] = 'rotateY(90deg)';
        this.centreContent(y, true);

        var z = this.line(lineWidth, 'green');
        z.style[prefix('transform')] = 'rotateZ(90deg)';
        this.centreContent(z, true);

        return this.nodes.centre;
    };

    window.Sphere = Sphere;

}(window));
