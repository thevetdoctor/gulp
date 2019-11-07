const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
// const runSequence = require('run-sequence');


gulp.task('processHTML', (done) => {
    gulp.src('*.html')
      .pipe(gulp.dest('dist'));
      done();
  });

  gulp.task('processStatic', (done) => {
    gulp.src('./images/*.svg')
      .pipe(gulp.dest('dist/images'));
      done();
  });

  
gulp.task('babelPolyfill', (done) => {
    gulp.src('node_modules/babel-polyfill/browser.js')
      .pipe(gulp.dest('dist/node_modules/babel-polyfill'));
      done();
  });


gulp.task('processJS', (done) => {
    gulp.src('*.js')
      .pipe(jshint({
        esversion: 8
      }))
      .pipe(jshint.reporter('default'))
      .pipe(babel({
        presets: ["@babel/preset-env"]
      }))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
      done();
  });


  gulp.task('browserSync', (done) => {
    browserSync.init({
      server: './dist',
      port: 8080,
      ui: {
        port: 8081
      }
    });
    done();
  });

  gulp.task('watch', gulp.parallel('browserSync', (done) => {
    gulp.watch('*.js', gulp.series('processJS'));
    gulp.watch('*.html', gulp.series('processHTML'));
  
    gulp.watch('dist/*.js', browserSync.reload);
    gulp.watch('dist/*.html', browserSync.reload); 
    // done();
  }));

// gulp.task('default', (callback) => {
//     runSequence(['processHTML', 'processJS', 'babelPolyfill'], callback());
//   });
gulp.task('default', gulp.series('processHTML', 'processStatic', 'processJS', 'babelPolyfill', 'watch', (callback) => {
     callback();
  }));

  

  