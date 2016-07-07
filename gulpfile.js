var gulp = require('gulp'),
    sass = require('gulp-sass'),
    typescript = require('gulp-tsc'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    runseq = require('run-sequence');


gulp.task('compile' , function(){
  return gulp.src(['src/**/*.ts'])
    .pipe(typescript())
    .pipe(gulp.dest('src/'))
});

gulp.task('markup', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'Markup copied' }));
})

gulp.task('bower', function () {
  return gulp.src(['bower_components/**/*.js','!bower_components/**/*.min.js'])
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/libs'));
})

gulp.task('scripts', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('clean', function() {
  return del(['dist',]);
});



gulp.task('ts:watch', function () { 
  return gulp.watch('src/**/*.ts', ['compile']);
});
gulp.task('js:watch', function () { 
  return gulp.watch('src/**/*.js', ['scripts']);
});
gulp.task('html:watch', function () { 
  return gulp.watch('src/**/*.html', ['markup']);
});

gulp.task('serve', function() {
  return gulp.src('dist')
    .pipe(webserver({ host: '127.0.0.1',port:8001, livereload: true, open: true }));
});

gulp.task('images',function(){
  return gulp.src(['textures/**/*.jpg','textures/**/*.png','textures/**/*.gif'])
  .pipe(gulp.dest('dist/img'));
});

gulp.task('fullbuild', function (callback) {
  runseq('clean', ['compile','ts:watch','images', 'bower','scripts','js:watch','markup','html:watch'],callback)
});

gulp.task('default',['fullbuild'], function () {
  gulp.start('serve');
});