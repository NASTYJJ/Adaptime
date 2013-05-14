/** 
 * @class attempt at multiple inheritence
 * i wanted to use multiple inheritence and interfaces, since javascript 
 * does not support this, here is a shot at getting it to work.
 * there is a lot of 'z' after methods because IE reserves all names it 
 * might ever need
 * disclaimer: I admit this inheritence scheme does not work as i hoped
 * but i will not remove it because it at least makes smaller code
 */
function Class(name)
{
	this.name = name;
	// name clashes should be caught here !
	// seem extends is a reserved word in IE !!
	this.inheritz = function(o)
	{
		for (m in o) {
			if (!this[m])	// overloading test
				this[m] = o[m];
		}
		// ok, microsoft also says super is out of order:
		// just reserve some words Billy, you might need them some day
		this.zuper = o; // only single inheritence
	}

	// interface check
	this.implementz = function(o)
	{
		for (m in o) {
			if (!this[m]) {
				// no exceptions, just throw it in their face
				msg = "class " + this.name + " implements " + o.name +" so it should implement:\n";
				msg += o[m](); // get the correct prototype
				msg += "\nbe sure you put this function BEFORE your implements() call";
				alert(msg);
			}
		}
	}
}

/** rather empty class
  * @param {Number} name name of interface
  */
function Interface(name)
{
	this.name = name;
}
