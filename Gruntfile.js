module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> v<%= pkg.version %> | (c) 2014 Hector Quintero Casanova | Released under <%= pkg.license.type %> License */\n',
    // Task configuration.
    jshint: {
      src: ['Gruntfile.js', '<%= pkg.name %>.js'],
      options: {
	jshintrc: true
      }
    },
    watch: {
      files: ['Gruntfile.js', '<%= pkg.name %>.js'],
      tasks: 'default'
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
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