# Load all required libraries.
gulp = require 'gulp'
del = require 'del'
bower_files = require 'main-bower-files'
runSequence = require 'run-sequence'
NwBuilder = require "node-webkit-builder"
gulploadplugins = require 'gulp-load-plugins'
$ = gulploadplugins()
config = require('./gulp-config.js').nw

gulp.task "nw", ->
  nw = new NwBuilder(
    version: config.version
    files: config.files
    #macIcns: './icons/icon.icns',
    buildType : config.buildType
    platforms: config.platforms
  )
  # Log stuff you want
  nw.on "log", (msg) ->
    $.util.log "node-webkit-builder", msg
  nw.build().catch (err) ->
    $.util.log 'node-webkit-builder', err
