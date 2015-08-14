module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [
                    'src/canvaschess.js',
                    'src/nags.js',
                    'src/util.js',
                    'src/board.js',
                    'src/amd.js'
                ],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
                    'dist/pgnviewer-<%= pkg.version %>.min.js': ['src/pgnviewer.js']
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'dist/pgn.min.css': ['src/css/pgn.css']
                }
            }
        },
        clean: {
            js: ['dist/*.js', '!dist/*.min.js']
        },
        compress: {
            main: {
                options: {
                    archive: '<%= pkg.name %>.zip'
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['**'], dest: '<%= pkg.name %>'}
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'clean', 'compress']);
};
