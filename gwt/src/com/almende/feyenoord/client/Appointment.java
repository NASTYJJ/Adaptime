/**
 * 
 */
package com.almende.feyenoord.client;

import com.google.gwt.core.client.*;
import com.google.gwt.user.client.*;
/**
 * @author Tamas Mahr
 * @version $Rev: 1098 $
 * 
 * Appointment object represent a time interval on a plan canvas. They are either created by the user via mouse gestures, of programatically.
 *
 */
public class Appointment {
	/**
	 * The opaque handle to the javascript object.
	 */
	private JavaScriptObject app;
	
	public Appointment(JavaScriptObject app){
		this.app = app;
		registerGWTObject(app);
	}
	
	public Appointment(PlanCanvas pCanvas, double startTime, double endTime, AppointmentType type, String id){
		this.app = createAppointment(pCanvas.getNativeObject(), startTime, endTime, type.getNativeObject(), id);
	}
	
	private native JavaScriptObject createAppointment(JavaScriptObject pCanvas, double startTime, double endTime, JavaScriptObject type, String id)/*-{
		var app = new $wnd.Appointment(pCanvas, startTime, endTime, type, id);
		app.gwtObj = this;
		return app; 
	}-*/;
	
	private native void registerGWTObject(JavaScriptObject app)/*-{
		app.gwtObj = this;
	}-*/;
	
	public double getStartTime(){
		return getStartTime(app);
	}
	
	private native double getStartTime(JavaScriptObject app)/*-{
		return app.startTime;
	}-*/;
	
	public double getEndTime(){
		return getEndTime(app);
	}
	
	private native double getEndTime(JavaScriptObject app)/*-{
		return app.endTime;
	}-*/;
	
	public int getType(){
		return getType(app);
	}
	
	private native int getType(JavaScriptObject app)/*-{
		return app.type;
	}-*/;
	
	public String getId(){
		return getId(app);
	}
	
	private native String getId(JavaScriptObject app)/*-{
		return app.id;
	}-*/;
	
	public native void setText(String text, boolean showTimes, boolean after)/*-{
		this.@com.almende.feyenoord.client.Appointment::app.set_text(text, showTimes, after);
	}-*/;
	
	public void setType(AppointmentType newType){
		setType(newType.getNativeObject());
	}
	
	private native void setType(JavaScriptObject newType)/*-{
		this.@com.almende.feyenoord.client.Appointment::app.set_apptype(newType);
	}-*/;
	
	public native void remove()/*-{
		this.@com.almende.feyenoord.client.Appointment::app.clear();
	}-*/;
	
	public native void move(float startTime)/*-{
		this.@com.almende.feyenoord.client.Appointment::app.move(startTime);
	}-*/;
	
	public native void resize(float duration)/*-{
		this.@com.almende.feyenoord.client.Appointment::app.resize(duration);
	}-*/;
	
	public native void setOpacity(float opacity)/*-{
		$wnd.global.browser.set_opacity(this.@com.almende.feyenoord.client.Appointment::app.domelm, opacity);
	}-*/;
	
	protected native Element getElement()/*-{
		return this.@com.almende.feyenoord.client.Appointment::app.domelm;
}-*/;

}
