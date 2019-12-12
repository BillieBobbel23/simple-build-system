# simple-gulp-tasks

Some simple tasks with GulpJS for a quick "build system".

## Installation:

``git clone https://github.com/BillieBobbel23/simple-gulp-task your/path/here``

## Usage
Run some simple tasks for your project using GulpJS:

* Minified, autoprefixed CSS from Sass

* Websafe fonts (WOFF/WOFF2 from a TFF/OTF)

* Image compression (for most older formats)

* WebP creation for images

* Linting (only CSS for now)

* Some feedback about file sizes

## Tasks

- ``npm run build ``  
Builds all assets and moves them into the output folder

- ``npm run serve ``  
**Windows only**  
Starts an npx webserver, watches assets for changes and opens the index.html  

- ``npm run watch ``    
Watches assets for changes

- ``npm run lint:css ``    
Builds and lints CSS file(s)
