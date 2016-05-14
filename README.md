# GruntWork

<a title="Eadweard Muybridge [Public domain or Public domain], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File%3ABoar_walking.gif"><img width="250" alt="Boar walking" src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Boar_walking.gif"/></a>

GruntWork is a simplistic [Grunt](http://gruntjs.com/) boilerplate for small JS projects. It aims to be lightweight, understandable and easy to configure and extend.

## Install

* edit `package.json` for version, author, license etc
* add info, dependencies to `bower.json`
* optionally customize `Gruntfile.js` to your needs

```!bash
npm install
bower install
```

## Development

As usual: develop in `src` and compile to `dist`.

Project meta data are defined in `package.json`. The Gruntfile features custom `CONF` object for a quick project setup.

### Watch

```!bash
grunt watch
```

### Build

```!bash
grunt
```

## Tasks

```
'grunt-replace'             // dist file names in index.html
'grunt-contrib-jshint'
'grunt-contrib-watch'
'grunt-contrib-concat'      // js. css
'grunt-contrib-copy'        // js, css, html, assets
'grunt-contrib-clean'
'grunt-contrib-uglify'      // js

```
## TODO

 * LESS tasks
