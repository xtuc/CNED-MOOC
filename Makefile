build:
	./node_modules/.bin/eslint src
	mkdir -p dist
	./node_modules/.bin/browserify -t [ babelify ] src/index.js > dist/script.js
	cat dist/* \
	  | sed s/default:/\"default\":/ \
	  | sed s/"\.default"/\[\"default\"\]/ \
	  | sed s/"\.default\."/\[\"default\"\]./ \
	  | sed s/"\.default("/\[\"default\"\]\(/ \
	  | pbcopy
	rm -rf dist

buildcss:
	# ./node_modules/.bin/node-sass --output-style compressed src/script.scss | pbcopy
	./node_modules/.bin/node-sass src/script.scss | pbcopy
