import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";

  public getAppointment(id: Number): Observable<Appointment> {
    const url = `${this.baseUrl}/Appointment/get/${id}`;
    return this.http.get<Appointment>(url);
  }

  public getAllAppointments(): Observable<Appointment[]> {
    const url = `${this.baseUrl}/Appointment/getall`;
    return this.http.get<Appointment[]>(url);
  }

  public saveAppointment(patient: Appointment): void {
    this.http.post(this.baseUrl + "/Appointment/save", patient).subscribe();
  }

}
