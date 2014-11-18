var path = require('path');
module.exports = function(grunt) {

  var config = {
    copy: {
      src: {
        files: [{
          expand: true,
          src: [
            '*.html',
            'package.json',
            'vendor/**/*',
            'favicon.ico',
            'sound.mp3',
            'sound.ogg',
            'chatc.js'
          ],
          dest: 'dist/'
        }]
      }
    },
    useminPrepare: {
          html: 'index.html',
          options: {
                    flow: {
                      html: {
                          steps: {
                            js: ['concat', 'uglifyjs'],
                              css: [
                                  'concat',
                                  {
                                    name: 'autoprefixer',
                                    createConfig: function (context, block) {
                                        context.outFiles = [block.dest];
                                        return {
                                          options: {
                                              browsers: ['last 2 versions', 'ie 8', 'ie 9']
                                            },
                                            files: [{
                                                src: path.join(context.inDir, block.dest),
                                                dest: path.join(context.outDir, block.dest)
                                            }]
                                        };
                                    }
                                },
                                'cssmin'
                              ]
                          },
                          post: {}
                      }
                  }
              }
          },
    usemin: {
        html: 'dist/index.html'
    },
  htmlmin: {
        dist: {
          options: {
            removeComments: true,
            collapseWhitespace: true
          },
          files: {
            'dist/index.html': 'dist/index.html'
          }
      }
  }
};

  grunt.initConfig(config);

  // Load all Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['copy', 'useminPrepare', 'concat', 'autoprefixer', 'cssmin', 'uglify', 'usemin', 'htmlmin']);
};
