var event_idle   =0;
var event_delete =1;
var event_insert =2;
var event_move   =3;
var event_resize =4;
var event_apptype=5;
var event_over   =6;
var event_out    =7;
var event_other  =9;

/**
 * @constructor state information at start of a dragdrop action
 * @param {Object} dragzone what surface did this event start on
 */
function DragState(dragzone)
{
	this.dragzone = dragzone;
}

/**
 * @constructor state information at end of a dragdrop action
 * @param {Object} dropzone what surface did this event end on
 */
function DropState(dropzone)
{
	this.dropzone = dropzone;
}

/**
 * @constructor object that holds (drag drop) event specific information
 * @param {Number} type type of event 
 * @param {Object} dragzone what surface did this event start on
 * @param {Object} draggable what was dragged(dropped)
 * @requiers JSON
 */
function Event(type,dragzone,draggable,e)
{
    /** initiate event by creating a new drag state 
        @param {Object} dragzone originating surface
      */
	this.start_event = function (dragzone) 
	{
		this.from=new DragState(dragzone);
	}

    /** end event by creating a new drop state 
        @param {Object} dropzone destination surface
      */
	this.end_event = function (dropzone) 
	{
		this.to  =new DropState(dropzone); // filled at drop
	}

    /** revert the operation to the state at time of start_event */
	this.rollback = function()
	{
		this.to.dropzone.detach(this.draggable);
		this.draggable.detached(this.to.dropzone);

		if (!this.from || !this.from.dragzone || ! this.from.tw) {
			// no origin ?, delete it !
			return;
		}
		this.from.dragzone.attach(this.draggable);
		this.draggable.attached(this.from.dragzone);

		this.draggable.tw.start = this.from.tw.start;
		this.draggable.tw.end = this.from.tw.end;
		this.draggable.redraw(this.draggable);
	}

    this.domevent=e;
	this.type=type;
	this.draggable=draggable;
	this.start_event(dragzone);
}

