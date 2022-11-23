import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";


  saveInvoice(invoiceData: Invoice[]) {
    this.http.post(this.baseUrl+"/Invoice/save", invoiceData).subscribe();
  }
}
