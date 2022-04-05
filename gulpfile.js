var gulp = require('gulp')

gulp.task('copy-index-html-to-cloud-functions', function () {
    return gulp.src("dist/listing-portal/index.html")
        .pipe(
            gulp.dest("functions/src/hosting", { overwrite: true })
        );
});