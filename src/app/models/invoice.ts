

export interface Invoice {
    Hsnsac: string;
    Str: string;
    Ds:string;
    Loc: string;
    ProductDescription : string;
    Pack: string;
    Mfg: string;
    ExpDate: Date,
    BatchNo: string,
    Qty: number,

    FreeDiscount: number;
    Mrp: number;
    Rate: number,
    Amount: number,
    TotalDiscountP: number,

    Taxable: number,
    GstPercentage: number,
    GstAmount: number,
}

