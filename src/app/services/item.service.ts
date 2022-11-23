import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:44396/api";

  public getItems() {
    return this.http.get<Item[]>(this.baseUrl+"/Item/get");
  }

  saveItem(item: Item) {
    this.http.post(this.baseUrl+"/Item/save", item).subscribe();
  }

  getItemById(id) {
    return this.http.get<Item>(this.baseUrl+"/Item/get/"+id);
  }

  getItemByName(name) {
    return this.http.get<Item>(this.baseUrl+"/Item/name/"+name);
  }

  updateItem(id, item: Item) {
    
  }
  
}