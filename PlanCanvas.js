// from here on PlanCanvas.js delete this later 

var DEFAULT_LEGEND_SIZE=15;

// these imply that the defaults are opposite
PlanCanvas.FLAG_VERTICAL=0x01;
PlanCanvas.FLAG_NOMOVE  =0x02;
PlanCanvas.FLAG_NOCREATE=0x04;
PlanCanvas.FLAG_NOCROSS =0x08;
PlanCanvas.FLAG_OVERLAP =0x10;
PlanCanvas.FLAG_NORESIZE=0x20;
PlanCanvas.FLAG_NOAPPCM =0x40;
PlanCanvas.FLAG_USEDUR  =0x80;
PlanCanvas.FLAG_NOSELECT=0x100;
// yep

/** 
 * @class a simple Legend to let users choose appointment types 
 * @param {Object} p parent dom elmenet in which to place Legend
 * @param {Array} types array of AppTypes to display 
 * @param {Number} w width of the Legend
 * @param {Number} h height of the Legend
 * @param {Number} bw optional width of each 'selector' block
 * @param {Number} bh optional height of each 'selector' block
 */
function Legend(p,types,w,h,bw,bh,cname) // block pars bw and bh optional
{
    this.w = w;
    this.h = h;
    if (!bw) bw=DEFAULT_LEGEND_SIZE;
    if (!bh) bh=DEFAULT_LEGEND_SIZE;
    this.bw = bw;
    this.bh = bh;
    var curvs;
    var curtype;

    function sel_current(e)
    {
        curtype = this.apptype;
        curvs.set_ustate(curtype);
    }

    this.get_apptype = function()
    {
        return curtype;
    }

    function visible_state(td,apptype,handler)
    {
        var tbl = new DomTable(td.domelm);
        var tr  = tbl.add_row(0,0);
        var left = tr.add_col(0,0);
        var right = tr.add_col(1,0);
        right.domelm.style.whiteSpace="nowrap"; // no wrapping fills out best

        var square = new DomDiv(left.domelm,0,bh,bw,bh,apptype.color);
        td.domelm.onmouseup = handler;
        td.domelm.apptype  = apptype;
		right.domelm.innerHTML=apptype.name;
        square.domelm.className   = "appointment";
        if (apptype.cname);
            square.domelm.className   += " " + apptype.cname;

        this.set_ustate = function(apptype)
        {
            square.domelm.apptype = apptype;
            if (apptype.color) square.set_bg(apptype.color);
            else {
                square.domelm.className   = "appointment";
                if (apptype.cname);
                    square.domelm.className   += " " + apptype.cname;
            }
            right.set_text('');
        }
    }

    if (!types[0]) return; 

    this.tbl = new DomTable(p);
    this.tbl.domelm.className="legend";
    if (cname)
        this.tbl.domelm.className="legend " + cname;
    this.tbl.xywh_px(0,0,this.w,this.h);
    var tr = this.tbl.add_row(0,40);

    // first add the selection div
    var td = tr.add_col(0,0);
    curtype = types[0]; 
    var curvs = new visible_state(td,curtype,null);
    curvs.set_ustate(curtype);

    var c=0;
    for (s in types) {
        c++;
        var td = tr.add_col(c);
        var vs = new visible_state(td,types[s],sel_current);
    }
    var td = tr.add_col(c+1);
}

function TimeLine(anchor,dur,freq,lfreq,cname,start,end)
{
    this.anchor = anchor;
    if (freq) {
        var n = Math.floor(anchor / freq);
        this.anchor -= (n+1)*freq;
        var x = this.anchor+freq;
    }
    this.dur=dur;
    this.freq=freq;
    this.lfreq=lfreq;
    if (!this.span) this.span=1.0;
    this.cname=cname;

	// optional, limits
	if (start) this.start=start;
	if (end) this.end=end;

}
// beginning and end of time_t
TimeLine.BOT=0; 
TimeLine.EOT=2147483648;

/** 
 * @class specifies the layout of a PlanCanvas
 * @param {Number} w width of the PlanCanvas
 * @param {Number} h height of the PlanCanvas
 * @param {Number} snap_at what appointments shou 'sanp' to in seconds
 * @param {Number} id used in style sheets
 */
function CanvasLayout(snap_at,cname,min)
{
    var thisobj=this;
    this.snap_at=snap_at;
    this.min=600000;
    if (min) this.min=min;
    this.cname=cname;
    this.tps=new Object();
    this.timelines=new Array();
    this.printtext = true;

    // helper object
    function tuple(pat,id)
    {
        this.pat=pat;
        this.id=id;
    }

    // just plain text
    this.set_text = function(txt)
    {
        this.caption = txt;
    }
    
    this.set_notext = function()
    {
        this.printtext = false;
    }
    
    this.set_timefunc = function(f)
    {
        this.tf = f;
    }

	this.clear_timelines=function()
	{
    	this.timelines=new Array();
	}

    // decoration
    this.add_timelines=function(anchor,dur,freq,lfreq,id,start,end)
    {
        var tl = new TimeLine(anchor,dur,freq,lfreq,id,start,end);
        thisobj.timelines[thisobj.timelines.length]=tl;
    }

	// color the workhours according to id
    this.add_activetime=function(start,end,inverse)
    {
        this.active = new TimeWindow(start, end);
		this.invert_active=inverse;
    }
}

// we need the IE5 names, because it has no two headed pointers
global.mouseicon = [ 'default', 'w-resize', 'e-resize', 'hand', 'n-resize', 's-resize' ];
global.border_sense = 4; // pixels !!
global.min_app=3;

/** 
  * 
  */
function get_border_h (o,x)
{
    var l = o.get_left();
    var r = o.get_right();
    //var pos = o.pcanvas.pxscale.get_world(x);
	var pos = x;

	// make complete app BODY if resize if off
	if (o.pcanvas.may_resize == false) return Appointment.BODY;

    // reduce bordersense on small divs (but assure resize)
    var border_sense = global.border_sense;
    if (r-l < border_sense*3) border_sense = Math.ceil((r-l)/3);
    if (pos-l < border_sense) return Appointment.LEFT;
    if (r-pos < border_sense) return Appointment.RIGHT;
	if (r-l < 3) return Appointment.RIGHT; // always give a chance to resize
    return Appointment.BODY;
}

function get_border_v (o,y)
{
    var t = o.get_top();
    var b = o.get_bottom();

    //var pos = o.pcanvas.pxscale.get_world(y);
	var pos = y;

	// make complete app BODY if resize if off
	if (o.pcanvas.may_resize == false) return Appointment.BODY;

    // reduce bordersense on small divs (but assure resize)
    var border_sense = global.border_sense;
    if (b-t < border_sense*3) border_sense = Math.ceil((b-t)/3);
    if (pos-t < border_sense) return Appointment.TOP;
    if (b-pos < border_sense) return Appointment.BOTTOM;
    return Appointment.BODY;
}

var ctr=0;

// glasspane GP mouse handlers
function GPDown(e)
{
    global.browser.event_set_xy(e);
    global.mousedown = true;
    var coord;
    var app=null;
    if (!this.pcanvas) return;

    global.browser.mouse_capture(this.pcanvas.glassdiv.domelm);
    if (this.pcanvas.is_vertical) {
        coord = get_relative_y(global.browser.y,this.pcanvas);
        app = this.pcanvas.appointment_under_v(coord);
    } else {
        coord = get_relative_x(global.browser.x,this.pcanvas);
        app = this.pcanvas.appointment_under_h(coord);
    }

    if (global.browser.button == 'right')
    {
        if (app && this.pcanvas.appmenu) {
            this.pcanvas.appmenu.set_data(app);
            y = get_scrolled_y(global.browser.y);
            x = get_scrolled_x(global.browser.x);
            this.pcanvas.appmenu.show_popup(x,y);
        } else if (this.pcanvas.menu) {
            this.pcanvas.menu.set_data(this.pcanvas);
            y = get_scrolled_y(global.browser.y);
            x = get_scrolled_x(global.browser.x);
            this.pcanvas.menu.show_popup(x,y);
        }

        return false;
    }

    if (!this.pcanvas.may_move) return;

    if (!app && !this.pcanvas.cur_app) {
        if (!this.pcanvas.may_create) return;
        var l;
        if (this.pcanvas.is_vertical)
            l = this.DE.get_left();
        else
            l = this.DE.get_top();

        if (!l) l=0;
        var start = this.pcanvas.scale.get_world(coord);
        start = this.pcanvas.scale.snap_world(start);
        var seltype = this.pcanvas.get_apptype();

        var app=
            new Appointment(this.pcanvas,start,start,seltype,-1);
        this.pcanvas.cur_app = app;
        this.pcanvas.cur_app.evt = new Event(event_insert,this.pcanvas,this.pcanvas.cur_app,e);
        global.browser.mouse_capture(this.pcanvas.glassdiv.domelm);
    } else {
        var coord,edge;
        if (this.pcanvas.is_vertical) {
            coord = get_relative_y(global.browser.y,this.pcanvas);
            edge = get_border_v(app,coord) ;
        } else {
            coord = get_relative_x(global.browser.x,this.pcanvas);
            edge = get_border_h(app,coord) ;
        }
        if (edge == Appointment.BODY) {
            var evt = new Event(event_move,this.pcanvas,app,e);
            evt.from.tw = new TimeWindow(app.tw.start, app.tw.end);
            
            this.pcanvas.ddc.mov_obj = app;
            app.evt = evt;
            this.pcanvas.cur_app = null;
            app.set_grip(coord);
            this.pcanvas.ddc.drag(this.pcanvas, app);
        } else {
            this.pcanvas.ddc.mov_obj = null;
            var evt = new Event(event_resize,this.pcanvas,app,e);
            app.evt = evt;
            evt.from.tw = new TimeWindow(app.tw.start, app.tw.end);
            this.pcanvas.cur_app = app;
            if (edge == Appointment.LEFT || edge == Appointment.TOP) 
                app.resizing = "b";
            else
                app.resizing = "f";
        }
        return false;
    }
    // needed!!, or you will get this event twice !
    global.browser.cancel_bubble(e);

    return false;
}

function GPOver(e)
{
    global.browser.event_set_xy(e);
    this.pcanvas.ddc.enter(this.pcanvas);
    global.browser.cancel_bubble(e);
}

// plancanvas handlers
function GPMove(e)
{
    global.browser.event_set_xy(e);
    var x = get_relative_x(global.browser.x,this.pcanvas);
    var y = get_relative_y(global.browser.y,this.pcanvas);

    if (this.pcanvas.is_vertical) {
        this.pcanvas.appointment_under_v(y);
    } else {
        this.pcanvas.appointment_under_h(x);
    }

    if (!this.pcanvas.may_move) return;

    if (this.pcanvas.cur_app != null) {
    	if (!this.pcanvas.cur_app.may_move) return;
        if (this.pcanvas.may_resize == false) return;
        if (this.pcanvas.is_vertical)
            this.pcanvas.cur_app.resize_v(this, y);
        else 
            this.pcanvas.cur_app.resize_h(this, x);
    } else 
    if (this.pcanvas.ddc.mov_obj != null) 
    {
    	if (!this.pcanvas.ddc.mov_obj.may_move) return;
        if (this.pcanvas.is_vertical)
            this.pcanvas.ddc.mov_obj.move_v(this, y);
        else
            this.pcanvas.ddc.mov_obj.move_h(this, x);
    }
}

function GPUp(e,o)
{
	var ret=true;
    global.browser.event_set_xy(e);
    global.browser.mouse_release(this);
    global.mousedown = false;

    if (!this.pcanvas) return;

    if (!this.pcanvas.cur_app) { // must be a move
        ob = this.pcanvas.ddc.mov_obj;
        if (ob)  {
            evt = ob.evt;
            evt.end_event(this.pcanvas);
            evt.to.tw = new TimeWindow(ob.tw.start,ob.tw.end);
            this.pcanvas.ddc.drop(this.pcanvas,this.pcanvas.ddc.mov_obj);
            if (!this.pcanvas.may_move) ret = false;
            if (evt.from.dragzone != evt.to.dropzone) {
                if (!this.pcanvas.may_cross) ret = false;
            }
            if (this.pcanvas.test_overlap(ob) && !this.pcanvas.may_overlap) ret = false;
            if (ret == true) ret = this.pcanvas.handler(evt);
            if (ret == false) evt.rollback();
        }
    } else {    // this means a resize 
        ob = this.pcanvas.cur_app;
        if (ob)  {
            evt = ob.evt;
            evt.end_event(this.pcanvas);
            evt.to.tw = new TimeWindow(ob.tw.start,ob.tw.end);
            if (!this.pcanvas.may_move ) ret = false;
            if (this.pcanvas.test_overlap(ob) && !this.pcanvas.may_overlap) ret = false;
            if (ret == true) ret = this.pcanvas.handler(evt);
            if (ret==false) evt.rollback();
        }
    }

    if (this.pcanvas.cur_app) {
		this.pcanvas.cur_app.check();
	}
    this.pcanvas.cur_app = null;
    this.pcanvas.ddc.mov_obj = null;
    // prevent double events :
    //global.browser.cancel_bubble(e);
}

function GPOut(e)
{
    //da("po-" + this.pcanvas.ddc.mov_obj);
    global.browser.event_set_xy(e);

	if (this.pcanvas.may_cross) return;

    global.browser.cancel_bubble(e);
    if (this.pcanvas.ddc.mov_obj) {
        detach(this.pcanvas.ddc.mov_obj,e);
    }
}

function detach(o,e)
{
    if (!o) return;

    var pcanvas = o.parent;
    // just always reattach, works  by far the best
    global.browser.event_set_xy(e);
    //global.browser.cancel_bubble(e);
    if (pcanvas.ddc.mov_obj)  {
        pcanvas.ddc.leave(pcanvas.ddc.mov_obj,pcanvas);
    }
}

// cur_app is an appointment that is being created/resized
// mov_obj is an appointment that is being moved or dragged
// sel_obj is an appointment that is selected
// x and y are optional offsets of the plancanvas within the parent DIV
function PlanCanvas(div,start,stop,layout,handler,types,ddc,flags,x,y)
{    
    if (!x) x=0;
    if (!y) y=0;

    this.is_vertical=false;
    this.may_create=true;
    this.may_move=true;
    this.may_cross=true;
    this.may_select=true;
    this.tw = new TimeWindow(start,stop);
    this.may_overlap=false;
    this.may_resize=true;
    this.use_appcm=true;
    this.suffix='px';
    this.showtimes=true;
    this.use_dur=false;
	this.width="100%"; 	
	this.height="100%"; 	

    var thisobj=this;

	this.disable_text=function()
	{
		this.showtimes=false;
	}

	this.set_over_func=function(fnc) 
	{
		this.overfnc=fnc;
	}

	/* leave suffix to px it's needed for some border options
		and it will be pure SM trying to get percentage to work again
		both percentage and pixels have been tried : PIXELS WON !
	 */ 
    this.set_suffix = function(sfx)
    {
        // ONLY px OR %
        if (sfx != 'px' && sfx != '%') sfx='%';
        this.suffix=sfx;

		if (sfx == 'px') {
			this.width = div.clientWidth;
        	this.height= div.clientHeight;
		} 
    }

	this.set_suffix('px');

    if (!ddc) ddc = global.ddc; 

	this.set_flags=function(flags)
	{
    	if (flags & PlanCanvas.FLAG_VERTICAL) this.is_vertical=true;
    	if (flags & PlanCanvas.FLAG_NOCREATE) this.may_create=false;
    	if (flags & PlanCanvas.FLAG_NOMOVE)   this.may_move=false;
    	if (flags & PlanCanvas.FLAG_NOCROSS)  this.may_cross=false;
    	if (flags & PlanCanvas.FLAG_OVERLAP)  this.may_overlap=true;
    	if (flags & PlanCanvas.FLAG_NORESIZE) this.may_resize=false;
    	if (flags & PlanCanvas.FLAG_NOSELECT) this.may_select=false;
    	if (flags & PlanCanvas.FLAG_NOAPPCM)  this.use_appcm=false;
    	if (flags & PlanCanvas.FLAG_USEDUR)   this.use_dur=true;
	}

	// freeze and thaw can only be done with all of these
	this.freeze=function()
	{
		this.may_create=false;
		this.may_move=false;
		this.may_cross=false;
		this.may_resize=false;
	}

	this.thaw=function()
	{
		this.may_create=true;
		this.may_move=true;
		this.may_cross=true;
		this.may_resize=true;
	}

	this.set_flags(flags);

    this.ddc = ddc;
    this.handler = handler;
    this.layout = layout;
    this.types = types;
    this.seltype = types[0];
    //this.opacity = 0.7;

    this.apps = new Array();

    this.set_world= function(start,stop) {
        var oldstart=this.start;
        this.tw = new TimeWindow(start,stop);
        this.redraw();
    }

    // TimeWindow version
    this.set_tw= function(tw) {
        var oldstart=this.start;
        this.tw=tw;
        this.redraw();
    }

    this.set_text = function(txt)
    {
        this.backdiv.set_centertext(txt);
    }

    function move_domelm_h(obj, val)
    {
	    dom_set_left (obj.slider,val,this.suffix);
    }

    function move_domelm_v(obj, val)
    {
	    dom_set_top (obj.slider,val,this.suffix);
    }

   this.wrapup=function(obj)
   {
        obj.slider.removeChild(obj.backdiv.domelm);
        obj.domelm.removeChild(obj.slider);
        obj.domelm.appendChild(obj.backdiv.domelm);
        dom_xywh_px(obj.backdiv.domelm,0,0);
    }

    // animate new time window
    this.slide = function(amount,time,effect)
    {
        var t1;

        var newstart = thisobj.tw.start + amount;
        var newstop  = thisobj.tw.end + amount;

        this.domelm.removeChild(this.backdiv.domelm);
        var olddiv = this.backdiv;

        if (this.is_vertical) {
            set_f = dom_set_top;
        } else {
            set_f = dom_set_left;
        }

        // create new div 
        this.backdiv = new DomDiv(this.domelm,0,0,0,0);
		// TODO : this will only work with % suffixes for now
		dom_xywh_perc(this.backdiv.domelm,0,0,100,100);
        this.domelm.removeChild(this.backdiv.domelm);
        this.backdiv.set_position('absolute');
        this.backdiv.set_z(0);
        this.backdiv.domelm.pcanvas = this // we need this in the callbacks

        this.slider = document.createElement("div");
        this.slider.style.position='absolute';
        this.domelm.appendChild(this.slider);
        this.slider.appendChild(olddiv.domelm);
        this.slider.appendChild(this.backdiv.domelm);
        this.slider.style.background="red";

		var cw = this.domelm.clientWidth;

		// TODO : this will only work with % suffixes for now
        if (amount < 0) {
            dom_xywh_perc(this.slider,-1*cw,0,100, 100);
            set_f(olddiv.domelm, 100, '%');
            set_f(this.backdiv.domelm, 0, '%');
        } else {
            dom_xywh_perc(this.slider,0,0,100, 100);
            set_f(olddiv.domelm, 0, '%');
            set_f(this.backdiv.domelm, 100, '%');
        }
        thisobj.tw = new TimeWindow(newstart, newstop);
        this.rescale();

        drawtimelines(this);
		//drawappointments(this);
		var dist;

        if (this.is_vertical) {
            move_f = move_domelm_v;
			dist=this.height * -1;
        } else {
            move_f = move_domelm_h;
			dist=this.width * -1;
		}

        if (amount > 0) {
            t1 = new Animation(move_f,this,0,dist,time,effect,this.wrapup);
        } else {
            t1 = new Animation(move_f,this,dist,time,effect,this.wrapup);
        }
        t1.go();
   }

    this.find_apptype_byname = function(name)
    {
        for (t=0; t< types.length; t++) {
            if (types[t].name == name) 
                return types[t];
        }
        return null;
    }

    this.find_apptype = function(id)
    {
        for (t=0; t< types.length; t++) {
            if (types[t].id == id) 
                return types[t];
        }
        return types[0];
    }

    this.appointment_under_h = function(x)
    {
        for (t=0; t< this.appointment_count(); t++) {
            app = this.appointment_get(t);
            if (app.contains_h(x)) {
				if (this.overfnc) this.overfnc(app);
                return app;
            }
        }
		if (this.overfnc) this.overfnc(null);
        return null;
    }
    
    this.appointment_under_v = function(y)
    {
        for (t=0; t< this.appointment_count(); t++) {
            app = this.appointment_get(t);
            if (app.contains_v(y)) {
				if (this.overfnc) this.overfnc(app);
                return app;
            }
        }
		if (this.overfnc) this.overfnc(null);
        return null;
    }
    
    this.drop = function (o)
    {
        //alert("implement drop(Object) for " + this.name);
    }

    this.drag = function (o)
    {
        //alert("implement drop(Object) for " + this.name);
    }

    // current apptype
    this.get_apptype = function()
    {
        return this.seltype;
    }

    this.set_apptype = function(apptp)
    {
        this.seltype=apptp;
    }

    this.set_legend = function (l) 
    {
        this.legend = l;

        // overwrites !
        this.get_apptype = function() {
            if (this.legend)
                return this.legend.get_apptype();
            return this.seltype;
        }
    }

    this.set_opacity = function(opacity)
    {
        this.opacity = opacity;
    }

    this.clear = function()
    {
        this.del_appointments();
        //remove_children(this.backdiv.domelm);
    }

    this.set_img = function (url)
    {
        this.backdiv.set_img(url);
    }

    this.timestamp = function(l)
    {
        // absolute left of parent div (plancanvas)
        var left = global.browser.getAbsoluteLeft(this.domelm);
        // rescaled to time 
        var s = this.scale.get_world(l);

        return s;
    }

	function tw_sort(a,b)
	{
		if (a.tw.start < b.tw.start) return -1;
		if (a.tw.start > b.tw.start) return  1;
		if (a.tw.end < b.tw.end) return -1;
		if (a.tw.end > b.tw.end) return  1;
		return 0;
	}

    this.appointment_sort = function()
    {
        return this.apps.sort(tw_sort);
    }

    this.appointment_count = function()
    {
        return this.apps.length;
    }

    this.appointment_get = function(n)
    {
        return this.apps[n];
    }

    // check for invisible apps 
    this.check=function()
    {
        // backward loop because of possible deletions
        for (n=this.apps.length-1;n>=0; n--) 
            this.apps[n].check();
    }

    this.appointment_get_index= function(handle)
    {
        for (n=0;n<this.apps.length;n++) 
            if (this.apps[n]==handle) 
                return n;

        return -1;
    }

    this.appointment_get_byid = function(id)
    {
        for (n=0;n<this.apps.length;n++) 
            if (this.apps[n].id==id) 
                return this.apps[n];

        return null;
    }

    this.appointment_get_byname = function(name)
    {
        for (n=0;n<this.apps.length;n++) 
            if (this.apps[n].name==name) 
                return this.apps[n];

        return null;
    }

    // glue app n to a, a's id will remain
    this.appointment_glue= function (a,n)
    {
        b = this.apps[n];

        if (a.tw.end == b.tw.start) // right glue
            a.tw.end = b.tw.end;
        else 
        if (a.tw.start == b.tw.end) // left glue
            a.tw.start = b.tw.start;
        else 
            return; // not adjacent

        this.appointment_del(n);
        this.redraw();
    }

    this.del_appointment= function (app)
    {
		for (n in this.apps) {
        	o = this.apps[n];
			if (app== o) {
        		delete_child(this.backdiv.domelm,o.domelm);
        		this.apps.splice(n,1);
			}
		}
    }

    this.appointment_del= function (n)
    {
        if (n> this.apps.length) return;

        o = this.apps[n];
        delete_child(this.backdiv.domelm,o.domelm);
        this.apps.splice(n,1);
    }

    this.del_appointments = function()
    {
        while (this.appointment_count()>0) 
            this.appointment_del(0);
    }

    this.set_world_snap = function (offset,step)
    {
        this.scale.set_world_snap(offset,step); 
    }

    this.detach = function (o)
    {
        delete_child(this.backdiv.domelm,o.domelm);

        o.parent = null;
        this.ddc.mov_obj = null;

        // find and delete appointment
        for (n=0;n<this.apps.length;n++) {
            if (this.apps[n]==o) {
                this.apps.splice(n,1);
                break;
            }
        }
    }

    // 1 unit overlap allowed !
    this.test_overlap = function (o)
    {
        // find and delete appointment
        for (n=0;n<this.apps.length;n++) {
            var testob = this.apps[n];
            if (o != testob) {
                if (((o.tw.end <= testob.tw.start) || 
                    (o.tw.start >= testob.tw.end)) == false)
                return true;
            }
        }
        return false;
    }

    this.attach = function (o)
    {
        if (!o) return;
        o.parent = this;
        this.cur_app = null;
        this.ddc.mov_obj = o;
        append_child(this.backdiv.domelm,o.domelm);
        global.browser.mouse_release(this);

        var n = this.apps.length;
        this.apps.splice(n,0,o);
    }

    this.domelm = document.createElement("div");

    // superclasses 
    // X this.set_position('relative');
    this.domelm.style.position='relative';

    this.domelm.className="plancanvas";

    if (layout.cname) 
        this.domelm.className+= " " + layout.cname;
    this.tw = new TimeWindow(start,stop);

    this.rescale=function()
    {
		// this uncommented is needed for zadkine
		var w = this.width;
		var h = this.height;

        //this.scale = new Scale(this.tw.start,this.tw.end,0,100);

        if (this.is_vertical) {
            this.pxscale = new Scale(0,100,0,h);
            this.min     = 100/h;
        this.scale = new Scale(this.tw.start,this.tw.end,0,h);
        } else {
            this.pxscale = new Scale(0,100,0,w);
            this.min     = 100/w;
        this.scale = new Scale(this.tw.start,this.tw.end,0,w);
        }
        this.set_world_snap(0,this.layout.snap_at);
    }

    this.redraw=function()
    {
        this.rescale();

        cleartimelines(this);
        drawtimelines(this);
		drawappointments(this);
    }

    this.resize = function(w,h)
    {   
		if (w) this.width = w;
		if (h) this.height = h;
        dom_xywh_px(this.domelm,0,0,this.width,this.height);
        dom_xywh_px(this.backdiv.domelm,0,0,this.width,this.height);
        dom_xywh_px(this.glassdiv.domelm,0,0,this.width,this.height);
		//drawappointments(this);
        this.redraw();
    }

	// also reposition
    this.xywh = function(x,y,w,h)
    {   
		if (w) this.width = w;
		if (h) this.height = h;
        dom_xywh_px(this.domelm,x,y,w,h);
        dom_xywh_px(this.backdiv.domelm,0,0,w,h);
        dom_xywh_px(this.glassdiv.domelm,0,0,w,h);
        this.redraw();
    }

    thisobj.set_appointmentmenu = function()
    {
        this.appmenu=new PopupMenu();

        this.add_menuitem=function(mi)
        {
            var data = new Object();
            data.app=thisobj.app;
            mi.set_data(data);
            this.appmenu.target=this.appmenu;
            this.appmenu.add_menuitem(mi);
        }

        this.add_delete_item=function(caption, color)
        {
            if (!caption) caption = 'delete';
            var data = new Object();
            data.app=thisobj.app;
            var mi = new MenuItem(caption, delete_app, color);
            mi.set_data(data);
            this.appmenu.target=this.appmenu;
            this.appmenu.add_menuitem(mi);
        }

        /** 
          * add menu option to glue adjecent appointments together
          * @param {String} caption string to display in tghe menu
          * @param {String} color optional color of the menuitem
          */
        this.add_glue_item=function(caption, color)
        {
            if (!caption) caption = 'glue';
            var data = new Object();
            data.app=thisobj.app;
            var mi = new MenuItem(caption, glue_app, color);
            mi.set_data(data);
            this.appmenu.target=this.appmenu;
            this.appmenu.add_menuitem(mi);
        }

        this.add_apptype_items=function()
        {
            var types = thisobj.types;

            for (t=0; t< types.length; t++) {
                var data = new Object();
                data.app=thisobj.app;
                data.name=types[t].name;
                var mi = new MenuItem(types[t].name, change_type, types[t].cname);
                if (types[t].color)
                    mi.set_bg(types[t].color);
                mi.set_data(data);
                this.appmenu.target=this.appmenu;
                this.appmenu.add_menuitem(mi);
            }
        }

        /** 
          * add menu option to edit times
          */
        this.add_edittimes=function(caption, color)
        {
            if (!caption) caption = 'set times';
            var data = new Object();
            data.app=thisobj.app;
            var mi = new MenuItem(caption, popup_edittime, color);
            mi.set_data(data);
            this.appmenu.target=this.appmenu;
            this.appmenu.add_menuitem(mi);
        }

        return this;
    }

    thisobj.set_menu = function()
    {
        this.menu=new PopupMenu();

        this.add_menuitem=function(mi)
        {
            var data = new Object();
            data.app=thisobj.app;
            mi.set_data(data);
            this.menu.target=this.menu;
            this.menu.add_menuitem(mi);
        }

        return this;
    }

    function change_type(popupmenu,data)
    {
        if (!data) return;   

        var at = thisobj.find_apptype_byname(data.name);
        if (!at) return;
        popupmenu.data.set_apptype(at);
    }

    function delete_app(popupmenu,data)
    {
        var a;
        if (!data) return;   
        app = popupmenu.data;

        for (a=0; a< thisobj.apps.length; a++)
            if (app == thisobj.apps[a]) {
                thisobj.appointment_del(a);
				app.Trash();
                return;
            }
    }

    function glue_neighbour(data)
    {
        var a;
        if (!data) return;   

        // glue if the type is the same and when adjacent
        for (a=0; a< thisobj.apps.length; a++)
            if (app.apptype == thisobj.apps[a].apptype && 
                ( app.tw.start == thisobj.apps[a].tw.end || 
                  app.tw.end == thisobj.apps[a].tw.start)) {
                thisobj.appointment_glue(app,a);
            }
    }

    function glue_app(popupmenu,data)
    {
        if (!data) return;   

        app = popupmenu.data;

        glue_neighbour(app); // possible left
        glue_neighbour(app); // possible right
        // don't go any further, only glue direct neighbours
    }

    function popup_edittime(popupmenu,data)
    {
        if (!data) return;   

        app = popupmenu.data;
		app.set_editable(true);

        //glue_neighbour(app); // possible left
        //glue_neighbour(app); // possible right
        // don't go any further, only glue direct neighbours
    }

    this.backdiv = new DomDiv(this.domelm,0,0,0,0);
	dom_xywh_sfx(this.backdiv.domelm,0,0,this.width,this.height,this.suffix);
    this.backdiv.set_position('absolute');
    this.backdiv.set_z(0);

    this.glassdiv = new DomDiv(this.domelm,0,0,0,0);
	dom_xywh_sfx(this.glassdiv.domelm,0,0,this.width,this.height,this.suffix);
    this.glassdiv.set_position('absolute');
    // !! DOES NOT work on IE7 :
    this.glassdiv.set_opacity(0.0); // hey, its glass

    // Browser compatibility (never remove these coments)!!!!
    // IE 6 weirdness : disabling this next line makes that you cannot create 
    // appointments !?!?!?!?!
    // i cannot find why it was commented (maybe the red shows somewhere)
    // so eat least i made it 'white'
    this.glassdiv.domelm.style.background="white";
    // Browser compatibility !!!!

    this.glassdiv.set_z(2);

    //this.add_contextmenu();

    function make_timetbl(elm,w,ts,te)
    {
        var d;

        d = new DomTable(elm);

        if (thisobj.is_vertical) {
			d.sh(700);
			d.sw(50);
        } else {
			d.sw(700);
			d.sh(50);
		}

        d.sl(ts);
        d.set_position("absolute");
        d.domelm.className="timelines";

        r = d.add_row(0,null);

        for (ct =0; ct< w; ct++) {
            c = d.add_col(0,ct);
        }

        if (tpi.cname) 
            d.domelm.className += " " + tpi.cname;

        return d.domelm;
        if (ps % tpi.lfreq == 0) {
            if (thisobj.layout.tf)
                displaytxt=thisobj.layout.tf(ts);
            else
                displaytxt = gues_format(ts,tpi.freq);
            d.set_centertext(displaytxt);
            //d.set_text(displaytxt);
        }
        return d.domelm;
    }

    function make_activediv(elm,start,w)
	{
        if(thisobj.is_vertical) {
            d = document.createElement('div');
            elm.appendChild(d);
            // was : dom_xywh_perc(d,0,start,100,w);
            dom_xywh_sfx(d,0,start,thisobj.width,w, thisobj.suffix);
        } else {
            d = document.createElement('div');
            elm.appendChild(d);
            // was : dom_xywh_perc(d,start,0,w,100);
            dom_xywh_sfx(d,start,0,w,thisobj.height,thisobj.suffix);
		}
        d.style.position="absolute";
		d.style.background="black";
        global.browser.set_opacity(d,0.05);
       	d.innerHTML="";
    	d.style.fontSize=1;
        return d;
	}

    function make_timediv(elm,laststart,w,ps,ts)
    {
        var d;

        if(thisobj.is_vertical) {
            d = document.createElement('div');
            elm.appendChild(d);
            // was : dom_xywh_perc(d,0,laststart,null,w);
            dom_xywh_sfx(d,0,laststart,null,w, thisobj.suffix);
        } else {
            d = document.createElement('div');
            elm.appendChild(d);
            // was : dom_xywh_perc(d,laststart,0,w,null);
            dom_xywh_sfx(d,laststart,0,w,null,thisobj.suffix);
		}
        d.style.position="absolute";
        d.className="timelines";
        if (tpi.cname) 
            d.className += " " + tpi.cname;
        if (ps % tpi.lfreq == 0) {
            if (thisobj.layout.tf)
                displaytxt=thisobj.layout.tf(ts);
            else
                displaytxt = gues_format(ts,tpi.freq);
			d.innerHTML = displaytxt;
        }
        return d;
    }

    // clear all decorations to refill the canvas
    function cleartimelines(pc)
    {
        if (!pc.decorations) return;
        for (var t=0; t< pc.decorations.length; t++) {
            var c = pc.decorations[t];
            pc.backdiv.domelm.removeChild(c);
        }
    }

    function drawappointments (pc)
    {
        // find and delete appointment
        for (n=0;n<pc.apps.length;n++) {
            var app = pc.apps[n];
			app.redraw(app);
        }
    }

    function drawtimelines(pc)
    {
        var nt = pc.layout.timelines.length;
        pc.decorations = new Array();

        var total=0;
        for (t=0; t< nt; t++) {
            tpi = pc.layout.timelines[t];
            ts=0;
            if (tpi.freq!=0) {
                ts = Math.floor((pc.tw.start-tpi.anchor) / tpi.freq);
            }
            ts *= tpi.freq; // just left of pc.start
            ts += tpi.anchor;

            var ps=0;
			if (tpi.start) {
            	while (ts < tpi.start)
					ts +=tpi.freq;
			}
            for (; ts < pc.tw.end+tpi.freq; ts +=tpi.freq) 
            {
                var start = pc.scale.get_model(ts);
                var end = pc.scale.get_model(ts+tpi.dur);
                var w = end-start;
                pc.decorations[pc.decorations.length] = 
                    make_timediv(pc.backdiv.domelm,start,w,ps,ts);
                if (tpi.freq == 0) break;
				if (tpi.end)  {
					if (ts > tpi.end) break;
				}
                ps++;
            }
        }
	    if (pc.layout.active) {
		    start = pc.layout.active.start;
		    end = pc.layout.active.end;
            var start = pc.scale.get_model(start);
            var end = pc.scale.get_model(end);
            var w = end-start;
	    	if (w<0)
				w=0;
			if (pc.layout.invert_active) {
				if (start > 0) 
           		pc.decorations[pc.decorations.length] =
               		make_activediv(pc.backdiv.domelm,0,start);
				if (end < 100) 
           		pc.decorations[pc.decorations.length] =
               		make_activediv(pc.backdiv.domelm,end,100);
			} else {
           		pc.decorations[pc.decorations.length] =
               		make_activediv(pc.backdiv.domelm,start,w);
			}
	    }
    }


    // oo interfaces 
    this.inheritz(new DragZone("PlanCanvas"));
    this.inheritz(new DropZone("PlanCanvas"));

    // domelm is inherited from canvas
    this.glassdiv.domelm.pcanvas = this // we need this in the callbacks
    this.backdiv.domelm.pcanvas  = this // we need this in the callbacks

    // this makes apps clip at the sides !!
    this.domelm.style.overflow="hidden";
    // but WTH does it make mouse up fail ???


    // events on the glass div
    this.glassdiv.domelm.onmouseup   = GPUp;
    this.glassdiv.domelm.onmousedown = GPDown;
    this.glassdiv.domelm.onmousemove = GPMove;
    this.glassdiv.domelm.onmouseout  = GPOut;
    this.glassdiv.domelm.onmouseover = GPOver;

    ddc.add_elm(this);
    append_child(div,this.domelm);
	// TODO : changed Tue Feb 16 2010 WATCH Closely
	// changed to avoid having to use .resize !! (for tutorial)

	this.resize(div.clientWidth, div.clientHeight);
	this.redraw();
    if (global.resizecontext) 
        global.resizecontext.add(thisobj);
}
PlanCanvas.prototype = new Class();
