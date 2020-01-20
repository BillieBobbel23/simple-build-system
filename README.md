# simple-gulp-tasks

Some simple tasks with GulpJS for a quick "build system".

## Installation:

Inside an empty directory run the clone command:  
``git clone https://github.com/BillieBobbel23/simple-gulp-task .``

After this install the project dependencies using  
`` npm install`` or ``yarn``.


## Usage
Run some simple tasks for your project using GulpJS:

* Minified, autoprefixed CSS from Sass

* Websafe fonts (WOFF/WOFF2 from a TFF/OTF)

* Image compression (for most older formats)

* WebP creation for images

* Linting (only CSS for now)

* Some feedback about file sizes

## Tasks
Tasks are run using ``opener`` and ``npm-run-all`` to prevent any OS related issues.

- ``npm run build ``  
Builds all assets and moves them into the output folder

- ``npm run build:prod ``  
Sets ``node_env="production"`` and builds a clean set of linted assets 

- ``npm run serve ``  
Starts an npx webserver, builds assets and opens the index.html  

- ``npm run lint:css ``    
Builds and lints CSS file(s)
