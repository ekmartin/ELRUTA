install:
	bower install
	npm install

server:
	node_modules/.bin/supervisor index.js

test:
	node_modules/.bin/mocha --colors --reporter list

.PHONY: server install test
