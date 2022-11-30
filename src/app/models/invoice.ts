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
}