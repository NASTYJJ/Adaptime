all: FLib.js 

clean: 
	rm FLib.js *.jsm

SRC= \
	Sha1	\
	Md5	\
	Misc	\
	Da	\
	Json	\
	Ajax

FLib.js: ${SRC:%=%.jsm}
	cat $^ > FLib.js

%.jsm:%.js
	python minify.py < $< > $@

#don't do this with doxygen, use jsdoc
#%.cpp:%.js
	#./js2doxy.pl < $^ >  $@
#doc: ${SRC:%=%.cpp}
	#./js2doxy.pl < $^ >  $@
	#doxygen *.cpp

doc:
	#rm FLib.js
	perl ~/bin/JSDoc-1.10.2/jsdoc.pl ${SRC:%=%.js}

