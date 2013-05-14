/**
 * 
 */
package com.almende.feyenoord.client;

import com.google.gwt.core.client.*;

/**
 * @author Tamas Mahr
 * @version $Rev: 1098 $
 *
 * The event class encapsulating the javascript Event object in the feyenoord scripts.
 */
public class PlanEvent {
	/**
	 * The opaque handle to the javascript Event object.
	 */
	private JavaScriptObject event;

	/**
	 * ???
	 */
	public static final int IDLE = 0;
	
	/**
	 * Delete event -- an appointment is removed from the canvas.
	 */
	public static final int DELETE = 1;
	
	/**
	 * Insert event -- a new appointment is added to the canvas.
	 */
	public static final int INSERT = 2;
	
	/**
	 * Move event -- an appointment is moved in the canvas.
	 */
	public static final int MOVE = 3;

	/**
	 * Resize event -- an appointment is resized in the canvas.
	 */
	public static final int RESIZE = 4;
	
	/**
	 * Creates a wrapper around the javascript object.
	 * 
	 * @param event the javascript object
	 */
	public PlanEvent(JavaScriptObject event){
		super();
		this.event = event;
		//Window.alert("Event of type " + getType(event) + " created (" + getAppointment(event) +
			//	"," + getDragZone(event) + "," + getDropZone(event) + ")");
	}
	
	public int getType(){
		return getType(event);
	}
	
	private native int getType(JavaScriptObject event)/*-{
		return event.type;
	}-*/;
	
	public PlanCanvas getSourceCanvas(){
		return getDragZone(event);
	}
	
	private native PlanCanvas getDragZone(JavaScriptObject event)/*-{
		if (event.from.dragzone.gwtObj){
			return event.from.dragzone.gwtObj;
		} else {
			return null;
		}
	}-*/;
	
	public Appointment getAppointment(){
		return getAppointment(event);
	}
	
	private native Appointment getAppointment(JavaScriptObject event)/*-{
		if (event.draggable.gwtObj){
			return event.draggable.gwtObj;
		} else {
			return null;
		}
	}-*/;
	
	public PlanCanvas getDestinationCanvas(){
		return getDropZone(event);
	}
	
	private native PlanCanvas getDropZone(JavaScriptObject event)/*-{
		if (event.to.dropzone && event.to.dropzone.gwtObj){
			return event.to.dropzone.gwtObj;
		} 
		
		return null;
	}-*/;
	
	public native boolean wasCTRLPressed()/*-{
		return this.@com.almende.feyenoord.client.PlanEvent::event.domevent.ctrlKey;
	}-*/;
}
