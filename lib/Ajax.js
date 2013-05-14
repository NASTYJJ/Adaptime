/** @fileoverview 
 *	Contains all objects and functions used to encode/decode messages and
 *	to send to or receive from a server using asynchrounous xml and javascript
 *  or AJAX
 */
/**
 * @class Formalized message used to send data to server scripts
 * @param {String} cmd Command used to dispatch at the serverside
 * @param {String} data Object to use as first (or only) data array member
 * @requires Json
 */
function JsonMessage(cmd,data)
{
	var ob = new Object();
	ob.cmd = cmd;
	ob.payload = new Array();

    if (data) {
	    ob.payload[0] = data;
    }

    /**
     * Return complete message as stringified json
     * @return {String} object as a json string
     */
	this.stringified = function()
	{
		return JSON.stringify(ob);
	}

    /** 
      * Clear object array 
      */
    this.clr_objects = function()
    {
	    ob.payload = new Array();
    }

    /** Add new object to the object array 
      * @param {Object} o Object to place at the end
	  */
    this.add_object = function(o)
    {
        nitems=ob.payload.length;
        ob.payload[nitems] = o;
    }

    /** 
     * Set object at array position
     * @param {Number} n Position in the object array
     * @param {Object} o Object to place at n
     */
    this.set_object = function(n,o)
    {
        ob.payload[n] = o;
    }
}

/**
 * @class Formalized message used to return data from server scripts
 * @param {String} msg Json formatted string containing the return message
 */
function JsonResult(msg)
{
	var ob = JSON.parse(msg);

    /** 
     * Return the status of the JsonResult
     */
    this.get_status = function()
    {
        return ob.stat;
    }

    /** 
     * get the N-th object returned from the server
     * @param {Number} object comes from position n in the object array
	 */
    this.get_object = function(n)
    {
        return ob.payload[n];
    }
}

/**
 * @class Context used for 1 ajax communication session, you can reuse it if
    used synchronous. But if you want simultaneous messages you 
    need to instantiate another AjaxContext
 * @param {String} sc complete url of the serverside script
 */
function AjaxContext(sc,domelm)
{
	var thisobj=this;
    var xmlhttp = false;
	/** @ignore */
	this.sc = sc;
	var triggerfunction;
	var udata = "hoi";
	/** @ignore */
	this.domelm=domelm;
	
    // < Cross-Browser defining of the xmlhttprequest object >
    try {
            xmlhttp = new ActiveXObject( "Msxml2.XMLHTTP" );
    } catch (e) {
        try {
                xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP" );  // IE
        } catch (E) {
                xmlhttp = false;
        }
    }

    if ( !xmlhttp ) {
        xmlhttp = new XMLHttpRequest();
    }

    /** set userdata to be passed to asynchonous handler */
	this.set_udata = function(data) { udata = data; }

    /** 
      * return ajax state 
      * @return {Number} current state
      */
    this.state = function ()
    {
        return xmlhttp.readyState;
    }

    /** 
      * return responseText 
      * @return {String} current responsetext
      */
    function text()
    {
        return xmlhttp.responseText;
    }

    function raw_get ()
	{
	    if (xmlhttp.readyState==4) {
			//alert (xmlhttp.responseText);
			//dp (xmlhttp.responseText);
			if (udata) 
				triggerfunction(xmlhttp.responseText,udata);
			else
				triggerfunction(xmlhttp.responseText);
		}
	}
	
	/** abort an ajax request */
	this.abort = function()
	{
		try {
        	xmlhttp.abort(null);
		} catch(e) {
			alert(e);
		}
	}

	/** get the data raw (not json encoded) */
    this.get_raw = function (cb,data,udata)
    {
        var ret;
		url = this.sc;
        url += '?' + data;
		this.set_udata(udata);

		try {
        	xmlhttp.open( "GET" , url, true);
        	// yes !!! microsoft again, force cache clean
        	xmlhttp.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
        	ret = xmlhttp.onreadystatechange=cb;
        	xmlhttp.send(null);
		} catch(e) {
			alert(e + " for url " + url );
		}
    }

    /** 
      * get data from server and handle it asynchronous
      * @param {Function} ufunc The function in which you handle the data
      * @param {String} content The raw data string you want to pass to the server script
      * @param {Object} udata Extra data you want to be passed to the ufunc
      */
	this.get_async = function(ufunc,content,udata)
	{
		triggerfunction = ufunc;
		this.get_raw(raw_get,content,udata);
	}

    /** 
      * get data from server synchronous and return the data
      * @param {String} content The raw data string you want to pass to the server script
      * @return {String} the complete returned server data
      */
	this.get_sync = function(content,verbose)
	{
		url = this.sc;
        url += '?' + content;
		if (verbose)
			alert(url);
        xmlhttp.open( "GET" , url, false);
        xmlhttp.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
        xmlhttp.send(null);
		if (verbose)
			alert(xmlhttp.responseText);
        return xmlhttp.responseText;
	}

    /** 
      * use ajax to see if a server page exists
      * @param {String} url The url you want to probe for reachability
      * @return {Boolean} true if reachable, false if not
      */
    this.exists = function(url)
    {
        xmlhttp.open( "GET" , url, false);
        xmlhttp.send(null);
        if (xmlhttp.status == 200) return true;
        else return false;
    }
}

/**
 * @class Context used for 1 ajax communication session with JsonMessage's, 
 * data is always json'ized as a JsonMessage and returned as a JsonResult
 * @param {String} sc complete url of the serverside script
 * @requires Json
 */
function JsonContext(sc,domelm)
{
	var thisobj=this;
    var xmlhttp = false;
	this.sc = sc;
    var ac = new AjaxContext(sc,domelm);


    /** 
      * trigger the callback function
      * @param {String} res result 
      */
	this.cb=function(res,udata)
	{
        var msg = new JsonResult(res);
		thisobj.triggerfunction(msg,udata);
	}
	
    /** 
      * get data from the server and handle it asynchronous
      * @param {Function} ufunc The function in which you handle the data
      * @param {String} jm the JsonMessage you want to send to the server script
      * @param {Object} udata Extra data you want to be passed to the ufunc
      */
	this.get_async = function(ufunc,jm,udata)
	{
        getstring = "json="+jm.stringified();
		thisobj.triggerfunction=ufunc;
		ac.get_async(this.cb,getstring,udata);
	}

    /** 
      * get data from the server synchronous and return the data
      * @param {String} jm the JsonMessage you want to send to the server script
      * @return {String} the complete returned server data
      */
	this.get_sync = function(jm,verbose)
	{
        getstring = "json="+jm.stringified();
		res = ac.get_sync(getstring,verbose);
        return new JsonResult(res);
	}
}

/**
 * @class due to browser limits (two connections ?) this que can be used for all
 * messages using one AjaxContext.
 */
function AjaxQueue(handler)
{
	var self=this;
	self.handler=handler;

	self.jc = new JsonContext("../sss.php"); // syncsession server script

	function loop(e,dta)
	{
		var jr = new JsonResult(e);
		var stat = jr.get_status();
		var o = jr.get_object(0);
		if (stat == "error") {
			alert("socket broken, aborting!");
			self.jc.abort();
			return false;
		}
		self.handler(e,dta);
		self.install_handler(o,dta);
	}

	/** subscribe to a topic with a sessionid
 	  * @param {String} topic topic to subscribe to
 	  * @param {int} sid session id number
      */
	this.subscribe=function(topic,sid)
	{
		var jm  = new JsonMessage("subscribe", topic);
		if (!sid) sid=0;
		jm.add_object(sid);
		var msg = self.jc.get_sync(jm);
		return msg;
	}
	
	/** unsubscribe from the current topic 
      */
	this.unsubscribe=function()
	{
		var jm  = new JsonMessage("unsubscribe", "");
		var msg = self.jc.get_sync(jm);
		return msg;
	}
	
	/** setup a handler for a topic to listen to
 	  * @param {int} sid session id number
 	  * @param {String} udata user data
      */
	this.install_handler=function(sid,udata)
	{
		var jm = new JsonMessage("listen", null);
		jm.add_object(sid);
		self.jc.get_async(loop,jm,udata);
	}
	
	/** start listening to a topic
 	  * @param {Function} fnc handler function
 	  * @param {int} sid session id number
 	  * @param {String} udata user data
      */
	this.start_listening=function(fnc,sid,udata)
	{
		self.install_handler(sid,udata);
	}
	
	/** put a message on the current topic
 	  * @param {String} sm message
      */
	this.put_message = function(sm) 
	{
		self.jc.abort();	 // abort the async listener
		var msg = self.jc.get_sync();    // do this synchronous
		self.start_listening(self.handler,sm); // restart listener again
		return msg;
	}
}

/** @ignore not finished yet */
function SssMessage(l,sid,count,ts,data)
{
	this.length=l;
	this.session=sid;
	this.counter=count;
	this.timestamp=ts;
	this.data=data;
}

// pure sync server queue
function SssQueue(handler)
{
	var self=this;
	self.handler=handler;

	self.jc = new JsonContext("../sss.php"); // syncsession server script

	function loop(e,dta)
	{
		var jr = new JsonResult(e);
		var stat = jr.get_status();
		var sm = jr.get_object(0);
		if (stat == "error") {
			alert("socket broken, aborting!");
			self.jc.abort();
			return false;
		}
		self.handler(e,dta);
		self.install_handler(sm,dta);
	}

	this.subscribe=function(topic,sid,count)
	{
		if (!sid) sid=0;
		if (!count) count=0;
		var sm  = new SssMessage(topic.length,sid,count,0,topic);
		var jm  = new JsonMessage("subscribe", sm);
		var msg = self.jc.get_sync(jm);
		return msg;
	}
	
	this.unsubscribe=function(sm)
	{
		var jm  = new JsonMessage("unsubscribe", sm);
		var msg = self.jc.get_sync(jm);
		return msg;
	}
	
	this.install_handler=function(sm,udata)
	{
		var jm = new JsonMessage("listen", sm);
		self.jc.get_async(loop,jm,udata);
	}
	
	this.start_listening=function(fnc,sm,udata)
	{
		self.install_handler(sm,udata);
	}
	
	this.put_message = function(sm) 
	{
		self.jc.abort();	 // abort the async listener
		var msg = self.jc.get_sync(sm);    // do this synchronous
		self.start_listening(sm,self.handler); // restart listener again
		return msg;
	}
}
