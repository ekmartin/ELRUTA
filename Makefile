STYL=$(shell find public/css -name *.styl)
JADE=$(shell find public -name "*.jade")
HTML=$(JADE:.jade=.html)

all: $(HTML) public/css/style.css

public/css/style.css: $(STYL)
	stylus < public/css/style.styl --include /usr/local/share/npm/lib/node_modules/nib/lib > public/css/style.css

%.html: %.jade
	jade --pretty < $< > $@

clean:
	rm -f $(HTML)

test:
	mocha --colors --reporter list

.PHONY: clean test
