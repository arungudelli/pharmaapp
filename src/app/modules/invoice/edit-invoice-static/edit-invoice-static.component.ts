import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { Distributor } from 'src/app/models/distributor';
import { PickDateAdapter } from 'src/app/models/pickDateAdapter';
import { DistributorService } from 'src/app/services/distributor.service';

export interface StaticInvoiceItems {
  id: number, 
  name: string, 
  pack: string, 
  batchNo: string, 
  expDate: Date, 
  qty: number, 
  freeItems: number, 
  mrp: number, 
  rate: number, 
  amount: number, 
  gst: number, 
  hsnCode: string
}

const datePickerFormat = {
  parse: {
      dateInput: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
      },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: {
      year: 'numeric',
      month: 'numeric',
    },
    dateA11yLabel: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    monthYearA11yLabel: {
      year: 'numeric',
      month: 'numeric',
    }
  }
}

@Component({
  selector: 'app-edit-invoice-static',
  templateUrl: './edit-invoice-static.component.html',
  styleUrls: ['./edit-invoice-static.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat }
  ]
})

export class EditInvoiceStaticComponent implements OnInit {
  
  distributors: Distributor[] = [];
  
  filteredDistributorOptions?: Observable<string[]>;
  
  ELEMENT_DATA : StaticInvoiceItems[] = [
    { id: 1, name: "T Lopez Inj", pack: "2ml", batchNo: "KLL01030", expDate: new Date("2022-11-23"), qty: 40, freeItems: 0, mrp: 17.45, rate: 12.46, amount: 498.40, gst: 12, hsnCode: "30049089" },
    { id: 2, name: "Dolo 650", pack: "1strip", batchNo: "HDD02030", expDate: new Date("2025-11-23"), qty: 23, freeItems: 0, mrp: 18.35, rate: 10.23, amount: 464.48, gst: 12, hsnCode: "30044669" },
    { id: 3, name: "D'Cold", pack: "5tablets", batchNo: "HDD01230", expDate: new Date("2023-11-23"), qty: 12, freeItems: 0, mrp: 20, rate: 15.25, amount: 135.54, gst: 12, hsnCode: "30049569" },
    { id: 4, name: "Cold Cream", pack: "10tablets", batchNo: "KPC01235", expDate: new Date("2028-11-23"), qty: 5, freeItems: 0, mrp: 199.25, rate: 140.57, amount: 579.59, gst: 12, hsnCode: "30446855" },
    { id: 5, name: "Neurobion Forte", pack: "1strip", batchNo: "MBT02065", expDate: new Date("2025-11-23"), qty: 24, freeItems: 0, mrp: 170.25, rate: 120.48, amount: 229.65, gst: 12, hsnCode: "30845248" },
    { id: 6, name: "Calcium Sandoz", pack: "1bottle", batchNo: "NNZ30254", expDate: new Date("2025-11-23"), qty: 10, freeItems: 0, mrp: 100.23, rate: 70.59, amount: 148.83, gst: 12, hsnCode: "35049089" },
    { id: 7, name: "Deodorant Spray", pack: "1can", batchNo: "NLP59984", expDate: new Date("2023-11-23"), qty: 1, freeItems: 0, mrp: 95.26, rate: 65.25, amount: 495.86, gst: 12, hsnCode: "30049589" },
    { id: 8, name: "Seven Seas Tonic", pack: "30ml", batchNo: "SOI16883", expDate: new Date("2024-11-23"), qty: 2, freeItems: 0, mrp: 198.26, rate: 150.47, amount: 986.59, gst: 12, hsnCode: "30849089" },
    { id: 9, name: "Paracetamol 30mg", pack: "1strip", batchNo: "OLI21883", expDate: new Date("2023-11-23"), qty: 30, freeItems: 2, mrp: 30.35, rate: 25.48, amount: 652.38, gst: 12, hsnCode: "30549089" },
    { id: 10, name: "Dysteria 2mg", pack: "2ml", batchNo: "UYI48761", expDate: new Date("2025-11-23"), qty: 25, freeItems: 0, mrp: 15.25, rate: 10.98, amount: 255.56, gst: 12, hsnCode: "30049529" },
  ];
    
  // ELEMENT_DATA : StaticInvoiceItems[] = [];
  
  columnSchema = [
    { key: 'select', type: '', label: '' }, 
    { key: 'id', type: 'text', label: '#' }, 
    { key: 'name', type: 'text', label: 'Product Name' }, 
    { key: 'pack', type: 'text', label: 'Pack' }, 
    { key: 'batchNo', type: 'text', label: 'Batch No.' }, 
    { key: 'expDate', type: 'date', label: 'Expiry Date' }, 
    { key: 'qty', type: 'number', label: 'Qty' }, 
    { key: 'freeItems', type: 'number', label: 'Free' }, 
    { key: 'mrp', type: 'number', label: 'MRP' }, 
    { key: 'rate', type: 'number', label: 'Rate' }, 
    { key: 'amount', type: 'number', label: 'Amount' }, 
    { key: 'gst', type: 'number', label: 'GST %' }, 
    { key: 'hsnCode', type: 'text', label: 'HSN Code' },
  ];

  editInvoiceForm = new FormGroup({
    invoiceRows: new FormArray(this.ELEMENT_DATA.map(val => new FormGroup({
      id: new FormControl(val.id), 
      name: new FormControl(val.name), 
      pack: new FormControl(val.pack), 
      batchNo: new FormControl(val.batchNo), 
      expDate: new FormControl(val.expDate), 
      // expDate: new FormControl(val.expDate.toISOString().split('T')[0]), // 2022-11-23 : yyyy-MM-dd
      qty: new FormControl(val.qty), 
      freeItems: new FormControl(val.freeItems), 
      mrp: new FormControl(val.mrp), 
      rate: new FormControl(val.rate), 
      amount: new FormControl(val.amount), 
      gst: new FormControl(val.gst), 
      hsnCode: new FormControl(val.hsnCode),

      action: new FormControl('existingRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false)
    })))
  });

  editInvoiceAccountsForm = new FormGroup({
    distributor: new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      email: new FormControl(),
      phoneNumber: new FormControl(),
      gstin : new FormControl(),
      pan: new FormControl(),
      dlno: new FormControl(),
      address: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      pinCode: new FormControl()
    }),
    billNo: new FormControl(''),
    billDate: new FormControl(''),
    amount: new FormControl(0),
    totalDiscount: new FormControl(0),
    actualAmount: new FormControl(0)
  });

  staticInvoiceDatasource = new MatTableDataSource((this.editInvoiceForm.get('invoiceRows') as FormArray).controls);
  
  selection =  new SelectionModel<StaticInvoiceItems>(true, []);

  staticinvoiceColumns: string[] = this.columnSchema.map(col => col.key).concat('action');
  
  constructor(public dialog: MatDialog, private distributorService: DistributorService) { }
  
  ngOnInit(): void {
    this.editInvoiceAccountsForm.controls.distributor.setValue({id:0,name:'',email:'',phoneNumber:0,gstin:'',pan:'',dlno:'',address:'',city:'',state:'',pinCode:''});

    this.getDistributorsList();
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.staticInvoiceDatasource.data.length;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if(this.isAllSelected()) {
      this.selection.clear();
      return;
    } else {
      this.selection.select(... this.staticInvoiceDatasource.data.map(item => item.value));
    }
  }

  /* The label for the checkbox on the passed row */
  checkboxLabel(row?: StaticInvoiceItems): string {
    if(!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    } else {
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
  }  
  
  getDistributorsList() {
    this.distributorService.getDistributors().subscribe(
      res => {
        // console.log('get distributors: ', res);
        this.distributors = res;
        this.filterSearchDistributors(res);
      }
    )
  }

  filterSearchDistributors(res: Distributor[]) {
    this.filteredDistributorOptions = this.editInvoiceAccountsForm.controls.distributor.valueChanges.pipe(
      startWith(''),
      map(term => {
        return res
          .map(option => option.name)
          .filter(option => option.toLowerCase().includes(term as string));
      },)
    )
  }

  onSelectDistributor(option: string) {
    const id = this.distributors.filter(item => item.name === option)[0].id;
    const name = this.distributors.filter(item => item.name === option)[0].name;
    const email = this.distributors.filter(item => item.name === option)[0].email;
    const phoneNumber = this.distributors.filter(item => item.name === option)[0].phoneNumber;
    const gstin  = this.distributors.filter(item => item.name === option)[0].gstin;
    const address = this.distributors.filter(item => item.name === option)[0].address;
    const city = this.distributors.filter(item => item.name === option)[0].city;
    const state = this.distributors.filter(item => item.name === option)[0].state;
    const pinCode = this.distributors.filter(item => item.name === option)[0].pinCode;

    this.editInvoiceAccountsForm.controls.distributor.setValue({id, name, email, phoneNumber, gstin, address, city, state, pinCode,pan:'',dlno:''});
  }

  saveForm(editInvoiceForm: FormGroup, i: number) {
    /* save edits made */
    console.log('saving object: ', editInvoiceForm.get('invoiceRows')?.value[i]);
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

  initiateInvoiceForm(): FormGroup {
    /* initialize a blank row */
    return new FormGroup({
      id: new FormControl(), 
      name: new FormControl(), 
      pack: new FormControl(), 
      batchNo: new FormControl(), 
      expDate: new FormControl(), 
      qty: new FormControl(), 
      freeItems: new FormControl(), 
      mrp: new FormControl(), 
      rate: new FormControl(), 
      amount: new FormControl(), 
      gst: new FormControl(), 
      hsnCode: new FormControl(),
      action: new FormControl('newRecord')
    })
  }

  addNewRow() {
    const control = this.editInvoiceForm.get('invoiceRows') as FormArray;
    /* Add new blank row below the last filled row */
    control.insert(this.ELEMENT_DATA.length, this.initiateInvoiceForm());
    this.staticInvoiceDatasource = new MatTableDataSource(control.controls);
  }

  saveInvoice() {
    console.log("saved form: ", this.editInvoiceForm.get('invoiceRows')?.value);
    console.log("accounts form: ", this.editInvoiceAccountsForm.value);
  }

}