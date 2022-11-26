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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
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
    this.getInvoiceList();
    this.getDistributorsList();
  }

  ngAfterViewInit(): void {
    this.invoiceDatasource.paginator = this.paginator;
  }
  
  getInvoiceList() {
    this.invoiceService.getInvoices().subscribe(
      res => {
        console.log('get invoices: ', res);
        this.invoice = res;
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

  filterSearchDistributors(res: Distributor[]) {
    this.filteredDistributorOptions = this.editInvoiceForm.controls.invoiceRows.get('distributor.name')?.valueChanges.pipe(
      startWith(''),
      map(term => {
        return res
          .map(option => option.name)
          .filter(option => option.toLowerCase().includes(term as string));
      },)
    )
  }

  onSelectDistributor(option: string) {
    const name = this.distributors.filter(item => item.name === option)[0].name;
    const phoneNumber = this.distributors.filter(item => item.name === option)[0].phoneNumber;

    console.log(this.editInvoiceForm.controls.invoiceRows.get('distributor'));
    
    // this.editInvoiceForm.controls.invoiceRows.get('distributor').setValue({name,phoneNumber});
  }

  initiateInvoiceForm(): FormGroup {
    /* initialize a blank row */
    return new FormGroup({
      id: new FormControl(),
      invoiceItems: new FormGroup({
        id: new FormControl(),
        item: new FormGroup({
          id: new FormControl(),
          name: new FormControl(),
          description: new FormControl(),
          hsn: new FormGroup({
            id: new FormControl(),
            hsnCode: new FormControl(),
            description: new FormControl(),
            gstRate: new FormControl(),
          }),
          manfacturer: new FormGroup({
            id: new FormControl(),
            name: new FormControl(),
          }),
        }),
        distributor: new FormGroup({
          id: new FormControl(),
          name: new FormControl(),
          email:new FormControl(),
          phoneNumber: new FormControl(),
          gstin : new FormControl(),
          pan: new FormControl(),
          dlno: new FormControl(),
          address: new FormControl(),
          city: new FormControl(),
          state: new FormControl(),
          pinCode: new FormControl(),
        }),
        pack: new FormControl(),
        batchNo: new FormControl(),
        mfgDate: new FormControl(),
        expDate: new FormControl(),
        qty: new FormControl(),
        freeItems: new FormControl(),
        discount: new FormControl(),
        mrp: new FormControl(),
        rate: new FormControl(),
      }),
      amount: new FormControl(),
      totalDiscount: new FormControl(),
      actualAmount: new FormControl(),
      
      action: new FormControl('existingRecord'),
    })
  }

  addNewRow() {
    const control = this.editInvoiceForm.get('invoiceRows') as FormArray;
    /* Add new blank row below the last filled row */
    control.insert(this.invoice.length, this.initiateInvoiceForm());
    this.invoiceDatasource = new MatTableDataSource(control.controls);
  }

  saveForm(editInvoiceForm: FormGroup, i: number) {
    /* save edits made */
    // console.log('saving object: ', editInvoiceForm.get('invoiceRows')?.value[i]);
    // updateInvoice(i, editInvoiceForm.get('invoiceRows')?.value[i]);
    ((editInvoiceForm.get('invoiceRows') as FormArray).at(i) as FormGroup).get('isEditable')?.patchValue(true);
  }
  
  cancelForm(editInvoiceForm: FormGroup, i: number) {
    /* discard edits made */
    ((editInvoiceForm.get('invoiceRows') as FormArray).at(i) as FormGroup).get('isEditable')?.patchValue(true);
  }
  
  editForm(editInvoiceForm: FormGroup, i: number) {
    /* set the form to be editable */
    ((editInvoiceForm.get('invoiceRows') as FormArray).at(i) as FormGroup).get('isEditable')?.patchValue(false);
  }

  saveInvoice() {
    
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