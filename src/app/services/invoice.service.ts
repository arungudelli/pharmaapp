import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";

  getInvoices() {
    return this.http.get<Invoice[]>(this.baseUrl+"/Invoice/get");
  }

  saveInvoice(invoiceData: Invoice) {
    this.http.post(this.baseUrl+"/Invoice/save", invoiceData).subscribe();
  }

  getInvoiceById(id: number) {
    return this.http.get<Invoice>(this.baseUrl+"/Invoice/get/"+id);
  }

  updateInvoice(id: number, invoice: Invoice) {

  }

}