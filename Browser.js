function disable()
{
	return false;
}

function enable()
{
	return true;
}

function set_opacity(elm,perc)
{
    return global.browser.set_opacity(elm,perc);
}

function get_cookie(c_name)
{
	if (document.cookie.length>0)
  	{
  		c_start=document.cookie.indexOf(c_name + "=")
  		if (c_start!=-1)
    		{ 
    			c_start=c_start + c_name.length+1 
    			c_end=document.cookie.indexOf(";",c_start)
    		if (c_end==-1) c_end=document.cookie.length
    			return unescape(document.cookie.substring(c_start,c_end))
    		} 
  	}
	return null
}

// when used from applet (single parameter)
function set_flat_cookie(value)
{
	document.cookie=value;
}

function set_cookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate)

	//exdate.setTime(exdate.getTime()+10000)
	//document.cookie=c_name+ "=" +escape(value)+
	//((expiredays==null) ? "" : ";expires="+exdate)
}

function del_cookie(c_name)
{
    set_cookie(c_name,"",-1);
}

function sniff_platform(platform)
{
    pf = platform.toLowerCase();

    // just Mac ? or MacIntel and MacPPC
    //test = agent.indexOf('macintel'); 
    //if (test >= 0) return 'macintel';
    //test = agent.indexOf('macppc'); 
    //if (test >= 0) return 'macppc';
    test = pf.indexOf('iphone'); // iphone is a more specific mac !
    if (test >= 0) return 'iphone';
    test = pf.indexOf('mac');
    if (test >= 0) return 'mac';
    test = pf.indexOf('linux'); // Linuxi386 for instance
    if (test >= 0) return 'linux';
    test = pf.indexOf('win32');
    if (test >= 0) return 'win32';

    //alert("unkown agent:" + agent);
    return 'win32'; // dan maar weer
}

function sniff_agent(ua)
{
    agent = ua.toLowerCase();

    test = agent.indexOf('netscape');
    if (test >= 0) return 'netscape';
    test = agent.indexOf('firefox');
    if (test >= 0) return 'firefox';
    test = agent.indexOf('opera');
    if (test >= 0) return 'opera';
    test = agent.indexOf('msie');
    if (test >= 0) return 'msie';
    test = agent.indexOf('safari');
    if (test >= 0) return 'safari';
    if (test >= 0) return 'safari';

    //alert("unkown agent:" + agent);
    return 'msie'; // what else ??
}

/**
 * @class Object handling browser dependent methods
 */
function Browser()
{
	//var agt=navigator.userAgent.toLowerCase();
	this.app_name = navigator.appName;
	this.is_major = parseInt(navigator.appVersion);
    this.user_agent = sniff_agent(navigator.userAgent);
    this.platform = sniff_platform(navigator.platform);
    this.is_minor = parseFloat(navigator.appVersion);
	this.is_ie    = false;
	this.is_safari = false;
    this.is_ie7   = (document.all && !window.opera && window.XMLHttpRequest) ? true : false;

    // avoid 'this' in methods 
    var self=this;
    self.captured=false;
	
	// for displaying text in divs
	// roughly the number of pixels each character gets
	this.text_treshold = 20;
	this.text_letterheight = 2.5;

	// YES you only have one mouse, you get 1 set of coordinates !
	this.x =0;
	this.y =0;

    /** 
     * bug internet explorer users
     * @param {String} which What about
     * @return {Boolean} mostly IE cant do something so return a boolean wether to go on or not
     */
    this.ie_flame = function(which)
    {
        if (!this.is_ie) return false;
        switch (which) {
            case "appendChild in other frame":
                alert("Internet Explorer cannot handle dom element being copied to other frames\nI discovered this too late to revert everything here\nAnyway this is a developer tutorial and if you are a developer using IE you deserve this\n\nDon't Use IE... firefox is free AND BETTER");
            break;
            default:
                alert("Don't Use IE... firefox is free AND BETTER");
            break;
        }
        return true;
    }

    /** 
     * stop propagating events 
     * @param {Object} e the event in question
     */
	this.cancel_bubble = function(e)
	{
		if (this.is_ie) {
			window.event.cancelBubble = true;
		} else {
			e.stopPropagation();
		}
	}

	if (this.app_name == "Microsoft Internet Explorer") {
		this.is_ie = true;
		// just filter IE stuff
	}
	if (this.user_agent == "safari") {
		this.is_safari = true;
		// just filter IE stuff
	}

    /** 
     * set opacity (or transaprancy but the higher the percentage the more opaque)
     *   for the current browser
     * @param {Object} elm the dom elm to alter
     * @param {Number} percentage , 0-100, the higer the less transparent
     */
	this.set_opacity = function (elm,percentage)
	{
		if (this.is_ie) {
		 	 str = "alpha(opacity:" + percentage*100 + ")";
			 elm.style.filter=str;
		} else {
			 elm.style.opacity=percentage;
		}
	}

    /** 
     * disable text selection, which is often irritatingly in the way
     */
	this.disable_selection = function()
	{
		if (this.is_ie) {
			document.onselectstart=new Function ("return false")
		} else {
			document.onmousedown=disable;
			document.onclick=enable;
		}
	}

    /** 
     * set iframe content
     */
	this.iframe_set = function(ifr,what)
	{
    	if(this.is_ie) // IE
			ifr.location.href=what;
		else 
			ifr.src=what;
	}

    /** 
     * experimental function, attempt to capture mouse globally
	 * sample function that works even outside browser
	 * but i presume that relies on txt selection
     */
	this.drag = function (o,msg){
		o.onmousedown=function(a){
			var d=document;if(!a)a=window.event;
			//var x=a.layerX?a.layerX:a.offsetX,y=a.layerY?a.layerY:a.offsetY;
			if(o.setCapture)
				o.setCapture();
			else if(window.captureEvents)
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			d.onmousemove=function(a){
				if(!a)a=window.event;
				if(!a.pageX)a.pageX=a.clientX;
				if(!a.pageY)a.pageY=a.clientY;
				//var tx=a.pageX-x,ty=a.pageY-y;
				//o.style.left=tx;
				//o.style.top=ty;
			};
			d.onmouseup=function(){
				if(o.releaseCapture)
				o.releaseCapture();
				else if(window.captureEvents)
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
				d.onmousemove=null;
				d.onmouseup=null;
				alert(msg)
			};
		};
	}

    /** 
     * browser icons, ie uses hand, the rest of the world pointer
     */
	this.icon_name = function(name)
	{
    	if(!this.is_ie) {
			if (name == 'hand') return 'pointer';
		} 
		return name;
	}

    /** 
     * capture mouse for document;
	 * only use in case of emergency, this manually calls the event
	 * functions on the object wherever they come in on the document
     */
	this.mouse_capture = function(o)
	{
		// STORE handlers  (untested, hope it works)
        if (self.captured==false) {
            self.store_mousedown = document.onmousedown;
		    self.store_mouseup = document.onmouseup;
		    self.store_mousemove = document.onmousemove;
            self.captured = true;
        }

		//document.onmousedown = o.onmousedown;
		//document.onmousemove = o.onmousemove;
		//document.onmouseup = o.onmouseup;
		document.onmousedown = function(e) {
			if (o.onmousedown) o.onmousedown(e);
		}
		document.onmousemove = function(e) {
			if (o.onmousemove) o.onmousemove(e);
		}
		document.onmouseup = function(e) {
			if (o.onmouseup) o.onmouseup(e);
		}
	}

    /** 
     * (try to) restore mouse_capture again
     */
	this.mouse_release = function(o)
	{
		// RESTORE original handlers (if set)
        if (self.captured==false) return;

        document.onmousedown = self.store_mousedown;
        document.onmouseup   = self.store_mouseup;
        document.onmousemove = self.store_mousemove;
	}

    /** 
     * set global wid and height, from the given event
     */
    this.event_set_wh = function (e)
    {
        if(this.is_ie) // IE
        {
                        this.w = document.body.clientWidth;
                        this.h = document.body.clientHeight;
        }
        else if(e) // Netscape/Firefox/Opera
        {
            this.w = e.innerWidth;
            this.h = e.innerHeight;
        // optional ?!
        //window.innerWidth;
        //window.innerHeight;
        }
        // and IE
    }


    /**
      * try to normalize a mouse event regardless or the browser used
	  * browser.x,browser.y is the absolute postion in the document
	  * browser.ox,browser.oy the absolute postion within the parent
	  * but beware: only use ox,oy if you dont want events outside the 
	  * parent (like plancanvas) because there the offset is different
	  * a tryout for that is tox,toy (target offset)
      * @param {Object} e mouse event 
      */
	this.event_set_xy = function (e)
	{
    	if(this.is_ie) // IE
    	{
        	this.x = window.event.clientX;
        	this.y = window.event.clientY;
        	this.ox = window.event.offsetX;
        	this.oy = window.event.offsetY;
			this.target = window.event.srcElement;
			if (window.event.button) {
				if (window.event.button == 1)
					this.button = "left";
				else 
				if (window.event.button == 2)
					this.button = "right";
				else 
				//if (window.event.button == 4)
					this.button = "middle";
			} 
    	}
    	else if(e) // Netscape/Firefox/Opera
    	{
        	this.x = e.clientX;
        	this.y = e.clientY;
			if (e.offsetY) { // opera 
        		this.ox = e.offsetX;
        		this.oy = e.offsetY;
			} else {
        		this.ox = e.layerX;
        		this.oy = e.layerY;
			}
			this.target = e.target;
			if (e.button) {
				if (e.button == 2)
					this.button = "right";
				else
					this.button = "middle";
			} else 
				this.button = "left";
		}
        if (this.is_safari && this.platform == 'mac') {
            this.x -= document.body.scrollLeft;
			// next line not necesary it seems (kk, jan 2009)
            //this.y -= document.body.scrollTop;
        }
	}

    /**
      * return the event as if IE did not exist
      * @param {Object} e event in normal browsers
      * @return {Object} e event in any browser
      */
	this.event_get = function (e)
	{
    	if(this.is_ie) // IE
			return window.event
		else 
			return e
	}

    /**
      * return the key event 
      * @param {Object} e event in normal browsers
      * @return {Object} key number typed
      */
	this.event_get_key = function (e)
	{
		var keynum

		/* if(window.event) // IE */
    	if(this.is_ie) // IE
		{
			keynum = window.event.keyCode
		}
		else if(e.which) // Netscape/Firefox/Opera
		{
			keynum = e.which
		}

		return keynum;
	}

    /**
      * get left side regarding scrollbar position 
      * @param {Object} p parent dom element
      * @return {Object} absolute left side, not visible left side
      */
	this.get_scrolled_left = function(p)
	{
		var left = global.browser.getAbsoluteLeft(p);
		left-= document.body.scrollLeft;
		return left;
	}
	
    /**
      * get left side disregarding scrollbar postion
      * @param {Object} dom object
      * @return {Object} absolute left side
      */
	this.getAbsoluteLeft = function(o) {
	oLeft = o.offsetLeft            // Get left position from the parent object
	while(o.offsetParent!=null) {   // Parse the parent hierarchy up to the document element
		oParent = o.offsetParent    // Get parent object reference
		oLeft += oParent.offsetLeft // Add parent left position
		o = oParent
	}
	// (strangely IE is 1 pixel off) (whom did you say ??)
	if (this.is_ie) oLeft ++;
	// Return left postion 
	return oLeft;
	}

	this.getAbsoluteTop = function (o) {
	oTop = o.offsetTop            // Get top position from the parent object
	while(o.offsetParent!=null) { // Parse the parent hierarchy up to the document element
		oParent = o.offsetParent  // Get parent object reference
		oTop += oParent.offsetTop // Add parent top position
		o = oParent
	}
	// Return top position
	return oTop
	}

    /** 
     * set a client cookie
     * @param {String} c_name cookie name
     * @param {String} value cookie value to store client side
     * @param {Number} expiredays day until expiration
     */
	this.set_cookie = function set_cookie(c_name,value,expiredays)
    {
        set_cookie(c_name,value,expiredays);
    }

    /** 
     * Get a client cookie
     * @param {String} c_name cookie name
     * @return {String} cookie value to get from client side
     */
    this.get_cookie = function get_cookie(c_name)
    {
        return get_cookie(c_name);
    }

    /** 
     * Delete a client cookie
     * @param {String} c_name cookie name
     */
    this.del_cookie = function del_cookie(c_name)
    {
        del_cookie(c_name);
    }
    
}
// instantiate 1 (one) browser object and use its methods for browser
// dependent stuff.
global.browser = new Browser();

