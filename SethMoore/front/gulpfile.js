'use strict';

let gulp = require('gulp');
let webpack = require('gulp-webpack');

gulp.task('bundle:test', function() {
  return gulp.src('./test/unit/unit-test.js')
    .pipe(webpack({output: {filename: 'test_bundle.js'}}))
    .pipe(gulp.dest('test/unit/'));
});
