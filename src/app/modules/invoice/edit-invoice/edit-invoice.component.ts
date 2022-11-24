import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from 'src/app/models/invoice';
import { Item } from 'src/app/models/item';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})

export class EditInvoiceComponent {
  items: Item[] = [];

  invoice: Invoice[] = [];

  COLUMN_SCHEMA = [
    {key: 'id', type: 'number', label: '#'},
    {key: 'items', type: 'text', label: 'Items'},
    // {key: 'item.name', type: 'text', label: 'Item'},
    // {key: 'item.hsn.hsnCode', type: 'text', label: 'HSN Code'},
    // {key: 'invoiceItems.batchNo', type: 'text', label: 'Batch No.'},
    // {key: 'invoiceItems.expDate', type: 'date', label: 'Exp. Date'},
    // {key: 'invoiceItems.mfgDate', type: 'date', label: 'Mfg. Date.'},
    // {key: 'invoiceItems.qty', type: 'number', label: 'Qty'},
    // {key: 'invoiceItems.pack', type: 'text', label: 'Pack'},
    // {key: 'invoiceItems.rate', type: 'number', label: 'Price/Pack'},
    // {key: 'invoiceItems.item.hsn.gstRate', type: 'number', label: 'GST %'},
    // {key: 'invoiceItems.tax', type: 'number', label: 'Tax'},
    {key: 'amount', type: 'number', label: 'Amount'},
    {key: 'totalDiscount', type: 'number', label: 'Total Discount'},
    {key: 'actualAmount', type: 'number', label: 'Actual Amount'},
    {key: 'isEdit', type: 'isEdit', label: ''}
  ];

  invoiceColumns: string[] = this.COLUMN_SCHEMA.map(col => col.key);

  invoiceDatasource = new MatTableDataSource<Invoice>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnSchema: any = this.COLUMN_SCHEMA;

  /*
  editInvoiceForm = new FormGroup({
    id: new FormControl(),
    item: new FormGroup({  
      id: new FormControl(),
      name: new FormControl(''),
      description: new FormControl(''),
      hsn: new FormGroup({
        id: new FormControl(),
        hsnCode: new FormControl(''),
        description: new FormControl(''),
        gstRate: new FormControl(),
      }),
      manfacturer: new FormGroup({
        id: new FormControl(),
        name: new FormControl(''),
      }),
    }),
    BatchNo: new FormControl(''),
    ExpDate: new FormControl(new Date()),
    MfgDate: new FormControl(new Date()),
    Qty: new FormControl(0),
    unit: new FormControl(''),
    rate: new FormControl(0),
    tax: new FormControl(0),
    amount: new FormControl(0)
  });
  */

  constructor(@Inject(MAT_DIALOG_DATA) public data: {invoice: Invoice}, public invoiceService: InvoiceService, public itemService: ItemService, public dialog: MatDialog) { }

  ngOnInit(): void {
    /*
    this.editInvoiceForm.controls.id.setValue(0);
    this.editInvoiceForm.controls.item.setValue({id: 0, name: '', description: '',hsn:{id:0,hsnCode:'',description:'',gstRate:0},manfacturer:{id:0,name: ''}});
    */

    this.getInvoiceList();
    this.getItemList();
  }

  ngAfterViewInit(): void {
    this.invoiceDatasource.paginator = this.paginator;
    this.invoiceDatasource.sort = this.sort;
  }
  
  getInvoiceList() {
    this.invoiceService.getInvoices().subscribe(
      res => {
        console.log('get invoices: ', res);
        this.invoice = res;
        this.invoiceDatasource.data = res;
      } 
    )
  }

  getItemList() {
    this.itemService.getItems().subscribe(
      res => {
        this.items = res;
      }
    )
  }

  addRow() {

  }

  /*
  editFormValue() {
    this.editInvoiceForm.patchValue({
      id: this.data.invoice.id,
      item: {
        id: this.data.invoice.item.id,
        name: this.data.invoice.item.name,
        description: this.data.invoice.item.description,
        hsn : {
          id: this.data.invoice.item.hsn.id,
          hsnCode: this.data.invoice.item.hsn.hsnCode,
          description: this.data.invoice.item.hsn.description,
          gstRate: this.data.invoice.item.hsn.gstRate,
        },
        manfacturer: {
          id: this.data.invoice.item.manfacturer.id,
          name: this.data.invoice.item.manfacturer.name,
        }
      },
      BatchNo: this.data.invoice.BatchNo,
      ExpDate: this.data.invoice.ExpDate,
      MfgDate: this.data.invoice.MfgDate,
      Qty: this.data.invoice.Qty,
      unit: this.data.invoice.unit,
      rate: this.data.invoice.rate,
      tax: this.data.invoice.tax,
      amount: this.data.invoice.amount
    })
  }

  savePopupItem() {
    if(!this.data) {
      this.invoiceService.saveInvoice(this.editInvoiceForm.value as Invoice);
    } else {
      this.invoiceService.updateInvoice(this.editInvoiceForm.value.id, this.editInvoiceForm.value as Invoice);
    }
  }
  
  resetForm() {
    this.editInvoiceForm.reset();
    this.dialog.closeAll();
  }
  */
  
}