const gulp = require('gulp');
const browserSync= require('browser-sync').create();
const watch = require ('gulp-watch');


// Таск для отображения контента в реальном времени
gulp.task('server', function() {
    browserSync.init( {
        server: {
            baseDir: "./dev"
        }
    })
});

//Таск для отслеживаниями изменений в файлах
gulp.task('watch', function() {
    watch(['./dev/*.html', './dev/css/**/*.css']), gulp.parallel(browserSync.reload);
});
//Дефолтный запуск gulp
gulp.task('default', gulp.parallel('server', 'watch'));


