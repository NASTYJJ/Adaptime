/**
 * 
 */
package com.almende.feyenoord.client;

/**
 * @author tamas
 *
 */
public class MoveAppointmentAnimation implements Animation {
	private Appointment appointment;
	
	public MoveAppointmentAnimation(Appointment app){
		this.appointment = app;
	}
	
	/* (non-Javadoc)
	 * @see com.almende.feyenoord.client.Animation#update(long)
	 */
	public void update(float value) {
		appointment.move(value);
	}

}
