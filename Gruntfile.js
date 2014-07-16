/*global module:false*/
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        config: {
            dir: './',
            prj1: './1_flickr_backbone/app',
            prj2: './2_flickr_AngularJS/app',
            prj3: './3_commentform/app',
            prj4: './4_parse_commentform/app'
        },
        watch: {
            js: {
                files: [
                    '<%= config.prj1 %>/scripts/{,*/}*.js',
                    '<%= config.prj2 %>/scripts/{,*/}*.js',
                    '<%= config.prj3 %>/scripts/{,*/}*.js',
                    '<%= config.prj4 %>/scripts/{,*/}*.js'
                ],
                tasks: ['jshint'],
            },
            sass: {
                files: [
                    '<%= config.prj1 %>/sass/{,*/}*.{scss,sass}',
                    '<%= config.prj2 %>/sass/{,*/}*.{scss,sass}',
                    '<%= config.prj3 %>/sass/{,*/}*.{scss,sass}',
                    '<%= config.prj4 %>/sass/{,*/}*.{scss,sass}'
                ],
                tasks: ['newer:sass']
            }
        },
        bowerInstall: {
            app: {
                src: [
                    '<%= config.prj1 %>/*.html',
                    '<%= config.prj2 %>/*.html',
                    '<%= config.prj3 %>/*.html',
                    '<%= config.prj4 %>/*.html'
                ],
                ignorePath: [
                    '<%= config.prj1 %>/',
                    '<%= config.prj2 %>/',
                    '<%= config.prj3 %>/',
                    '<%= config.prj4 %>/'
                ]
                // ,
                // exclude: [
                //     '<%= config.prj4 %>/bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap.js'
                // ]
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            app: {
                options: {
                    open: true,
                    base: '<%= config.dir %>'
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: true,
                eqnull: true,
                browser: true,
                strict: false,
                laxbreak: true,
                devel: true,
                globals: {
                    jQuery: true,
                    require: true
                },
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.prj1 %>/scripts/{,*/}*.js',
                '<%= config.prj2 %>/scripts/{,*/}*.js',
                '<%= config.prj3 %>/scripts/{,*/}*.js',
                '<%= config.prj4 %>/scripts/{,*/}*.js',
                '!<%= config.prj1 %>/scripts/main.js',
                '!<%= config.prj2 %>/scripts/main.js',
                '!<%= config.prj3 %>/scripts/main.js',
                '!<%= config.prj4 %>/scripts/main.js',
                '!<%= config.prj1 %>/scripts/vendor/*',
                '!<%= config.prj2 %>/scripts/vendor/*',
                '!<%= config.prj3 %>/scripts/vendor/*',
                '!<%= config.prj4 %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        sass: {
            app: {
                options: {
                    style: 'expanded',
                    sourcemap: true
                },
                files: {
                    '<%= config.prj1 %>/styles/main.css': '<%= config.prj1 %>/sass/main.scss',
                    '<%= config.prj2 %>/styles/main.css': '<%= config.prj2 %>/sass/main.scss',
                    '<%= config.prj3 %>/styles/main.css': '<%= config.prj3 %>/sass/main.scss',
                    '<%= config.prj4 %>/styles/main.css': '<%= config.prj4 %>/sass/main.scss'
                }
            }
        }
    });

    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'bowerInstall',
            'watch'
        ]);
    });
    
    grunt.registerTask('build', [
        'bowerInstall',
        'sass'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'build'
    ]);
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default',['sass', 'watch', 'connect']);
};
