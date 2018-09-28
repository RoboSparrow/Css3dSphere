# Interactive Html5 Sphere

* A variation of [PaulHeye's excellent segmented CSS sphere](http://paulrhayes.com/experiments/sphere/)

License: MIT. This is an experiment and not a serious project. Anything can change (and break). I may not provide active support and maintenace.
I appreciate however suggestions and pull requests, if you think things can be done better.
## Demo:

* http://robosparrow.github.io/Css3dSphere

## Features:

* CSS3 and Vanilla JS
* configure basic geometry parameters
* move, rotate sphere
* Fallback for legacy browsers
* animations
* manipulate html content in sphere segments and centre

## Browser support

* See section *Legacy Mode* below.

The sphere will render on modern browsers who understand es5 and [css 3d transforms](http://caniuse.com/#feat=transforms3d).

## Setup

Include `css3-sphere.js` and `css3-sphere.css` in your page.

```
<!DOCTYPE html>
<html>
  <head>
        <meta charset="UTF-8">

        <title>CSS sphere</title>

        <!-- sphere -->
        <link rel="stylesheet" href="./lib/css3-sphere.css">
        <script src="./lib/css3-sphere.js"></script>
        
        <script>
            var sphere = new Sphere(document.getElementById('MySphere'));
            // now you can do things with your sphere
        </script>        

    <body>
        <!-- sphere wrapper -->
        <div id="MySphere"></div>
    </body>
</html>
```

## Create Sphere

`new Sphere(node, options);`

* `node`: Dom node (block element)
* `options`: object, your initial state properties, see `stateObject` below

```
var sphere = new Sphere(document.getElementById('MySphere'));
```

or

```
var sphere = new Sphere(document.getElementById('MySphere'), {
    sphereClass: 'circles',
    animation: 'rotateZ'
});
```

## Legacy Mode

###  HTML5 checks and fallback

Some simple checks for Html5 support are run on start. 

* ['transform', 'transformStyle', 'transition', 'backfaceVisibility', 'perspective', 'transformStyle: preserve-3d']`

The sphere will not render oif one or more of the the tests fail .(Unless you force rendering, see below).
ou can check the state with the `this.ok()` method. Failed tests are logged in the `this.errors` array.

```
var sphere = new Sphere(document.getElementById('MySphere');

if(sphere.ok()){
    // do your manipulations
}

if(!sphere.ok()){
    document.getElementById('my-error').innerHTML = '<pre>Missing HTML5 support: ' + sphere.errors.join(', ') + '</pre>';
}
```

Of course you can use more sophisticated tools like [Modernizr](https://modernizr.com/):

```
var sphere = new Sphere(document.getElementById('MySphere'));
if(<my-checks-say-yes>){
    sphere.draw();// discard inbuilt fallback and force drawing
}
```

### Prefixing

* supported prefixes: `webkit, moz, ms` (Opera is now on Webkit)

## Update state parameters 

`sphere.updateState(stateObject);`

* `stateObject`: an object with properties to be updated.

```
sphere.updateState({
    radius: 600,   
    animation: null,
    rotateY: 90
});

```

`sphere.updateState` triggers a complete re-render of the Sphere. See also `sphere.sphereTransforms` for less exhaustive transformations of an existing sphere.

Configurable state properties: 

```
var state = {
    columns: 12,
    rows: 6,                    // colums/rows relation should be 2:1 for best results!
    radius: 300,                // sphere radius (px)
    translateX: 0,              // move sphere (px)
    translateY: 0,              // move sphere (px)
    translateZ: 0,              // move sphere (px)
    rotateX: 0,                 // rotate sphere (deg)
    rotateY: 0,                 // rotate sphere (deg)
    rotateZ: 0,                 // rotate sphere (deg) 
    animation: 'rotateY',       // animate spere: null (no animation), 'rotateXn',  'rotateY',  'rotateZ' , @see css3-sphere.css for animations
    sphereClass: 'circles',     // segment shapes (classNAmes) @see css3-sphere.css for shape classes 
}
```

### Load defaults

* `sphere.reset();`

## Move Sphere

* `sphere.sphereTransforms(propertyName, distance);`
* `propertyName`: transform property (must be defined in state defaults)
* `distance`: distance in pixels (number)

```
// move 300px to right
sphere.sphereTransforms('translateX', 300);

// move 300px to top
sphere.sphereTransforms('translateX', -300);

// move 300px to front
sphere.sphereTransforms('translateZ', -300);
```

## Rotate Sphere

`sphere.sphereTransforms(propertyName, angle);`

* `propertyName`: transform property (must be defined in state defaults)
* `angle`: angle in degrees (number)

```
// rotate 30 degrees up
sphere.sphereTransforms('rotateX', 30);

// rotate 30 degrees down
sphere.sphereTransforms('rotateX', -30);

// rotate 30 degrees left
sphere.sphereTransforms('rotateY', -30);

// rotate 30 degrees right
sphere.sphereTransforms('rotateY', 30);

// spin 30 degrees left
sphere.sphereTransforms('rotateZ', -30);

// spin 30 degrees right
sphere.sphereTransforms('rotateZ', 30);

```

## Animate Sphere

```
sphere.sphereAnimation(animationClass|'pause'|'play'|null);
```

* `animationClass`: See `css3-sphere.less` or `css3-sphere.css` for animation class examples. Define your own!
* supports multiple classes: `fist-class second-class`
* Stop an animation by simply submitting `null`.

```
sphere.sphereAnimation('rotateX');
sphere.sphereAnimation('rotateY');
sphere.sphereAnimation('rotateZ');

// chain animations - see less file
sphere.sphereAnimation('translateZ rotateY');

// pause animation
sphere.sphereAnimation('pause');

// resume animation
sphere.sphereAnimation('pause');

// remove animation alltogether
sphere.sphereAnimation(null);

```

## Style Segments

This method attaches simply a css class to the sphere so 

`sphere.sphereClass(className);`

* `className`: You can define your own classes or use those in `css3-sphere.css`
* supports multiple classes: `fist-class second-class`

```
// circles
sphere.sphereClass('cirles');

// transparent segments
sphere.sphereClass('transparent');

// default (sqaures)
sphere.sphereClass('');
```

## Node manipulation

Some node references are stored for your cunning manipulations in the `sphere.nodes` property.

* `sphere.nodes.scene`: internal wrapper created by sphere
* `sphere.nodes.sphere`: sphere parent
* `sphere.nodes.centre`: Centre node (by default empty)
* `sphere.nodes.columns`: An array holding the segments of the sphere.

Of all these the `sphere.nodes.columns` array will be the most interesting when you want to populate the sphere with your content.
See `sphere.columnContent()` for details.

Schema of the DOM structure:

```
<div class="sphere">
    <div class="container">
        <div class="sphere-centre"></div>
         <div class="sphere-row row-0">
             <div class="sphere-column row-0 col-0">
                 <div class="column-content"></div>
             </div>
             ... more columns
         </div>
         ... more rows
    </div>
</div>
```


## Attach content

### Segments

`sphere.columnContent(content, index);`

* `content`: node or html string
* `index`: A single segment. Attaches content to all segments if not set or `-1`

Index refers to the `sphere.nodes.columns` node array.

```
// content - node example
var node = document.CreateElement('img');
node.className = 'my-class';
node.src = 'http://my-image-url';

// content - html example
var html = '<div class="my-class"><a href="http://my-link">My link</a></div>';

// attach to all segments
sphere.columnContent(node);

// attach to specific segment
sphere.columnContent(html, 3);
```

### Sphere centre

`sphere.centreContent(content);`

* `content`: node or html string

```
sphere.centreContent('<h1>My Content</h1>');
```

# Cache

The `sphere` instance contains a very basic cache for temporarily storing (state) properties. 
You need to invoke this manually.

Example:

```
//stop animation and store current
sphere.cache.set('animation', sphere.state.animation);
sphere.sphereAnimation(null);

//resume animation
sphere.sphereAnimation(sphere.cache.get('animation', null));

//remove property
sphere.cache.purge('animation');

//purge all
sphere.cache.purge();
```
