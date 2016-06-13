# build:
# 	BABEL_ENV=production babel src/script.js | pbcopy

build:
	./node_modules/.bin/eslint src
	./node_modules/.bin/browserify -t [ babelify ] src/index.js | pbcopy

# publish:
# 	s3_website cfg apply
# 	s3_website push
# 	rm -rf dist
