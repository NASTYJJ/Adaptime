/** get number of minutes passed in the given day (t = last_midnight())
  * @param {Number} t timestamp from which to calulate 
  */
function day_minutes(t)
{
	var d = new Date(t);
	return d.getMinutes();
}

/** get number of hours passed in the given day (t = last_midnight())
  * @param {Number} t timestamp from which to calulate 
  */
function day_hours(t)
{
	var d = new Date(t);
	return d.getHours();
}

/** format a time in xx:yy form
  * @param {Number} s timestamp
  */
function time_format(t)
{
    //if (t > 100000000000) t /= 1000;
	// ok this invalidates 1 jan 1970, so ?!? 
	if (t < 87000000) {
		var s = t/1000; // ms to minutes
		var h = Math.floor(s/3600);
		var m = Math.round((s-(h*3600))/60);
	} else {
		var d = new Date(t);
		var h = d.getHours();
		var m = d.getMinutes();
	}
	if (m < 10) m='0'+m;

	return h + ":" + m;
}

function addslashes(str) {
	if (!str) return str;
	str=str.replace(/\\/g,'\\\\');
	str=str.replace(/\'/g,'\\\'');
	str=str.replace(/\"/g,'\\"');
	str=str.replace(/\0/g,'\\0');
	return str;
}
function stripslashes(str) {
	if (!str) return str;
	str=str.replace(/\\'/g,'\'');
	str=str.replace(/\\"/g,'"');
	str=str.replace(/\\0/g,'\0');
	str=str.replace(/\\\\/g,'\\');
	return str;
}

function dur_format(s)
{
	var ret;
	s/=1000;

	var h = Math.floor(s/3600);
	var m = Math.round((s-(h*3600))/60);

	if (m < 10) m='0'+m;
	return h + ":" + m;
}

function hour_format(s)
{
    if (s > 100000000000) s /= 1000;
	var d = new Date(s*1000);
	h = d.getHours();

	return h;
}
var wds= new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
var mnts= new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" );

var dgn= new Array("zo", "ma", "di", "wo", "do", "vr", "za");
var dagen= new Array("Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag");
var maanden = new Array("Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December");

function nl_date(t)
{
	var d;
	if (t==undefined) 
		d = new Date();
	else
		d = new Date(t*1000);
		
	m = d.getMonth();
	wd = d.getDay();
	d = d.getDate();

	return dagen[wd] + " " + d + " " + maanden[m];
}

function nl_wd(d)
{
	return dgn[d];
}

function nl_weekday(d)
{
	return dagen[d];
}

function nl_month(t)
{
	var d;
	if (t==undefined) 
		d = new Date();
	else
		d = new Date(t*1000);
		
	m = d.getMonth();

	return maanden[m];
}

function date_format(s)
{
	var d = new Date(s*1000);

	m = d.getMonth();
	wd = d.getDay();
	d = d.getDate();

	return wds[wd] + " " + d + " " + mnts[m];
}

function mysql_date_format(d)
{
	y = d.getFullYear();
	m = d.getMonth()+1;
	if (m < 10) m='0'+m;
	d = d.getDate();
	if (d < 10) d='0'+d;

	return y + "-" + m + "-" + d;
}

function mysql_time_format(d)
{
	h = d.getHours();
	if (h < 10) h='0'+h;
	m = d.getMinutes();
	if (m < 10) m='0'+m;
	s = d.getSeconds();
	if (s < 10) s='0'+s;

	return h + ":" + m + ":" + s;
}

function mysql_datetime_format(d)
{
	return mysql_date_format(d) + " " + mysql_time_format(d);
}

function mysql_parse_date(dt)
{
	var split = dt.split("-")
	var d=new Date();

	yr = parseInt(split[0],10);
	mon = parseInt(split[1],10); 
	day = parseInt(split[2],10);

	d.setSeconds(0);
	d.setMinutes(0);
	d.setHours(0);
	d.setDate(day);
	d.setMonth(mon-1);
	d.setFullYear(yr);

	return d;
}

function mysql_parse_datetime(dt)
{
	var d=new Date();
	var split = dt.split(" ")
	var splitd = split[0].split("-")
	var splitt = split[1].split(":")

	yr = parseInt(splitd[0],10);
	mon = parseInt(splitd[1],10); 
	day = parseInt(splitd[2],10);

	hr = parseInt(splitt[0],10);
	min = parseInt(splitt[1],10);
	sec = parseInt(splitt[2],10);

	d.setSeconds(sec);
	d.setMinutes(min);
	d.setHours(hr);
	d.setDate(day);
	d.setMonth(mon-1);
	d.setFullYear(yr);
	return d;
}

function gues_format(s,gap)
{
    if (gap >= 24*3600000) 
        return date_format(s);
    else
        return time_format(s);
}

/** get the timestamp of the midnight before t
  * @param {Number} t timestamp
  * @return {Number} last midnight in seconds afer epoch
  */
function last_midnight(t)
{
    midnight =t;
	if (!midnight) 
		midnight = new Date()
	
	// last midnight
	midnight.setHours(0);
	midnight.setMinutes(0);
	midnight.setSeconds(0);
	midnight.setMilliseconds(0);

	start = midnight.getTime() ; // seconds!!
	start = Math.floor(start); 	// no fractions

	return start;
}

function last_monday(before) 
{
	wd = before.getDay();
	before.setSeconds(0);
	before.setHours(0);
	before.setMinutes(0);
	
	midnight = before.getTime() - (wd-1) * 24 * 3600 * 1000;
	before = new Date(midnight);
	return before;
}

function last_sunday(before) 
{
	wd = before.getDay();
	before.setSeconds(0);
	before.setHours(0);
	before.setMinutes(0);
	
	midnight = before.getTime() - wd * 24 * 3600 * 1000;
	before = new Date(midnight);
	return before;
}

function start_of_month(before) 
{
	wd = before.getDay();
	before.setSeconds(0);
	before.setHours(0);
	before.setMinutes(0);
	before.setDate(1);
	
	midnight = before.getTime() - wd * 24 * 3600 * 1000;
	before = new Date(midnight);
	return before;
}

/** get the timzone offset 
  * @return {Number} offset in minutes
  */
function get_tzo()
{
    var d = new Date();
    return d.getTimezoneOffset();
}

/** get the timestamp of the next midnight after t
  * @param {Number} t timestamp
  * @return {Number} next midnight in seconds afer epoch
  */
function next_midnight(t)
{
	start = last_midnight(t);
	end = start + 60*60*24*1000;
	return end;
}


