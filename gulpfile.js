/* global require, jshint node: true, esnext: true */

/* GULP CONFIGURATION
============================== */
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      pug = require('gulp-pug'),
      rename = require('gulp-rename'),
      plumber = require('gulp-plumber'),
      autoprefixer = require('gulp-autoprefixer'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      sourcemaps = require('gulp-sourcemaps'),
      data = require('gulp-data'),
      spritesmith = require('gulp.spritesmith'),
      rimraf = require('rimraf'),
      fs = require('fs'),
      browserSync = require('browser-sync').create();

/* Plumber error message
 ******************************/
const plumberLog = function(error) {
  console.log([
    '',
    '----------ERROR MESSAGE START----------',
    ('[' + error.name + ' in ' + error.plugin + ']'),
    error.message,
    '----------ERROR MESSAGE END----------',
    ''
  ].join('\n'));
  this.end();
};

/* Server
 ******************************/
gulp.task('server', function () {
  browserSync.init({
    server: {
      port: 3000,
      baseDir: './build'
    },
    notify: false
  });

  gulp.watch('./build/**/*').on('change', browserSync.reload);
});

/* Pug compile
 ******************************/
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('./source/template/index.pug')
    .pipe(plumber())
    .pipe(data(function() {
      return JSON.parse(
        fs.readFileSync('./source/js/titles.json')
      );
    }))
    .pipe(pug({
      pretty: true
    })).on('error', plumberLog)
    .pipe(gulp.dest('./build'));
});

/* Styles compile
******************************/
gulp.task('styles:compile', function () {
  return gulp.src('./source/styles/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 1%', 'ie 8', 'ie 7'],
      cascade: false
    }))
    .pipe(sass({
      outputStyle: 'compressed' //'expanded'
    })).on('error', plumberLog)
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'));
});

/* Scripts
******************************/
gulp.task('scripts', function () {
  return gulp.src([
      './source/js/form.js',
      './source/js/navigation.js',
      './source/js/main.js'
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify()).on('error', plumberLog)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/js'));
});

/* PNG sprite
******************************/
gulp.task('pngSprite', function(cb) {
  const spriteData = gulp.src('./source/images/icons/*.png')
    .pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss',
    padding: 10,
    algorithm: 'top-down'
  }));

  spriteData.img.pipe(gulp.dest('./build/images'));
  spriteData.css.pipe(gulp.dest('./source/styles/global'));
  cb();
});

/* Delete
******************************/
gulp.task('clean', function del(cb) {
  return rimraf('./build', cb);
});

/* Copy fonts
******************************/
gulp.task('copy:fonts', function () {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('./build/fonts'));
});

/* Copy images
******************************/
gulp.task('copy:images', function () {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('./build/images'));
});

/* Copy
******************************/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* Watchers
******************************/
gulp.task('watch', function () {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('source/js/**/*.js', gulp.series('scripts'));
});

/* Default
******************************/
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'scripts', 'pngSprite', 'copy'),
  gulp.parallel('watch', 'server')
  )
);