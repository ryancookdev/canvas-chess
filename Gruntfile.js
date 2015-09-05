module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            beforeconcat: ['src/js/**'],
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/',
                        src: '**',
                        flatten: true,
                        dest: 'dist/temp/'
                    },
                    {
                        expand: true,
                        src: 'img/**',
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'src/css/',
                        src: '**',
                        flatten: true,
                        dest: 'dist/temp/'
                    }
                ]
            }
        },
        concat: {
            options: {
                separator: ';\n'
            },
            canvasChess: {
                src: [
                    'dist/temp/canvaschess.js',
                    'dist/temp/assert.js',
                    'dist/temp/nags.js',
                    'dist/temp/square.js',
                    'dist/temp/move.js',
                    'dist/temp/piece.js',
                    'dist/temp/position.js',
                    'dist/temp/util.js',
                    'dist/temp/engine.js',
                    'dist/temp/board.js',
                    'dist/temp/amd.js'
                ],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            pgnViewer: {
                src: ['dist/temp/pgnviewer.js'],
                dest: 'dist/pgnviewer-<%= pkg.version %>.js'
            },
            css: {
                src: ['dist/temp/pgn.css'],
                dest: 'dist/pgn.css'
            }
        },
        uglify: {
            main: {
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
                    'dist/pgnviewer-<%= pkg.version %>.min.js': ['dist/pgnviewer-<%= pkg.version %>.js']
                }
            }
        },
        cssmin: {
            main: {
                src: 'dist/pgn.css',
                dest: 'dist/pgn.min.css'
            }
        },
        clean: {
            main: ['dist/temp/']
        },
        compress: {
            main: {
                options: {
                    archive: '<%= pkg.name %>.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: '**',
                        dest: '<%= pkg.name %>'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('deploy-dev', ['copy', 'concat', 'clean']);
    grunt.registerTask('deploy', ['concat', 'uglify', 'cssmin', 'clean', 'copy', 'compress']);
};
