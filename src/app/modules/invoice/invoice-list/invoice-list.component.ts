import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceService } from 'src/app/services/invoice.service';
import { EditInvoiceStaticComponent } from '../edit-invoice-static/edit-invoice-static.component';
import { EditInvoiceComponent } from '../edit-invoice/edit-invoice.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})

export class InvoiceListComponent {
  invoice: Invoice[] = [];

  selectedInvoice: Invoice = {} as Invoice;

  columnSchema = [
    {key: 'select', type: '', label: '', object:'', isObject: false, formGroupName: ''},
    {key: 'id', type: 'number', label: '#', object:'', isObject: false, formGroupName: ''},
    {key: 'invoiceNumber', type: 'number', label: 'invoiceNumber', object:'', isObject: false, formGroupName: ''},
    {key: 'invoiceDate', type: 'text', label: 'invoiceDate', object:'', isObject: false, formGroupName: ''},
    // {key: 'id', type: 'number', label: 'id', object:'distributor', isObject: true, formGroupName: ''},
    {key: 'name', type: 'text', label: 'Distributor Name', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'email', type: 'text', label: 'email', object:'distributor', isObject: true, formGroupName: ''},
    // {key: 'phoneNumber', type: 'number', label: 'phoneNumber', object:'distributor', isObject: true, formGroupName: ''},
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
    {key: 'amount', type: 'number', label: 'Amount', object:'', isObject: false, formGroupName: ''},
    {key: 'totalDiscount', type: 'number', label: 'Total Discount', object:'', isObject: false, formGroupName: ''},
    {key: 'actualAmount', type: 'number', label: 'Actual Amount', object:'', isObject: false, formGroupName: ''},
    {key: 'action', type: '', label: 'Action', object: '', isObject: false, formGroup: ''}
  ];

  invoiceColumns: string[] = this.columnSchema.map(col => col.key);

  // invoiceColumns: string[] = ['id', 'items', 'amount', 'totalDiscount', 'actualAmount'];

  invoiceDatasource = new MatTableDataSource<Invoice>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, public invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.getAllInvoices();
  }

  ngAfterViewInit(): void {
    this.invoiceDatasource.paginator = this.paginator;
    this.invoiceDatasource.sort = this.sort;
  }
  
  openInvoiceDialog() {
    this.dialog.open(
      EditInvoiceComponent, 
      // EditInvoiceStaticComponent,
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

  getAllInvoices() {
    /*
    this.invoiceService.getInvoices().subscribe(
      res => {
        // console.log('get invoices: ', res);
        this.invoice = res;
        this.invoiceDatasource.data = res;
      }
    )
    */

    this.invoiceService.getInvoices();
    this.invoiceService.allInvoices.subscribe(res=>{
      // console.log('get invoices: ', res);
      this.invoice = res;
      this.invoiceDatasource.data = res;
    });
  }

  editSelectedInvoice(invoice: Invoice[]) {

    const index = Object.entries(invoice).at(0)?.at(1)?.valueOf();
    
    const invoiceRow = this.invoice.find(x=>x.id === index);

    const invoiceRows: any[] = [];

    invoiceRow?.invoiceItems.map(x=> {
      invoiceRows.push({
        id: x.id,
        productName: x.item.name,
        pack: x.pack,
        batchNo: x.batchNo,
        mfgDate: x.mfgDate,
        expDate: x.expDate,
        qty: x.qty,
        freeItems: x.freeItems,
        mrp: x.mrp,
        rate: x.rate,
        discount: x.discount,
        gstRate: x.item.hsn.gstRate,
        hsnCode: x.item.hsn.hsnCode,

        // action: x.action,
        // isEditable: x.isEditable,
        // isNewRow: x.isNewRow
      })
    })
   
    this.dialog.open(
      // EditInvoiceStaticComponent, 
      EditInvoiceComponent,
      {
        maxWidth: '100vw', 
        maxHeight: '100vh', 
        width: '98%', 
        height: '98%', 
        panelClass: 'fixActionRow',
        autoFocus: false,
        data: { invoice , invoiceRows}
      }
    );
  }
}