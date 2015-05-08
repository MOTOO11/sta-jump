gulp = require 'gulp'
del = require 'del'
requireDir = require 'require-dir'
dir        = requireDir './gulp-tasks'
config = require('./gulp-tasks/gulp-config.js')
gulploadplugins = require 'gulp-load-plugins'
$ = gulploadplugins()
runSequence = require 'run-sequence'

gulp.task 'clean', ->
  del [config.clean.src] , (err) ->
    if err
      $.util.log err
    else
      $.util.log "clean build directory."

gulp.task 'webserver',->
  gulp.src('build')
    .pipe $.webserver({livereload:true,open:true})

gulp.task 'init',['bower:init', 'ts','less','static']

gulp.task 'default',['watch','webserver']

gulp.task 'build',['ts','less','static','html','css','js','images','sounds']

gulp.task 'watch', ()->
#  runSequence ['ts','less','static'],'webserver'
  runSequence ['ts','less','static']
  gulp.watch config.typescript.src, ['ts']
  gulp.watch config.less.src, ['less']
  gulp.watch config.html.src, ['html']
  gulp.watch config.css.src, ['css']
  gulp.watch config.js.src, ['js']
  gulp.watch config.images.src, ['images']
  gulp.watch config.sounds.src, ['sounds']

gulp.task 'watch:ts', ['webserver'] ,->
  gulp.watch './src/ts/*.ts', ['ts']

gulp.task 'deploy', ->
  gulp.src config.DST_DIR + '/**/*'
  .pipe $.ghPages()