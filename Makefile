build:
	./node_modules/.bin/eslint src
	mkdir -p dist
	./node_modules/.bin/browserify -t [ babelify ] src/index.js > dist/script.js
	cat dist/script.js \
	  | sed s/default:/\"default\":/ \
	  | sed s/"\.default"/\[\"default\"\]/ \
	  | sed s/"\.default\."/\[\"default\"\]./ \
	  | sed s/"\.default("/\[\"default\"\]\(/ \
	  > dist/script.js

buildcss:
	./node_modules/.bin/node-sass --output-style compressed src/script.scss > dist/script.css
	# ./node_modules/.bin/node-sass src/script.scss | pbcopy
