import { Component, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceService } from 'src/app/services/invoice.service';
import { EditBillComponent } from '../edit-bill/edit-bill.component';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css']
})

export class BillListComponent {
  bill: Invoice[] = [];

  selectedBill: Invoice = {} as Invoice;

  columnSchema = [
    {key: 'select', type: '', label: '', object:'', isObject: false, formGroupName: ''},
    {key: 'id', type: 'number', label: '#', object:'', isObject: false, formGroupName: ''},
    {key: 'invoiceNumber', type: 'number', label: 'Bill Number', object:'', isObject: false, formGroupName: ''},
    {key: 'invoiceDate', type: 'text', label: 'Bill Date', object:'', isObject: false, formGroupName: ''},
    // {key: 'id', type: 'number', label: 'id', object:'distributor', isObject: true, formGroupName: ''},
    {key: 'name', type: 'text', label: 'Customer Name', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'email', type: 'text', label: 'email', object:'distributor', isObject: true, formGroupName: ''},
    {key: 'phoneNumber', type: 'number', label: 'Phone Number', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'gstin ', type: 'text', label: 'gstin', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'pan', type: 'text', label: 'pan', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'dlno', type: 'text', label: 'dlno', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'address', type: 'text', label: 'address', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'city', type: 'text', label: 'city', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'state', type: 'text', label: 'state', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'pinCode', type: 'text', label: 'pinCode', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'id', type: 'number', label: 'id', object: 'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'id', type: 'number', label: 'id', object:'item', isObject: true, formGroupName: ''},
    // {key: 'name', type: 'text', label: 'name', object:'item', isObject: true, formGroupName: ''},
    // {key: 'description', type: 'text', label: 'description', object:'item', isObject: true, formGroupName: ''},
    // {key: 'id', type: 'number', label: 'id', object:'hsn', isObject: true, formGroupName: ''},
    // {key: 'hsnCode', type: 'text', label: 'hsnCode', object:'hsn', isObject: true, formGroupName: ''},
    // {key: 'description', type: 'text', label: 'description', object:'hsn', isObject: true, formGroupName: ''},
    // {key: 'gstRate', type: 'number', label: 'gstRate', object:'hsn', isObject: true, formGroupName: ''},
    // {key: 'id', type: 'number', label: 'id', object:'manfacturer', isObject: true, formGroupName: ''},
    // {key: 'name', type: 'text', label: 'name', object:'manfacturer', isObject: true, formGroupName: ''},
    // {key: 'pack', type: 'text', label: 'pack', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'batchNo', type: 'text', label: 'batchNo', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'mfgDate', type: 'date', label: 'Mfg. Date', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'expDate', type: 'date', label: 'expDate', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'qty', type: 'number', label: 'qty', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'freeItems', type: 'number', label: 'freeItems', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'discount', type: 'number', label: 'discount', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'mrp', type: 'number', label: 'mrp', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'rate', type: 'number', label: 'rate', object:'invoiceItems', isObject: true, formGroupName: ''},
    // {key: 'amount', type: 'number', label: 'Amount', object:'', isObject: false, formGroupName: ''},
    // {key: 'totalDiscount', type: 'number', label: 'Total Discount', object:'', isObject: false, formGroupName: ''},
    {key: 'actualAmount', type: 'number', label: 'Total Amount', object:'', isObject: false, formGroupName: ''},
    {key: 'action', type: '', label: 'Action', object: '', isObject: false, formGroup: ''}
  ];

  billColumns: string[] = this.columnSchema.map(col => col.key);

  // invoiceColumns: string[] = ['id', 'items', 'amount', 'totalDiscount', 'actualAmount'];

  billDatasource = new MatTableDataSource<Invoice>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.getAllBills();

    // /*
    // const filterPredicate = this.billDatasource.filterPredicate;
    // this.billDatasource.filterPredicate = (data: AbstractControl|any, filter) => {
    this.billDatasource.filterPredicate = (data: Invoice, filter) => {
      // return filterPredicate.call(this.billDatasource, data, filter);
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1; 
    };
    // */
  }

  ngAfterViewInit(): void {
    this.billDatasource.paginator = this.paginator;
  }

  getAllBills() {
    this.invoiceService.getInvoices();
    this.invoiceService.allInvoices.subscribe(res=>{
      // console.log('get invoices: ', res);
      this.bill = res;
      this.billDatasource.data = res;
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.billDatasource.filter = filterValue.trim().toLowerCase();

    if(this.billDatasource.paginator) {
      this.billDatasource.paginator.firstPage();
    }
  }

  openBillDialog() {
    this.dialog.open(
      EditBillComponent, 
      {
        maxWidth: '100vw', 
        maxHeight: '100vh', 
        width: '98%', 
        height: '98%', 
        panelClass: 'fixActionRow',
        autoFocus: false
      }
    );
  }

  editSelectedBill(bill: Invoice[]) {

    const index = Object.entries(bill).at(0)?.at(1)?.valueOf();
    
    const billRow = this.bill.find(x=>x.id === index);

    const billRows: any[] = [];

    billRow?.invoiceItems.map(x=> {
      billRows.push({
        id: x.id,
        productName: x.item.name,
        qty: x.qty,
        batchNo: x.batchNo,
        discount: x.discount,
        mrp: x.mrp,
        mfgDate: x.mfgDate,
        expDate: x.expDate,
      })
    })
   
    // console.log(index, billRow, billRows);
   
    this.dialog.open(
      EditBillComponent,
      {
        maxWidth: '100vw', 
        maxHeight: '100vh', 
        width: '98%', 
        height: '98%', 
        panelClass: 'fixActionRow',
        autoFocus: false,
        data: { bill , billRows}
      }
    );
  }
}
