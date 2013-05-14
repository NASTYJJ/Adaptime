Appointment.LEFT = 1;
Appointment.RIGHT = 2;
Appointment.BODY = 3;
Appointment.TOP = 4;
Appointment.BOTTOM = 5;
Appointment.WHAT = 6;

// no key handling, because it is for the whole document
// do a popup or a waste-bin
function APKey(e)
{
    var k = global.browser.event_get_key(e);
}

function AppType(id,name,color,cname,opacity,editable)
{
    this.id = id;
    this.name = name;
    // color takes precedence !
    this.color = color;
    this.cname = null;
	if (cname!=undefined) this.cname=cname;
    this.editable=true;
    if (editable!=undefined) this.editable=editable;
    this.fg = "white"; // for now, make it a parameter
	this.opacity = 1.0;
	if (opacity!=undefined) this.opacity = opacity;

    this.railw=0;
    this.stopw=0;
	this.lmargin=0;
	this.rmargin=0; 

	this.set_margins=function(lmargin,rmargin)
	{
		this.lmargin=lmargin;
		this.rmargin=rmargin;
	}

    this.set_borders=function(railw,stopw,clr)
    {
        this.railw=railw;
        this.stopw=stopw;
        this.bcolor=clr;
    }

    // backward compatibility, the color is overwritten !
    this.set_rails=function(railw,railc)
    {
        this.railw=railw;
        this.bcolor=railc;
    }

    this.set_stops=function(stopw,stopc)
    {
        this.stopw=stopw;
        this.bcolor=stopc;
    }
}

function APMove(e)
{
    //alert("dammit");
}

/** 
 * @class Appointment or timeslot on a plancanvas
 * @param {Object} pcanvas, PlanCanvas on which to create this Appointment
 * @param {Number} start start of Appointment
 * @param {Number} end end of Appointment
 * @param {Object} apptype type of this Appointment
 * @param {String} id supposedly unique id of this app
 */
function Appointment(pcanvas, start, end, apptype, id, flags)
{
	var thisobj=this;
    this.pcanvas = pcanvas;
    var n=0;

   	n = this.pcanvas.apps.length;
    this.pcanvas.apps[n] = this;
    this.resizing = "f"; // use 'b'ack and 'f'orth 
    this.id = id;
    this.tw = new TimeWindow(start,end);
	this.selected=false;

	this.name="app";

    this.apptype = apptype;
	if (!apptype.editable) flags |= PlanCanvas.FLAG_NORESIZE | PlanCanvas.FLAG_NOMOVE;
    this.after=false;
    this.showtimes=true;
	this.edittimes=false;
    this.grip=10;
	this.border=1;
	// !! WARNING !! keep this 2 max !
	// because dragging it between PlanCanvas' will make the appointment
	// shrink because the clientHeight measurement includes the border
	this.selborder=2; 

	// defaults
    this.may_move=true;
    this.may_cross=true;
    this.may_overlap=true;
    this.may_resize=true;

	this.is_moveable=function() { return this.may_move; }

	// experimental per-app restrictions
    if (flags & PlanCanvas.FLAG_NOMOVE)   this.may_move=false;
    if (flags & PlanCanvas.FLAG_NOCROSS)  this.may_cross=false;
    if (flags & PlanCanvas.FLAG_OVERLAP)  this.may_overlap=true;
    if (flags & PlanCanvas.FLAG_NORESIZE) this.may_resize=false;

	// reset selection after reread
	if (pcanvas.may_select && pcanvas.ddc.sel_id==id)  {
		thisobj.selected=true;
	} 
	else 
		thisobj.selected=false;


    this.set_text=function(ftxt,showtimes,after)
    {
        this.freetext=ftxt;
        this.showtimes=showtimes;
        if (after) this.after=after;
        this.redraw_times();
    }

	this.set_editable=function(on)
	{
       	this.edittimes=on;
        this.redraw(this);
	}

	// also writes !!
    this.set_tw=function(tw)
    {
		var ret=true;
		// create en event with the old times for possible rollback
        var evt = new Event(event_move,this.pcanvas,this,null);
        evt.from.tw = new TimeWindow(this.tw.start, this.tw.end);
		evt.end_event(this.pcanvas);
		// now assign the new values for testing
        evt.to.tw=this.tw=tw;
		
        if (!this.pcanvas.may_move) ret = false;
        if (evt.from.dragzone != evt.to.dropzone) {
            if (!this.pcanvas.may_cross) ret = false;
        }
		// just do it and then test 
        if (this.pcanvas.test_overlap(this) && !this.pcanvas.may_overlap) ret = false;
        if (ret == true) ret = this.pcanvas.handler(evt);
        if (ret == false) evt.rollback();
        this.pcanvas.cur_app = null;
        this.pcanvas.ddc.mov_obj = null;
    }

	this.set_start=function(s)
	{
		var tw = new TimeWindow(s,this.tw.end);
		this.set_tw(tw);
	}

	this.set_end=function(e)
	{
		var tw = new TimeWindow(this.tw.start,e);
		this.set_tw(tw);
	}

    // where to 'grip' when moving
    this.set_grip = function (x)
    {
        if (this.pcanvas.is_vertical)
            var l = this.get_top();
        else
            var l = this.get_left();

        /* x = this.pcanvas.pxscale.get_world(x); */
        this.grip = x-l;
    }

    this.set_apptype = function(type)
    {
        this.apptype=type;
        if (type.cname){
	    	//this.domelm.style.background="";
            this.domelm.className  = "appointment";
            this.inner.domelm.className  = "appointment";
			if (type.cname) { 
				this.domelm.className  += " " + type.cname; 
            	this.inner.domelm.className  += " " + type.cname;
			}
        }
        if (type.color) {
			dom_set_color(this.inner.domelm,type.color,type.fg);
        }
        if (type.opacity) {
			dom_set_opacity(this.inner.domelm,type.opacity);
		}
        var evt = new Event(event_apptype,this.pcanvas,this,null);
        evt.apptype=type;
        this.pcanvas.handler(evt);
        this.redraw(this);
    }

    this.clear = function()
    {
        var n = this.pcanvas.appointment_get_index(this);
        if (n<0) return;
        this.pcanvas.appointment_del(n);
    }

    this.resize_left = function (p,x)
    {
        this.resizing = "b";
        //var r = this.get_right();
		var r = this.pcanvas.scale.get_model(this.tw.end);
        if (x < 0) x = 0;
        var s = this.pcanvas.scale.snap_model(x);
        var tmp = this.pcanvas.scale.get_world(s);
        this.tw.start = this.pcanvas.scale.snap_world(tmp);
        this.sl(s);
        this.sw(r-s);
    }

    this.resize_up = function (p,y)
    {
        this.resizing = "b";
	    var b = this.pcanvas.scale.get_model(this.tw.end);
        if (y < 0) y = 0;
        var s = this.pcanvas.scale.snap_model(y);
        var tmp = this.pcanvas.scale.get_world(s);
        this.tw.start = this.pcanvas.scale.snap_world(tmp);
        this.st(s);
        this.sh(b-s);
    }

    this.del = function()
    {
        //alert("should delete " + this);
    }

    this.resize_right = function (p,x)
    {
        this.resizing = "f";
        var pw = new Coord(p.clientWidth);
		// TODO : switchable percentage/pixels
        if (x > pw.n) x = pw.n;
		/* if (x > 100) x = 100; */
        var x = this.pcanvas.scale.snap_model(x);
        var l = this.get_left();
        this.tw.end = this.pcanvas.scale.get_world(x);
        this.tw.end = this.pcanvas.scale.snap_world(this.tw.end);
        this.sw(x-l);
    }

    // check for invisible app, make min (1 pix) if so
    this.check=function()
    {
        if (this.pcanvas.is_vertical) {
            if (this.domelm.clientHeight < 2) {
                this.sh(20);
			}
        } else {
            if (this.domelm.clientWidth < 2) {
                //this.set_w(this.pcanvas.min + this.pcanvas.suffix);
            }
        }
    }

    this.resize_down = function (p,y)
    {
        this.resizing = "f";

        var pw = new Coord(p.clientHeight);
		// TODO : switchable percentage/pixels
		//if (y > 100) y = 100;
        if (y > pw.n) y = pw.n;
        var y = this.pcanvas.scale.snap_model(y);
        var t = this.get_top();
        this.tw.end = this.pcanvas.scale.get_world(y);
        this.tw.end = this.pcanvas.scale.snap_world(this.tw.end);
        this.sh(y-t);
    }

    this.resize_v = function (p,y)
    {
        var curtop = this.get_top();
        var curbottom = this.get_bottom();

        /* y = this.pcanvas.pxscale.get_world(y); */
        if (this.resizing == "f") {
            if (y > curtop) {
                this.resize_down(p,y);
            } else {
                // compensate swap to left
                this.st(y);
                this.sh(curtop-y);
		var tmp= this.tw.start;
		this.tw.start=this.tw.end;
		this.tw.end=tmp;
                this.resize_up(p,y);
            }
        } else 
        if (this.resizing == "b") {
            if (y > curbottom) {
                // compensate swap to right
                this.st(curbottom);
                this.sh(y-curbottom);
		var tmp= this.tw.start;
		this.tw.start=this.tw.end;
		this.tw.end=tmp;
                this.resize_down(p,y);
            } else {
                this.resize_up(p,y);
            }
        }
        this.redraw_times();
    }

    this.resize_h = function (p,x)
    {
        var curleft = dom_strippx(this.get_left());
        var curright = dom_strippx(this.get_right());

        /* x = this.pcanvas.pxscale.get_world(x); */
        if (this.resizing == "f") {
            if (x > curleft) {
                this.resize_right(p,x);
            } else {
                // compensate swap to left
                this.sl(x);
                this.sw(curleft-x);
		var tmp= this.tw.start;
		this.tw.start=this.tw.end;
		this.tw.end=tmp;
                this.resize_left(p,x);
            }
        } else 
        if (this.resizing == "b") {
            if (x > curright) {
                // compensate swap to right
                this.sl(curright);
                this.sw(x-curright);
		var tmp= this.tw.start;
		this.tw.start=this.tw.end;
		this.tw.end=tmp;
                this.resize_right(p,x);
            } else {
                this.resize_left(p,x);
            }
        }
        this.redraw_times();
    }

    this.move_v = function (p,y)
    {
		var outer = dom_strippx(this.domelm.style.height);
		// outer lines of the div, add 2 borders
		if (thisobj.selected) {
			outer += thisobj.selborder;
			outer += thisobj.selborder;
		}

        var h = new Coord(outer);
        y-=this.grip;
        var s = this.pcanvas.scale.snap_model(y);

        this.tw.start = this.pcanvas.scale.get_world(s);
        this.tw.start = this.pcanvas.scale.snap_world(this.tw.start);
        this.tw.end = this.pcanvas.scale.get_world(s+h.n);
        this.tw.end = this.pcanvas.scale.snap_world(this.tw.end);

        this.st(s);
        this.sl(0);
        this.redraw_times();
    }

    this.move_h = function (p,x)
    {
		// untested (tested for vertical and copied)
		var outer = dom_strippx(this.domelm.style.width);
		if (thisobj.selected) {
			outer += thisobj.selborder;
			outer += thisobj.selborder;
		}

        var w = new Coord(outer);
        /* x = this.pcanvas.pxscale.get_world(x); */
        x-=this.grip;
        var s = this.pcanvas.scale.snap_model(x);

        this.tw.start = this.pcanvas.scale.get_world(s);
        this.tw.start = this.pcanvas.scale.snap_world(this.tw.start);
        this.tw.end = this.pcanvas.scale.get_world(s+w.n);
        this.tw.end = this.pcanvas.scale.snap_world(this.tw.end);

        this.st(0);
        this.sl(s);
        this.redraw_times();
    }

    this.resize_app_h=function(p,s)
    {
        this.tw.end = this.tw.start+s;

        var left  = this.pcanvas.scale.get_model(this.tw.start);
        var right = this.pcanvas.scale.get_model(this.tw.end);
        var wid   = right-left;

        this.sw(wid);
        this.redraw_times();
    }

    this.resize_app_v=function(p,s)
    {
        this.tw.end = this.tw.start+s;

        var left  = this.pcanvas.scale.get_model(this.tw.start);
        var right = this.pcanvas.scale.get_model(this.tw.end);
        var wid   = right-left;

        this.sh(wid);
        this.redraw_times();
    }

    this.move_app_h=function(p,s)
    {
        var w = new Coord(this.domelm.style.width);

	var dur = this.tw.end-this.tw.start;
        this.tw.start = s;
        this.tw.end = this.tw.start + dur;

        s = this.pcanvas.scale.get_model(this.tw.start);
        this.st(0);
        this.sl(s);
        this.redraw_times();
    }

    this.move_app_v=function(p,s)
    {
        this.tw.start = s;
        this.tw.end = this.pcanvas.scale.get_world(s+w);

        s = this.pcanvas.scale.get_model(this.tw.start);
        this.st(0);
        this.sl(s);
        this.redraw_times();
    }

    // external movement (not through mouse)
    this.move=function(pos)
    {
        if (this.pcanvas.is_vertical)
            this.move_app_v(this,pos);
        else
            this.move_app_h(this,pos);
    }
    
    // external movement (not through mouse)
    this.resize=function(amount)
    {
        if (this.pcanvas.is_vertical)
            this.resize_app_v(this,amount);
        else
            this.resize_app_h(this,amount);
    }
    
    this.contains_h = function(pos)
    {
        if (!this.get_left) return;
        var l = this.get_left();
        var r = this.get_right();   
        /* var pos = this.pcanvas.pxscale.get_world(pos); */
        if (pos >= l && pos <= r) {
            var x = get_relative_x(global.browser.x,this.pcanvas.backdiv);
            var edge = get_border_h(this,x) ;
            if (edge == Appointment.BODY && (this.pcanvas.may_move==false || this.may_move==false )) return;
            if ( (edge == Appointment.LEFT || edge == Appointment.RIGHT)  && this.pcanvas.may_resize==false) return;
            this.pcanvas.glassdiv.domelm.style.cursor = 
                    global.browser.icon_name(global.mouseicon[edge]);
            return true;
        } else {
            this.pcanvas.glassdiv.domelm.style.cursor = 
                    global.browser.icon_name(global.mouseicon[0]);
            return false;
        }
    }

    this.contains_v = function(pos)
    {
        var t = this.get_top();
        var b = this.get_bottom();   
		// only with percentage:
        //var pos = this.pcanvas.pxscale.get_world(pos);
        if (pos >= t && pos <= b) {
            var y = get_relative_y(global.browser.y,this.pcanvas.backdiv);
            var edge = get_border_v(this,y) ;
            this.pcanvas.glassdiv.domelm.style.cursor = 
                    global.browser.icon_name(global.mouseicon[edge]);
            return true;
        } else {
            this.pcanvas.glassdiv.domelm.style.cursor = 
                    global.browser.icon_name(global.mouseicon[0]);
            return false;
        }
    }

    this.fits = function(txt,w,h)
    {
        var area = w*h;
        var len = txt.length;
        var letterspace = area/len;

		// height should also be considered for small divs (IE)
        if (h < global.browser.text_letterheight) return false;
        if (letterspace > global.browser.text_treshold) return true;
        return false;
        // of course you f*&^ this up if you change the default font
    }

	// hour:minute format only !!
	this.altertimes=function()
	{
		var times= this.value.split("-");
		if (!times[0] || !times[1]) return ;
		if (times[0] ==""  || times[1] =="" ) return ;

		var start=times[0].split(":");
		var end=times[1].split(":");

		if (!start[0] || !start[1] || !end[0] || !end[1]) return ;
		if (start[0] ==""  || start[1] =="" ) return ;
		if (end[0] ==""  || end[1] =="" ) return ;

		// hehe! set the times and redraw
		var s = new Date(app.tw.start*1000);
		s.setHours(start[0]);
		s.setMinutes(start[1]);
		app.tw.start = s.getTime()/1000;
		var e = new Date(app.tw.end*1000);
		e.setHours(end[0]);
		e.setMinutes(end[1]);
		app.tw.end = e.getTime()/1000;
		this.app.set_editable(false);
	}
    
    this.redraw_times = function()
    {
        // commented stuff removed jan2008, since it seems supurflous
        //var l = new Coord(this.domelm.style.left);
        //var t = new Coord(this.domelm.style.top);
        var w = new Coord(this.domelm.style.width);
        var h = new Coord(this.domelm.style.height);

        var s = this.tw.start;
        var w2 = this.tw.end;

        var displaytxt="";
		if (this.pcanvas.use_dur) {
			if (this.showtimes && this.pcanvas.showtimes) {
				displaytxt = dur_format(w2-s);
			}
		} else {
			if (this.showtimes && this.pcanvas.showtimes) {
				displaytxt = time_format(s);
				displaytxt += "-";
				displaytxt += time_format(w2);
			}
		}

        if (this.freetext) {
            if (!this.after) 
                displaytxt = this.freetext + " " + displaytxt;
            else 
                displaytxt = displaytxt +" " +  this.freetext;
        }
        
        //if (!this.pcanvas.layout.printtext || !this.fits(displaytxt,w.n,h.n)) displaytxt = "";
        if (!this.pcanvas.layout.printtext) displaytxt = "";
		if (this.edittimes) {
        	var elm = this.set_centeredit(displaytxt,this.altertimes);
			elm.app=this;
			elm.focus();
		} else {
    //div.style.fontSize=1;
	//div.innerHTML=" ";
			if (displaytxt=="") {
        		this.domelm.innerHTML="";
    			this.domelm.style.fontSize=1;
			} else {
    			this.domelm.style.fontSize=null;
        		this.domelm.innerHTML=displaytxt;
			}
        	//this.set_centertext(displaytxt);
		}
    }

	this.select=function()
	{
		if (! thisobj.pcanvas.may_select) return ;
		thisobj.selected=true;
		this.domelm.style.border= thisobj.selborder + "px solid black";
		this.domelm.style.width=thisobj.pcanvas.width- (2*thisobj.selborder) + "px";
		var old = dom_strippx(this.domelm.style.height);
		this.domelm.style.height= old  -  (1*thisobj.selborder) + 'px';
	}

	this.deselect=function()
	{
		if (! thisobj.pcanvas.may_select) return ;
		//dom_set_opacity(this.domelm,"0.7");
		thisobj.selected=false;
		this.domelm.style.border= thisobj.border + "px solid black";
		this.domelm.style.width=thisobj.pcanvas.width- (2*thisobj.border) + "px";
		var old = dom_strippx(this.domelm.style.height);
		this.domelm.style.height= old +  (2*(thisobj.selborder-thisobj.border)) + 'px';
	}

    this.redraw=function(what)
    {
        var xtra=0;
        var bcolor='black';
        var s = what.pcanvas.scale.get_model(what.tw.start);
        var e = what.pcanvas.scale.get_model(what.tw.end);
		s= Math.round(s);
		e= Math.round(e);

	// this was commented (25 mar 2008) but it is needed for 
	// setting letter_color , BUT
	// if uncommented. borders don't work !! 
       	if (what.apptype.color) 
			dom_set_color(what.domelm,what.apptype.color,what.apptype.fg);
       	if (what.apptype.opacity) 
			dom_set_opacity(what.domelm,what.apptype.opacity);

		what.domelm.style.border=thisobj.border + "px solid #587F7E";

        var railw = what.apptype.railw;
        var stopw = what.apptype.stopw;

        if (what.pcanvas.is_vertical) {
            what.st(s);
            what.sl(this.apptype.lmargin);
            what.sw(this.pcanvas.width-(thisobj.border*2));
            what.sh(e-s-(thisobj.border*2));
			if (this.selected == true) {
				this.domelm.style.border= thisobj.selborder + "px solid black";
				this.domelm.style.width=thisobj.pcanvas.width- (2*thisobj.selborder) + "px";
				var old = dom_strippx(this.domelm.style.height);
				this.domelm.style.height= old  -  (1*thisobj.selborder) + 'px';
			}
        } else {
            what.sl(s);
            what.st(this.apptype.lmargin);
            what.sh(this.pcanvas.height-(thisobj.border*2));
            what.sw(e-s-(thisobj.border*2));
			// untested !!: just copied from vertical and changed height
			if (this.selected == true) {
				this.domelm.style.border= thisobj.selborder + "px solid black";
				this.domelm.style.height=thisobj.pcanvas.height- (2*thisobj.selborder) + "px";
				var old = dom_strippx(this.domelm.style.width);
				this.domelm.style.width= old  -  (1*thisobj.selborder) + 'px';
			}
        }
        what.redraw_times();
    }
    
    // Draggable interface :
    this.attached = function(to)
    {
        this.domelm.app = this // we need this in the callbacks
        this.resizing = null;
        this.pcanvas = to;
        //this.grip=10;
            
        this.redraw(this);
    }

    this.detached = function(from)
    {
        //alert("detached");
        // nothing extra to do ?
    }

    // for Draggable() class 
    this.drag = function(p)
    {
        //alert("i was dragged off a(n) " + p.name);
    }

    this.drop = function(p)
    {
        //alert("i was dropped on a(n) " + p.name);
    }

    // Lunch interface
    this.Trash = function()
    {
        var evt = this.evt;
        evt.end_event(this.pcanvas);
        evt.type = event_delete;
        ret = this.pcanvas.handler(evt);
        if (ret<0) evt.rollback();
        this.pcanvas.cur_app = null;
        this.pcanvas.ddc.mov_obj = null;
    }

	// plainly delete
    this.Drop = function()
    {
        var evt = 
        new Event(event_delete,this.pcanvas,this,null);
        evt.end_event(this.pcanvas);
        evt.type = event_delete;
        ret = this.pcanvas.handler(evt);
        if (ret<0) evt.rollback();
        this.pcanvas.cur_app = null;
        this.pcanvas.ddc.mov_obj = null;
        this.pcanvas.ddc.sel_obj = null;
    }

    var color = this.apptype.color;
    var bcolor = this.apptype.bcolor;
    this.inheritz(new Lunch());
    this.inheritz(new DomDiv(this.pcanvas.backdiv.domelm,null,null,null,null,bcolor));
    this.set_position('absolute');
	this.set_overflow('hidden');

    this.inner = new DomDiv(this.domelm,null,null,null,null,color);
    this.inner.set_position('absolute');

    this.sw=function(w) { this.set_w(w,this.pcanvas.suffix); }
    this.sh=function(h) { this.set_h(h,this.pcanvas.suffix); }
    this.sl=function(l) { this.set_left(l,this.pcanvas.suffix); }
    this.st=function(t) { this.set_top(t,this.pcanvas.suffix); }

    this.inner.domelm.className="appointment";
    this.domelm.className="appointment";
    if (apptype.cname) {
        this.inner.domelm.className += " " + apptype.cname;
        this.domelm.className += " " + apptype.cname;
	}

    this.inheritz(new Draggable("Appointment"));
    this.parent = this.pcanvas;
    this.domelm.app = this // we need this in the callbacks
    this.set_z(1);

    this.redraw(this);
    this.redraw_times();

    function yep()
    {
        alert("you should NOT get events");
    }

    this.domelm.onmouseover=null;
}
Appointment.prototype = new Class();

