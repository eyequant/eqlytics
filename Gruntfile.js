module.exports = function(grunt) {

  grunt.initConfig({
    pkg: {name: 'eqlytics'},

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },

      build: {
        src: 'lib/eqlytics.js',
        dest: 'dist/eqlytics.min.js'
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['uglify', 'karma']);
};
