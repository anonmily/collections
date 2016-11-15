.DEFAULT_GOAL := build

test: unit
	
unit:
	mocha --compilers js:babel-core/register tests/

build:
	# Just compile ES6
	babel es6 -d es5

pushversion:
	git add --all
	git commit -m "Build version"
	npm patch version
	npm publish

deploy: build pushversion
