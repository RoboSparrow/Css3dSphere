# Interactive Html5 Sphere

* A variation of [PaulHeye's excellent segmented CSS sphere](http://paulrhayes.com/experiments/sphere/)

License: MIT. This is an experiment and not a serious project. Anything can change (and break). I may not provide active support and maintenace.
I appreciate however suggestions and pull requests, if you think things can be done better.

##Features:
* pure Css3 and vanilla JS
* configure basic geometry parameters
* move, rotate sphere
* animations
* css shapes
* insert html content in sphere segments
* insert html content in sphere centre

## Browser support

* [See here] (http://caniuse.com/#feat=transforms3d)

Modern browsers who understand es5 and css 3d transforms. 
This will **NOT work with IE <= 11**! (no `preserve-3d` support)

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
sphere.sphereAnimation(animationClass|null);
```

* `animationClass`: See `css3-sphere.css` for available animation classes or define your own
* Stop an animation by simply submitting `null`.

```
sphere.sphereAnimation('rotateX');
sphere.sphereAnimation('rotateY');
sphere.sphereAnimation('rotateZ');

//stop
sphere.sphereAnimation(null);

```

## Style Segments

This method attaches simply a css class to the sphere so 

`sphere.sphereClass(className);`

* `className`: You can define your own classes or use those in `css3-sphere.css`

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
