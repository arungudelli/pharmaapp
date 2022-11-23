import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Distributor } from '../models/distributor';

@Injectable({
  providedIn: 'root'
})

export class DistributorService {
  
  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";

  public getDistributors() {      
    return this.http.get<Distributor[]>(this.baseUrl+"/Distributor/get");
  }

  saveDistributor(distributor: Distributor) {
    this.http.post(this.baseUrl+"/Distributor/save", distributor).subscribe();
  }

  getDistributorById(id: number) {
    return this.http.get<Distributor>(`${this.baseUrl}//Distributor/get/${id}`);
  }

  updateDistributor(id: number, distributor: Distributor) {

  }

}