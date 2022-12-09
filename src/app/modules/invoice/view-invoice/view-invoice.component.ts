import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceRows } from 'src/app/models/invoiceRows';
import { DocGenInvoice } from 'src/app/pdfmake-docs/doc-gen-invoice';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css']
})

export class ViewInvoiceComponent {

  invoice: Invoice = {} as Invoice;

  ELEMENT_DATA: InvoiceRows[] = [];
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: {invoice: Invoice, invoiceRows: InvoiceRows[]}, public invoiceService: InvoiceService){}

  columnSchema = [
    {
      columnDef: 'productName',
      header: 'Product Name',
      cell: (element: InvoiceRows) => `${element.productName}`,
      footer: 'Amount',
    },
    {
      columnDef: 'pack',
      header: 'Pack',
      cell: (element: InvoiceRows) => `${element.pack}`,
      footer: `${this.data.invoice.amount}`,
    },
    {
      columnDef: 'batchNo',
      header: 'Batch No.',
      cell: (element: InvoiceRows) => `${element.batchNo}`,
      footer: '',
    },
    {
      columnDef: 'mfgDate',
      header: 'Mfg. Date',
      cell: (element: InvoiceRows) => `${element.mfgDate}`,
      footer: '',
    },
    {
      columnDef: 'expDate',
      header: 'Exp. Date',
      cell: (element: InvoiceRows) => `${element.expDate}`,
      footer: 'Total Discount',
    },
    {
      columnDef: 'qty',
      header: 'Qty',
      cell: (element: InvoiceRows) => `${element.qty}`,
      footer: `${this.data.invoice.totalDiscount}`,
    },
    {
      columnDef: 'freeItems',
      header: 'Free Items',
      cell: (element: InvoiceRows) => `${element.freeItems}`,
      footer: '',
    },
    {
      columnDef: 'mrp',
      header: 'MRP',
      cell: (element: InvoiceRows) => `${element.mrp}`,
      footer: '',
    },
    {
      columnDef: 'rate',
      header: 'Rate',
      cell: (element: InvoiceRows) => `${element.rate}`,
      footer: 'Actual Amount',
    },
    {
      columnDef: 'discount',
      header: 'Discount',
      cell: (element: InvoiceRows) => `${element.discount}`,
      footer: `${this.data.invoice.actualAmount}`,
    },
    {
      columnDef: 'gstRate',
      header: 'GST Rate',
      cell: (element: InvoiceRows) => `${element.gstRate}`,
      footer: '',
    },
    {
      columnDef: 'hsnCode',
      header: 'HSN Code',
      cell: (element: InvoiceRows) => `${element.hsnCode}`,
      footer: '',
    },
  ];

  invoiceDataSource = this.ELEMENT_DATA = this.data.invoiceRows;

  invoiceColumns = this.columnSchema.map(x=>x.columnDef);

  ngOnInit(): void {
    
  }

  generatePDF() {
    DocGenInvoice(this.data.invoice);
  }

}
