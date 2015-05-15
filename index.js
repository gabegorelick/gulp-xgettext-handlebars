'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var Parser = require('xgettext-handlebars');
var Catalog = require('gettext-catalog');

var pluginName = require('./package.json').name;

module.exports = function (config) {
  var emitStreamingError = function () {
    this.emit('error', new gutil.PluginError(pluginName, 'Streaming not supported'));
  }.bind(this);

  var parser = new Parser(config);
  var catalog = new Catalog();

  var firstFile = null;

  var finish = function () {
    var pos = catalog.toPOs();
    pos.forEach(function (po) {
      this.push(new gutil.File({
        // if you don't want to use the first file for the base directory, you can use gulp-rename to change it
        cwd: firstFile.cwd,
        base: firstFile.base,
        path: path.join(firstFile.base, po.domain + '.pot'),
        contents: new Buffer(po.toString())
      }));
    }.bind(this));
  };

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      emitStreamingError();
      return cb();
    }

    if (!firstFile) {
      firstFile = file;
    }

    var strings = parser.parse(file.contents.toString(), {
      filename: path.relative(file.cwd, file.path)
    });
    catalog.addStrings(strings);

    return cb();
  }, finish);
};
