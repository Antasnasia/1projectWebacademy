const gulp = require('gulp');
const browserSync= require('browser-sync').create();
const watch = require ('gulp-watch');
const sass= require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber= require('gulp-plumber');
const notify= require('gulp-notify');
const gcmq = require('gulp-group-css-media-queries');
const sassGlob = require('gulp-sass-glob');
const pug = require('gulp-pug');

// таск для сборки pug файлов
gulp.task('pug', function() {
    return gulp.src('./dev/pug/pages/**/*.pug')
        .pipe(pug({
            pretty: true
        }))


        .pipe(gulp.dest('./dist/'))
});

//таск для компиляции и обработки файлов scss
gulp.task('scss', function(callback) {
    return (gulp.src('./dev/scss/main.scss'))
    .pipe(plumber ({
        errorHandler: notify.onError(function(err) {
            return {
                title: "Styles",
                sound: false,
                message: err.message
            }
        })
    }))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
        indentType: 'Tab',
        indentWidth: 1,
        outputStyle: "expanded"
    }))
    .pipe(gcmq())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 4 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'));
    callback();
});



// Таск для отображения контента в реальном времени
gulp.task('server', function() {
    browserSync.init( {
        server: {
            baseDir: "./dist"
        }
    })
});

//Таск для отслеживаниями изменений в файлах
gulp.task('watch', function() {
   
    watch ('./dev/scss/**/*.scss', gulp.parallel('scss'));
   watch('./dev/pug/**/*.pug', gulp.parallel('pug'));
    watch(['./dist/*.html', './dist/css/**/*.css'], gulp.parallel(browserSync.reload));
});
//Дефолтный запуск gulp
gulp.task('default', gulp.parallel('server', 'watch',  'scss', 'pug'));


