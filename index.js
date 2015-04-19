'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var Parser = require('xgettext-handlebars');

var pluginName = require('./package.json').name;

module.exports = function (config) {
  var emitStreamingError = function () {
    this.emit('error', new gutil.PluginError(pluginName, 'Streaming not supported'));
  }.bind(this);

  var parser = new Parser(config);

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      emitStreamingError();
      return cb();
    }

    file.contents = new Buffer(JSON.stringify(parser.parse(file.contents.toString())));

    this.push(file);

    return cb();
  });
};
