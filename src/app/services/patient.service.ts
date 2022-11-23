import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Patient } from '../models/patient';

@Injectable({
    providedIn: 'root'
})
export class PatientService
{

    constructor(private http: HttpClient) { }

    baseUrl = "https://localhost:44396/api";

    public getPatients(phoneNumber: Number): Observable<Patient[]> {
        const url = `${this.baseUrl}/Patient/phone/${phoneNumber}`;
        return this.http.get<Patient[]>(url);
    }

    public savePatient(patient : Patient): void{
        this.http.post(this.baseUrl+"/Patient/save", patient).subscribe();
    }
}
