import { Distributor } from "./distributor";
import { Item } from "./item";

export interface InvoiceItems {
    id: number;
    item: Item;
    distributor: Distributor;
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