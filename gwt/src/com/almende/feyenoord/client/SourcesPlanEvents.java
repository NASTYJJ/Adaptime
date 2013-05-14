/**
 * 
 */
package com.almende.feyenoord.client;

/**
 * @author Tamas Mahr
 * @version $Rev: 1037 $
 * 
 * This interface is implemented by object that are planning to send out plan event notifications.
 *
 */
public interface SourcesPlanEvents {
	/**
	 * Adds a listener interface to receive change events.
	 */
	void addPlanListener(PlanListener listener);
	
	/**
	 * Removes a previously added listener interface.
	 */
	void removePlanListener(PlanListener listener);
}
