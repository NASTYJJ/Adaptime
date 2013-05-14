/**
 * 
 */
package com.almende.feyenoord.client;

/**
 * @author Tamas Mahr
 * @version $Rev: 1037 $
 * 
 * PlanListener objects receive notification from the plan canvas, that a user event happened.
 *
 */
public interface PlanListener {
	/**
	 * This method is called, when a user event happens. The event is described by the event object passed as an argument.
	 * @param e the event that has happened
	 * @return true if the change is accepted and processed, false if it is rejected and the original state should be restored.
	 */
	boolean onPlanEvent(PlanEvent e);
}
