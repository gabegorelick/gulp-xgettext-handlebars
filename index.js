'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var xgettext = require('xgettext-handlebars');
var Catalog = require('gettext-catalog');
var assign = require('object-assign');

module.exports = function (options) {
  var catalog = new Catalog();

  var firstFile = null;

  var finish = function (cb) {
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

    cb();
  };

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-xgettext-handlebars', 'Streaming not supported'));
    }

    if (!firstFile) {
      firstFile = file;
    }

    var messages = xgettext(file.contents.toString(), assign({
      filename: path.relative(file.cwd, file.path)
    }, options));
    catalog.addMessages(messages);

    return cb();
  }, finish);
};
