var gulp = require('gulp'),
    gulp_replace = require('gulp-replace'),
    fs = require('fs');

gulp.task('copy-index-html-to-cloud-functions', function () {
    var indexHtmlContent = fs.readFileSync("dist/listing-portal/index.html", "utf-8");

    return gulp.src("functions/lib/index.js")
        .pipe(
            gulp_replace('INDEX_HTML_REPLACEMENT', indexHtmlContent)
        ).pipe(
            gulp.dest("functions/lib/", { overwrite: true })
        );
});