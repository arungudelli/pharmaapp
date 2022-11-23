import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Distributor } from '../models/distributor';

@Injectable({
  providedIn: 'root'
})
export class DistributorService {
  
  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";
  //baseUrl = "http://localhost:3000/distributor";

  // public getDistributors(): Observable<Distributor[]> {      
  public getDistributors() {      
    // throw new Error('Method not implemented.');
    return this.http.get<Distributor[]>(this.baseUrl+"/Distributor/get");
  }

  saveDistributor(distributor: Distributor) {
    this.http.post(this.baseUrl+"/Distributor/save", distributor).subscribe();
    // this.http.post(this.baseUrl, distributor).subscribe(
    //   (response)=>  console.log(response),
    //   (error)=>     console.log(error),
    //   ()=>          console.log("completed")
    // );;
  }

  getDistributorById(id: number) {
    return this.http.get<Distributor>(`${this.baseUrl}//Distributor/get/${id}`);
  }

  updateDistributor(id: number, distributor: Distributor) {

  }

}