module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! picoSlides v<%= pkg.version %> | (c) 2014 Hector Quintero Casanova | Released under <%= pkg.license.type %> License */\n',
    // Task configuration.
    jshint: {
      src: ['Gruntfile.js', 'picoSlides.js'],
      options: {
	jshintrc: true
      }
    },
    watch: {
      files: ['Gruntfile.js', 'picoSlides.js'],
      tasks: 'default'
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'picoSlides.js',
        dest: 'picoSlides.min.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'uglify']);
};