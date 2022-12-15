import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Bill } from 'src/app/models/bill';
import { BillService } from 'src/app/services/bill.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { EditBillComponent } from '../edit-bill/edit-bill.component';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css']
})

export class BillListComponent {
  bill: Bill[] = [];

  selectedBill: Bill = {} as Bill;

  columnSchema = [
    {key: 'select', type: '', label: '', object:'', isObject: false, formGroupName: ''},
    {key: 'id', type: 'number', label: '#', object:'', isObject: false, formGroupName: ''},
    {key: 'billNumber', type: 'number', label: 'Bill Number', object:'', isObject: false, formGroupName: ''},
    {key: 'billDate', type: 'text', label: 'Bill Date', object:'', isObject: false, formGroupName: ''},
    /*
    {key: 'patientName', type: 'text', label: 'Customer Name', object:'patient', isObject: true, formGroupName: ''},
    {key: 'phoneNumber', type: 'number', label: 'Phone Number', object:'patient', isObject: true, formGroupName: ''},
    */
    {key: 'discountedAmount', type: 'number', label: 'Amount', object:'', isObject: false, formGroupName: ''},
    {key: 'action', type: '', label: 'Action', object: '', isObject: false, formGroup: ''}
  ];

  billColumns: string[] = this.columnSchema.map(col => col.key);

  // invoiceColumns: string[] = ['id', 'items', 'amount', 'totalDiscount', 'actualAmount'];

  billDatasource = new MatTableDataSource<Bill>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, public billService: BillService, public invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.getAllBills();

    // /*
    this.billDatasource.filterPredicate = (data: Bill, filter) => {
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
    this.billService.getBills();
    this.billService.allBills.subscribe(res=>{
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

  editSelectedBill(bill: Bill[]) {

    const index = Object.entries(bill).at(0)?.at(1)?.valueOf();
    
    const billRow = this.bill.find(x=>x.id === index);

    const billRows: any[] = [];

    billRow?.billItems.map(x=> {
      billRows.push({
        id: x.id,
        productName: x.item.name,
        batchNo: x.batchNo,
        mfgDate: x.mfgDate,
        expDate: x.expDate,
        qty: x.qty,
        discount: x.discount,
        mrp: x.mrp,
        amount: x.amount,
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
