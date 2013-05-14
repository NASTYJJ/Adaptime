/**
 * 
 */
package com.almende.feyenoord.client;

import com.google.gwt.core.client.*;

/**
 * @author Tamas
 * @version $Rev: 1085 $
 * 
 * The AppointmentType is a simple wrapper arount the javascript class with the same name (in feyenoord).
 *
 */
public class AppointmentType {
	/**
	 * The opaque handle to the javascript object.
	 */
	private JavaScriptObject appType;
	
	public AppointmentType(int id, String name, String color, String className){
		super();
		
		appType = createAppType(id, name, color, className);
	}
	
	public AppointmentType(int id, String name, String color){
		this(id, name, color, null);
	}
	
	/**
	 * Creates an AppointmentType object, where the color should be set from css and the class name is set to the same as the provided name.
	 * @param id the id associated with the AppointmentType object
	 * @param name the name of the AppointmentType, and also the class name for css
	 */
	public AppointmentType(int id, String name){
		this(id, name, null, name);
	}
	
	public native int getIid()/*-{
		return this.@com.almende.feyenoord.client.AppointmentType::appType.id;
	}-*/;
	
	public native String getName()/*-{
		return this.@com.almende.feyenoord.client.AppointmentType::appType.name;
	}-*/;
	
	public native String getColor()/*-{
		return this.@com.almende.feyenoord.client.AppointmentType::appType.color;
	}-*/;

	public native String getClassName()/*-{
		return this.@com.almende.feyenoord.client.AppointmentType::appType.cname;
	}-*/;

	private native JavaScriptObject createAppType(int id, String name, String color, String className)/*-{
		//console.log($wnd);
		return new $wnd.AppType(id, name, color, className); 
	}-*/;
	
	public JavaScriptObject getNativeObject(){
		return appType;
	}
	
	public native void setHorizontalBorder(int width, String color)/*-{
		this.@com.almende.feyenoord.client.AppointmentType::appType.set_rails(width, color);
	}-*/;

	public native void setVerticalBorder(int width, String color)/*-{
		this.@com.almende.feyenoord.client.AppointmentType::appType.set_stops(width, color);
}-*/;
}
