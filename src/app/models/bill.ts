import { BillItems } from "./billItems";
import { Patient } from "./patient";

export interface Bill {
    id: number;
    billNumber: string;
    billDate: Date;
    patient: Patient;
    billItems: BillItems[];
    totalAmount: number;
    totalDiscount: number;
    discountedAmount: number;
}