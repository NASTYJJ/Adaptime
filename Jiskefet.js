/**
 * @interface alert about implementing the Trash() method
 */
function Lunch()
{
	this.Trash = function ()
	{
		alert ("should implement Trash() on class :" + this.name);
	}
}
Lunch.prototype = new Class();

/** @ignore */
function JFOver(e)
{
	if (!this.obj.ddc.o) return; // not dragging a.t.m.
}

/** @ignore */
function JFUp(e)
{
    // global handler, should not try to handle everything
    if (!this.obj.ddc.o) return;
	global.browser.event_set_xy(e);
	global.browser.mouse_release(this);
	this.obj.ddc.mousedown = false;

	this.obj.ddc.o.Trash();
	this.obj.ddc.o = null;

	// prevent double events :
	global.browser.cancel_bubble(e);
}

/** @ignore */
function DocUp(e)
{
	global.browser.event_set_xy(e);
	global.browser.mouse_release(this);
	this.obj.ddc.mousedown = false;

	this.obj.ddc.o.Trash();
	this.obj.ddc.o = null;

	// prevent double events :
	global.browser.cancel_bubble(e);
}

/** @constructor surface to use to delete draggables
    @param {Object} prnt parent for the dom element to place under
    @param {Number} w width of the drop surface
    @param {Number} h height of the drop surface
    @param {DragDropContexct} ddc dragdropcontext to use (null will take the global ddc)
  */
function Jiskefet(prnt,w,h,ddc)
{
    if (!ddc) ddc=global.ddc;
	this.ddc = ddc;
	this.drop = function(o)
	{
		o.Trash();
	}

	// superclasses/interfaces
	this.inheritz(new DomDiv(prnt,0,0,w,h,'white'));
	this.inheritz(new DropZone());

	this.domelm.obj = this;
	this.domelm.onmouseover = JFOver;
	this.domelm.onmouseup = JFUp;
    this.domelm.style.cursor = 
       global.browser.icon_name('hand');
} 
Jiskefet.prototype = new Class();

// designate any dom element to be trashcan
function DomJiskefet(domelm,ddc)
{
    if (!ddc) ddc=global.ddc;
	this.ddc = ddc;
	this.drop = function(o)
	{
		o.Trash();
	}

	this.inheritz(new DomElement(domelm));
	this.inheritz(new DropZone());

	this.domelm.obj = this;
	this.domelm.onmouseover = JFOver;
	this.domelm.onmouseup = JFUp;
    this.domelm.style.cursor = 
    global.browser.icon_name('hand');
} 
DomJiskefet.prototype = new Class();
