function Tab(l,c,d)
{
	this.label=l;
	this.content=c;
	this.udata=d;
}

/** @constructor 
  * simple tabulator class
  */
function Tabs(p,hlcolor)
{
	var thisobj=this;
	thisobj.tabs= Array();

	this.hlcolor="#ffffff";
	if (hlcolor)
		this.hlcolor=hlcolor;

	this.init=function(p) 
	{
    	thisobj.topelm = document.createElement("div");
		dom_xywh(thisobj.topelm,'0px','0px','100%','100%');
    	thisobj.topelm.style.position="absolute";
    	thisobj.topelm.style.display="inline";
    	thisobj.tabulator = document.createElement("div");
    	thisobj.tabulator.style.position="absolute";
    	thisobj.tabulator.style.display="inline";
		thisobj.topelm.appendChild(thisobj.tabulator);
		dom_xywh(thisobj.topelm,'0px','10px','100%','15px');
		dom_xywh(thisobj.tabulator,'0px','0px','100%','15px');

    	thisobj.dataarea = document.createElement("div");
    	thisobj.dataarea.style.position="absolute";
		thisobj.topelm.appendChild(thisobj.dataarea);
		dom_xywh(thisobj.dataarea,'0px','25px','100%','150px');

		// create tabs if already added (init called afterwards)
		for (var t=0;t<thisobj.tabs.length; t++) {
			var tab= thisobj.tabs[t];
			thisobj.draw_label(tab);
		}
		p.appendChild(thisobj.topelm);
	}

	this.xy=function(x,y) {
		dom_xywh(thisobj.topelm,x+'px',y+'px');
	}

	function refill(e)
	{
		var tab=this.tab;
		remove_children(thisobj.dataarea);

		var domtree=tab.content(thisobj.dataarea, tab.udata);
		if (!domtree) return;
		thisobj.dataarea.appendChild(domtree);
	}

	function hl(){
		this.className="UiTabHighlighted";
	}

	function ll(){
		this.className="UiTab";
	}

	this.draw_label=function(tab) {
		var l = document.createElement("span");
		l.className="UiTab";
		l.innerHTML=tab.label;
		l.onclick=refill;
		l.onmouseover=hl;
		l.onmouseout=ll;
    	l.style.cursor= global.browser.icon_name("hand");
		l.tab=tab;
		dom_xywh(l,0,0,null,'15px');
		thisobj.tabulator.appendChild(l);
	}

	// justy add them in order please 
	this.add=function(label,content,data) 
	{
		var t = thisobj.tabs.length;
		thisobj.tabs[t]=new Tab(label,content,data);
		if (thisobj.tabulator)
			thisobj.draw_label(thisobj.tabs[t]);
	}

	if (p) this.init(p);
}
