import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hsn } from '../models/hsn';

@Injectable({
  providedIn: 'root'
})
export class HsnService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";

  public getHsnList() {
    return this.http.get<Hsn[]>(this.baseUrl+"/Hsn/get");
  }

  saveHsn(hsn: Hsn) {
    this.http.post(this.baseUrl+"/Hsn/save", hsn).subscribe();
  }

  getHsnById(id: number | string) {
    return this.http.get<Hsn>(this.baseUrl+"Hsn/get/"+id);
  }

  getHsnByCode(code: string) {
    return this.http.get<Hsn>(this.baseUrl+"/Hsn/code/"+code);
  }
}
