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

  invoiceColumns: string[] = ['id', 'items', 'amount', 'totalDiscount', 'actualAmount'];

  invoiceDatasource = new MatTableDataSource<Invoice>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, public invoiceService: InvoiceService) { }

  ngOnInit(): void {
    // this.getAllInvoices();
  }

  ngAfterViewInit(): void {
    this.invoiceDatasource.paginator = this.paginator;
    this.invoiceDatasource.sort = this.sort;
  }
  
  openInvoiceDialog() {
    // this.dialog.open(EditInvoiceComponent, {maxWidth: '100vw', maxHeight: '100vh', width: '95%', height: '95%', panelClass: 'full-screen-modal'});
    // this.dialog.open(EditInvoiceStaticComponent, {maxWidth: '100vw', maxHeight: '100vh', width: '95%', height: '95%', panelClass: 'full-screen-modal'});
    this.dialog.open(EditInvoiceStaticComponent, {maxWidth: '100vw', maxHeight: '100vh', width: '98%', height: '98%', panelClass: 'fixActionRow'
    ,autoFocus: false
  });
  }

  getAllInvoices() {
    this.invoiceService.getInvoices().subscribe(
      res => {
        this.invoice = res;
        this.invoiceDatasource.data = res;
      }
    )
  }

  editSelectedInvoice(invoice: Invoice[]) {
    // this.dialog.open(EditInvoiceComponent, {data: {invoice}});
    this.dialog.open(EditInvoiceStaticComponent, {data: {invoice}});
  }
}