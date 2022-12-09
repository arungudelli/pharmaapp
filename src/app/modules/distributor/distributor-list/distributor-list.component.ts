import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Distributor } from 'src/app/models/distributor';
import { Invoice } from 'src/app/models/invoice';
import { DistributorService } from 'src/app/services/distributor.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { EditInvoiceComponent } from '../../invoice/edit-invoice/edit-invoice.component';
import { ViewInvoiceComponent } from '../../invoice/view-invoice/view-invoice.component';
import { EditDistributorComponent } from '../edit-distributor/edit-distributor.component';

@Component({
  selector: 'app-distributor-list',
  templateUrl: './distributor-list.component.html',
  styleUrls: ['./distributor-list.component.css']
})

export class DistributorListComponent {
  distributor: Distributor[] = [];

  selectedDistributor: Distributor;

  distributorColumns: string[] = ['Distributor', 'Amount'];

  distributorDatasource = new MatTableDataSource<Distributor>();

  invoice: Invoice[] = [];
  
  invoiceColumns: string[] = ['invoiceNumber','invoiceDate','amount','totalDiscount','actualAmount','action'];

  invoiceDatasource = new MatTableDataSource<Invoice>();

  constructor(public dialog: MatDialog, public distributorService: DistributorService, public invoiceService: InvoiceService) { 
    this.selectedDistributor = {} as Distributor;
  }

  ngOnInit(): void {
    this.getAllDistributors();
  }

  openDistributorDialog() {
    this.dialog.open(EditDistributorComponent);
  }

  getAllDistributors() {
    this.distributorService.getDistributors().subscribe(
      res => {
        this.distributor = res;
        this.distributorDatasource.data = res;
      }
    )
  }

  editSelectedDistributor(distributor: Distributor[]) {
    this.dialog.open(EditDistributorComponent, {data: {distributor}});
  }

  getSelectedInvoice(index: number) {
    // console.log(index);
    this.invoiceService.getInvoiceByDistributorId(index).subscribe(
      res => {
        // console.log(res);
        this.invoice = res as Invoice[];
        this.invoiceDatasource.data = res as Invoice[];
      }
    );
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
      })
    })

    this.dialog.open(
      // EditInvoiceComponent, 
      ViewInvoiceComponent,
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