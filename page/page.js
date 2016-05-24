/* global Sphere */
/* global Flickr */

var Page = (function() {
    
    /**
     * popups
     */  
    
    var popups = function(sphere){

        var popupCallback = function(e){
            e.preventDefault();
            
            var id = e.target.getAttribute('href').substring(1); //#
            var src = document.getElementById(id);
            src.classList.toggle('active');
            if(id === 'SettingsForm'){
                if(src.classList.contains('active')){
                    sphere.cache.set('animation', sphere.state.animation);
                    sphere.sphereAnimation(null);
                }else{
                    sphere.sphereAnimation(sphere.cache.get('animation'));
                }
            }
        };
        
        var triggers = document.querySelectorAll('.js-popup-trigger');
        for(var i = 0; i < triggers.length; i++){                
            triggers[i].addEventListener('click', popupCallback);
        }
    };
    
    /**
     * update sidebar form
     */
     
    var updateForms = function(sphere){
        var form = document.getElementById('SettingsForm');
        var nodes = form.querySelectorAll('[name]');
        var state = sphere.state;
        var output;
        for(var i = 0; i < nodes.length; i++){
            if(sphere.state.hasOwnProperty(nodes[i].name)){
                nodes[i].value = state[nodes[i].name];
                output = document.querySelector('output[for=' + nodes[i].name + ']');
                if(output){
                    output.textContent = state[nodes[i].name];
                }
            }
        }

        document.getElementById('json').textContent = JSON.stringify(state, false, 4);
    };
    
    
    /**
     * rotate controls
     */
     
    var rotateControls = function(sphere){
        var els = document.querySelectorAll('.rotate');
        var eventCallback = function(e){
            e.preventDefault();
        
            var val = sphere.state[e.target.dataset.name] + parseInt(e.target.dataset.val, 10);
            sphere.sphereTransforms(e.target.dataset.name, val);
            
            updateForms(sphere);
        };
    
        for(var i = 0; i < els.length; i++){
            els[i].addEventListener('click', eventCallback, false);
        }
    
    };
    
    /**
     * sidebarForm
     */
     
    var sidebarForm = function(sphere){
        var els = document.querySelectorAll('.change');
        var eventCallback = function(e){
            var vals = {};
            var val;
            var method = e.target.dataset.method || 'updateState';
            
            switch (method){
                case 'updateState':
                    vals[e.target.name] = e.target.value;
                    sphere.updateState(vals);
                break;
                case 'sphereTransforms':
                    val = parseInt(e.target.value, 10);
                    if(isNaN(val)){
                        return false;
                    }
                    sphere.sphereTransforms(e.target.name,  val);
                break;
                default:
                    //nothing
            }
            updateForms(sphere);
        };
    
        for(var i = 0; i < els.length; i++){
            els[i].addEventListener('change', eventCallback, false);
        }
    };
    
    var columnControls = function(sphere){
    
        var els = document.querySelectorAll('.action');
        var eventCallback = function(e){
            e.preventDefault();
    
            var action = this.name || this.dataset.name || false;
            var value = this.value || this.dataset.val || false;
            var node;
    
            switch(action){
                case 'reset':
                    sphere.reset();
                break;
                case 'sphereClass':
                    sphere.sphereClass(value);
                break;
                case 'html':
                    sphere.columnContent(this.innerHTML);
                    sphere.sphereClass('transparent');
                    sphere.centreContent(null);
                break;
                case 'words':
                    var words = value.split(' ');
                    for(i = 0; i < sphere.nodes.columns.length; i++){
                        node = document.createElement('div');
                        node.className = 'text-center text';
                        node.textContent =  (typeof words[i] !== 'undefined' ) ? words[i] : '';
                        sphere.columnContent(node, i);
                    }
                    sphere.centreContent(null);
                    sphere.sphereClass('transparent');
                break;
                case 'flickr':
                    flickrSphere(sphere);
                break;
            }
        };
    
        for(var i = 0; i < els.length; i++){
            els[i].addEventListener('click', eventCallback, false);
        }
    };
    
    var flickrSphere = function(sphere){
        if(typeof window.Flickr === 'undefined'){
            return false;
        }
        
        sphere.centreContent('<i class="fa fa-flickr" style="font-size: 3em;" aria-hidden="true"></i>');
        sphere.sphereClass('transparent');
        sphere.columnContent('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>');
        
        var items = [];
        
        var attachEvents = function(sphere, node){
            var start = function(){
                sphere.sphereAnimation('stop');
            };
            
            var end = function(){
                sphere.sphereAnimation('play');
            };
            
            var click = function(){
            };
                
            node.addEventListener('mouseenter', start, false);
            node.addEventListener('touchstart', start, false);
            node.addEventListener('mouseleave', end, false);
            node.addEventListener('touchend', end, false);
            node.addEventListener('click', click, false);
        };
        
        var attach = function(item, index){
            
            var figure = document.createElement('figure');
            figure.className = 'flickr-feed-item';
            var img = new Image();
            figure.appendChild(img);
            
            img.src = item.getImage();
            img.onload = function(){
                sphere.columnContent(figure, index);
                attachEvents(sphere, sphere.nodes.columns[index]);
            };
            
        };
        
        var build = function(){
            for(var i = 0; i < sphere.nodes.columns.length; i++){
                attach(items[i], i);
            }
            
        };
        
        var feed = function(){
            Flickr.Feed().Photos().ready(function(data){
                items = items.concat(data.items);
                if(items.length < sphere.nodes.columns.length){
                    feed();
                    return;
                }
                build();
            });
        };
        
        feed();
    };
    
    return {
        Init: {
            popups: popups,
            sidebarForm: sidebarForm,
            rotateControls: rotateControls,
            columnControls: columnControls,
        },
        updateForms: updateForms,
        flickrSphere: flickrSphere
    };
    
}());
    
document.addEventListener('DOMContentLoaded', function() {

    /**
     * Init Sphere
     */

    var sphere = new Sphere(document.getElementById('Draw3dSphere'), {sphereClass: 'circles'});
    //sphere.coordinates();
    sphere.centreContent('<h1>Css Sphere</h1>');
    
    // add some content to sphere
    var cols = sphere.state.columns - 1;
    var content = document.querySelectorAll('.sphere-init-content');
    for(var i = 0; i < content.length; i++){
        sphere.columnContent(content[i], cols - i);
    }
    
    /**
     * init Page
     */
     
    Page.Init.popups(sphere);
    Page.Init.sidebarForm(sphere);
    Page.Init.rotateControls(sphere);
    Page.Init.columnControls(sphere); 
    
    Page.updateForms(sphere);
});

window.addEventListener('resize', function(){
    //@todo
}, true);
