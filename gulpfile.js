const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const htmlmin = require('gulp-htmlmin');
const jsmin = require('gulp-jsmin');
const del = require('del');
const imagemin = require('gulp-imagemin');
const sync = require("browser-sync").create();

// Styles
const styles = () => {
  return gulp.src("./sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// // Html
// const html = () => {
//   return gulp.src("./*.html")
//     .pipe(htmlmin({
//       collapseWhitespace: true
//     }))
//     .pipe(gulp.dest("build"));
// }

// exports.html = html;

// // Scripts

// const scripts = () => {
//   return gulp.src("source/js/*.js")
//     .pipe(jsmin())
//     .pipe(gulp.dest("build/js"))
//     .pipe(sync.stream());
// }

// exports.scripts = scripts;

// // Images

// const images = () => {
//   return gulp.src("source/img/**/*.{jpg,png,svg}")
//     .pipe(imagemin([
//       imagemin.mozjpeg({
//         progressive: true
//       })
//     ]))
//     .pipe(gulp.dest("build/img"))
// }

// exports.images = images;


// // Copy

// const copy = (done) => {
//   return gulp.src([
//     "source/fonts/*.{woff,woff2}",
//     "source/favicon/*.{svg,png}",
//     "source/favicon.ico",
//     "source/img/**/*.{jpg,png,svg,webp}",
//     "source/manifest.webmanifest"
//   ], {
//     base: "source"
//   })
//     .pipe(gulp.dest("build"));
// }

// exports.copy = copy;

// // Server

// const server = (done) => {
//   sync.init({
//     server: {
//       baseDir: 'build'
//     },
//     cors: true,
//     notify: false,
//     ui: false,
//   });
//   done();
// }

// exports.server = server;

// Reload
const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("./sass/**/*.scss", gulp.series("styles", reload));
  // gulp.watch("source/sass/**/*.scss").on('change', styles);
  // gulp.watch("source/*.html", gulp.series(html, reload));
  // gulp.watch("source/js/*.js", gulp.series(scripts))
}

// Delete build before
const clean = () => {
  return del("build");
}
exports.clean = clean;


// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    // html,
    styles,
    // scripts,
    // copy,
    // images
  )
);
exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles
    // html,
    // scripts,
    // copy,
    // images
  ),
  gulp.series(
    // server,
    watcher,
    styles
  )
);
