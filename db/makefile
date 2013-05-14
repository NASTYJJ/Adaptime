all: Feyenoord.js gwtinstall

gwtinstall:
	cp Feyenoord.js gwt/war/gwtexample

clean: 
	rm Feyenoord.js *.jsm

SRC= Db	

Feyenoord.js: ${SRC:%=%.jsm}
	cat $^ > Feyenoord.js

%.jsm:%.js
	python minify.py < $< > $@

#don't do this with doxygen, use jsdoc
#%.cpp:%.js
	#./js2doxy.pl < $^ >  $@
#doc: ${SRC:%=%.cpp}
	#./js2doxy.pl < $^ >  $@
	#doxygen *.cpp

doc:
	#rm Feyenoord.js
	perl ~/bin/JSDoc-1.10.2/jsdoc.pl ${SRC:%=%.js}

