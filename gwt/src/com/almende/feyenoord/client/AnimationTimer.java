/**
 * 
 */
package com.almende.feyenoord.client;

import com.google.gwt.core.client.*;
import com.google.gwt.user.client.*;

/**
 * @author Tamas Mahr
 *
 */
public class AnimationTimer {
	JavaScriptObject animTimer;
	
	public AnimationTimer(Animation obj, double start, double stop, int duration){
		animTimer = createAnimationTimer(obj, start, stop, duration);
	}
	
	private native JavaScriptObject createAnimationTimer(Animation obj, double start, double end, int duration)/*-{
		var self = this;
		return new $wnd.Animation(function(object, val){
			self.@com.almende.feyenoord.client.AnimationTimer::handler(Lcom/almende/feyenoord/client/Animation;F)(object, val);
			}, obj, start, end, duration);
		return null;
	}-*/;
	
	public native void go()/*-{
		this.@com.almende.feyenoord.client.AnimationTimer::animTimer.go();
	}-*/;
	
	
	private void handler(Animation obj, float value){
		obj.update(value);
	}
}
