# Load all required libraries.
gulp = require 'gulp'
del = require 'del'
config = require('./gulp-config.js').typescript
runSequence = require 'run-sequence'
gulploadplugins = require 'gulp-load-plugins'
$ = gulploadplugins()

gulp.task 'ts', ->
  runSequence 'ts:src:build',['ts:lint']

gulp.task 'ts:clean', ->
  del config.dst,()->
    $.util.log 'typescript cleanup.'

gulp.task 'ts:src:build', ->
  gulp.src config.main
    .pipe $.plumber()
    .pipe $.tsc(out:config.name,sourcemap:true,removeComments:true)
    .pipe gulp.dest config.dst

gulp.task 'ts:minify', ->
  gulp.src (config.dst +'/'+ config.name)
    .pipe $.plumber()
    .pipe $.rename config.minName
    .pipe $.uglify({preserveComments : 'all'} )
    .pipe gulp.dest config.dst

gulp.task 'ts:lint', ->
  gulp.src config.src
    .pipe $.plumber()
    .pipe $.cached 'tslint'
    .pipe $.tslint()
    .pipe $.tslint.report('verbose',{emitError:false})

gulp.task 'ts:test:build', ->
  gulp.src config.test
    .pipe $.plumber({errorHandler: $.notify.onError('<%= error.message %>')})
    .pipe $.tsc(out:config.testName,sourcemap:true)
    .pipe gulp.dest config.dstTest
