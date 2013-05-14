package com.almende.feyenoord.client;

import java.util.*;
import com.google.gwt.user.client.ui.*;
import com.google.gwt.user.client.*;

/**
 * @author Tamas Mahr
 * @version $Rev$
 *
 * A PlanBoardPanel contains one PlanBoard widget and optionally displays a name for it.
 */

public class PlanCanvasPanel extends FlowPanel {
	/**
	 * The plan canvas this panel displays.
	 */
	private PlanCanvas canvas = null;
	
	public PlanCanvasPanel(){
		super();
		
		setStyleName("planCanvasPanel");	
	}
	/**
	 * Adds a short string to be displayed overlapping the plan canvas.
	 * @param name the string to be displayed.
	 */
	public void addName(String name){
		// we need to set the position attribute of the containing box relative in order to have the expected behaviour of the absolutely positioned children
		DOM.setStyleAttribute(getElement(), "position", "relative");
		
		Label nameLabel = new Label(name);
		Element domElement = nameLabel.getElement();
//		DOM.setStyleAttribute(domElement, "backgroundColor", "white");
//		DOM.setStyleAttribute(domElement, "border", "1px solid black");
		DOM.setStyleAttribute(domElement, "position", "absolute");
		DOM.setStyleAttribute(domElement, "left", "0px");
		DOM.setStyleAttribute(domElement, "bottom", "0px");
		DOM.setStyleAttribute(domElement, "zIndex", "2");

		nameLabel.setStyleName("planCanvasNameTag");
		
		super.add(nameLabel);
	}
	
	/**
	 * Adds the plan canvas.
	 * @param canvas the plan canvas this panel displays.
	 */
	public void addPlanCanvas(PlanCanvas canvas){
		super.add(canvas);
		this.canvas = canvas;
	}
	
	public void add(Widget widget){
		if (widget instanceof PlanCanvas){
			addPlanCanvas((PlanCanvas)widget);
			return;
		}
		
		throw new IllegalArgumentException("This panel only supports PlanCanvas widgets");
	}
	
	public void update(){
		if (canvas != null){
			canvas.redraw();
		}
	}
	
//	/**
//	 * When this panel is attached to the dom, it redraws the plan canvas.
//	 */
//	protected void onLoad(){
//		if (canvas != null){
//			System.out.print("PlanCanvasPanel.onLoad()... ");
//			canvas.redraw();
//			System.out.println(" done");
//		}
//	}
}
