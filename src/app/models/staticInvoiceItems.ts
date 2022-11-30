import { Item } from "./item";

    export interface StaticInvoiceItems {
    id: number, 
    item: Item, 
    pack: string, 
    batchNo: string, 
    mfgDate: Date, 
    expDate: Date, 
    qty: number, 
    freeItems: number, 
    mrp: number, 
    rate: number, 
    amount: number, 
}