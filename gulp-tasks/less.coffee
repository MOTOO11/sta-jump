# Load all required libraries.
gulp = require 'gulp'
del = require 'del'
config = require('./gulp-config.js').less
runSequence = require 'run-sequence'
gulploadplugins = require 'gulp-load-plugins'
$ = gulploadplugins()

gulp.task 'less', ->
  runSequence 'less:build','less:minify'

gulp.task 'less:clean', ->
  del config.dst,()->
    $.util.log 'less cleanup.'

gulp.task 'less:build', ->
  gulp.src config.main
    .pipe $.plumber()
    .pipe $.lessSourcemap()
    .on 'error' , (err) ->
      $.util.log err.message
    # .pipe $.autoprefixer('last 1 version')
    .pipe gulp.dest config.dst


gulp.task 'less:minify', ->
  gulp.src config.dst + '/' + config.name
    .pipe $.plumber()
    .pipe $.rename config.minName
    .pipe $.minifyCss()
    .pipe gulp.dest config.dst
