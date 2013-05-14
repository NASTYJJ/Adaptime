// get rid of some (hopefully all ?) Dom.js items, they are to
// large and slow, 
function ui_xywh (elm,x,y,w,h)
{
    if (x != null) {
		elm.style.left=x;
	}
    if (y != null) {
        elm.style.top=y;
    }
    // inherit width and height
    if (w != null) elm.style.width=w;
    if (h != null) elm.style.height=h;
}

function ui_xywh_px (elm,x,y,w,h)
{
    if (x != null) {
		elm.style.left=x+"px";
	}
    if (y != null) {
        elm.style.top=y+"px";
    }
    // inherit width and height
    if (w != null) elm.style.width=w+"px";
    if (h != null) elm.style.height=h+"px";
}

// create a div with most common settings 
function UIDiv(p,x,y,w,h,caption)
{
	var d = document.createElement("div");
	d.style.position="absolute";
	if (p) p.appendChild(d);
	ui_xywh_px(d,x,y,w,h);
	if (caption) d.innerHTML=caption;

	return d;
}

// create a rather standard button
function UIButton(p,x,y,w,h,caption,action,xtra)
{
	var d = document.createElement("input");
    d.type="submit";
	d.style.position="absolute";
	if (p) p.appendChild(d);
	ui_xywh_px(d,x,y,w,h);
	if (caption) d.value=caption;
	if (action) d.onclick=action;
	if (xtra) d.udata=xtra;

	return d;
}
