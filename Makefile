STYL=$(shell find public/css -name *.styl)
JADE=$(shell find public -name "*.jade")
HTML=$(JADE:.jade=.html)

all: $(HTML) public/css/style.css

public/css/style.css: $(STYL)
	node_modules/bin/stylus < public/css/style.styl --include /usr/local/share/npm/lib/node_modules/nib/lib > public/css/style.css

%.html: %.jade
	node_modules/jade/bin/jade.js --pretty < $< > $@

clean:
	rm -f $(HTML)

test:
	node_modules/bin/mocha --colors --reporter list

.PHONY: clean test
