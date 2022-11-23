import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Manufacturer } from '../models/manufacturer';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";
  
  public getManufacturers() {
    return this.http.get<Manufacturer[]>(this.baseUrl+"/Manfacturer/get");
  }

  saveManufacturer(manufacturer: Manufacturer) {
    this.http.post(this.baseUrl+"/Manfacturer/save", manufacturer).subscribe();
  }
}
