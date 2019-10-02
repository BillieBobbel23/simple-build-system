const { parallel, src, dest, watch } = require("gulp");
const path = require("path");
const size = require("gulp-size");
var rename = require("gulp-rename");

// Sass to CSS
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const autoprefixer = require("gulp-autoprefixer");

function css() {
  return src(path.resolve("./", "src/scss/**/*.scss"))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest("dist/css"))
    .pipe(csso({ sourceMap: true }))
    .pipe(size({ title: "CSS file size ", showFiles: true, pretty: true }))
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest(path.resolve("./", "dist/css")));
}

// Image compression
const imagemin = require("gulp-imagemin");

function images() {
  return src("src/img/**/*")
    .pipe(imagemin())
    .pipe(
      size({ title: "Image file size(s): ", showFiles: true, pretty: true })
    )
    .pipe(dest("dist/img/"));
}

// Create fonts
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");

function makeWoff() {
  return src("src/fonts/**/*")
    .pipe(ttf2woff())
    .pipe(size({ title: "Font file size(s):", showFiles: true, pretty: true }))
    .pipe(dest("dist/fonts/"));
}
function makeWoff2() {
  return src("src/fonts/**/*")
    .pipe(ttf2woff2())
    .pipe(size({ title: "Font file size(s):", showFiles: true, pretty: true }))
    .pipe(dest("dist/fonts/"));
}

function watchAll() {
  watch("src/scss/*.scss", css);
}

// CSS linting
const csslint = require("gulp-csslint");
const stylestats = require("gulp-stylestats");

function lintCss() {
  return (
    src("src/scss/*.scss")
      .pipe(sass())
      .pipe(dest("dist/css/"))
      // https://github.com/CSSLint/csslint/wiki/Rules-by-ID
      .pipe(csslint({ "box-sizing": false }))
      .pipe(csslint.formatter("compact"))
      .pipe(
        stylestats({
          type: "json",
          output: true
        })
      )
  );
}

exports.css = css;
exports.images = images;
exports.fonts = parallel(makeWoff, makeWoff2);

exports.generate = parallel(images, makeWoff, makeWoff2);
exports.default = parallel(css, images, makeWoff, makeWoff2);

exports.lintCss = lintCss;
exports.lint = lintCss;

exports.watchAll = watchAll;
