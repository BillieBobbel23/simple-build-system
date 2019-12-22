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
// Babel JS
const babel = require("gulp-babel");
const concat = require("gulp-concat");

// configuration
const conf = require("./config");

function feedback(title, compact = true, pretty = true) {
  return {
    title: title,
    showFiles: compact,
    pretty: pretty
  };
}

function makeJs() {
  return src(path.resolve(conf.root, conf.in, conf.js, "**/*.{js,jsx}"))
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(rename("test.min.js"))
    .pipe(size(feedback("Created JS file(s)")))
    .pipe(dest(path.resolve(conf.root, conf.out, conf.js)));
}

function makeCss() {
  return src(path.resolve(conf.root, conf.in, conf.scss, "**/*.scss"))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest(path.resolve(conf.out, conf.css)))
    .pipe(csso({ sourceMap: true }))
    .pipe(size(feedback("Created CSS file(s)")))
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest(path.resolve(conf.root, conf.out, conf.css)));
}

function minifyImages() {
  return src(path.resolve(conf.root, conf.in, conf.img, "**/*"))
    .pipe(imagemin())
    .pipe(size(feedback("Compressed image(s)")))
    .pipe(dest(path.resolve(conf.root, conf.out, conf.img)));
}

function makeWebp() {
  return src(path.resolve(conf.root, conf.in, conf.img, "**/*"))
    .pipe(webp())
    .pipe(size(feedback("Created WebP image(s)")))
    .pipe(dest(path.resolve(conf.root, conf.out, conf.img)));
}

function minifySvg() {
  return src(path.resolve(conf.root, conf.in, conf.svg, "*.svg"))
    .pipe(svgmin({}))
    .pipe(size(feedback("Optimized SVG((s)")))
    .pipe(dest(path.resolve(conf.root, conf.out, conf.svg)));
}

function makeWoff() {
  return src(path.resolve(conf.root, conf.in, conf.fonts, "*.{ttf,otf}"))
    .pipe(ttf2woff())
    .pipe(size(feedback("Created WOFF font(s):")))
    .pipe(dest(path.resolve(conf.root, conf.out, conf.fonts)));
}
function makeWoff2() {
  return src(path.resolve(conf.root, conf.in, conf.fonts, "*.{ttf,otf}"))
    .pipe(ttf2woff2())
    .pipe(size(feedback("Created WOFF WOFF2 font(s):")))
    .pipe(dest(path.resolve(conf.root, conf.out, conf.fonts)));
}

function lintCss() {
  return (
    src(path.resolve(conf.root, conf.in, conf.scss, "*.scss"))
      .pipe(sass())
      .pipe(dest(path.resolve(conf.root, conf.out, conf.css)))
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
  watch("./src/scss/**/*.scss", makeCss);
  watch("./src/img/**/*.*", [minifyImages, makeWebp, makeSvg]);
  watch("./src/fonts/**/*.*", [makeWoff, makeWoff2]);
}

exports.lintCss = lintCss;

exports.watch = watchAll;
exports.default = parallel(
  makeCss,
  makeJs,
  parallel(minifyImages, makeWebp),
  parallel(makeWoff, makeWoff2),
  minifySvg
);
