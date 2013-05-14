/**
 * 
 */
package com.almende.feyenoord.client;

/**
 * @author Tamas Mahr
 *
 */
public class FadeAppointmentInAnimation implements Animation {
	Appointment appointment;
	
	long animationDuration;
	
	public FadeAppointmentInAnimation(Appointment appointment, long animationDuration){
		this.appointment = appointment;
		this.animationDuration = animationDuration;
	}
	
	/* (non-Javadoc)
	 * @see com.almende.feyenoord.client.Animation#update(long)
	 */
	public void update(float value) {
		appointment.setOpacity((float)value / (float)animationDuration);
	}

}
