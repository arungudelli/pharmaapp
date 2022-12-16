import { InvoiceItems } from "./invoiceItems";

export interface BillRows {
    id: number, 
    productName: string,
    invoiceItem: InvoiceItems, 
    batchNo: string, 
    mfgDate: Date, 
    expDate: Date, 
    qty: number, 
    mrp: number, 
    discount: number, 
    amount: number, 
}