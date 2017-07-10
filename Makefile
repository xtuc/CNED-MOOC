export PATH := $(PATH):./node_modules/.bin/

build:
	eslint src
	mkdir -p dist
	browserify -d -t [ babelify ] src/index.js -o dist/pre-script.js
	babel --plugins transform-es3-member-expression-literals,transform-es3-modules-literals dist/pre-script.js --out-file dist/script.js --source-maps
	rm dist/pre-script.js

buildcss:
	node-sass --output-style compressed src/script.scss > dist/script.css
	postcss --use autoprefixer dist/script.css -d dist/
