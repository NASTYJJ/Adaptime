/**
 */
package com.almende.feyenoord.client;

import com.google.gwt.core.client.*;

/**
 * @author Tamas Mahr
 * @version $Rev: 1037 $
 * 
 * A drag and drop context facilitate drag and drop between plan canvases. Only canvases created with the same drag and drop context can drag and drop to each other.
 *
 */
public class DragAndDropContext {
	private JavaScriptObject dndCtx;
	
	public DragAndDropContext(){
		dndCtx = createDNDContext();
	}
	
	private native JavaScriptObject createDNDContext()/*-{
		return new $wnd.DragDropContext();
	}-*/;
	
	public JavaScriptObject getNativeObject(){
		return dndCtx;
	}
}
