'use strict';

var xgettext = require('..');
var File = require('gulp-util').File;
var path = require('path');
var PO = require('pofile');
require('should');

describe('gulp-xgettext-handlebars', function () {

  it("shouldn't blow up", function (done) {
    var stream = xgettext();
    stream.on('error', done);
    stream.on('data', function (file) {
      path.basename(file.path).should.equal('messages.pot');
      var catalog = PO.parse(file.contents.toString());

      catalog.items.length.should.equal(1);
      catalog.items[0].msgid.should.equal('Hi');

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

  it('should combine strings from multiple files', function (done) {
    var stream = xgettext();
    stream.on('error', done);
    stream.on('data', function (file) {
      var catalog = PO.parse(file.contents.toString());

      catalog.items.length.should.equal(2);
      catalog.items[0].msgid.should.equal('Bye');
      catalog.items[1].msgid.should.equal('Hi');

      done();
    });

    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'foo.hbs'),
      contents: new Buffer('{{_ "Hi"}}')
    }));
    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'bar.hbs'),
      contents: new Buffer('{{_ "Bye"}}')
    }));
    stream.end();
  });

  it('should emit one file per domain', function (done) {
    var stream = xgettext();
    stream.on('error', done);
    stream.once('data', function (file) {
      path.basename(file.path).should.equal('domain1.pot');
      var catalog = PO.parse(file.contents.toString());

      catalog.items.length.should.equal(1);
      catalog.items[0].msgid.should.equal('Hi');

      stream.once('data', function (file) {
        path.basename(file.path).should.equal('domain2.pot');
        var catalog = PO.parse(file.contents.toString());

        catalog.items.length.should.equal(1);
        catalog.items[0].msgid.should.equal('Bye');

        done();
      });
    });

    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'foo.hbs'),
      contents: new Buffer('{{d_ "domain1" "Hi"}}')
    }));
    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'bar.hbs'),
      contents: new Buffer('{{d_ "domain2" "Bye"}}')
    }));
    stream.end();
  });
});
