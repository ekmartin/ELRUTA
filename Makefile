ICONS=$(shell find assets/images -name "*.orig.png")
RIPPED=$(ICONS:.orig.png=.png)

install:
	bower install
	npm install

server:
	node_modules/.bin/supervisor index.js

rip: $(RIPPED)

$(RIPPED): $(ICONS)
	convert $< -channel rgba -alpha set -fuzz 10% -fill none +opaque "#4D4D4D" $@

test:
	node_modules/.bin/mocha --colors --reporter list

.PHONY: server install test rip
