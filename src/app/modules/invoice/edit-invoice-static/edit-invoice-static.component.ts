import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface StaticInvoiceItems {
  id: number, 
  name: string, 
  pack: string, 
  batchNo: string, 
  expDate: Date, 
  qty: number, 
  freeItems: number, 
  mrp: number, 
  rate: number, 
  amount: number, 
  gst: number, 
  hsnCode: string
}

const ELEMENT_DATA : StaticInvoiceItems[] = [
  { id: 1, name: "T Lopez Inj", pack: "2ml", batchNo: "KLL01030", expDate: new Date("2022-11-23"), qty: 40, freeItems: 0, mrp: 17.45, rate: 12.46, amount: 498.40, gst: 12, hsnCode: "30049089" },
  { id: 2, name: "Dolo 650", pack: "1strip", batchNo: "HDD02030", expDate: new Date("2025-11-23"), qty: 23, freeItems: 0, mrp: 18.35, rate: 10.23, amount: 464.48, gst: 12, hsnCode: "30044669" },
  { id: 3, name: "D'Cold", pack: "5tablets", batchNo: "HDD01230", expDate: new Date("2023-11-23"), qty: 12, freeItems: 0, mrp: 20, rate: 15.25, amount: 135.54, gst: 12, hsnCode: "30049569" },
  { id: 4, name: "Cold Cream", pack: "10tablets", batchNo: "KPC01235", expDate: new Date("2028-11-23"), qty: 5, freeItems: 0, mrp: 199.25, rate: 140.57, amount: 579.59, gst: 12, hsnCode: "30446855" },
  { id: 5, name: "Neurobion Forte", pack: "1strip", batchNo: "MBT02065", expDate: new Date("2025-11-23"), qty: 24, freeItems: 0, mrp: 170.25, rate: 120.48, amount: 229.65, gst: 12, hsnCode: "30845248" },
  { id: 6, name: "Calcium Sandoz", pack: "1bottle", batchNo: "NNZ30254", expDate: new Date("2025-11-23"), qty: 10, freeItems: 0, mrp: 100.23, rate: 70.59, amount: 148.83, gst: 12, hsnCode: "35049089" },
  { id: 7, name: "Deodorant Spray", pack: "1can", batchNo: "NLP59984", expDate: new Date("2023-11-23"), qty: 1, freeItems: 0, mrp: 95.26, rate: 65.25, amount: 495.86, gst: 12, hsnCode: "30049589" },
  { id: 8, name: "Seven Seas Tonic", pack: "30ml", batchNo: "SOI16883", expDate: new Date("2024-11-23"), qty: 2, freeItems: 0, mrp: 198.26, rate: 150.47, amount: 986.59, gst: 12, hsnCode: "30849089" },
  { id: 9, name: "Paracetamol 30mg", pack: "1strip", batchNo: "OLI21883", expDate: new Date("2023-11-23"), qty: 30, freeItems: 2, mrp: 30.35, rate: 25.48, amount: 652.38, gst: 12, hsnCode: "30549089" },
  { id: 10, name: "Dysteria 2mg", pack: "2ml", batchNo: "UYI48761", expDate: new Date("2025-11-23"), qty: 25, freeItems: 0, mrp: 15.25, rate: 10.98, amount: 255.56, gst: 12, hsnCode: "30049529" },
];

@Component({
  selector: 'app-edit-invoice-static',
  templateUrl: './edit-invoice-static.component.html',
  styleUrls: ['./edit-invoice-static.component.css']
})

export class EditInvoiceStaticComponent {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  columnSchema = [
    { key: 'id', type: 'text', label: '#' }, 
    { key: 'name', type: 'text', label: 'Product Name' }, 
    { key: 'pack', type: 'text', label: 'Pack' }, 
    { key: 'batchNo', type: 'text', label: 'Batch No.' }, 
    { key: 'expDate', type: 'date', label: 'Expiry Date' }, 
    { key: 'qty', type: 'number', label: 'Qty' }, 
    { key: 'freeItems', type: 'number', label: 'Free' }, 
    { key: 'mrp', type: 'number', label: 'MRP' }, 
    { key: 'rate', type: 'number', label: 'Rate' }, 
    { key: 'amount', type: 'number', label: 'Amount' }, 
    { key: 'gst', type: 'number', label: 'GST %' }, 
    { key: 'hsnCode', type: 'text', label: 'HSN Code' },
  ];

  staticinvoiceColumns: string[] = this.columnSchema.map(col => col.key).concat('action');

  editInvoiceForm = new FormGroup({
    invoiceRows: new FormArray(ELEMENT_DATA.map(val => new FormGroup({
      id: new FormControl(val.id), 
      name: new FormControl(val.name), 
      pack: new FormControl(val.pack), 
      batchNo: new FormControl(val.batchNo), 
      expDate: new FormControl(val.expDate.toISOString().split('T')[0]), 
      qty: new FormControl(val.qty), 
      freeItems: new FormControl(val.freeItems), 
      mrp: new FormControl(val.mrp), 
      rate: new FormControl(val.rate), 
      amount: new FormControl(val.amount), 
      gst: new FormControl(val.gst), 
      hsnCode: new FormControl(val.hsnCode),

      action: new FormControl('existingRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false)
    })))
  });

  staticInvoiceDatasource = new MatTableDataSource((this.editInvoiceForm.get('invoiceRows') as FormArray).controls);
  
  constructor(public dialog: MatDialog) { }

  ngOninit(): void {
  }

  saveForm(savedRow: any) {
    console.log('save form: ', savedRow);
  }

  cancelForm(cancelledRow: any) {
    console.log('cancel form: ', cancelledRow);
  }

  editForm(editedRow: any) {
    console.log('edit form: ', editedRow);
  }

  deleteForm(deletedRow: any) {
    console.log('delete form: ', deletedRow);
  }

}