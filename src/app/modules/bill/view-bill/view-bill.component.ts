import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BillRows } from 'src/app/models/billRows';
import { Invoice } from 'src/app/models/invoice';
import { DocGenBill } from 'src/app/pdfmake-docs/doc-gen-bill';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css']
})

export class ViewBillComponent {
  bill: Invoice = {} as Invoice;

  ELEMENT_DATA: BillRows[] = [];
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: {bill: Invoice, billRows: BillRows[]}, public invoiceService: InvoiceService){}

  columnSchema = [
    {
      columnDef: 'productName',
      header: 'Product Name',
      cell: (element: BillRows) => `${element.productName}`,
      footer: 'Amount',
    },
    {
      columnDef: 'qty',
      header: 'Qty',
      cell: (element: BillRows) => `${element.qty}`,
      footer: `${this.data.bill.totalDiscount}`,
    },
    {
      columnDef: 'batchNo',
      header: 'Batch No.',
      cell: (element: BillRows) => `${element.batchNo}`,
      footer: '',
    },
    {
      columnDef: 'discount',
      header: 'Discount',
      cell: (element: BillRows) => `${element.discount}`,
      footer: `${this.data.bill.actualAmount}`,
    },
    {
      columnDef: 'mrp',
      header: 'MRP',
      cell: (element: BillRows) => `${element.mrp}`,
      footer: '',
    },
    {
      columnDef: 'mfgDate',
      header: 'Mfg. Date',
      cell: (element: BillRows) => `${element.mfgDate}`,
      footer: '',
    },
    {
      columnDef: 'expDate',
      header: 'Exp. Date',
      cell: (element: BillRows) => `${element.expDate}`,
      footer: 'Total Discount',
    },
  ];

  billDataSource = this.ELEMENT_DATA = this.data.billRows;

  billColumns = this.columnSchema.map(x=>x.columnDef);

  generatePDF() {
    DocGenBill(this.data.bill);
  }
}
