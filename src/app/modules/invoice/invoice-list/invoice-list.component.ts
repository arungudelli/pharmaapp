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
    {key: 'select', type: '', label: '', object:''},
    {key: 'id', type: 'number', label: '#', object:''},
    {key: 'invoiceNumber', type: 'number', label: 'invoiceNumber', object:''},
    {key: 'invoiceDate', type: 'text', label: 'invoiceDate', object:''},
    // {key: 'distributor', type: 'object', label: 'Distributor Name', object: 'distributor.name'},
    // {key: 'id', type: 'object', label: 'id', object:'distributor'},
    // {key: 'name', type: 'object', label: 'name', object:'distributor'},
    // {key: 'email', type: 'object', label: 'email', object:'distributor'},
    // {key: 'phoneNumber', type: 'object', label: 'phoneNumber', object:'distributor'},
    // {key: 'gstin ', type: 'object', label: 'gstin', object:'distributor'},
    // {key: 'pan', type: 'object', label: 'pan', object:'distributor'},
    // {key: 'dlno', type: 'object', label: 'dlno', object:'distributor'},
    // {key: 'address', type: 'object', label: 'address', object:'distributor'},
    // {key: 'city', type: 'object', label: 'city', object:'distributor'},
    // {key: 'state', type: 'object', label: 'state', object:'distributor'},
    // {key: 'pinCode', type: 'object', label: 'pinCode', object:'distributor'},
    // {key: 'id', type: 'object', label: 'id', object: 'invoiceItems'},
    // {key: 'id', type: 'object', label: 'id', object:'item'},
    // {key: 'name', type: 'object', label: 'name', object:'item'},
    // {key: 'description', type: 'object', label: 'description', object:'item'},
    // {key: 'id', type: 'object', label: 'id', object:'hsn'},
    // {key: 'hsnCode', type: 'object', label: 'hsnCode', object:'hsn'},
    // {key: 'description', type: 'object', label: 'description', object:'hsn'},
    // {key: 'gstRate', type: 'object', label: 'gstRate', object:'hsn'},
    // {key: 'id', type: 'object', label: 'id', object:'manfacturer'},
    // {key: 'name', type: 'object', label: 'name', object:'manfacturer'},
    // {key: 'pack', type: 'object', label: 'pack', object:'invoiceItems'},
    // {key: 'batchNo', type: 'object', label: 'batchNo', object:'invoiceItems'},
    {key: 'mfgDate', type: 'object', label: 'Mfg. Date', object:'invoiceItems'},
    // {key: 'expDate', type: 'object', label: 'expDate', object:'invoiceItems'},
    // {key: 'qty', type: 'object', label: 'qty', object:'invoiceItems'},
    // {key: 'freeItems', type: 'object', label: 'freeItems', object:'invoiceItems'},
    // {key: 'discount', type: 'object', label: 'discount', object:'invoiceItems'},
    // {key: 'mrp', type: 'object', label: 'mrp', object:'invoiceItems'},
    // {key: 'rate', type: 'object', label: 'rate', object:'invoiceItems'},
    {key: 'amount', type: 'number', label: 'Amount', object:''},
    {key: 'totalDiscount', type: 'number', label: 'Total Discount', object:''},
    {key: 'actualAmount', type: 'number', label: 'Actual Amount', object:''}
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