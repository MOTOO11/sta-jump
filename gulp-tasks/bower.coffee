# Load all required libraries.
gulp = require 'gulp'
del = require 'del'
bower = require 'bower'
config = require('./gulp-config.js').vendor
gulploadplugins = require 'gulp-load-plugins'
$ = gulploadplugins()
bower_files = require 'main-bower-files'

# Copy fonts using streams.
load_components = ()->
  vendor_js()
  vendor_css()
  vendor_other()
  vendor_fonts()

vendor_js = ->
  $.util.log 'Loading vendor javascript files.'
  filter = $.filter '*.js'
  gulp.src bower_files()
    .pipe $.plumber()
    .pipe filter
    .pipe $.concat config.dst.name.scripts
    .pipe gulp.dest config.dst.scripts
    .pipe $.rename config.dst.name.minScripts
    .pipe $.uglify({preserveComments : 'all'} )
    .pipe gulp.dest config.dst.scripts

vendor_css = ->
  $.util.log 'Loading vendor css files.'
  filter = $.filter '*.css'
  gulp.src bower_files()
    .pipe $.plumber()
    .pipe filter
    .pipe $.concat config.dst.name.css
    .pipe gulp.dest config.dst.css
    .pipe $.rename config.dst.name.minCss
    .pipe $.minifyCss({keepBreaks: false} )
    .pipe gulp.dest config.dst.css

vendor_fonts = ->
  $.util.log 'Loading fonts.'
  filter = $.filter ['*.eot','*.svg','*.ttf','*.woff']
  gulp.src bower_files()
    .pipe filter
    .pipe gulp.dest config.dst.fonts

vendor_other = ->
  $.util.log 'Loading another vendor files.'
  filter = $.filter ['*','!*.css','!*.js','!*.less',
  '!*.eot','!*.svg','!*.ttf','!*.woff']
  gulp.src bower_files()
    .pipe filter
    .pipe gulp.dest config.dst.staticFiles

gulp.task 'bower:init', ->
  bower.commands.install().on 'end', (r) -> load_components()

gulp.task 'bower:update', ->
  bower.commands.update().on 'end', (r) -> load_components()
