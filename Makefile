ICONS=$(shell find assets/images -name "*.orig.png")
RIPPED=$(ICONS:.orig.png=.png)

install:
	bower install
	npm install

server:
	node_modules/.bin/supervisor index.js

rip: $(RIPPED)

%.png: %.orig.png
	convert $< -alpha extract -fuzz 15% -transparent black -threshold 0 $@

test:
	node_modules/.bin/mocha --colors --reporter list

.PHONY: server install test rip
