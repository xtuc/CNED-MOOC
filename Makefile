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
