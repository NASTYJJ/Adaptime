/** 
  * @constructor 
  * @param {String} type, type name
  */
function DropZone(type)
{
	this.type = type;

	this.drop = function (o)
	{
		alert("implement drop(Object) for " + this.name);
	}

	this.attach = function (o,x,y)
	{
		alert("implement attach(Object,x-coord,y-coord) for + " + this.name);
	}
}

/** @interface : something that can be dragged from
 */
function DragZone(type)
{
	this.type = type;

	this.drag = function (o)
	{
		alert("implement drag(Object) for " + this.name);
	}

	this.detach = function (o)
	{
		alert("implement detach(Object) for " + this.name);
	}
}

/** @interface 
 */
function Draggable(type)
{
	this.type = type; // to be used for object id

	/** 
  	 * function to be executed when a draggable is picked up from a DragZone
  	 * @param {Object} p, parent (DragZone) object
  	 */
	this.drag = function (p)
	{
		alert ("implement drag(Parent) for " + this.name) ;
	}

	/** 
  	 * function to be executed when a draggable is dropped on a DropZone
  	 * @param {Object} p, parent (DropZone) object
  	 */
	this.drop = function (p)
	{
		alert ("implement drop(Parent) for " + this.name) ;
	}

	/** 
  	 * function to be executed when a draggable is attached to a DropZone
	 * so this is not on mouseup but when dragging (see drop)
  	 * @param {Object} p, parent (DropZone) object
  	 */
	this.attached = function (o)
	{
		alert ("implement attached(Object) for " + this.name) ;
	}

	/** 
  	 * function to be executed when a draggable is detach from a DragZone
	 * so this is not on mousedown but when dragging and leaving the dragzone
  	 * @param {Object} p, parent (DragZone) object
  	 */
	this.detached = function (o)
	{
		alert ("implement detached(Object) for " + this.name) ;
	}
}

/** @class 
  * draggables and dragzones use this to exchange data
  */
function DragDropContext()
{
	this.members = new Array; // list of member elements
	this.mlen=0;
	this.o = null;
	this.p = null;
	this.sel_obj = null;

	
	/** 
  	 * add a new member to this DragDropContext
  	 * @param {Object} elm, object that becomes member of this DragDropContext
  	 */
	this.add_elm = function(elm)
	{
		var l = this.members.length;
		this.members[l]=elm;
	}

	/** 
  	 * delete a member from this DragDropContext
  	 * @param {Number} pos, position of object that stops being a member of this DragDropContext
  	 */
	this.del_elm = function(pos)
	{
		if (this.members[pos])
			delete(this.members[pos]);
	}

	/** 
  	 * traverse all members of this DDC
  	 * @param {Function} handler, function to be exectuded with each member as parameter
  	 */
	this.elm_traverse = function(handler)
	{
		for (var m in this.members) {
			mem = this.members[m];
			handler(mem);
		}
	}

	this.deselect = function()
	{
		if (this.sel_obj) {
			this.sel_obj.deselect();
		} 
		this.sel_obj = null;
	}

	this.select = function(app)
	{
		if (this.sel_obj) this.sel_obj.deselect();
		if (app) {
			app.select();
		} 
		this.sel_obj = app;
	}

	this.leave = function (o)
	{
		from = o.parent;
		if (!from) return; // not attached
		from.detach(o);
		o.detached(from);
	}

	this.drag = function (p,o)
	{
		p.drag(o);
		o.drag(p);
		this.o = o;
		this.p = p;
	}

	this.enter = function(to) 
	{
        if (!to || !this.o) return;
		to.attach(this.o);
		this.o.attached(to);
	}

	this.drop = function(p,o) 
	{
		p.drop(o);
		if (o) o.drop(p);
		this.o = null;
		this.p = null;
	}
}

// make at least one, otherwise don't include this
global.ddc = new DragDropContext();
