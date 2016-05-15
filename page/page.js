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
        document.getElementById(id).classList.toggle('active');
    };
    
    var triggers = document.querySelectorAll('.js-popup-trigger');
    for(i = 0; i < triggers.length; i++){                
        triggers[i].addEventListener('click', popupCallback);
    }

    //// 
    // Controls
    ////
    
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
        vals[e.target.name] = e.target.value;
        sphere.updateState(vals);
        updateForms(sphere.state);
    };

    for(i = 0; i < els.length; i++){
        els[i].addEventListener('change', eventCallback, false);
    }

    els = document.querySelectorAll('.rotate');
    eventCallback = function(e){
        e.preventDefault();
        var vals = {
            animation: null,
        };
        vals[e.target.dataset.name] = sphere.state[e.target.dataset.name] + parseInt(e.target.dataset.val, 10);
        sphere.updateState(vals);
        updateForms(sphere.state);
    };

    for(i = 0; i < els.length; i++){
        els[i].addEventListener('click', eventCallback, false);
    }
    
    els = document.querySelectorAll('.rotate');
    eventCallback = function(e){
        e.preventDefault();
        var vals = {
            animation: null,
        };
        vals[e.target.dataset.name] = sphere.state[e.target.dataset.name] + parseInt(e.target.dataset.val, 10);
        sphere.updateState(vals);
        updateForms(sphere.state);
    };

    for(i = 0; i < els.length; i++){
        els[i].addEventListener('click', eventCallback, false);
    }
    
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
            break;
            case 'words':
                var words = value.split(' ');
                for(i = 0; i < sphere.nodes.columns.length; i++){
                    node = document.createElement('div');
                    node.className = "text-center";
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
    updateForms(sphere.state);
    
    var content = document.querySelectorAll('.sphere-init-content');
    for(i = 0; i < content.length; i++){
        sphere.columContent(content[i], i);
    }
});

window.addEventListener('resize', function(){
    //@todo
}, true);
