/**
 * 
 */
package com.almende.feyenoord.client;

/**
 * @author Tamas Mahr
 *
 */
public class ResizeAppointmentAnimation implements Animation {
	public Appointment appointment;
	
	public ResizeAppointmentAnimation(Appointment appointment){
		this.appointment = appointment;
	}
	
	/* (non-Javadoc)
	 * @see com.almende.feyenoord.client.Animation#update(long)
	 */
	public void update(float value) {
		appointment.resize(value);
	}

}
