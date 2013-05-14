/**
  * printf replacement
  *
  */
function printf()
{
	var s="";

	for(var i=0; i<arguments.length; i++) {
      s = s + arguments[i] + " " ;
	}

	if (typeof(console) != "undefined") 
		console.log(s);
	else if (typeof(alert) != "undefined") 
		alert (s);
	else
		print (s);
}

/** 
  * shorthand for global.debug.print 
  * @see Debug#print
  */
function dp(x)
{
	if (global && global.debug)
		global.debug.print(x);
}

/** 
  * shorthand for global.debug.append 
  * @see Debug#append
  */
function da(x)
{
	if (global && global.debug)
		global.debug.append(x);
}

/** 
  * shorthand for global.debug.print_attributes 
  * @see Debug#print_attributes
  */
function pa(x)
{
	global.debug.print_attributes(x);
}

/** 
  * shorthand for global.debug.print_styles 
  * @see Debug#print_styles
  */
function ps(x)
{
	global.debug.print_styles(x);
}

/** 
  * shorthand for global.debug.print_table 
  * @see Debug#print_table
  */
function pt(x)
{
	global.debug.print_table(x);
}

/** 
  * @class General debug object used to redirect debug output to a 
  *  dom element you specify.
  * @requires Dom
  */
function Debug(out)
{
	// output html element, otherwise alert will be ued
	this.out = out;

	this.set_elm=function(out) {
		this.out=out;
	}
    /** 
     * whipe previous content and print string
     * @param {String} txt The string to print
     */
	this.print = function(txt)
	{
		if (this.out) {
			this.out.innerHTML=txt;
		} else {
			alert(txt);
		}
	}

    /** 
     * do not whipe previous content but append string
     * @param {String} txt The string to append
     */
	this.append = function(txt)
	{
		if (this.out) {
			this.out.innerHTML += txt;
		} else {
			alert(txt);
		}
	}

    /** 
     * print a complete style table
     * @param {Object} what The object to print styles from
     * @param {Object} where The dom object where to put the table
     */
	this.print_styles = function(what,where)
	{
		var tbl = this.styles(what);
		if (!where) where = this.out;
		replace_child(where,tbl);
	}

    /** 
     * print all attributes of an object using js reflection
     * @param {Object} what What object to dump
     * @param {Object} where dom element Where to print it, if null or 
     *   use the Debug.out element
     */
	this.print_attributes = function(what,where)
	{
		var tbl = this.attributes(what);
		if (!where) where = this.out;
		replace_child(where,tbl);
	}

    /** 
     * generate attribute table, used for printing with print_attributes()
     * @param {Object} what What object to dump
     * @return {Object} dom table with the object in two columns (name,val)
     * @see Debug#print_attributes
     */
	this.attributes = function (obj)
	{
		tbl = document.createElement("table");
		// opera needs this to be 0
		tbl.cellSpacing = 1;
		tbl.border=0;
		tbl.bgColor="000000";

		if (!obj) {
			tr = tbl.insertRow(tbl.rows.length);
			td = tr.insertCell(0);
			td.nowrap = true;
			td.innerHTML = obj;
			return tbl;
		}

		for (var a in obj)
		{
			tr = tbl.insertRow(tbl.rows.length);
			tr.bgColor="eeeeee";
			td = tr.insertCell(0);
			td.nowrap = true;
			td.innerHTML = a;
			td = tr.insertCell(1);
			if (obj[a]) {
				td.innerHTML = obj[a];
			} else {
				td.innerHTML = "-";
			}
		}
		tr = tbl.insertRow(0);
		td = tr.insertCell(0);
		td.style.background="#888888"; // rather neutral header
		if (obj.nodeName) 
			td.innerHTML = obj.nodeName;
		else 
			td.innerHTML = "member";
		td = tr.insertCell(1);
		td.style.background="#888888"; // rather neutral header
		if (obj.id) 
			td.innerHTML = obj.id;
		else 
			td.innerHTML = "value";


		return tbl;
	}

    /** 
     * print an array of objects, this is called print_table because for 
     * instance mysql.php queries can be dumped this way
     * @param {Array} what What array to dump
     */
	this.print_table = function(what,where)
	{
		var tbl = this.table(what);
		if (!where) where = this.out;
		replace_child(where,tbl);
	}

    /** 
     * generate table, used for printing with print_table()
     * @param {Array} what What Array to dump
     * @return {Object} dom table with the array in multiple columns 
     * @see Debug#print_table
     */
	this.table = function (obj)
	{
		tbl = document.createElement("table");
		// opera needs this to be 0
		tbl.cellSpacing = 1;
		tbl.border=0;
		tbl.bgColor="000000";

		if (!obj) {
			tr = tbl.insertRow(tbl.rows.length);
			td = tr.insertCell(0);
			td.nowrap = true;
			td.innerHTML = obj;
			return tbl;
		}

        //header 
		tr = tbl.insertRow(0);
        idx0=obj[0];
        c =0;
		for (var a in idx0)
        {
		    td = tr.insertCell(c);
		    td.style.background="#888888"; // rather neutral header
			td.innerHTML = a;
            c++;
        }

        //dump rows
        for (i=0; i< obj.length; i++) {
			tr = tbl.insertRow(tbl.rows.length);
            c =0;
		    for (var a in obj[i])
		    {
			    td = tr.insertCell(c);
			    td.nowrap = true;
			    if (obj[i][a]) {
                    // geintje ;) to disable:
                    // if (0) 
                    if (a == 'color' || a == 'colour' || 
                        a == 'Color' || a == 'Colour' || 
                        a == 'kleur' || a == 'Kleur') {
                        td.style.background=obj[i][a];
			td.style.color=letter_color(obj[i][a]);
                    }
                    dom_set_text(td, obj[i][a]);
			    } else {
				    td.innerHTML = "-";
			    }
                c++;
            }
		}

		return tbl;
	}

    /** @ignore */
    function getStyles(x)
    {
        if (x.currentStyle)
            return x.currentStyle;
        else if (window.getComputedStyle)
           return document.defaultView.getComputedStyle(x,null);
        return null;
    }

    /** @ignore */
    function getStyle(x,styleProp)
    {
        if (x.currentStyle)
           var y = x.currentStyle[styleProp];
        else if (window.getComputedStyle)
           var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
        return y;
    }

    /** @ignore */
	this.styles = function (o)
	{
		tbl = document.createElement("table");
		// opera needs this to be 0
		tbl.cellSpacing = 1;
		tbl.border=0;
		tbl.bgColor="000000";

        obj = getStyles(o);

		if (!obj) {
			tr = tbl.insertRow(tbl.rows.length);
			td = tr.insertCell(0);
			td.nowrap = true;
			td.innerHTML = obj;
			return tbl;
		}

		for (var a in obj)
		{
			tr = tbl.insertRow(tbl.rows.length);
			tr.bgColor="eeeeee";
			td = tr.insertCell(0);
			td.nowrap = true;
			td.innerHTML = a;
			td = tr.insertCell(1);
			if (obj[a]) {
				td.innerHTML = obj[a];
			} else {
				td.innerHTML = "-";
			}
		}
		tr = tbl.insertRow(0);
		td = tr.insertCell(0);
		td.style.background="#888888"; // rather neutral header
		if (obj.nodeName) 
			td.innerHTML = obj.nodeName;
		else 
			td.innerHTML = "member";
		td = tr.insertCell(1);
		td.style.background="#888888"; // rather neutral header
		if (obj.id) 
			td.innerHTML = obj.id;
		else 
			td.innerHTML = "value";


		return tbl;
	}
}
