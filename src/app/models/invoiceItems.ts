import { Distributor } from "./distributor";
import { Hsn } from "./hsn";
import { Item } from "./item";

export interface InvoiceItems {
    id: number;
    item: Item;
    distributor: Distributor;
    hsn: Hsn;
    pack: string;
    batchNo: string;
    mfgDate: Date;
    expDate: Date;
    qty: number;
    freeItems: number;
    discount: number;
    mrp: number;
    rate: number;
}