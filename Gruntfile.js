module.exports = function(grunt) {

  var config = {
    uglify: {
      my_target: {
        files: {
          'js/scripts.js': ['js/jquery.min.js', 'js/mustache.js', 'js/client.js']
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!styles.css'],
        dest: 'css/',
        ext: 's.css'
      }
    },
    usemin: {
      html: 'index.html',
    }
  };

  grunt.initConfig(config);

  // Load all Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['uglify', 'cssmin', 'usemin']);
};
