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
    // {key: 'distributor', type: 'object', label: 'Distributor'},
    // {key: 'id', type: 'number', label: 'id', object:'distributor'},
    // {key: 'name', type: 'text', label: 'name', object:'distributor'},
    // {key: 'email', type: 'text', label: 'email', object:'distributor'},
    // {key: 'phoneNumber', type: 'number', label: 'phoneNumber', object:'distributor'},
    // {key: 'gstin ', type: 'text', label: 'gstin', object:'distributor'},
    // {key: 'pan', type: 'text', label: 'pan', object:'distributor'},
    // {key: 'dlno', type: 'text', label: 'dlno', object:'distributor'},
    // {key: 'address', type: 'text', label: 'address', object:'distributor'},
    // {key: 'city', type: 'text', label: 'city', object:'distributor'},
    // {key: 'state', type: 'text', label: 'state', object:'distributor'},
    // {key: 'pinCode', type: 'text', label: 'pinCode', object:'distributor'},
    // {key: 'id', type: 'number', label: 'id', object: 'invoiceItems'},
    // {key: 'id', type: 'number', label: 'id', object:'item'},
    // {key: 'name', type: 'text', label: 'name', object:'item'},
    // {key: 'description', type: 'text', label: 'description', object:'item'},
    // {key: 'id', type: 'number', label: 'id', object:'hsn'},
    // {key: 'hsnCode', type: 'text', label: 'hsnCode', object:'hsn'},
    // {key: 'description', type: 'text', label: 'description', object:'hsn'},
    // {key: 'gstRate', type: 'number', label: 'gstRate', object:'hsn'},
    // {key: 'id', type: 'number', label: 'id', object:'manfacturer'},
    // {key: 'name', type: 'text', label: 'name', object:'manfacturer'},
    // {key: 'pack', type: '', label: 'pack', object:'invoiceItems'},
    // {key: 'batchNo', type: 'text', label: 'batchNo', object:'invoiceItems'},
    // {key: 'mfgDate', type: 'text', label: 'mfgDate', object:'invoiceItems'},
    // {key: 'expDate', type: 'text', label: 'expDate', object:'invoiceItems'},
    // {key: 'qty', type: 'number', label: 'qty', object:'invoiceItems'},
    // {key: 'freeItems', type: 'number', label: 'freeItems', object:'invoiceItems'},
    // {key: 'discount', type: 'number', label: 'discount', object:'invoiceItems'},
    // {key: 'mrp', type: 'number', label: 'mrp', object:'invoiceItems'},
    // {key: 'rate', type: 'number', label: 'rate', object:'invoiceItems'},
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