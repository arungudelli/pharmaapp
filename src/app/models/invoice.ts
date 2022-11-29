import { Distributor } from "./distributor";
import { InvoiceItems } from "./invoiceItems";


export interface Invoice {
    id: number;
    invoiceNumber: string;
    invoiceDate: Date;
    distributor: Distributor;
    invoiceItems: InvoiceItems;
    amount: number;
    totalDiscount: number;
    actualAmount: number;
   
    /*
    tax: number;
    unit: string;
    */

    /*
    Hsnsac: string;
    Str: string;
    Ds:string;
    Loc: string;
    ProductDescription : string;
    Pack: string;
    Mfg: string;
    FreeDiscount: number;
    Mrp: number;
    TotalDiscountP: number,
    Taxable: number,
    GstPercentage: number,
    GstAmount: number,
    */
}