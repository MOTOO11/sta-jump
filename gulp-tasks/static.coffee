# Load all required libraries.
gulp = require 'gulp'
del = require 'del'
config = require('./gulp-config.js')
runSequence = require 'run-sequence'
gulploadplugins = require 'gulp-load-plugins'
$ = gulploadplugins()

gulp.task 'static',['html','css','js','images','sounds']

gulp.task 'html', ->
  gulp.src config.html.src
    .pipe gulp.dest config.html.dst

gulp.task 'css', ->
  gulp.src config.css.src
    .pipe gulp.dest config.css.dst

gulp.task 'js', ->
  gulp.src config.js.src
    .pipe gulp.dest config.js.dst

gulp.task 'images', ->
  gulp.src config.images.src
    .pipe gulp.dest config.images.dst

gulp.task 'sounds', ->
  gulp.src config.sounds.src
    .pipe gulp.dest config.sounds.dst