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

// configuration
const conf = require("./config");

function feedback(title, compact = true, pretty = true) {
  return {
    title: title,
    showFiles: compact,
    pretty: pretty
  };
}

function css() {
  return src(path.resolve(conf.root, conf.in, conf.scss, "**/*.scss"))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(
      dest(path.resolve(conf.out, conf.css))
        .pipe(csso({ sourceMap: true }))
        .pipe(size(feedback("Created CSS file(s)")))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(dest(path.resolve(conf.root, conf.out, conf.css)))
    );
}

function images() {
  return (
    src(path.resolve(conf.root, conf.in, conf.img, "**/*"))
      .pipe(imagemin())
      .pipe(size(feedback("Compressed image(s)")))
      .pipe(dest(path.resolve(conf.root, conf.out, conf.img)))
      // make WebP images
      .pipe(webp())
      .pipe(size(feedback("Created WebP image(s)")))
      .pipe(dest(path.resolve(conf.root, conf.out, conf.img)))
  );
}

function svg() {
  return src(path.resolve(conf.root, conf.in, conf.svg, "*.svg"))
    .pipe(svgmin({}))
    .pipe(size(feedback("Optimized SVG((s)")))
    .pipe(dest(path.resolve(conf.root, conf.out, conf.svg)));
}

function fonts() {
  return src(path.resolve(conf.root, conf.in, conf.fonts, "*.{ttf,otf}"))
    .pipe(ttf2woff())
    .pipe(ttf2woff2())
    .pipe(size(feedback("Created WOFF and WOFF2 font(s):")))
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
  watch("./src/scss/**/*.scss", css);
  watch("./src/img/**/*.*", [images, svg]);
  watch("./src/fonts/**/*.*", fonts);
}

exports.lintCss = lintCss;

exports.watch = watchAll;
exports.default = parallel(css, images, fonts, svg);
