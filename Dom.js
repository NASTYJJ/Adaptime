/** 
  * get width of a domelement
  * @param {Object} elm dom element
  */
function dom_get_w(elm) {
   return elm.clientWidth;
}

function fok_us()
{
    this.focus();
}

/** 
  * get height of a domelement
  * @param {Object} elm dom element
  */
function dom_get_h(elm) {
   return elm.offsetHeight;
}

function dom_set_w (elm,x,sfx)
{
   l = dom_append_sfx(x,sfx);
	elm.style.width = l;
}
function dom_set_h (elm,x,sfx)
{
   l = dom_append_sfx(x,sfx);
	elm.style.height = l;
}
function dom_set_left (elm,x,sfx)
{
	//alert(x);
   l = dom_append_sfx(x,sfx);
	elm.style.left = l;
}

function dom_set_color (elm,bg,fg)
{
	if (fg) elm.style.color = fg;	 // optional
	elm.style.background = bg;
}

function dom_set_opacity (elm,percentage)
{
    global.browser.set_opacity(elm,percentage)
}

function dom_set_top (elm,x,sfx)
{
   l = dom_append_sfx(x,sfx);
	elm.style.top = l;
}
/** 
  * remove all children of the given parent
  * @param {Object} parent dom element to 'strip'
  */
function remove_children(parent)
{
    while (parent.childNodes.length > 0) {
        parent.removeChild(parent.firstChild);
    }
}

function remove_tree(parent)
{
    while (parent.childNodes.length > 0) {
		remove_tree(parent.firstChild);
    	c = parent.removeChild(parent.firstChild);
		delete(c);
	}
}

function dom_xywh (elm,x,y,w,h)
{
    if (x != null) {
		elm.style.left=x;
	}
    if (y != null) {
        elm.style.top=y;
    }
    // inherit width and height
    if (w != null) {
		elm.style.width=w;
	}
    if (h != null) {
		elm.style.height=h;
	}
}

function dom_xywh_sfx (elm,x,y,w,h,sfx)
{
    if (x != null) {
		var u = dom_append_sfx(x,sfx);
		elm.style.left=u;
	}
    if (y != null) {
		var u = dom_append_sfx(y,sfx);
        elm.style.top=u;
    }
    // inherit width and height
    if (w != null) {
		var u = dom_append_sfx(w,sfx);
		elm.style.width=u;
	}
    if (h != null) {
		var u = dom_append_sfx(h,sfx);
		elm.style.height=u;
	}
}

function dom_xywh_px (elm,x,y,w,h)
{
	dom_xywh_sfx(elm,x,y,w,h,"px");
}

function dom_xywh_perc (elm,x,y,w,h)
{
	dom_xywh_sfx(elm,x,y,w,h,"%");
}

function dom_centertext(elm,str)
{
    if (!elm.center) {
        elm.center = document.createElement("div");
    }
    elm.center.className=elm.className;
    dom_disable_borders(elm.center);
    elm.center.id=this.id;
    elm.center.style.display="inline";
    elm.center.style.position="absolute";
    elm.appendChild(elm.center);

    elm.center.innerHTML=str;
    var wp = dom_get_w(elm);
    var hp = dom_get_h(elm);
    var w = dom_get_w(elm.center);
    var h = dom_get_h(elm.center);
    dom_set_left(elm.center,(wp-w)/2,'px');
    dom_set_top(elm.center,(hp-h)/2,'px');
    //dp((wp-w)/2);
}

/** 
  * replace all children of the given parent with newchild
  * @param {Object} parent dom element 
  * @param {Object} newchild dom element to become the only child
  */
function replace_child(parent,newchild)
{
    remove_children(parent);
    parent.appendChild(newchild);
}

/** 
  * make newchild a hey.. new child , of parent
  * @param {Object} parent dom element 
  * @param {Object} newchild new dom child element
  */
function append_child(parent,newchild)
{
    parent.appendChild(newchild);
}

/** 
  * remove child from parent
  * @param {Object} parent dom element 
  * @param {Object} child dom child element to remove
  */
function remove_child(parent,child)
{
    parent.removeChild(child);
}

/** 
  * create a table with callapsed borders
  * @return {Object} dom table element 
  */
function collapsed_table()
{
	var tbl= document.createElement('table');
    tbl.style.borderCollapse="collapse";
    tbl.border=0;
    return tbl;
}

/** 
  * recalculate the x position when horizontal scrollbar is shifted
  * @param {Number} x coordinate
  * @return {Number} scrolled value
  */
function get_scrolled_x(x)
{
    return x + document.body.scrollLeft;
}

/** 
  * recalculate the y position when vertical scrollbar is shifted
  * @param {Number} y coordinate
  * @return {Number} scrolled value
  */
function get_scrolled_y(y)
{
    return y + document.body.scrollTop;
}

/** 
  * give position in pixels 
  * @param {Number} x coordinate
  * @return {Number} scrolled value
  */
function get_relative_x(x,p)
{
    x -= global.browser.getAbsoluteLeft(p.domelm);
    x += document.body.scrollLeft;
    return x;
}

/** 
  * give position in pixels 
  * @param {Number} y coordinate
  * @return {Number} scrolled value
  */
function get_relative_y(y,p)
{
    y -= global.browser.getAbsoluteTop(p.domelm);
	var topper;
  	if (!document.body.scrollTop) {
    	topper = document.documentElement.scrollTop;
  	}
  	else {
    	topper = document.body.scrollTop;
  	}
    y += topper;
	//console.log(document.body.scrollTop);
    return y;
}

function dom_disable_borders(elm)
{
    elm.style.border=0; // seems enough !?
}

function set_img_single (domelm,imgname) {
   url = "url("+imgname+")";
   domelm.style.backgroundRepeat="no-repeat";
   if (imgname != null) domelm.style.backgroundImage=url;
   else domelm.style.backgroundImage="";
   domelm.display="block";
} 

function set_img(p,imgname)
{    
    url = "url("+imgname+")";
    if (imgname != null) p.style.backgroundImage=url;
}

function center_img(p,imgname)
{    
    url = "url("+imgname+")";
    if (imgname != null) p.style.backgroundImage=url;
	p.style.left="50%";
}

function delete_child(parent,oldchild)
{
    for (c=0; c< parent.childNodes.length; c++) {
        if (parent.childNodes[c] == oldchild) {
            parent.removeChild(oldchild);
            return;
        }
    }
}

function dom_append_sfx(x,sfx)
{
    if (!sfx) sfx="px";
	if (sfx=="px") x = Math.round(x);
    return x + sfx;
}

function dom_appendpx(x)
{
  	if (typeof x == 'string') {
		var l = x.length;
  		if (x.slice(l-2) == 'px') 
			return x;
	}
	return x + 'px';
}

function dom_stripw(elm)
{
    var w = elm.style.width;
  	if (typeof w != 'string') return w;
	var l = w.length;
  	if (w.slice(l-2) == 'px') 
        return parseInt(w.slice(0,l-2))
  	if (w.slice(l-1) == '%') {
        base = parseFloat(w.slice(0,l-1))
        //w = Math.round(base * elm.clientWidth);
        w = base * elm.clientWidth;
    }

    // NO other units 
    return w;
}

function dom_striph(elm)
{
    var h = elm.style.height;
  	if (typeof h != 'string') return h;
	var l= h.length;
  	if (h.slice(l-2) == 'px') 
        return parseInt(h.slice(0,l-2))
  	if (h.slice(l-1) == '%') {
        base = parseFloat(h.slice(0,l-1))
        //h = Math.round(base * elm.clientHeight);
        h = base * elm.clientHeight;
    }

    // NO other units 
    return h;
}

function dom_strippx(s)
{
    if (!s) return null
	if (typeof s != 'string') return s;
	var l = s.length;
  	if (s.slice(l-2) == 'px') {
        return parseInt(s.slice(0,l-2))
    }
  	if (s.slice(l-1) == '%') {
        return parseFloat(s.slice(0,l-1))
    }
    return s;
}

function dom_set_text(elm,str)
{
    var bg = elm.style.backgroundColor;
    // temp test, how determine if its a dark color ?
    if (bg)
    {
         var txtclr = letter_color(bg);
         if (txtclr) elm.style.color = txtclr;
    }
    elm.innerHTML=str;
}


/** 
  * @class Empty class and placeholder for some Dom specific functions
  */
function Dom()
{
    // empty ?, most of these are class functions !
}
//Dom.prototype = new Class("Dom");
Dom.prototype = new Class();
/** 
  * remove all children from parent and make child the only child node
  * @param {Object} parent parent dom element
  * @param {Object} newchild the new (only) child of parent
  */
Dom.replace_child = replace_child;
/** 
  * remove all children from parent 
  * @param {Object} parent parent dom element
  */
Dom.remove_children = remove_children;
/** 
  * remove the specified child from parent
  * @param {Object} parent parent dom element
  * @param {Object} oldchild child dom elmenet do delete
  */
Dom.delete_child = delete_child;
/** 
  * strip 'px' from string if any
  * @param {Object} s coordinate string to strip
  */
Dom.strip_px = dom_strippx;

/** 
  * @class bas class for dom elements 
  * @param {Object} elm dom element to wrap around
  */
function DomElement(elm)
{
    this.domelm = elm;
    // backpointer to the DomElm wrapper
    this.domelm.DE = this;
    
    /** 
     * delete child oldchild from this instance
     * @param {Object} oldchild dom element to delete
     */
    function delete_child(oldchild)
    {
        if (!oldchild) return;

        this.removeChild(oldchild);
    }

    /** 
     * set text in this instnace and try to guess a readable txt color
     * @param {String} txt Text to set 
     */
    this.set_text = function(str)
    {
        var bg = this.domelm.style.backgroundColor;
        // temp test, how determine if its a dark color ?
        if (bg)
        {
            var txtclr = letter_color(bg);
            if (txtclr) this.domelm.style.color = txtclr;
        }
        this.domelm.innerHTML=str;
    }

    /** 
     * set text font size
     * @param {Number} size font size
     */
    this.set_font = function(size)
    {
        this.domelm.style.fontSize=size;
    }

    /** 
     * set background color and transparency
     * @param {String} clr color string for background
     * @param {Number} opq opacity (100-transparency) value
     */
    this.set_bg = function(clr,opq)
    {
        if (clr) this.domelm.style.background=clr;
        if (opq) this.set_opacity(opq);
    }

    /** 
     * set background imge
     * @param {String} imgname plain image name
     */
    this.set_img = function(imgname)
    {    
        url = "url("+imgname+")";
        if (imgname != null) this.domelm.style.backgroundImage=url;
    }

    this.set_img_single = function(imgname) {
        url = "url("+imgname+")";
        if (imgname != null) this.domelm.style.backgroundImage=url;
             this.domelm.style.backgroundRepeat="no-repeat";
    } 

    /** 
     * set background transparency
     * @param {Number} opq opacity (100-transparency) value
     */
    this.set_opacity = function(percentage)
    {
        global.browser.set_opacity(this.domelm,percentage)
    }

    /** 
     * set cursor to use when mouse is over this domelm
     * @param {String} img_name cursor image name
     */
    this.set_cursor = function(img_name)
    {
        if (img_name != null) this.domelm.style.cursor = img_name;
    }

    /** 
     * remove all children from instance and make child the only child node
     * @param {Object} what the new (only) child of this instance
     */
    this.replace_child = function(what)
    {
        return Dom.replace_child(this.domelm,what);
    }

    /** 
     * set position style 
     * @param {String} either "absolute", "relative", "static" or "fixed"
     */
    this.set_position = function(postype)
    {
        this.domelm.style.position=postype;
    }

    /** 
     * set overflow style 
     * @param {String} either "visible", "scroll", "hidden" or "auto"
     */
    this.set_overflow = function(type)
    {
        this.domelm.style.overflow=type;
    }

    /** 
     * set level, zIndex or stacking order of this instance
     * @param {Number} level Z-index 
     */
    this.set_z = function(level)
    {
        this.domelm.style.zIndex= level;
    }

    /** 
     * get left side of the element as a number
     * @return {Number} stripped left edge
     */
    this.get_left = function()
    {
        var l = 0;
        if (this.domelm.style.left)  {
            l = Dom.strip_px(this.domelm.style.left);
        }
        return l;
    }

    /** 
     * get upper side of the element as a number
     * @return {Number} stripped top edge
     */
    this.get_top = function()
    {
        var l = 0;
        if (this.domelm.style.top)  {
            l = Dom.strip_px(this.domelm.style.top);
        }
        return l;
    }

    /** 
     * set left side of the element 
     * @param {Number} x left edge in pixels
     */
    this.set_left = function(x,sfx)
    {
		l = dom_append_sfx(x,sfx);
       	this.domelm.style.left = l;
    }

    /** 
     * set top side of the element 
     * @param {Number} x top edge in pixels
     */
    this.set_top = function(x,sfx)
    {
		l = dom_append_sfx(x,sfx);
       	this.domelm.style.top = l;
    }

    /** 
     * get width the element in pixels
     * @return {Number} stripped width in pixels
     */
    this.get_w= function()
    {
        return Dom.strip_px(this.domelm.style.width);
    }

    /** 
     * get height the element in pixels
     * @return {Number} stripped height in pixels
     */
    this.get_h = function()
    {
        return Dom.strip_px(this.domelm.style.height);
    }
    
    /** 
     * set width of the element 
     * @param {Number} w width in pixels
     */
    this.set_w = function (w,sfx)
    {
	if (w<0) w=0;
        var l = dom_append_sfx(w,sfx);
        this.domelm.style.width = dom_append_sfx(w,sfx);
    }

    /** 
     * set height of the element 
     * @param {Number} h width in pixels
     */
    this.set_h = function (h,sfx)
    {
		if (h<0) h=0;
        this.domelm.style.height = dom_append_sfx(h,sfx);
    }

    /** 
     * get right side of the element as a number
     * @return {Number} stripped right edge
     */
    this.get_right = function()
    {
        var l = this.get_left();
        return l+Dom.strip_px(this.domelm.style.width);
    }

    /** 
     * get lower side of the element as a number
     * @return {Number} stripped lower edge
     */
    this.get_bottom = function()
    {
        var l = this.get_top();
        return l+Dom.strip_px(this.domelm.style.height);
    }

    /** 
     * position the element
     * @param {Number} x left edge in pixels
     * @param {Number} y top edge in pixels
     * @param {Number} w width in pixels
     * @param {Number} h height in pixels
     */
    this.xywh = function (x,y,w,h)
    {
		dom_xywh(this.domelm,x,y,w,h);
    }

    this.xywh_px = function (x,y,w,h)
    {
		dom_xywh_px(this.domelm,x,y,w,h);
    }

    /** 
     * position the element in xy xy format
     * @param {Number} x left edge in pixels
     * @param {Number} y top edge in pixels
     * @param {Number} x2 right edge in pixels
     * @param {Number} y2 bottom edge in pixels
     */
    this.xyxy = function (x,y,x2,y2)
    {
        if (x2 == null) x2 = dom_strippx(this.domelm.style.left) + dom_strippx(this.domelm.style.width)
        if (y2 == null) y2 = dom_strippx(this.domelm.style.top) + dom_strippx(this.domelm.style.height)
        if (x) this.domelm.style.left= dom_appendpx(x);
        if (y) this.domelm.style.top=y;

        // recalc w/h
        this.domelm.style.width= x2 - dom_strippx(this.domelm.style.left)
        this.domelm.style.height= y2 - dom_strippx(this.domelm.style.top)
    }
}
//DomElement.prototype = new Class("DomElement");
DomElement.prototype = new Class();

var id = 0;

/** 
  * @class wrapper around "div" element
  * @base DomElement
  * @constructor create div under given parent
  * @param {Object} parent make new div child of parent
  * @param {Number} x left side in pixels
  * @param {Number} y top side in pixels
  * @param {Number} w width in pixels
  * @param {Number} h height in pixels
  */
function DomDiv(parent,x,y,w,h,clr,opt_before)
{
    var div = document.createElement("div");    
    // mind the order, methods, inherit, use
    this.inheritz(new DomElement(div));
    // member domelm exists now (is div)

    this.domelm.name = id++;

    // link it under parent
	if (clr) div.style.background  = clr;
    if (opt_before) 
        parent.insertBefore(div,opt_before);
    else
        parent.appendChild(div);

	this.noselection=function()
	{
    	this.domelm.onselectstart = function () { return false; } // ie
    	this.domelm.onmousedown = function () { return false;  } // mozilla
	}

	// prbably has to be done all the way up
	this.selection=function()
	{
    	this.domelm.onselectstart = null;
    	this.domelm.onmousedown = null;
	}

	// default no selection
	this.noselection();

    /** 
      * set div border properties
      * @param {Number} x border width
      * @param {String} clr border color
      * @param {String} stl border style. If undefinde style is "solid"
      */
    this.set_border = function (x,clr,stl) 
    {
        if (!stl) stl = "solid";
        str = x +"px " + stl + " " + clr;
        this.domelm.style.border=str;
    }

	this.set_border_top=function(x,clr,stl) 
	{
        if (!stl) stl = "solid";
        str = x +"px " + stl + " " + clr;
        this.domelm.style.borderTop=str;
	}
	this.set_border_bottom=function(x,clr,stl) 
	{
        if (!stl) stl = "solid";
        str = x +"px " + stl + " " + clr;
        this.domelm.style.borderBottom=str;
	}
	this.set_border_left=function(x,clr,stl) 
	{
        if (!stl) stl = "solid";
        str = x +"px " + stl + " " + clr;
        this.domelm.style.borderLeft=str;
	}

	this.set_border_right=function(x,clr,stl) 
	{
        if (!stl) stl = "solid";
        str = x +"px " + stl + " " + clr;
        this.domelm.style.borderRight=str;
	}
    /** 
     * set text in this instnace and try to guess a readable txt color
     * @param {String} txt Text to set 
     */
    this.set_text = function(str)
    {
        var bg = this.domelm.style.backgroundColor;
        // temp test, how determine if its a dark color ?
        if (bg)
        {
            var txtclr = letter_color(bg);
            if (txtclr) this.domelm.style.color = txtclr;
        }
        this.domelm.innerHTML=str;
    }

    /** 
     * set an html object centered in this div
	 * try to p[ut it dead center , this involves a second div !!
     * @param {Object} obj object (or text) to center
     */
    this.set_centerobject = function(obj)
    {
        var bg = this.domelm.style.backgroundColor;
		if (!this.center) {	
			this.center = document.createElement("div");
			this.domelm.appendChild(this.center);
        }
        // no ? this also copies background
    	//this.center.className=this.domelm.className;
        dom_disable_borders(this.center);
    	this.center.id=this.domelm.id;
		this.center.style.display="inline";
		this.center.style.position="absolute";
        // temp test, how determine if its a dark color ?
        if (bg)
        {
            var txtclr = letter_color(bg);
            if (txtclr) this.domelm.style.color = txtclr;
        }
		if (typeof(obj) == 'string') {
        	this.center.innerHTML=obj;
		} else {
			remove_children(this.center)
        	this.center.appendChild(obj);
		}
		var wp = dom_get_w(this.domelm);
		var hp = dom_get_h(this.domelm);
		var w = dom_get_w(this.center);
		var h = dom_get_h(this.center);
		dom_set_left(this.center,(wp-w)/2,'px');
		dom_set_top(this.center,(hp-h)/2,'px');
		//dp((wp-w)/2);
    }

    /** 
     * set text in this instance and try to guess a readable txt color
	 * try to p[ut it dead center , this involves a second div !!
     * @param {String} txt Text to set 
     */
    this.set_centertext = function(str) {
		this.set_centerobject(str);
	}


    /** 
     * set editable field in this instance and
	 * try to p[ut it dead center , this involves a second div !!
     * @param {String} txt Text to set in edit field
     */
    this.set_centeredit = function(str,fnc)
	{
    	var inp = document.createElement("input");    
		inp.value = str;
    	inp.onchange = fnc;
		this.set_centerobject(inp);
		return inp;
	}
    //str = "1px solid";
    //this.domelm.style.border=str;
    //div.style.fontSize=10;
    //div.style.fontSize=1;
	//div.innerHTML=" ";
    this.xywh_px(x,y,w,h);
}
//DomDiv.prototype = new Class("DomDiv");
DomDiv.prototype = new Class();

/** 
  * @class wrapper around "td" element
  * @base DomElement
  * @constructor create table data under given parent
  * @param {Object} parent parent node of new element
  * @param {Number} width width in pixels
  */
function DomTd(parent,width)
{
    //this.width = width;
    this.inheritz(new DomElement(parent));
    this.xywh(0,0,11,null);
}
//DomTd.prototype = new Class("DomTd");
DomTd.prototype = new Class();

/** 
  * @class wrapper around "tr" element
  * @base DomElement
  * @constructor create table row under given parent
  * @param {Object} parent parent node of new element
  * @param {Number} height height in pixels
  */
function DomTr(elm,height)
{
    this.cols = new Da();
    this.height = height;

    /** get current height
      * @return {Number} current height in pixels
      */
    this.get_height = function()
    {
        return this.height;
    }

    /** add new column to table row
      * @param {Number} pos At which position to insert column
      * @param {Number} wid how wide will the new column be
      * @return {DomTd} newly created DomTd object
      */
    this.add_col = function(pos,wid)
    {
        if (pos >= this.cols.length) pos = this.cols.length;
        this.cell = this.domelm.insertCell(pos);
        var td = new DomTd(this.cell,wid);

        //cell.appendChild(pc);
        this.cols.ins(td,pos);

        return td;
    }

    this.inheritz(new DomElement(elm));
}
DomTr.prototype = new Class();

/** 
  * @class wrapper around "table" element
  * @base DomElement
  * @constructor create table under given parent
  * @param {Object} parent parent node of new element
  */
function DomTable(parent)
{
    var tbl = this.tbl = document.createElement("table");    
    this.tbl.border=0;
    this.rows = new Da();

    /** set table border style
      * @param {Number} sz border width 
      * @param {String} c border color
      */
    this.set_borders = function(sz,c)
    {
        this.tbl.border = 0;
        this.tbl.cellSpacing=sz;
        this.tbl.cellPadding=0;
        if (c) this.tbl.style.background = c;
    }

    this.set_class = function(str)
    {
        if (str) this.tbl.className=str;
    }

    /** get row at given position
      * @param {Number} row which row to get
      * @return {DomTr} table row requested
      */
    this.get_row = function(row)
    {
        if (row >= this.rows.length) return null;
        var tr = this.rows.get(row);
        return tr;
    }
    
    /** get cell at given position
      * @param {Number} row which row to get it from
      * @param {Number} col which col to get from row
      * @return {DomTd} table data requested
      */
    this.get_cell = function(row,col)
    {
        if (row >= this.rows.length) return null;
        var tr = this.rows.get(row);
        return tr.cols.get(col);
    }
    
    /** add column at given position
      * @param {Number} row which row to add column to
      * @param {Number} col column position for the new column
      * @return {DomTd} new table data created
      */
    this.add_col = function(row,col)
    {
        var tr = this.rows.get(row);
        var td = tr.add_col(col);

        return td;
    }

    /** add row at given position
      * @param {Number} row position to insert new row
      * @param {Number} height height of the new row
      * @return {DomTr} new table row created
      */
    this.add_row = function(pos,height)
    {
        if (pos >= this.rows.length) pos = this.rows.length;
        var row = this.tbl.insertRow(pos);
        tr = new DomTr(row,height);
        this.rows.ins(tr,pos);
        return tr;
    }
    // now wrap it in a DomElement 
    this.inheritz(new DomElement(tbl));
    parent.appendChild(this.tbl);
}
DomTable.prototype = new Class();

/** 
  * @class wrapper around text "input" button element
  * @base DomElement
  * @constructor create input under given parent
  * @param {Object} parent parent node of new element
  * @param {String} val value or caption 
  * @param {Function} fnc callback function to trigger 'onchange'
  * @param {String} id id name 
  */
function DomButton(parent,val,fnc,id)
{
    var inp = document.createElement("input");    

    inp.type="submit";
    inp.value = val;
    inp.id = id;
    inp.style.border=0;
    //inp.style.width="100%";
    inp.onclick = fnc;
    this.inheritz(new DomElement(inp));
    parent.appendChild(inp);
    return this;
}
DomButton.prototype = new Class();

/** 
  * @class wrapper around text "input" element
  * @base DomElement
  * @constructor create input under given parent
  * @param {Object} parent parent node of new element
  * @param {String} val value or caption 
  * @param {Function} fnc callback function to trigger 'onchange'
  * @param {String} id id name 
  */
function DomEdit(parent,val,fnc,id)
{
    var inp = document.createElement("input");    

    inp.value = val;
    inp.oldvalue = val;
    inp.id = id;
    inp.style.border=0;
    inp.onchange = fnc;
    this.inheritz(new DomElement(inp));
    parent.appendChild(inp);
    return this;
}
DomEdit.prototype = new Class();

/** 
  * @class wrapper around "option" element
  * @base DomElement
  * @constructor create option under given parent
  * @param {Object} parent parent node of new element
  * @param {String} val value or caption 
  */
function DomOption(parent,val)
{
    var inp = document.createElement("option");    

    inp.innerHTML = val;
	inp.value=false; // always start unselected
    parent.appendChild(inp);

	this.set=function()
	{
		inp.selected="selected";
	}

	this.unset=function()
	{
		inp.selected="unselect";
		inp.value=false;
	}

	this.selected=function()
	{
		return inp.selected;
	}

    return this;
}
DomOption.prototype = new Class();

/** 
  * @class wrapper around "select" element
  * @base DomElement
  * @constructor create select under given parent
  * @param {Object} parent parent node of new element
  * @param {Array} val array of options to create
  * @param {Function} fnc callback function to trigger 'onchange'
  * @param {String} id id name 
  */
function DomSelect(parent,val,fnc,id,mul,sz)
{
    this.sel = document.createElement("select");    
	if (mul) {
		this.sel.multiple="multiple";
		this.size=5;
	}
	this.opts= Array();
	var t=0;

    for (a in val) {
		var opt = 
		this.opts[t++] = 
        new DomOption(this.sel,val[a]);
    }

	this.clear=function()
	{
		this.sel.selectedIndex=-1;
	}

    this.sel.style.border=0;
    this.sel.onchange = fnc;
	this.clear();
    this.inheritz(new DomElement(sel));
    parent.appendChild(this.sel);
	this.set=function(i) {
		this.opts[i].set();
	}

	this.selected=function(i) {
		return this.opts[i].selected();
	}

    return this;
}

function DomSelectMultiple(parent,val,fnc,id,sz)
{
	var d = DomSelect(parent,val,fnc,id,true,sz);
	return d;
}
