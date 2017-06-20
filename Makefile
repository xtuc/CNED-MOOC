export PATH := $(PATH):./node_modules/.bin/

build:
	eslint src
	mkdir -p dist
	browserify -t [ babelify ] src/index.js > dist/pre-script.js
	babel --plugins transform-es3-modules-literals dist/pre-script.js > dist/script.js
	rm dist/pre-script.js

buildcss:
	node-sass --output-style compressed src/script.scss > dist/script.css
	postcss --use autoprefixer dist/script.css -d dist/
