// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Styles
gulp.task('styles', function() {
  return gulp.src('assets/scss/main.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('assets/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('assets/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
    del(['assets/css', 'assets/js', 'assets/img'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('assets/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('assets/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('assets/img/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in assets/, reload on change
  gulp.watch(['assets/**']).on('change', livereload.changed);

});