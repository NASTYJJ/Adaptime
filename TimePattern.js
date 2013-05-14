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
		;
		//alert (s);
	else
		print (s);
}

function TimeWindow(start,end)
{
    this.start=start;
    this.end=end;
}

// notime is an error condition
var NOTIME=-Infinity;;
// very early is a valid time
// javascript is accurate up to 15 digits, 
// so this is the first accurate number after -Infinity
var VERY_EARLY=-999999999999999
var BOT=0;
var EOT=Infinity;;

var MSEC_IN_DAY=86400000;

function smaller_ts(a, b)
{
    if (a > NOTIME && b> NOTIME) return a < b;
    if (a > NOTIME) return 1;
    return false;
}

function bigger_ts(a, b)
{
    if (a > NOTIME && b> NOTIME) return a > b;
    if (a > NOTIME) return 0;
    return true;
}

// interval functions
function  regular_prev(ip, before)
{
    if (before < ip.start) return BOT;
    return Math.floor((before-ip.start)/ip.period) * ip.period + ip.start;
}

function  regular_next(ip, after)
{
    var rval= (Math.floor((after-ip.start)/ip.period) + 1) * ip.period + ip.start;
	return rval;
}

// loop detected versions, returns error if result is not later than start
function checked_next_start(tp, start, limit)
{
	var result=0;

	var s=start;
	var e=limit;

	result = tp.next_start(tp,s,e);
	if (result > start) return result; // equal is NOT allowed
	return EOT;
}

function checked_next_end(tp, start, limit)
{
	var result=0;

	result = tp.next_end(tp,start,limit);
	if (result > start) return result; 	// equal is NOT allowed !!
	return EOT;
}

function checked_prev_end(tp, start, limit)
{
	var result=0;

	result = tp.prev_end(tp,start,limit);
	if (result <= start) return result; 	// equal is allowed !!
	return BOT;
}

function checked_prev_start(tp, start, limit)
{
	var result=0;

	result = tp.prev_start(tp,start,limit);
	if (result < start) return result; 	// equal is NOT allowed !!
	return BOT;
}

function IS_SINGLE_TW(ptrn) { return ptrn.iv.period==0; }

// pattern combination functions 
function leaf_next_start(ptrn, after, limit)
{
	var p=0;
	var n=0;
	var nn=0;
	var s=0;
	var e=0;

	var start = ptrn.tw.start;
	var end = ptrn.tw.end;

	if (IS_SINGLE_TW(ptrn)) {
		// clip 
		if (start<after) start=after;
		if (end > limit) end=limit;

		if (end < start) return EOT;
		if (after < start) return start;
		return limit;
	}

	p = ptrn.iv.prev(ptrn.iv,after);
	if (p==BOT) p = after;
	n = ptrn.iv.next(ptrn.iv,p); // REAL prev and next
	if (n==EOT) return limit;

	do {
		// negative values are offsets from the end (=next interval)
		if (start < 0) s = n+start; else s = p+start;
		if (end < 0) e = n+end; else e = p+end;

		// clip to interval
		if (s>=n) s=EOT; if (s<p) s=p;
		if (e>n) e=n; if (e<p) e=BOT;

		p=n; // next loop
		n = ptrn.iv.next(ptrn.iv,p);
	} while (s < limit && s <after && s<e);
	if (!n || s>e) return limit;
	if (s <= after) {
		//printf("loop, return EOT %lld %lld\n", s, after);
		return limit;
	}
	return s;
}

function leaf_next_end(ptrn, after, limit)
{
	var p=0, n=0, nn=0, s=0;
	var e=0;

	var start=ptrn.tw.start;
	var end=ptrn.tw.end;

	if (IS_SINGLE_TW(ptrn)) { // single tw
		// clipping
		if (start<after) start=after;
		if (end > limit) end=limit;

		if (end < after || start > limit) return EOT;
		if (after <= end) return end;
		return limit;
	}
	p = ptrn.iv.prev(ptrn.iv,after);
	if (p==BOT) p = after;
	n = ptrn.iv.next(ptrn.iv,p); // REAL prev and next
	if (n==EOT) return limit;

	do {
		if (end < 0) e = n+end; else e = p+end;
		if (start < 0) s = n+start; else s = p+start;

		// clipping
		if (s>=n) s=EOT; if (s<p) s=p;
		if (e>n) e=n; if (e<p) e=BOT;

		p=n;
		n = ptrn.iv.next(ptrn.iv,p);
		//if (start < 0) s = n+start; else s = p+start;
	} while (e < limit && e< after && s<e);
	if (n==NOTIME) return limit;
	return e;
}

function leaf_prev_start(ptrn, before, limit)
{
	var p=0;
	var n=0;
	var s=0;
	var e=0;
	var start=ptrn.tw.start;
	var end=ptrn.tw.end;

	if (IS_SINGLE_TW(ptrn)) { 
		if (start > end || start < 0 || end < 0) return BOT;
		if (before > ptrn.tw.start) return ptrn.tw.start;
		return limit;
	}
	p = ptrn.iv.prev(ptrn.iv,before);
	if (!p) return limit;
	n = ptrn.iv.next(ptrn.iv,p); // REAL prev and next


	do {
		if (start < 0) s = n+start; else s = p+start;
		if (end < 0) e = n+end; else e = p+end;

		// clipping
		if (s>=n) s=EOT; if (s<p) s=p;
		if (e>n) e=n; if (e<=p) e=VERY_EARLY;

		n=p;
		p = ptrn.iv.prev(ptrn.iv,n-1);
	} while (p>limit && s > before && s<=e);
	if (!p || s>e) return limit;

	return s;
}

function leaf_prev_end(ptrn, before, limit)
{
	var p=0;
	var n=0;
	var s=0;
	var e=0;

	var start=ptrn.tw.start;
	var end=ptrn.tw.end;

	if (IS_SINGLE_TW(ptrn)) {
		if (start> end || end < 0 || start < 0) return BOT;
		if (before > ptrn.tw.end) return ptrn.tw.end;
		return limit;
	}
	p = ptrn.iv.prev(ptrn.iv, before);
	if (!p) return limit;
	n = ptrn.iv.next(ptrn.iv, p); // REAL prev and next


	do {
		if (end < 0) e = n+end; else e = p+end;
		if (start < 0) s = n+start; else s = p+start;

		// clipping
		if (s>=n) s=EOT; if (s<p) s=p;
		if (e>n) e=n; if (e<=p) e=VERY_EARLY;

		n=p;
		p = ptrn.iv.prev(ptrn.iv,n-1);
	} while (e>limit && e > before && s<=e);
	if (!p || s>e) return limit;

	/* if (s > before) return EOT; */
	return e;
}

function leaf_valid(ptr, at)
{
	var n = checked_next_start(ptr,at-1,EOT);
	var s = checked_prev_start(ptr,at,BOT);
	var e = checked_prev_end(ptr,at,BOT);
	var t;

	if (e == BOT) return false;
	if (n == at && n!=e) return true; // on start boundary
	t = checked_next_end(ptr,s,EOT);
	if (e<=s && s!=t) return true; 
	else return false;
}

function not_next_start(ptrn, after, limit)
{
	var rval = ptrn.op1.next_end(ptrn.op1,after,limit);

	if (rval < after) return EOT; // equal is NOT allowed
	if (rval != EOT) return rval;
	return rval;
}

function not_next_end(ptrn, after, limit)
{
	var rval = ptrn.op1.next_start(ptrn.op1,after,limit);
	if (rval < after) return EOT; // equal is NOT allowed
	return rval;
}

function not_prev_start(ptrn, before, limit)
{
	var rval = checked_prev_end(ptrn.op1,before,limit);
	return rval;
}

function not_prev_end(ptrn, before, limit)
{
	var rval = checked_prev_start(ptrn.op1,before,limit);
	return rval;
}

function not_valid(ptrn, at)
{
	var rval = ptrn.op1.valid(ptrn.op1,at);
	return !rval;
}

// Intersection
function or_next_start(ptrn,after,limit)
{
	var ra,rb;

	ra = checked_next_start(ptrn.op1,after,limit);
    rb = checked_next_start(ptrn.op2,after,limit);
    return smaller_ts(ra , rb) ? ra : rb;
}

function or_next_end(ptrn,after,limit)
{
	var sa = checked_next_start(ptrn.op1,after,limit);
	var sb = checked_next_start(ptrn.op2,after,limit);
	var ea = checked_next_end(ptrn.op1,after,limit);
	var eb = checked_next_end(ptrn.op2,after,limit);

	// if reversed start/end, take after as start
	if (sa>ea) sa = after;
	if (sb>eb) sb = after;

	while (after < limit) {
		if (ea<eb) {
			after = ea;
			if (sb > after+1) return after; // +1 is for adjacency
			sa = checked_next_start(ptrn.op1,after,limit);
			ea = checked_next_end(ptrn.op1,sa,limit);
		} else {
			after = eb;
			if (sa > after+1) return after; // +1 is for adjacency
			sb = checked_next_start(ptrn.op2,after,limit);
			eb = checked_next_end(ptrn.op2,sb,limit);
		}
	}

	return limit;
}

function or_prev_start(ptrn,before,limit)
{
	var sa = checked_prev_start(ptrn.op1,before,limit);
	var sb = checked_prev_start(ptrn.op2,before,limit);
	var ea = checked_prev_end(ptrn.op1,before,limit);
	var eb = checked_prev_end(ptrn.op2,before,limit);

	if (sa>ea) ea = before;
	if (sb>eb) eb = before;

	while (before > limit) {
		if (sa>sb) {
			before = sa;
			if (eb < before-1) return before; // -1 is for adjacency
			ea = checked_prev_end(ptrn.op1,before,limit);
			sa = checked_prev_start(ptrn.op1,ea,limit);
		} else {
			before = sb;
			if (ea < before-1) return before; // -1 is for adjacency
			eb = checked_prev_end(ptrn.op2,before,limit);
			sb = checked_prev_start(ptrn.op2,eb,limit);
		}
	}

	return limit;
}

function or_prev_end(ptrn, before, limit)
{
	var ra,rb;

	ra = checked_prev_end(ptrn.op1,before,limit);
    rb = checked_prev_end(ptrn.op2,before,limit);
    return ra > rb ? ra : rb;
}

function or_valid(ptrn, at)
{
	var valid;
	valid = ptrn.op1.valid(ptrn.op1,at);
	valid |= ptrn.op2.valid(ptrn.op2,at);
	return valid;
}

// union

function and_next_start(ptrn,after,limit)
{
	var sa = checked_next_start(ptrn.op1,after,limit);
	var sb = checked_next_start(ptrn.op2,after,limit);
	var ea = checked_next_end(ptrn.op1,after,limit);
	var eb = checked_next_end(ptrn.op2,after,limit);

	// if reversed start/end, take after as start
	if (sa>ea) sa = after;
	if (sb>eb) sb = after;

	while (after < limit) {
		if (sa>sb) {
			after = sa;
			if (eb > after-1) return after; // -1 is for adjacency
			sb = checked_next_start(ptrn.op2,after,limit);
			eb = checked_next_end(ptrn.op2,after, limit);
			if (sb>eb) sb = after;
		} else {
			after = sb;
			if (ea > after-1) return after; // -1 is for adjacency
			sa = checked_next_start(ptrn.op1,after,limit);
			ea = checked_next_end(ptrn.op1,after, limit);
			if (sa>ea) sa = after;
		}
	}

	return limit;
}

function and_next_end(ptrn, after, limit)
{
	var ea = checked_next_end(ptrn.op1,after,limit);
	var eb = checked_next_end(ptrn.op2,after,limit);

	if (ea && eb) return (ea<eb) ? ea : eb;
	if (!ea && eb) return eb;
	if (ea && !eb) return ea;
	return limit;
}

function and_prev_start(ptrn,after,limit)
{
	var ea = checked_prev_start(ptrn.op1,after,limit);
	var eb = checked_prev_start(ptrn.op2,after,limit);

	if (ea && eb) return (ea>eb) ? ea : eb;
	if (!ea && eb) return ea;
	if (ea && !eb) return eb;
	return limit;
}

function and_prev_end(ptrn, before, limit)
{
	var sa = checked_prev_start(ptrn.op1,before,limit);
	var sb = checked_prev_start(ptrn.op2,before,limit);
	var ea = checked_prev_end(ptrn.op1,before,limit);
	var eb = checked_prev_end(ptrn.op2,before,limit);

	// if reversed start/end, take before as start
	if (sa>ea) ea = before;
	if (sb>eb) eb = before;

	while (before > limit) {
		if (ea<eb) {
			before = ea;
			if (sb < before) return before; 
			eb = checked_prev_end(ptrn.op2,before,limit);
			sb = checked_prev_start(ptrn.op2,eb,limit);
		} else {
			before = eb;
			if (sa < before) return before;
			ea = checked_prev_end(ptrn.op1,before,limit);
			sa = checked_prev_start(ptrn.op1,ea,limit);
		}
	}

	return limit;
}

function and_valid(ptrn, at)
{
	var valid;
	valid = ptrn.op1.valid(ptrn.op1,at);
	valid &= ptrn.op2.valid(ptrn.op2,at);
	return valid;
}

// global functions so it's easier syncable with the c version
function traverse_fwd(start,stop,tp,what,handle)
{
	var end;
	var valid;
	if (start < 0) start=0; // there is no negative time
    if (stop < 0) stop=0;

	end=start;
	valid=tp.valid(tp,start);
	if (!valid) {
		if ( (start=checked_next_start(tp,start,stop)) > stop )
			return;
	}

	if ((end = checked_next_end(tp,start,stop)) > stop || end > stop)
		end = stop;

    while (start< stop && start != NOTIME && end != NOTIME) {

        if (end > start)
            what(start,end,handle);
        if ( (start = tp.next_start(tp,end,stop)) > stop)
            return;
        if ((end = checked_next_end(tp,start,stop)) > stop)
            end = stop;
    }
}

function traverse_windows(start,stop,tp,what,handle)
{
	if (start<stop)
		traverse_fwd(start,stop,tp,what,handle);
	else
		traverse_bwd(start,stop,tp,what,handle);
}

function YearInterval()
{
    this.prev = function(ival,before)
    {
        before--;
        var d = new Date(before);
        y = d.getFullYear();
        d.setSeconds(0);
        d.setMinutes(0);
        d.setHours(0);
        d.setDate(1);
        d.setMonth(0);
        y--;
        d.setFullYear(y);
        return d.getTime();
    }

    this.next = function(ival,after)
    {
        after++;
        var d = new Date(after);
        y = d.getFullYear();
        d.setSeconds(0);
        d.setMinutes(0);
        d.setHours(0);
        d.setDate(1);
        d.setMonth(0);
        y++;
        d.setFullYear(y);
        return d.getTime();
    }
}


DayInterval.mon=1;
DayInterval.tue=2;
DayInterval.wed=3;
DayInterval.thu=4;
DayInterval.fri=5;
DayInterval.sat=6;
DayInterval.sun=7;

function DayInterval(which)
{
    if (which && which >= 1 && which <=7) { 
        // epoch was on a thursday
        this.start= ((which + 7) - 4) * MSEC_IN_DAY;
        this.period = 7*MSEC_IN_DAY;
    } else {
        this.start= 4*MSEC_IN_DAY;
        this.period = 1*MSEC_IN_DAY;
    }

    this.prev = function(ival,before)
    {
        before--; // prevent loop
        return Math.floor( ((before-this.start)/this.period) ) * this.period + this.start;
    }
    this.next = function(ival,after)
    {
        after++; // prevent loop
        return Math.floor( ((after-this.start)/this.period) + 1) * this.period + this.start;
    }
}

MonthInterval.jan=1;
MonthInterval.feb=2;
MonthInterval.mar=3;
MonthInterval.apr=4;
MonthInterval.may=5;
MonthInterval.jun=6;
MonthInterval.jul=7;
MonthInterval.aug=8;
MonthInterval.sep=9;
MonthInterval.oct=10;
MonthInterval.nov=11;
MonthInterval.dec=12;

function MonthInterval(which)
{
    if (which) this.which=which;

    this.prev = function(ival,before)
    {
        before--;
        var d = new Date(before);
        m = d.getUTCMonth();
        y = d.getUTCFullYear();
        d.setUTCSeconds(0);
        d.setUTCMinutes(0);
        d.setUTCHours(0);
        d.setUTCDate(1);
        if (this.which) {
            if (m<=this.which-1) y--;
            m=this.which;
        }
        //m--; NO beginning of month !!
        if (m < 0) {
            y--;
            m=11;
        }
        d.setUTCFullYear(y);
        d.setUTCMonth(m);
        return d.getTime();
    }
    this.next = function(ival,after)
    {
        after++;
        var d = new Date(after);
        m = d.getUTCMonth();
        y = d.getUTCFullYear();
        d.setUTCSeconds(0);
        d.setUTCMinutes(0);
        d.setUTCHours(0);
        d.setUTCDate(1);
        if (this.which) {
            if (m>=this.which-1) y++;
            m=this.which-2;
        }
        m++;
        if (m > 11) {
            y++;
            m=0;
        }
        d.setUTCFullYear(y);
        d.setUTCMonth(m);
        return d.getTime();
    }
}

function Interval(anchor,length)
{
	if (length<0) length=0; // means no repetition
	if (length>0) 
		// first negative start
		this.start=anchor - (Math.floor(anchor / length) * length) - length;
	else
		this.start=0;

    this.period=length;

    this.prev = function(ival,before)
    {
		return regular_prev(this,before);
    }
    this.next = function(ival,after)
    {
		return regular_next(this,after);
    }
}

function TimeEvent(ts,start)
{
    this.ts=ts;
    this.start=start;
}

function date_print(ts)
{
    if (ts) {
        var d = new Date(ts);
        printf (d.toUTCString());
    } else
        printf ("not a valid date : " , ts);
}

function TimePattern(tw,iv)
{
    this.tw=tw;
    this.iv=iv;
	this.lbl="Pattern";

    this.next_start=function(tp,after,limit)
    {
		return leaf_next_start(this,after,limit);
    }

    this.next_end=function(tp,after,limit)
    {
		return leaf_next_end(this,after,limit);
    }

    this.prev_start=function(tp,before,limit)
    {
		return leaf_prev_start(this,before,limit);
    }

    this.prev_end=function(tp,before,limit)
    {
		return leaf_prev_end(this,before,limit);
    }

    this.valid=function(tp,at)
    {
		return leaf_valid(this,at);
    }

	this.traverse_fwd=function(start,stop,what,xtra)
	{
		traverse_fwd(s,e,this,what,xtra);
	}

	this.traverse_bwd=function(start,stop,what,xtra)
	{
		// todo : test in c first
	}

	this.traverse_windows=function(start,stop,what,xtra)
	{
		traverse_windows(start,stop,this,what,xtra);
	}
}

function NotPattern(op1)
{
	var ptr = new TimePattern(null,null);
    ptr.op1=op1;
	//this.type=TYPE_NOT;
	ptr.lbl="NotPattern";

    ptr.next_start=function(tp,after,limit) 
		{   return not_next_start(this,after,limit); }
    ptr.next_end=function(tp,after,limit) 
		{   return not_next_end(this,after,limit); }
    ptr.prev_start=function(tp,before,limit) 
		{ return not_prev_start(this,before,limit); }
    ptr.prev_end=function(tp,before,limit) 
		{ return not_prev_end(this,before,limit); }
    ptr.valid=function(tp,at) { return not_valid(this,at); }
	return ptr;
}

function OrPattern(op1,op2)
{
	//var ptr = new TimePattern(null,null);
    this.op1=op1;
    this.op2=op2;
	this.lbl="OrPattern";
    this.next_start=function(tp,after,limit) 
		{   return or_next_start(tp,after,limit); }
    this.next_end=function(tp,after,limit) 
		{   return or_next_end(tp,after,limit); }
    this.prev_start=function(tp,before,limit) 
		{ return or_prev_start(tp,before,limit); }
    this.prev_end=function(tp,before,limit) 
		{ return or_prev_end(tp,before,limit); }
    this.valid=function(tp,at) { return or_valid(tp,at); }
}

function AndPattern(op1,op2)
{
	//var ptr = new TimePattern(null,null);
    this.op1=op1;
    this.op2=op2;
	this.lbl="AndPattern";
    this.next_start=function(tp,after,limit) 
		{   return and_next_start(tp,after,limit); }
    this.next_end=function(tp,after,limit) 
		{   return and_next_end(tp,after,limit); }
    this.prev_start=function(tp,before,limit) 
		{ return and_prev_start(tp,before,limit); }
    this.prev_end=function(tp,before,limit) 
		{ return and_prev_end(tp,before,limit); }
    this.valid=function(tp,at) { return and_valid(tp,at); }
}

function TAndPattern(op1,op2)
{
	var ptr = new TimePattern(null,null);
    ptr.op1=op1;
    ptr.op2=op1;
	ptr.lbl="AndPattern";
    ptr.next_start=and_next_start;
    ptr.next_end=and_next_end;
    ptr.prev_start=and_prev_start;
    ptr.prev_end=and_prev_end;
    ptr.valid=and_valid;

	return ptr;
}

function CreateInterval(iv)
{
	var unit = iv.unit;

	switch (unit) {
		case "DAY":
			// the 3600000 is because epoch is 01:00 jan 1 1970
			return new Interval(parseInt(iv.anchor)*MSEC_IN_DAY-3600000,parseInt(iv.period)*MSEC_IN_DAY);
		break;
		case "MONTH":
			return new MonthInterval();
		break;
		case "YEAR":
			return new YearInterval();
		break;
		default:
			return new Interval(parseInt(iv.anchor),parseInt(iv.period));
		break;
	}
}

function CreatePattern(jp)
{
	var operation = jp.operation;
	var op1,op2,tw,iv;
	var pat;

	switch(operation) {
		case "LEAF":
			tw=new TimeWindow(parseInt(jp.tw.start),parseInt(jp.tw.end));
			iv=CreateInterval(jp.iv);
			pat=new TimePattern(tw,iv);
		break;
		case "AND":
			op1 = CreatePattern(jp.op1);
			op2 = CreatePattern(jp.op2);
			pat = new AndPattern(op1,op2);
		break;
		case "OR":
			op1 = CreatePattern(jp.op1);
			op2 = CreatePattern(jp.op2);
			pat = new OrPattern(op1,op2);
		break;
		case "NOT":
			op1 = CreatePattern(jp.op1);
			pat = new NotPattern(op1);
		break;
		default:
			return null;
		break;
	}
	return pat;
}

function fill_trav(start,stop)
{
    date_print(start);
    date_print(stop);
}

function fill(start,stop,tp)
{
    var valid = tp.valid(tp,start);
    if (!valid) { 
        start = tp.next_start(tp,start,stop);
    }
    date_print(start);
    var end = tp.next_end(tp,start,stop);
    date_print(end);
    while (start < stop) {
        start = tp.next_start(tp,end,stop);
    	date_print(start);
        end = tp.next_end(tp,start,stop);
    	date_print(end);
    }
}

function exampl1()
{
    var start = Date.parse("Jan 1,2007 00:00");
    var stop  = Date.parse("Jan 1,2008 00:00");

	//date_print(start);
	//printf(start);

    var month = new MonthInterval(); 
    var tenth = new TimeWindow(9*24*60*60*1000, 10*24*60*60*1000);
    var weekend = new TimeWindow(2*24*60*60*1000, 4*24*60*60*1000);
    var weekly = new Interval(0*24*60*60*1000, 7*24*60*60*1000);

    var tp1 = new TimePattern(tenth,month);
    var tp2 = new TimePattern(weekend,weekly);

    var tpo = new OrPattern(tp1,tp2);
    var tpa = new AndPattern(tp1,tp2);

    fill(start,stop,tpo);
}

function adap()
{
var base= '{"tw":null,"iv":null,"operation":"OR","op1":{"tw":null,"iv":null,"operation":"AND","op1":{"tw":{"start":"28800000" ,"end":"64800000"},"iv":{"anchor":"0","period":"1","unit":"DAY"},"operation":"LEAF"},"op2":{"tw":{"start" :"0","end":"172800000"},"iv":{"anchor":"4","period":"7","unit":"DAY"},"operation":"LEAF"}},"op2":{"tw" :null,"iv":null,"operation":"AND","op1":{"tw":{"start":"28800000","end":"43200000"},"iv":{"anchor":"4" ,"period":"7","unit":"DAY"},"operation":"LEAF"},"op2":{"tw":{"start":"172800000","end":"604800000"},"iv" :{"anchor":"4","period":"7","unit":"DAY"},"operation":"LEAF"}}}';

    var start = Date.parse("Jan 19,2009 00:00");
    var stop  = Date.parse("Jan 25,2009 00:00");

	var JSON=new Json();

	var pat = JSON.parse(base);
	var tpo = CreatePattern(pat);

    fill(start,stop,tpo);
}

var counter;

function count_trav(a,b)
{
	counter += (b-a);
	print(a,b,counter);
}

function count(start,stop,tp)
{
	counter=0;
	traverse_windows(start,stop,tp,count_trav,null);
	return counter;
}

function fill(start,stop,tp)
{
	counter=0;
	traverse_windows(start,stop,tp,fill_trav,null);
	return counter;
}

function test()
{
	var start = 0;
	var stop  = 100;
	
	var i1,i2,i3,i4;
	var t1,t2,t3,t4;
	var p1,p2,p3,p4;

	var or, and;

	i1 = new Interval(0,0);
	t1 = new TimeWindow(1,2);
	p1 = new TimePattern(t1,i1);

	p2 = new NotPattern(p1);

	print("p1\n");
	count(start,stop,p1);
	print("p2\n");
	count(start,stop,p2);
}

function exhaust_not(depth)
{
	var START=0;
	var END=100;
	var c=0;
	var c2=0;
	var is,id;
	var ts,td;

	var i1,i2;
	var t1,t2;
	var p1,p2;

	var nd = depth*-1;

    for (is=0; is< depth; is++) {
        for (id=0; id< depth; id++) {
            i1 = new Interval(START + is ,id);
            for (ts=nd; ts< depth; ts++) {
                for (td=nd; td< depth; td++) {
                    t1 = new TimeWindow(ts,td);
                    p1 = new TimePattern(t1,i1);
                    p2 = new NotPattern(p1);

                    c = count(START,END,p1);
                    c2 = count(START,END,p2);
					//printf("done");

                    if (c + c2 != (END-START))
                        print("nie :", START+is, id, ts, td, c, c2, (END-START));
				}
			}
		}
	}

}

function exhaust(depth)
{
	exhaust_not(depth);
}

//adap();

//exampl1();

//test();
//exhaust(3);

//test_tp();
