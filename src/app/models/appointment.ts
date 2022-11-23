import { AppointmentStatus } from "../enums/appointment-status";
import { PatientBodyData } from "./patient-body-data";

export interface Appointment{
appointmentId:Number;     
patientId:Number; 
hospitalId:Number; 
doctorId:Number; 
patientComments:string; 
doctorComments:string; 
internalComments:string; 
followUpDate:Date; 
status:AppointmentStatus; 
patientBodyData:PatientBodyData;
}