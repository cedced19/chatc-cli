module.exports = function(grunt) {

  var config = {
    copy: {
      src: {
        files: [{
          expand: true,
          src: [
            'node_modules/MD5/**/*',
            'node_modules/socket.io/**/*',
            'node_modules/fast-http/**/*',
            '*.html',
            'package.json',
            'sound.mp3',
            'sound.ogg',
            '.gitignore',
            'font/**.*',
            'js/*.js',
            'css/*.css',
            'favicon.ico',
            'server.js'
          ],
          dest: 'dist/'
        }]
      }
    },
    useminPrepare: {
          html: 'index.html'
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
  grunt.registerTask('default', ['copy', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin', 'htmlmin']);
};
