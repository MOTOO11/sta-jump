# Load all required libraries.
gulp = require 'gulp'
del = require 'del'
config = require('./gulp-config.js').less
runSequence = require 'run-sequence'
gulploadplugins = require 'gulp-load-plugins'
$ = gulploadplugins()

gulp.task 'git:gh-pages', ->
  gulp.src config.DST_DIR
    .pipe $.plumber()
    .pipe ghPages()