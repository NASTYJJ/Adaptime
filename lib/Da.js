/**
  * @class dynamic array object
  *    specifically if you need ordering, otherwise use the js hash
  */
function Da()
{
	this.data = new Array()
	this.length = 0

	/** 
      * insert object at specified position
      * @param {Object} obj Object to insert
      * @param {Number} pos Position at which to insert Object
      * @return {Number}length of the array after insertion or -1 at error
      */
	this.ins= function(obj,pos)
	{
		var t

		if (pos < 0 || pos > this.length) return -1

		for (t=this.length; t>= pos; t--) {
			this.data[t] = this.data[t-1]
		}
		this.data[pos]= obj
		return this.length ++
	}

	/**
      * add an object at the end of the array
      * @return {Number}length of the array after insertion or -1 at error
      */
	this.add= function(obj)
	{
		this.ins(obj,this.length)
	}

	/**
      * get object at the specified position in the array
      * @param {Number} pos Position at which to insert Object
      * @return {Object} the object
      */
	this.get = function(pos)
	{
		if (pos < 0 || pos > this.length) return null;
		return this.data[pos];
	}

	/**
      * delete object at position pos, 
      * @param {Number} pos delete array element at this position
      * @return {Number} length of the array after deletion or -1 at error
      */
	this.del= function(pos)
	{
		var t
		if (pos < 0 || pos >= this.length) return -1

		for (t=pos; t< this.length; t++) {
			this.data[t] = this.data[t+1]
		}
		return this.length --
	}

	/** return string comma seperated */
	this.toString = function()
	{
		var t

		var str = "";
		for (t=0; t< this.length; t++) {
			if (t!= 0)
				str += ","
			str += this.data[t].toString()
		}
		return str
	}
}
//Da.prototype = new Class("Da")

function da_test(n)
{
	var x,y
	var to = new da()

	for (x=0; x< n; x++) {
		to.ins(x,0)
		str = to.toString()
		alert(str)
	}

	for (x=0; x < n; x++) {
		to.del(2);
		str = to.toString()
		alert(str)
	}
}
