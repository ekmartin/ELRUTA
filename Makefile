ICONS=$(shell find assets/images -name "*.orig.png")

install:
	npm install
	node_modules/bower/bin/bower install

server:
	node_modules/.bin/supervisor index.js

test:
	node_modules/.bin/mocha --colors --reporter list

.PHONY: server install test
