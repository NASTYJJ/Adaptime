package com.almende.feyenoord.client;

import java.util.*;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.*;

import com.almende.feyenoord.shared.FieldVerifier;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.user.client.rpc.AsyncCallback;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class GwtExample implements EntryPoint, PlanListener {
	Label status;
	
	Vector canvases;
  /**
   * This is the entry point method.
   */
  public void onModuleLoad() {
	  canvases = new Vector();
	  VerticalPanel panel = new VerticalPanel();
	  RootPanel.get().add(panel);
  
//	  Date now = new Date();
//	  Date when = new Date(now.getYear(), now.getMonth(), now.getDate(), 0, 0, 0);
	  Date when = new Date();
	  when.setHours(0);
	  when.setMinutes(0);
	  when.setSeconds(0);
	  double start = when.getTime() ;
	  
	  double end = start + 24 * 3600000;
	  
	  AppointmentType[] types = new AppointmentType[1];
	  types[0] = new AppointmentType(-1, "something", "#00587c");
	  
	  CanvasLayout layout = new CanvasLayout(30000*60,"backstyle");
	  layout.addTimeLines(start, (double)3600000, (double)7200000, 1, "hourticks");
	  layout.addTimeLines(start+3600000, (double)3600000, (double)7200000, 1, "hourticks2");
	  DragAndDropContext dndCtx1 = new DragAndDropContext();
	  DragAndDropContext dndCtx2 = new DragAndDropContext();
	  
	  panel.add(new Label("Plan canvas group 1"));

	  PlanCanvas canvas = new PlanCanvas(start, end, layout, types, dndCtx1, PlanCanvas.FLAG_OVERLAP);
	  canvas.setId("first");
	  canvases.add(canvas);
	  canvas.addPlanListener(this);
	  PlanCanvasPanel canvasPanel = new PlanCanvasPanel();
	  canvasPanel.add(canvas);
	  canvasPanel.addName("first");
	  panel.add(canvasPanel);
	canvas.resize(1000,100);

	  canvas = new PlanCanvas(start, end, layout, types, dndCtx1, PlanCanvas.FLAG_OVERLAP);
	  canvas.setId("second");
	  canvases.add(canvas);
	  canvas.addPlanListener(this);
	  canvasPanel = new PlanCanvasPanel();
	  canvasPanel.add(canvas);
	  canvasPanel.addName("second");
	  panel.add(canvasPanel);

	  panel.add(new Label("Plan canvas group 2"));
	  canvas.resize(1000,100);
	  
	  canvas = new PlanCanvas(start, end, layout, types, dndCtx2, PlanCanvas.FLAG_NOCREATE);
	  canvas.setId("third");
	  canvases.add(canvas);
	  canvas.addPlanListener(this);
	  canvasPanel = new PlanCanvasPanel();
	  canvasPanel.add(canvas);
	  canvasPanel.addName("third");
	  panel.add(canvasPanel);
	canvas.resize(1000,100);

	  double appStart = start + 3600000;
	  //double appEnd = end - 7200000;
	  double appEnd = appStart + 14400000;
	  double appDuration = appEnd - appStart;
	  Appointment app = new Appointment(canvas, appStart, appEnd, types[0], "PreDefined");
	  
	  AnimationTimer fadeTimer = new AnimationTimer(new FadeAppointmentInAnimation(app, 100), 0, 100, 3000);
	  fadeTimer.go();
	  
	  //AnimationTimer resizeTimer = new AnimationTimer(new ResizeAppointmentAnimation(app), appDuration, appDuration / 2, 3000);
	  //resizeTimer.go();
	  
	  AnimationTimer moveTimer = new AnimationTimer(new MoveAppointmentAnimation(app), appStart, appStart + appDuration / 4, 3000);
	  moveTimer.go();
	  
	  //canvas = new PlanCanvas(start, end, layout, types, dndCtx2, 0);
	  //canvas.setId("fourth");
	  //canvases.add(canvas);
	  //canvas.addPlanListener(this);
	  //canvasPanel = new PlanCanvasPanel();
	  //canvasPanel.add(canvas);
	  //canvasPanel.addName("fourth");
	  //panel.add(canvasPanel);

	  status = new Label("Nothing yet");
	  panel.add(status);
  }
  
  public boolean onPlanEvent(PlanEvent e){
	  if (canvases.contains(e.getSourceCanvas())){
		  status.setText("Event: " + e.getType() + " of " + e.getAppointment() + " from canvas " + e.getSourceCanvas().getId());
	  } else {
		  status.setText("Event: " + e.getType() + " of " + e.getAppointment() + " from: " + e.getSourceCanvas().getId() + " to: " + e.getDestinationCanvas().getId());
	  }
	  
	  return true;
  }
}
