const { parallel, series, src, dest, watch } = require("gulp");
// Utilities
const path = require("path");
const size = require("gulp-size");
const rename = require("gulp-rename");
// (S)CSS
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const autoprefixer = require("gulp-autoprefixer");
// Image(s)
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
// SVG(s)
const svgmin = require("gulp-svgmin");
// Fonts
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
// CSS linting
const csslint = require("gulp-csslint");
const stylestats = require("gulp-stylestats");

const config = {
  input: "src/",
  output: "dist/"
};

// DRY up the feedback for sizes
function feedback(title, compact = true, pretty = true) {
  return {
    title: title,
    showFiles: compact,
    pretty: pretty
  };
}

function css() {
  return src(path.resolve("./", config.input, "scss/**/*.scss"))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest(config.output + "css"))
    .pipe(csso({ sourceMap: true }))
    .pipe(size(feedback("Created CSS file(s)")))
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest(path.resolve("./", config.output, "css")));
}

function images() {
  return (
    src(config.input + "img/**/*")
      .pipe(imagemin())
      .pipe(size(feedback("Compressed image(s)")))
      .pipe(dest(path.resolve("./", config.output, "img")))
      // make WebP images
      .pipe(webp())
      .pipe(size(feedback("Created WebP image(s)")))
      .pipe(dest(path.resolve("./", config.output, "img")))
  );
}

function svg() {
  return src(path.resolve("./", config.input, "svg/*.svg"))
    .pipe(svgmin({}))
    .pipe(size(feedback("Optimized SVG((s)")))
    .pipe(dest(path.resolve("./", config.output, "svg")));
}

function makeWoff() {
  return src(path.resolve("./", config.input, "fonts/*.{ttf,otf}"))
    .pipe(ttf2woff())
    .pipe(size(feedback("Created WOFF font(s):")))
    .pipe(dest(path.resolve("./", config.output, "fonts")));
}

function makeWoff2() {
  return src(path.resolve("./", config.input, "fonts/*.{ttf,otf}"))
    .pipe(ttf2woff2())
    .pipe(size(feedback("Created WOFF2 font(s):")))
    .pipe(dest(path.resolve("./", config.output, "fonts")));
}

function lintCss() {
  return (
    src("src/scss/*.scss")
      .pipe(sass())
      .pipe(dest("dist/css/"))
      // https://github.com/CSSLint/csslint/wiki/Rules-by-ID
      .pipe(
        csslint({
          "box-sizing": false,
          "order-alphabetical": false,
          "box-model": false
        })
      )
      .pipe(csslint.formatter("compact"))
      .pipe(
        stylestats({
          type: "json",
          output: false
        })
      )
  );
}

// Watcher
function watchAll() {
  watch("./src/scss/**/*.scss", css);
}

exports.lintCss = lintCss;

exports.watch = watchAll;
exports.default = parallel(css, images, makeWoff, makeWoff2, svg);
