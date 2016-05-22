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
        
        // jshint: specify your preferred options in 'globals'
        // http://jshint.com/docs/options/
        jshint: {
            files: ['Gruntfile.js', 'lib/<%= pkg.name %>.js', 'page/**/*.js', '!page/vendor/**'],
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

    // custom tasks (mind the order of your tasks!), just comment out what you don't need
    grunt.registerTask(
        'default',
        'Compiles all of the assets and copies the files to the build directory.', [
            'jshint',
            'less',
            'uglify'
        ]
    );

}; // end module.exports
