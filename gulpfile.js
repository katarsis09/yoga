const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const htmlmin = require('gulp-htmlmin');
const terser = require("gulp-terser");
const jsmin = require('gulp-jsmin');
const del = require('del');
const squoosh = require("gulp-libsquoosh");
const webp = require("gulp-webp");
const imagemin = require('gulp-imagemin');
const sync = require("browser-sync").create();

// Styles
const styles = () => {
  return gulp.src("./sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Html
const html = () => {
  return gulp.src("./index.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("js/main.js")
    .pipe(terser())
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const optimizeImages = () => {
  return gulp.src("./img/**/*.{jpg,png,svg}")
  .pipe(squoosh())
  .pipe(gulp.dest("build/img"))
}

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src("./img/**/*.{jpg,png,svg}")
    .pipe(gulp.dest("build/img"))
}

exports.copyImages = copyImages;


// WebP

const createWebp = () => {
  return gulp.src("./img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;


// Copy

const copy = (done) => {
  return gulp.src([
    "./fonts/*.{woff,woff2}",
    "./img/**/*.{jpg,png,svg,webp}"
  ], {
    base: "./"
  })
  .pipe(gulp.dest("build"));
}

exports.copy = copy;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload
const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("./sass/**/*.scss", gulp.series("styles", reload));
  gulp.watch("./sass/**/*.scss").on('change', styles);
  gulp.watch("./index.html", gulp.series(html, reload));
  gulp.watch("./js/*.js", gulp.series(scripts))
}

// Delete build before
const clean = () => {
  return del("build");
}
exports.clean = clean;


// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp
  ),
);

exports.build = build;

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
