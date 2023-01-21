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
const fileInclude= require('gulp-file-include');

// таск для сборки html файлов
gulp.task ('html', function (callback) {
    return gulp.src('./dev/html/*.html') //в папке html хранятся все основные страницы нашего сайта - основной index.html, page. contacts etc. в подпапке sections хранятся шаблоны частей сайта (header.html, content.html, footer.html etc), кот. компилироватся не будут
    .pipe(plumber({
        errorHandler: notify.onError(function(err) {
            return {
                title: "HTML include",
                sound: false,
                message: err.message
            }
        })
    }))
    .pipe(fileInclude({  prefix: '@@'  }))
    
    .pipe(gulp.dest('./dist/')) //путь сохранения скомпилированного файла
    ;
    callback();
})

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
    watch('./dev/html/**/*.html', gulp.parallel('html'));
    watch(['./dist/*.html', './dist/css/**/*.css'], gulp.parallel(browserSync.reload));
});
//Дефолтный запуск gulp
gulp.task('default', gulp.parallel('server', 'watch', 'html', 'scss'));


