var BASE = function (p) {
  return p;//path.join(BASE_DIR, p);
};

var path = require('path');
var SRC_DIR = BASE('src');
var DST_DIR = BASE('build');
//var BASE_DIR = __dirname + './../';

var SRC = function (p) {
  return path.join(SRC_DIR, p);
};

var DST = function (p) {
  return path.join(DST_DIR, p);
};

module.exports = {
  DST_DIR:DST_DIR,
  SRC_DIR:SRC_DIR,
  vendor : {
    dst : {
      scripts : DST('vendor/scripts/'),
      css :  DST('vendor/css/'),
      images : DST('vendor/images/'),
      fonts : DST('vendor/fonts/'),
      staticFiles : DST('vendor/static/'),
      name :{
        scripts : 'vendor.js',
        minScripts : 'vendor.min.js',
        css : 'vendor.css',
        minCss : 'vendor.min.css',
      }
    }
  },
  typescript:{
    src : SRC('typescript/*.ts'),
    main : SRC('typescript/build.ts'),
    test: SRC('typescript/spec/test.ts'),
    name : 'build.js',
    minName : 'build.min.js',
    testName : 'test.js',
    dst : DST('scripts'),
    dstTest: DST('scripts/spec'),
  },
  less : {
    src : SRC('less/*.less'),
    main : SRC('less/build.less'),
    name : 'build.css',
    minName : 'build.min.css',
    dst : DST('styles')
  },
  html : {
    src :SRC('html/*.html'),
    dst :DST_DIR
  },
  css : {
    src :SRC('css/*.css'),
    dst :DST('css')
  },
  js : {
    src :SRC('js/*.*'),
    dst :DST('js')
  },
  images :{
    src :SRC('images/**/*.*'),
    dst :DST('images')
  },
  sounds :{
    src :SRC('sounds/**/*.*'),
    dst :DST('sounds')
  },
  clean : {
    src : DST_DIR
  },
  nw: {
    version: "latest",
    files: "./nwapp/**",
    macIcns: "./nwapp/icons/icon.icns",
    platforms: ["win", "osx"],
    buildType: "version",
    winIco: "./nwapp/icons/icon.ico"
  }
};