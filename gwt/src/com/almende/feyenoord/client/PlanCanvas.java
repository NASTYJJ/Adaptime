/**
 * 
 */
package com.almende.feyenoord.client;

import com.google.gwt.core.client.*;
import com.google.gwt.user.client.ui.*;
import com.google.gwt.user.client.*;
import java.util.*;

/**
 * @author Tamas Mahr
 * @version $Rev: 1093 $
 *
 * The PlanCanvas encapsulates the PlanCanvas implemented in js.
 */
public class PlanCanvas extends Widget implements SourcesPlanEvents {
	/**
	 * Flags that a vertical plan canvas is needed instead of the default horizontal.
	 */
	public static int FLAG_VERTICAL;
	
	/**
	 * Disallows movement of appointments on the plan canvas.
	 */
	public static int FLAG_NOMOVE;
	
	/**
	 * Disallows visual creation (by mouse) of appointments on the plan canvas.
	 */
	public static int FLAG_NOCREATE;
	
	/**
	 * Disallows dragging from and droppong to the plan canvas.
	 */
	public static int FLAG_NOCROSS;
	
	/**
	 * Appointments are not allowed to overlap on the plan canvas.
	 */
	public static int FLAG_OVERLAP;

	/**
	 * Appointments are not allowed to be resized.
	 */
	public static int FLAG_NORESIZE;

	/**
	 * Context menu on Appointments will be disabled.
	 */
	public static int FLAG_NOAPPCM;
	
	/**
	 * The opaque handle to the javascript object.
	 */
	private JavaScriptObject pc;

	/**
	 * The object who receives plan events.
	 */
	private ArrayList planListeners;
	
	private Element main;
	
	/**
	 * User defined id.
	 */
	private Object id;
	
	private static native void init()/*-{
		@com.almende.feyenoord.client.PlanCanvas::FLAG_VERTICAL = $wnd.PlanCanvas.FLAG_VERTICAL;
		@com.almende.feyenoord.client.PlanCanvas::FLAG_NOMOVE= $wnd.PlanCanvas.FLAG_NOMOVE;
		@com.almende.feyenoord.client.PlanCanvas::FLAG_NOCREATE= $wnd.PlanCanvas.FLAG_NOCREATE;
		@com.almende.feyenoord.client.PlanCanvas::FLAG_NOCROSS = $wnd.PlanCanvas.FLAG_NOCROSS;
		@com.almende.feyenoord.client.PlanCanvas::FLAG_OVERLAP = $wnd.PlanCanvas.FLAG_OVERLAP;
		@com.almende.feyenoord.client.PlanCanvas::FLAG_NORESIZE = $wnd.PlanCanvas.FLAG_NORESIZE;
		@com.almende.feyenoord.client.PlanCanvas::FLAG_NOAPPCM = $wnd.PlanCanvas.FLAG_NOAPPCM;
	}-*/;
	
	static {
		PlanCanvas.init();
	}
	/**
	 * Constructor that initializes all aspects of a PlanCanvas object from the arguments. 
	 * 
	 * @param startTime the time at the lefmost points of the canvas
	 * @param endTime the time at the rightmost points of the canvas
	 * @param layout the object that contains layout information
	 * @param types the appointment types this canvas will know about
	 * @param dndCtx the drag and drop context this canvas belongs to
	 * @param offsetX the horizontal offset of the canvas relative to the parent container
	 * @param offsetY the vertical offset of the canvas relative to the parent container
	 */
	public PlanCanvas(double startTime, double endTime, CanvasLayout layout, AppointmentType[] types, DragAndDropContext dndCtx, int flags, int offsetX, int offsetY){
		
		this.main = DOM.createDiv();
		this.planListeners = new ArrayList();
		
		JavaScriptObject dnd = null;
		if (dndCtx != null){
			dnd = dndCtx.getNativeObject();
		}
		this.pc = createPlanCanvas(main, startTime, endTime, layout.getNativeObject(), appTypeArray2JS(types), dnd, flags, offsetX, offsetY);
		sinkEvents(Event.MOUSEEVENTS);
	}

	/**
	 * Constructor that initializes all aspects of a PlanCanvas object from the arguments. 
	 * 
	 * @param startTime the time at the lefmost points of the canvas
	 * @param endTime the time at the rightmost points of the canvas
	 * @param layout the object that contains layout information
	 * @param types the appointment types this canvas will know about
	 * @param dndCtx the drag and drop context this canvas belongs to
	 */
	public PlanCanvas(double startTime, double endTime, CanvasLayout layout, AppointmentType[] types, DragAndDropContext dndCtx, int flags){
		this(startTime, endTime, layout, types, dndCtx, flags, 0, 0);
	}

	/**
	 * Constructor that initializes almost all aspects of a PlanCanvas object from the arguments. Additionally to the arguments, the offsets are set to zero, and the drag and drop context null, which will make the canvas to use the global context.
	 * 
	 * @param startTime the time at the lefmost points of the canvas
	 * @param endTime the time at the rightmost points of the canvas
	 * @param layout the object that contains layout information
	 * @param handler the object that is notified whenever the user changes appointments on the canvas
	 * @param types the appointment types this canvas will know about
	 */
	public PlanCanvas(long startTime, long endTime, CanvasLayout layout, AppointmentType[] types, int flags){
		this(startTime, endTime, layout, types, null, flags, 0, 0);
	}
	
//	protected void onLoad(){
//
//		sinkEvents(Event.MOUSEEVENTS);
//}

	/**
	 * Wrapper around the javascript object constructor. A reference to the gwt object in the javascript object is saved, so later we will know where this canvas belong to.
	 * 
	 * @param parent
	 * @param startTime
	 * @param endTime
	 * @param layout
	 * @param types
	 * @param dndCtx
	 * @param offsetX
	 * @param offsetY
	 * @return
	 */
	private native JavaScriptObject createPlanCanvas(Element parent, double startTime, double endTime, JavaScriptObject layout, JavaScriptObject types, JavaScriptObject dndCtx, int flags, int offsetX, int offsetY)/*-{
		var self = this;
		var p = new $wnd.PlanCanvas(parent, startTime, endTime, layout, function(event){
			return self.@com.almende.feyenoord.client.PlanCanvas::handle(Lcom/google/gwt/core/client/JavaScriptObject;)(event);
		}, types, dndCtx, flags, offsetX, offsetY);
		p.gwtObj = self;
		return p;
	}-*/;

	private native JavaScriptObject createJSArray()/*-{
		return new Array();
	}-*/;
	
	private native int addToJSArray(JavaScriptObject array, JavaScriptObject element)/*-{
		return array.push(element);
	}-*/;
	
	private JavaScriptObject appTypeArray2JS(AppointmentType[] types){
		JavaScriptObject jsTypes = createJSArray();
		
		for (int i = 0 ; i < types.length ; i++){
			addToJSArray(jsTypes, types[i].getNativeObject());
		}
		
		return jsTypes;
	}
	
	private boolean handle(JavaScriptObject event){
		PlanEvent gwtEvent = new PlanEvent(event);
		if (gwtEvent.getType() == PlanEvent.INSERT){
			new Appointment(getJSAppointmentFromEvent(event));
		}

		Iterator listeners = planListeners.iterator();
		while (listeners.hasNext()){
			PlanListener listener = (PlanListener)listeners.next();
			listener.onPlanEvent(gwtEvent);
		}
		
		return true;
	}
	
	private native JavaScriptObject getJSAppointmentFromEvent(JavaScriptObject event)/*-{
		return event.draggable;
	}-*/;
	
	/**
	 * Adds listener to the list of plan listeners.
	 */
	public void addPlanListener(PlanListener listener){
		planListeners.add(listener);
	}
	
	/**
	 * Removes listener from the list of plan listeners.
	 */
	public void removePlanListener(PlanListener listener){
		planListeners.remove(listener);
	}
	
	public JavaScriptObject getNativeObject(){
		return pc;
	}
	
	public Element getElement(){
		return main;
	}
	
	public native void redraw()/*-{
		this.@com.almende.feyenoord.client.PlanCanvas::pc.redraw();
	}-*/;
	
	/**
	 * Sets a user defined id for the plancanvas
	 * @param id a user defined identifier
	 */
	public void setId(Object id){
		this.id = id;
	}
	
	/**
	 * Returns the user defined id.
	 * @return the user defined id.
	 */
	public Object getId(){
		return id;
	}
	
	/**
	 * Retruns the number of appointments.
	 * @return the number of appointments.
	 */
	public native int getAppointmentCount()/*-{
		return this.@com.almende.feyenoord.client.PlanCanvas::pc.appointment_count();
	}-*/;
	
	/**
	 * Returns the <code>index</code>th appointment. If index is greater or equal to the number of appointments, an IndexOutOfBoundsException is thrown.
	 * @param index the index of the appointments to return
	 * @return the <code>index</code>th appointment
	 */

	public Appointment getAppointment(int index){
		Appointment app = _getAppointment(index);
		
		if (app == null){
			throw new IndexOutOfBoundsException("Invalid appointment index: " + index);
		}
		
		return app;
	}
	
	private native Appointment _getAppointment(int index)/*-{
		if (index >= this.@com.almende.feyenoord.client.PlanCanvas::pc.appointment_count())
			return null;
			
		return this.@com.almende.feyenoord.client.PlanCanvas::pc.appointment_get(index).gwtObj;
	}-*/;
	
	/**
	 * Checks if an appointment with the given id has already been added to the plan canvas.
	 * 
	 * @param id the id of the appointment that should be checked for existence
	 * @return true if an appontment with the given id already exists in the plan canvas, false otherwise.
	 */
	public boolean hasAppointment(String id){
		Appointment app = getAppointmentOrNullById(id);
		
		return app != null;
	}
	
	/**
	 * Returns an appointment that has the id <code>id</code>. If no such appointment exists, an IllegalArgumentException is thrown.
	 * @param id the id that is searched in the appointments of this plan canvas
	 * @return the appointment that has the same id as <code>id</code>
	 */
	public Appointment getAppointmentById(String id){
		Appointment app = getAppointmentOrNullById(id);
		
		if (app == null)
			throw new IllegalArgumentException("The supplied id (" + id + "does not exist");
		
		return app;
	}
	
	/**
	 * Returns the appoitnment with id added earlier to this plan canvas. If no appointment with id exists, this method returns null.
	 * @param id the id of the appointment that should be returned
	 * @return the appointment with id or null if no such appointment exists
	 */
	public native Appointment getAppointmentOrNullById(String id)/*-{
		var app = this.@com.almende.feyenoord.client.PlanCanvas::pc.appointment_get_byid(id);
		
		if (app == null)
			return null;
			
		return app.gwtObj;
	}-*/;
	
	/**
	 * Returns an appointment that has the same text as <code>text</code>. If no such appointment exists, an IllegalArgumentException is thrown.
	 * @param text the text that is searched in the appointments of this plan canvas
	 * @return the appointment that has the same text as <code>text</code>
	 */
	public Appointment getAppointmentByText(String text){
		Appointment app = _getAppointmentByText(text);
		
		if (app == null)
			throw new IllegalArgumentException("No appointments with the supplied text " + text);
		
		return app;		
	}

	private native Appointment _getAppointmentByText(String text)/*-{
	var app = this.@com.almende.feyenoord.client.PlanCanvas::pc.appointment_get_byname(text);
	
	if (app == null)
		return null;
		
	return app.gwtObj;
}-*/;

	/**
	 * Removes the appointment with the given index from the plan canvas. If no such appointment exists, an IllegalArgumentException is thrown.
	 * @param index
	 */
	public void removeAppointment(int index){
		if (index >= getAppointmentCount()){
			throw new IllegalArgumentException();
		}
		
		_removeAppointment(index);
	}
	
	private native void _removeAppointment(int index)/*-{
		this.@com.almende.feyenoord.client.PlanCanvas::pc.appointment_del(index);
	}-*/;
	
	/**
	 * Resize Plancanvas, needed for all size-less divs it is put in
	 */
	public native void resize(int w,int h)/*-{
		this.@com.almende.feyenoord.client.PlanCanvas::pc.resize(w,h);
	}-*/;

	/**
	 * Removes all appointments from the plan canvas.
	 */
	public native void removeAllAppointments()/*-{
		this.@com.almende.feyenoord.client.PlanCanvas::pc.del_appointments();
	}-*/;
	
	protected void onLoad(){
		redraw();
	}
}
