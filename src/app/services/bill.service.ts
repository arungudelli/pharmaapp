import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { Bill } from '../models/bill';

@Injectable({
  providedIn: 'root'
})

export class BillService {

  behaviorSubject = new BehaviorSubject<Bill[]>([]);

  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";

  getBills() {
    this.http.get<Bill[]>(this.baseUrl+"/Bill/get").pipe(shareReplay(1)).subscribe(
      res => this.behaviorSubject.next(res)
    );
  }

  get allBills(): Observable<Bill[]> {
    return this.behaviorSubject.asObservable();
  }

  saveBill(billData: Bill) {
    this.http.post(this.baseUrl+"/Bill/save", billData).subscribe(() => this.getBills());
  }

  getBillById(id: number) {
    this.http.get<Bill>(this.baseUrl+"/Bill/get/"+id);
  }

  updateBill(id: number, bill: Bill) {
    console.log('bill update: \nid: ', id, '\nbill: ', bill);
    // return this.http.put<Bill>(this.baseUrl+"/Bill/get/"+id, bill).subscribe(() => getBill());
  }

}
