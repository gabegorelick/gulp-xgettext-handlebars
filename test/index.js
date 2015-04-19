'use strict';

var xgettext = require('..');
var File = require('gulp-util').File;
var path = require('path');
require('should');

describe('gulp-xgettext-handlebars', function () {
  // TODO add more tests

  it("shouldn't blow up", function (done) {
    var stream = xgettext();
    stream.on('error', done);
    stream.on('data', function (file) {
      var messages = JSON.parse(file.contents);

      Object.keys(messages).length.should.equal(1);
      messages.Hi.msgid.should.equal('Hi');

      done();
    });

    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'foo.hbs'),
      contents: new Buffer('{{_ "Hi"}}')
    }));
    stream.end();
  });
});
