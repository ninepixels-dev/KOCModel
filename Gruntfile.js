module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            options: {
                paths: 'production/assets/styles',
                compress: true
            },
            app: {
                files: {
                    '.tmp/style.min.css': ['public_html/**/*.less']
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: true,
                sourceMapName: 'production/assets/styles/app.min.map',
                report: 'gzip'
            },
            app: {
                files: {
                    'production/assets/styles/app.min.css': [
                        'public_html/assets/styles/**/*.css',
                        '.tmp/**/*.css'
                    ]
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            app: {
                files: {
                    'production/assets/scripts/vendor.min.js': [
                        'public_html/assets/js/vendor.min.js',
                        'public_html/assets/js/app.min.js',
                        'public_html/assets/js/main.min.js',
                        'public_html/assets/scripts/**/*.js'
                    ]
                }
            }
        },
        copy: {
            app: {
                files: [
                    {expand: true, src: ['public_html/*'], dest: 'production/', flatten: true},
                    {expand: true, src: ['public_html/data/*'], dest: 'production/data/', flatten: true},
                    {expand: true, src: ['public_html/workbooks/*'], dest: 'production/workbooks/', flatten: true},
                    {expand: true, src: ['public_html/workbooks/templates/*'], dest: 'production/workbooks/templates/', flatten: true},
                    {expand: true, src: ['public_html/assets/scripts/**/*.html'], dest: 'production/assets/templates/', flatten: true},
                    {expand: true, src: ['public_html/assets/fonts/*'], dest: 'production/assets/fonts/', flatten: true}
                ]
            }
        },
        clean: {
            app: {
                src: ["production", ".tmp"]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            less: {
                files: 'public_html/**/*.less',
                tasks: ['less', 'cssmin']
            },
            scripts: {
                files: ['public_html/**/*.js'],
                tasks: 'uglify:app'
            },
            copy: {
                files: ['public_html/*', 'public_html/data/*', 'public_html/workbooks/*', 'public_html/assets/**/*.html'],
                tasks: 'copy'
            }
        }
    });

    grunt.registerTask('build', [
        'clean',
        'less',
        'cssmin',
        'uglify',
        'copy',
        'watch'
    ]);

    require('load-grunt-tasks')(grunt);
};
