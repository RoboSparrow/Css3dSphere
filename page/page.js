/* global Sphere */

document.addEventListener('DOMContentLoaded', function() {
    var els;
    var i;
    var eventCallback;

    //// 
    //popups
    ////
    
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
    for(i = 0; i < triggers.length; i++){                
        triggers[i].addEventListener('click', popupCallback);
    }

    //// 
    // Controls
    ////
    
    //// sidebar
    
    var updateForms = function(state){
        var form = document.getElementById('SettingsForm');
        var nodes = form.querySelectorAll('[name]');
        for(var i = 0; i < nodes.length; i++){
            if(sphere.state.hasOwnProperty(nodes[i].name)){
                nodes[i].value = state[nodes[i].name];
            }
        }

        document.getElementById('json').textContent = JSON.stringify(state, false, 4);
    };
    
    els = document.querySelectorAll('.change');
    eventCallback = function(e){
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
        updateForms(sphere.state);
    };

    for(i = 0; i < els.length; i++){
        els[i].addEventListener('change', eventCallback, false);
    }
    
    //// rotate
    
    els = document.querySelectorAll('.rotate');
    eventCallback = function(e){
        e.preventDefault();
    
        var val = sphere.state[e.target.dataset.name] + parseInt(e.target.dataset.val, 10);
        sphere.sphereTransforms(e.target.dataset.name, val);
        
        updateForms(sphere.state);
    };

    for(i = 0; i < els.length; i++){
        els[i].addEventListener('click', eventCallback, false);
    }
    
    //// shapes and content
    
    els = document.querySelectorAll('.action');
    eventCallback = function(e){
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
                sphere.columContent(this.innerHTML);
                sphere.sphereClass('transparent');
            break;
            case 'words':
                var words = value.split(' ');
                for(i = 0; i < sphere.nodes.columns.length; i++){
                    node = document.createElement('div');
                    node.className = 'text-center';
                    node.textContent =  (typeof words[i] !== 'undefined' ) ? words[i] : '';
                    sphere.columContent(node, i);
                }
            break;
        }
    };

    for(i = 0; i < els.length; i++){
        els[i].addEventListener('click', eventCallback, false);
    }
    
    //// 
    // Sphere
    ////

    var sphere = new Sphere(document.getElementById('Draw3dSphere'));
    //sphere.coordinates();
    sphere.centreContent('<h1>Css Sphere</h1>');
    updateForms(sphere.state);
    
    var cols = sphere.state.columns - 1;
    var content = document.querySelectorAll('.sphere-init-content');
    for(i = 0; i < content.length; i++){
        sphere.columContent(content[i], cols - i);
    }
});

window.addEventListener('resize', function(){
    //@todo
}, true);
