import { Item } from "./item";


export interface Invoice {
    id: number;
    item: Item;
    BatchNo: string;
    ExpDate: Date;
    MfgDate: Date;
    Qty: number;
    unit: string;
    rate: number;
    tax: number;
    amount: number;

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
}