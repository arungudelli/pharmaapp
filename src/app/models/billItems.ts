import { Item } from "./item";

export interface BillItems {
    id: number, 
    item: Item,
    batchNo: string, 
    mfgDate: Date, 
    expDate: Date, 
    qty: number, 
    discount: number, 
    mrp: number, 
    amount: number, 
}