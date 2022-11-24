import { Component, Inject, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { Distributor } from 'src/app/models/distributor';
import { Invoice } from 'src/app/models/invoice';
import { Manufacturer } from 'src/app/models/manufacturer';
import { DistributorService } from 'src/app/services/distributor.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ManufacturerService } from 'src/app/services/manufacturer.service';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})

export class EditInvoiceComponent {
  distributors: Distributor[] = [];

  invoice: Invoice[] = [];

  selectedInvoice: Invoice = {} as Invoice;

  filteredDistributorOptions?: Observable<string[]>;

  columnSchema = [
    {key: 'id', type: 'number', label: '#'},
    {key: 'amount', type: 'number', label: 'Amount'},
    {key: 'totalDiscount', type: 'number', label: 'Total Discount'},
    {key: 'actualAmount', type: 'number', label: 'Actual Amount'},
  ];

  invoiceColumns: string[] = this.columnSchema.map(col => col.key);

  // invoiceColumns: string[] = ['id', 'amount', 'totalDiscount', 'actualAmount'];
  // ['id',['id',['id','name','description',['id','hsnCode','description','gstRate'],['id','name']],['id','name','email','phoneNumber','gstin','pan','dlno','address','city','state','pinCode'],'pack','batchNo','mfgDate','expDate','qty','freeItems','discount','mrp','rate'],'amount','totalDiscount','actualAmount'];
  
  // invoiceDatasource = new MatTableDataSource<Invoice>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  editInvoiceForm = new FormGroup({
    invoiceRows: new FormArray(this.invoice.map(val => new FormGroup({
      id: new FormControl(val.id),
      invoiceItems: new FormGroup({
        id: new FormControl(val.invoiceItems.id),
        item: new FormGroup({
          id: new FormControl(val.invoiceItems.item.id),
          name: new FormControl(val.invoiceItems.item.name),
          description: new FormControl(val.invoiceItems.item.description),
          hsn: new FormGroup({
            id: new FormControl(val.invoiceItems.item.hsn.id),
            hsnCode: new FormControl(val.invoiceItems.item.hsn.hsnCode),
            description: new FormControl(val.invoiceItems.item.hsn.description),
            gstRate: new FormControl(val.invoiceItems.item.hsn.gstRate),
          }),
          manfacturer: new FormGroup({
            id: new FormControl(val.invoiceItems.item.manfacturer.id),
            name: new FormControl(val.invoiceItems.item.manfacturer.name),
            // id: new FormControl(),
            // name: new FormControl(),
          }),
        }),
        distributor: new FormGroup({
          id: new FormControl(val.invoiceItems.distributor.id),
          name: new FormControl(val.invoiceItems.distributor.name),
          email:new FormControl(val.invoiceItems.distributor.email),
          phoneNumber: new FormControl(val.invoiceItems.distributor.phoneNumber),
          gstin : new FormControl(val.invoiceItems.distributor.gstin),
          pan: new FormControl(val.invoiceItems.distributor.pan),
          dlno: new FormControl(val.invoiceItems.distributor.dlno),
          address: new FormControl(val.invoiceItems.distributor.address),
          city: new FormControl(val.invoiceItems.distributor.city),
          state: new FormControl(val.invoiceItems.distributor.state),
          pinCode: new FormControl(val.invoiceItems.distributor.pinCode),
        }),
        pack: new FormControl(val.invoiceItems.pack),
        batchNo: new FormControl(val.invoiceItems.batchNo),
        mfgDate: new FormControl(val.invoiceItems.mfgDate),
        expDate: new FormControl(val.invoiceItems.expDate),
        qty: new FormControl(val.invoiceItems.qty),
        freeItems: new FormControl(val.invoiceItems.freeItems),
        discount: new FormControl(val.invoiceItems.discount),
        mrp: new FormControl(val.invoiceItems.mrp),
        rate: new FormControl(val.invoiceItems.rate),
      }),
      amount: new FormControl(val.amount),
      totalDiscount: new FormControl(val.totalDiscount),
      actualAmount: new FormControl(val.actualAmount),
      
      action: new FormControl('existingRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false),
    })))
  });
  
  invoiceDatasource = new MatTableDataSource((this.editInvoiceForm.get('invoiceRows') as FormArray).controls);
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: {invoice: Invoice}, public invoiceService: InvoiceService, public distributorService: DistributorService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.editInvoiceForm.controls.invoiceRows.controls.id.setValue(0);
    // this.editInvoiceForm.controls.invoiceRows.get('manfacturer')?.setValue({id:0,name:''});
    // this.editInvoiceForm.controls.item.setValue({id: 0, name: '', description: '',hsn:{id:0,hsnCode:'',description:'',gstRate:0},manfacturer:{id:0,name: ''}});

    this.getInvoiceList();
    this.getDistributorsList();
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
        // this.invoiceDatasource.data = res;
      } 
    )
  }

  getDistributorsList() {
    this.distributorService.getDistributors().subscribe(
      res => {
        console.log('get distributors: ', res);
        this.distributors = res;
        this.filterSearchDistributors(res);
      }
    )
  }

  filterSearchDistributors(res: Manufacturer[]) {
    this.filteredDistributorOptions = this.editInvoiceForm.controls.invoiceRows.get('distributor.name')?.valueChanges.pipe(
      startWith(''),
      map(term => {
        return res
          .map(option => option.name)
          .filter(option => option.toLowerCase().includes(term as string));
      },)
    )
  }

  onSelectMfr(option: string) {
    const name = this.distributors.filter(item => item.name === option)[0].name;
    const phoneNumber = this.distributors.filter(item => item.name === option)[0].phoneNumber;

    console.log(this.editInvoiceForm.controls.invoiceRows.get('distributor'));
    
    // this.editInvoiceForm.controls.invoiceRows.get('distributor').setValue({name,phoneNumber});
  }

  addRow() {
    // const newRow = this.selectedInvoice;
    // this.invoiceDatasource.data = [...this.invoiceDatasource.data, newRow];
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