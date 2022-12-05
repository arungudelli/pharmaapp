import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  behaviorSubject = new BehaviorSubject<Invoice[]>([]);

  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";

  getInvoices() {
    this.http.get<Invoice[]>(this.baseUrl+"/Invoice/get").pipe(shareReplay(1)).subscribe(
      res => this.behaviorSubject.next(res)
    );
  }

  get allInvoices(): Observable<Invoice[]> {
    return this.behaviorSubject.asObservable();
  }

  /*
  getInvoices() {
    return this.http.get<Invoice[]>(this.baseUrl+"/Invoice/get");
  }
  */

  saveInvoice(invoiceData: Invoice) {
    this.http.post(this.baseUrl+"/Invoice/save", invoiceData).subscribe(() => this.getInvoices());
  }

  getInvoiceById(id: number) {
    return this.http.get<Invoice>(this.baseUrl+"/Invoice/get/"+id);
  }

  updateInvoice(id: number, invoice: Invoice) {

  }

}