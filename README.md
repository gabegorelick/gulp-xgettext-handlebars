# [gulp](http://gulpjs.com)-xgettext-handlebars

> Extract translatable strings using [xgettext-handlebars](https://www.npmjs.com/package/xgettext-handlebars)

## WARNING
**This code is unstable and going through a major rewrite.**

## Install

Install with [npm](https://npmjs.org/package/gulp-xgettext-handlebars)

```sh
npm install --save-dev gulp-xgettext-handlebars
```

## Example

```js
var gulp = require('gulp');
var gettext = require('gulp-xgettext-handlebars');

gulp.task('pot', function () {
    return gulp.src(['src/templates/**/*.hbs'])
        .pipe(gettext({
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest('po/'));
});
```

## API

None yet
