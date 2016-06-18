/* jshint node:true */

var postcssProcessors = [
    require('autoprefixer')({
        browsers: ['last 2 versions','iOS 7']
    })
];

module.exports = function(grunt) {
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // uglify js
        uglify: {
            js: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [ 'src/lib/<%= pkg.name %>.js' ]
                }
            }
        },
        
        less: {
            development: {
                options: {
                    paths: ['']
                },
                files: [
                    {
                        src: ['src/lib/*.less', '!{fonts, variable, mixins}*.less'],
                        dest: 'dist/<%= pkg.name %>.css',
                    },
                    {
                        src: ['src/page/**.less', '!{fonts, variable, mixins}*.less'],
                        dest: 'page/page.css',
                    }
                ]
            }
        },
        
        // copy files
        copy: {
            lib: {
                expand: true,
                cwd: 'src/lib/',
                src: [
                    '*.js',
                    '*.css',
                    '*.less'
                ],
                dest: 'dist/'
            },
            page: {
                expand: true,
                cwd: 'src/page/',
                src: [
                    '*.js',
                    '*.css'
                ],
                dest: 'page/'
            },
            fontawesome: {
                expand: true,
                cwd: 'bower_components/fontawesome/',
                src: [
                    'css/font-awesome.min.css',
                    'fonts/*.*'
                ],
                dest: 'page/vendor/fontawesome/'
            },
            pure: {
                expand: true,
                cwd: 'bower_components/pure/',
                src: [
                    'pure-min.css',
                    'grids-responsive-min.css',
                ],
                dest: 'page/vendor/pure/'
            },
            vendors: {
                expand: true,
                cwd: 'src/page/',
                src: 'vendor/*.js',
                dest: 'page/'
            }
        },
        
        // jshint: specify your preferred options in 'globals'
        // http://jshint.com/docs/options/
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', '!src/page/vendor/*.js'],
            options: {
                jshintrc: true
            }
        },

        // jasmine 
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['src/lib/**/test/**/*.js']
            }
        },
        
        // postcss
        postcss: {
            dist: {
                options: {
                    processors: postcssProcessors
                },
                src: 'dist/*.css'
            },
            page: {
                options: {
                    processors: postcssProcessors
                },
                src: 'page/*.css'
            }
        },

        // configure watch task
        watch: {
            files: ['<%= jshint.files %>', 'src/**/*.less', '*.html'],
            tasks: [
                'jshint', 
                'less', 
                'uglify',
                'copy',
                'postcss'
            ]
        },
    }); // end grunt.initConfig

    ////
    // grunt tasks
    ////

    // requirements
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-postcss');
    
    // custom tasks (mind the order of your tasks!), just comment out what you don't need
    grunt.registerTask(
        'default',
        'Compiles all of the assets and copies the files to the build directory.', [
            'jshint',
            'mochaTest',
            'less',
            'uglify',
            'copy',
            'postcss'
        ]
    );

}; // end module.exports
