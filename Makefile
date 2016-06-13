# build:
# 	BABEL_ENV=production babel src/script.js | pbcopy

build:
	./node_modules/.bin/browserify -t [ babelify ] src/index.js | pbcopy
