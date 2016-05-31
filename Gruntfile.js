/* jshint node:true */

module.exports = function(grunt) {
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // uglify js
        uglify: {
            js: {
                files: {
                    'lib/<%= pkg.name %>.min.js': [ 'lib/<%= pkg.name %>.js' ]
                }
            }
        },
        
        less: {
            development: {
                options: {
                    paths: ['']
                },
                plugins: [
                    new (require('less-plugin-autoprefix'))({
                        browsers: ["last 2 versions"]
                    })
                ],
                files: [
                    {
                        src: ['lib/*.less', '!{fonts, variable, mixins}*.less'],
                        dest: 'lib/<%= pkg.name %>.css',
                    },
                    {
                        src: ['page/**.less', '!{fonts, variable, mixins}*.less'],
                        dest: 'page/page.css',
                    }
                ]
            }
        },
        
        // copy files
        copy: {
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
            }
        },
        
        // jshint: specify your preferred options in 'globals'
        // http://jshint.com/docs/options/
        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js', '!lib/**/*.min.js', 'page/**/*.js', '!page/vendor/**', 'test/**/*.js'],
            options: {
                jshintrc: true
            }
        },

        // configure watch task
        watch: {
            files: ['<%= jshint.files %>', 'lib/*.less', 'page/**/*.less', '*.html'],
            tasks: [
                'jshint', 
                'less', 
                'uglify'
            ]
        },
        
        // jasmine 
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['lib/Space/test/**/*.js']
            }
        }
        
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
    
    // custom tasks (mind the order of your tasks!), just comment out what you don't need
    grunt.registerTask(
        'default',
        'Compiles all of the assets and copies the files to the build directory.', [
            'jshint',
            'mochaTest',
            'less',
            'uglify',
            'copy'
        ]
    );

}; // end module.exports
