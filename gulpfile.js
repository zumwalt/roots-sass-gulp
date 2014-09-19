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
    del = require('del'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// Set the address of your local WordPress installation.
var localhost = "yourlocal.dev";

// Destinations
var destination = {
  css: 'assets/css',
  scripts: 'assets/js',
  images: 'assets/img',
  modernizr: 'assets/vendor/modernizr',
  vendor: 'assets/js/vendor'
};

// Paths
var paths = {
  scripts: [
    'assets/js/_main.js' // Primary script
  ],
  scss: [
    'assets/scss/main.scss'
  ]
};

// Styles
gulp.task('styles', function() {
  return gulp.src(paths.scss)
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(destination.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(destination.css))
    .pipe(reload({stream:true}))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(destination.scripts))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(destination.scripts))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('assets/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(destination.images))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
    del(['assets/css/*.min.css', 'assets/js/*.min.js'], cb)
});

// Browser Sync
gulp.task('browser-sync', function() {
    browserSync({
        proxy: localhost
    });
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', ['browser-sync'], function() {

  // Watch .scss files
  gulp.watch('assets/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('assets/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('assets/img/**/*', ['images']);

  // Watch any files in assets/, reload on change
  gulp.watch(['assets/**']).on('change', browserSync.reload);

});