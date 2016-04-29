'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');

const sources = {
  html: __dirname + '/app/**/*.html',
  js: __dirname + '/app/app.js',
  test: __dirname + '/test/app_spec.js',
  css: __dirname +'/app/sass/**/*.scss'
};

gulp.task('sass', function () {
  return gulp.src('./app/sass/core.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./app/sass/**/*.scss', ['sass']);
});

gulp.task('bundle:dev', () => {
  return gulp.src(sources.js)
  .pipe(webpack({output: {filename: 'bundle.js'}, watch: true}))
  .pipe(gulp.dest('./build'));
});

gulp.task('copy-html', () => {
  return gulp.src(sources.html)
    .pipe(gulp.dest('./build'));
});

gulp.task('bundle:test', () => {
  return gulp.src(sources.test)
    .pipe(webpack({output: {filename: 'test_bundle.js'}, watch: true}))
    .pipe(gulp.dest('./test'));
});

gulp.task('default', ['bundle:dev', 'copy-html', 'sass', 'sass:watch']);
