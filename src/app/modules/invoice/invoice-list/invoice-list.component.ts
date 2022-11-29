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
    {key: 'select', type: '', label: '', object:'', subtype:''},
    {key: 'id', type: 'number', label: '#', object:'', subtype:''},
    {key: 'invoiceNumber', type: 'number', label: 'invoiceNumber', object:'', subtype:''},
    {key: 'invoiceDate', type: 'text', label: 'invoiceDate', object:'', subtype:''},
    // {key: 'distributor', type: 'object', label: 'Distributor Name', object: 'distributor.name', subtype:''},
    // {key: 'id', type: 'object', label: 'id', object:'distributor', subtype:''},
    // {key: 'name', type: 'object', label: 'name', object:'distributor', subtype:''},
    // {key: 'email', type: 'object', label: 'email', object:'distributor', subtype:''},
    // {key: 'phoneNumber', type: 'object', label: 'phoneNumber', object:'distributor', subtype:''},
    // {key: 'gstin ', type: 'object', label: 'gstin', object:'distributor', subtype:''},
    // {key: 'pan', type: 'object', label: 'pan', object:'distributor', subtype:''},
    // {key: 'dlno', type: 'object', label: 'dlno', object:'distributor', subtype:''},
    // {key: 'address', type: 'object', label: 'address', object:'distributor', subtype:''},
    // {key: 'city', type: 'object', label: 'city', object:'distributor', subtype:''},
    // {key: 'state', type: 'object', label: 'state', object:'distributor', subtype:''},
    // {key: 'pinCode', type: 'object', label: 'pinCode', object:'distributor', subtype:''},
    // {key: 'id', type: 'object', label: 'id', object: 'invoiceItems', subtype:''},
    // {key: 'id', type: 'object', label: 'id', object:'item', subtype:''},
    // {key: 'name', type: 'object', label: 'name', object:'item', subtype:''},
    // {key: 'description', type: 'object', label: 'description', object:'item', subtype:''},
    // {key: 'id', type: 'object', label: 'id', object:'hsn', subtype:''},
    // {key: 'hsnCode', type: 'object', label: 'hsnCode', object:'hsn', subtype:''},
    // {key: 'description', type: 'object', label: 'description', object:'hsn', subtype:''},
    // {key: 'gstRate', type: 'object', label: 'gstRate', object:'hsn', subtype:''},
    // {key: 'id', type: 'object', label: 'id', object:'manfacturer', subtype:''},
    // {key: 'name', type: 'object', label: 'name', object:'manfacturer', subtype:''},
    // {key: 'pack', type: 'object', label: 'pack', object:'invoiceItems', subtype:''},
    // {key: 'batchNo', type: 'object', label: 'batchNo', object:'invoiceItems', subtype:''},
    {key: 'mfgDate', type: 'object', label: 'Mfg. Date', object:'invoiceItems', subtype:'date'},
    // {key: 'expDate', type: 'object', label: 'expDate', object:'invoiceItems', subtype:''},
    // {key: 'qty', type: 'object', label: 'qty', object:'invoiceItems', subtype:''},
    // {key: 'freeItems', type: 'object', label: 'freeItems', object:'invoiceItems', subtype:''},
    // {key: 'discount', type: 'object', label: 'discount', object:'invoiceItems', subtype:''},
    // {key: 'mrp', type: 'object', label: 'mrp', object:'invoiceItems', subtype:''},
    // {key: 'rate', type: 'object', label: 'rate', object:'invoiceItems', subtype:''},
    {key: 'amount', type: 'number', label: 'Amount', object:'', subtype:''},
    {key: 'totalDiscount', type: 'number', label: 'Total Discount', object:'', subtype:''},
    {key: 'actualAmount', type: 'number', label: 'Actual Amount', object:'', subtype: ''}
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
    this.invoiceService.getInvoices().subscribe(
      res => {
        // console.log('get invoices: ', res);
        this.invoice = res;
        this.invoiceDatasource.data = res;
      }
    )
  }

  editSelectedInvoice(invoice: Invoice[]) {
    this.dialog.open(
      // EditInvoiceStaticComponent, 
      EditInvoiceComponent,
      {data: {invoice}}
    );
  }
}