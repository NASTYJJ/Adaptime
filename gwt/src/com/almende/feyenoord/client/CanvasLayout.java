/**
 * 
 */
package com.almende.feyenoord.client;

import com.google.gwt.core.client.*;

/**
 * @author Tamas Mahr
 * @version $Rev: 1086 $
 *
 */
public class CanvasLayout {
	/**
	 * The opaque handle of the native javscript object.
	 */
	private JavaScriptObject canvasLayout;
	
	public CanvasLayout(int snapAt){
		this(snapAt, null);
	}
	
	public CanvasLayout(int snapAt, String htmlID){
		super();
		
		canvasLayout = createCanvasLayout(snapAt, htmlID);
	}
	
	public native JavaScriptObject createCanvasLayout(int snapAt, String htmlID)/*-{
		var l;
		l= new $wnd.CanvasLayout(snapAt, htmlID);
		l.gwtObj = this;
		return l;
	}-*/;

	/**
	 * Returns the native JavaScript object.	
	 * @return the native JavaScript object
	 */
	public JavaScriptObject getNativeObject(){
		return canvasLayout;
	}
	
	public void addTimeLines(double start, double dur, double frequency, int annotation){
		addTimeLines(start, dur, frequency, annotation, null);
	}
	
	/**
	 * Adds ticks to the plancanvas this canvas layout is assigned to.
	 * 
	 * @param start the time of the first tick
	 * @param gap the time between two ticks
	 * @param frequency how often should a tick be annotated (in terms of ticks)
	 * @param id the css id for the div
	 */
	public native void addTimeLines(double start, double dur, double frequency, int annotation, String id)/*-{
		this.@com.almende.feyenoord.client.CanvasLayout::canvasLayout.add_timelines(start, dur, frequency, annotation, id);
	}-*/;
}
