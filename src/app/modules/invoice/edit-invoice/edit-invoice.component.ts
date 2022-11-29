import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';

import { Distributor } from 'src/app/models/distributor';
import { Invoice } from 'src/app/models/invoice';
import { Item } from 'src/app/models/item';
import { PickDateAdapter } from 'src/app/models/pickDateAdapter';
import { StaticInvoiceItems } from 'src/app/models/staticInvoiceItems';
import { DistributorService } from 'src/app/services/distributor.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ItemService } from 'src/app/services/item.service';

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
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat }
  ]
})

export class EditInvoiceComponent {

  distributors: Distributor[] = [];
  
  items: Item[] = [];

  filteredItemOptions?: Observable<string[]>;

  filteredDistributorOptions?: Observable<string[]>;

  ELEMENT_DATA : StaticInvoiceItems[] = [];

  columnSchema = [
    { key: 'select', type: '', label: '' }, 
    { key: 'id', type: 'text', label: '#' }, 
    { key: 'name', type: 'text', label: 'Product Name' }, 
    { key: 'pack', type: 'text', label: 'Pack' }, 
    { key: 'batchNo', type: 'text', label: 'Batch No.' }, 
    { key: 'mfgDate', type: 'date', label: 'Manufacturing Date' }, 
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
      mfgDate: new FormControl(val.mfgDate), 
      expDate: new FormControl(val.expDate), 
      qty: new FormControl(val.qty), 
      freeItems: new FormControl(val.freeItems), 
      mrp: new FormControl(val.mrp), 
      rate: new FormControl(val.rate), 
      amount: new FormControl(val.amount), 

      /*
      items: new FormGroup({
        id: new FormControl(),
        name: new FormControl(),
        description: new FormControl(),
        hsn: new FormGroup({
          id: new FormControl(),
          hsnCode: new FormControl(),
          description: new FormControl(),
          gstRate: new FormControl()
        }),
        manfacturer: new FormGroup({
          id: new FormControl(),
          name: new FormControl()
        })
      }),
      */

      // /*
      gst: new FormControl(val.gst), 
      hsnCode: new FormControl(val.hsnCode),
      // */

      action: new FormControl('existingRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false)
    })))
  });

  editInvoiceAccountsForm = new FormGroup({
    // /*
    items: new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      description: new FormControl(),
      hsn: new FormGroup({
        id: new FormControl(),
        hsnCode: new FormControl(),
        description: new FormControl(),
        gstRate: new FormControl()
      }),
      manfacturer: new FormGroup({
        id: new FormControl(),
        name: new FormControl()
      })
    }),
    // */
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
    invoiceNo: new FormControl(''),
    invoiceDate: new FormControl(''),
    amount: new FormControl(0),
    totalDiscount: new FormControl(0),
    actualAmount: new FormControl(0)
  });

  invoiceDatasource = new MatTableDataSource((this.editInvoiceForm.get('invoiceRows') as FormArray).controls);
  
  selection = new SelectionModel<StaticInvoiceItems>(true, []);

  invoiceColumns: string[] = this.columnSchema.map(col => col.key);

  constructor(@Inject(MAT_DIALOG_DATA) public data: {invoice: Invoice}, public invoiceService: InvoiceService, public distributorService: DistributorService, public itemsService: ItemService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editInvoiceAccountsForm.controls.items.setValue({id:0,name:'',description:'',hsn:{id:0,hsnCode:'',description:'',gstRate:0},manfacturer:{id:0,name:''}});
    this.editInvoiceAccountsForm.controls.distributor.setValue({id:0,name:'',email:'',phoneNumber:0,gstin:'',pan:'',dlno:'',address:'',city:'',state:'',pinCode:''});

    this.getDistributorsList();
    this.getItemsList();
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
    
  getItemsList() {
    this.itemsService.getItems().subscribe(
      res => {
        // console.log('get invoices: ', res);
        this.items = res;
        this.filterSearchItems(res);
      } 
    )
  }

  filterSearchItems(res: Item[]) {
    // this.filteredItemOptions = this.editInvoiceAccountsForm.controls.items.valueChanges.pipe(
      // this.filteredItemOptions = this.editInvoiceForm.controls.invoiceRows.get('name')?.valueChanges.pipe(
      // this.filteredItemOptions = this.editInvoiceForm.get('invoiceRows')?.get('name')?.valueChanges.pipe(
      this.filteredItemOptions = this.editInvoiceForm.get('invoiceRows.name')?.valueChanges.pipe(
      startWith(''),
      map(term => {
        console.log(term, res);
        
        return res
          .map(option => option.name)
          .filter(option => option.toLowerCase().includes(term as string));
      },)
    )
  }

  onSelectItem(option: string) {
    const item = this.items.filter(item => item.name === option)[0];

    /*
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
    */
    console.log('selected item: ', item);
    
    this.editInvoiceAccountsForm.controls.items.setValue(item);
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
    const distributor = this.distributors.filter(item => item.name === option)[0];
    /*
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
    */
    console.log('selected distributor: ', distributor);
    
    this.editInvoiceAccountsForm.controls.distributor.setValue(distributor);
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.invoiceDatasource.data.length;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.invoiceDatasource.data.map(item => Object(item).value));
  }

  /* The label for the checkbox on the passed row */
  checkboxLabel(row?: StaticInvoiceItems): string {
    if(!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }  

  initiateInvoiceForm(): FormGroup {
    /* initialize a blank row */
    return new FormGroup({
      id: new FormControl(), 
      name: new FormControl(), 
      pack: new FormControl(), 
      batchNo: new FormControl(), 
      mfgDate: new FormControl(), 
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
    this.invoiceDatasource = new MatTableDataSource(control.controls);
  }

  removeRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.invoiceDatasource.data.findIndex(d => d.value === item);
      this.invoiceDatasource.data.splice(index, 1);
      this.invoiceDatasource = new MatTableDataSource(this.invoiceDatasource.data);
    });
    this.selection =  new SelectionModel<StaticInvoiceItems>(true, []);
  }

  saveInvoice() {
    console.log("saved form: ", this.editInvoiceForm.get('invoiceRows')?.value);
    /*
    saved form
    invoiceItems
    [
    {
        "id": null,
        "name": "1",
        "pack": "1",
        "batchNo": "1",
        "mfgDate": "2022-11-28T18:30:00.000Z",
        "expDate": "2022-11-28T18:30:00.000Z",
        "qty": "1",
        "freeItems": "1",
        "mrp": "1",
        "rate": "1",
        "amount": "1",
        "gst": "1",
        "hsnCode": "1",
        "action": "newRecord"
    }
    ]
    */

    console.log("accounts form: ", this.editInvoiceAccountsForm.value);
    /*
    accounts form
    {
    "distributor": distributor,
    "invoiceNo": "",
    "invoiceDate": "",
    "amount": "1",
    "totalDiscount": "1",
    "actualAmount": "1"
    }
    */

    /*
    to add
    items
    */
  }
   
}