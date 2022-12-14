import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';

import { BillRows } from 'src/app/models/billRows';
import { Distributor } from 'src/app/models/distributor';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceItems } from 'src/app/models/invoiceItems';
import { Item } from 'src/app/models/item';
import { Patient } from 'src/app/models/patient';
import { PickDateAdapter } from 'src/app/models/pickDateAdapter';
import { DocGenBill } from 'src/app/pdfmake-docs/doc-gen-bill';
import { DistributorService } from 'src/app/services/distributor.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ItemService } from 'src/app/services/item.service';
import { PatientService } from 'src/app/services/patient.service';

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
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css'],
  // /*
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat }
  ]
  // */
})

export class EditBillComponent {
  patients: Patient[] = [];
  
  selectedPatient: Patient = {} as Patient;

  items: Item[] = [];

  filteredItemOptions?: Observable<string[]>;

  filteredDistributorOptions?: Observable<string[]>;

  ELEMENT_DATA: BillRows[] = [];

  selectedItems: Item[] = [];

  editBillForm = new FormGroup({
    billRows: new FormArray(this.ELEMENT_DATA.map(val => new FormGroup({
      id: new FormControl(val.id), 
      productName: new FormControl(val.productName),
      qty: new FormControl(val.qty), 
      batchNo: new FormControl(val.batchNo), 
      discount: new FormControl(val.discount), 
      mrp: new FormControl(val.mrp), 
      mfgDate: new FormControl(val.mfgDate), 
      expDate: new FormControl(val.expDate), 
    })))
  });

  editBillAccountsForm = new FormGroup({
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
          gstRate: new FormControl()
        }),
        manfacturer: new FormGroup({
          id: new FormControl(),
          name: new FormControl()
        })
      }),
      pack: new FormControl(), 
      batchNo: new FormControl(), 
      mfgDate: new FormControl(), 
      expDate: new FormControl(), 
      qty: new FormControl(), 
      freeItems: new FormControl(), 
      mrp: new FormControl(), 
      rate: new FormControl(), 
      discount: new FormControl(), 
    }),
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
    patient: new FormGroup({
      id: new FormControl(),
      primaryPatiendId: new FormControl(),
      patientName: new FormControl(),
      dateOfBirth: new FormControl(),
      gender: new FormControl(),
      emailId: new FormControl(),
      phoneNumber: new FormControl(),
      bloodGroup: new FormControl(),
      address: new FormControl(),
      location: new FormControl(),
      pinCode: new FormControl(),
    }),
    billNumber: new FormControl(),
    // billDate: new FormControl(new Date()),
    billDate: new FormControl(),
    amount: new FormControl(),
    totalDiscount: new FormControl(),
    actualAmount: new FormControl()
  });

  billDatasource = new MatTableDataSource((this.editBillForm.get('billRows') as FormArray).controls);
  
  selection = new SelectionModel<BillRows>(true, []);

  billColumns: string[] = ['select','id','productName','qty','batchNo','discount','mrp','mfgDate','expDate'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {bill: Invoice, billRows: BillRows[]}, public patientService: PatientService, public itemservice: ItemService, public invoiceService: InvoiceService, public distributorService: DistributorService, public itemsService: ItemService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editBillAccountsForm.controls.id.setValue(0);
    this.editBillAccountsForm.controls.billNumber.setValue('');
    // this.editBillAccountsForm.controls.billDate.setValue(new Date());
    this.editBillAccountsForm.controls.distributor.setValue({id:0,name:'',phoneNumber:0,email:'',dlno:'',pan:'',state:'',address:'',city:'',gstin:'',pinCode:''});
    this.editBillAccountsForm.controls.invoiceItems.setValue({id:0,item:{id:0,name:'',description:'',hsn:{id:0,hsnCode:'',description:'',gstRate:0},manfacturer:{id:0,name:''}},pack:'',batchNo:'',mfgDate:new Date(),expDate:new Date(),qty:0,freeItems:0,mrp:0,rate:0,discount:0});
    this.editBillAccountsForm.controls.patient.setValue({id:0,primaryPatiendId:0,patientName:'',dateOfBirth:'',gender:'',emailId:'',phoneNumber:0,bloodGroup:0,address:'',location:'',pinCode:''});
    this.editBillAccountsForm.controls.amount.setValue(0);
    this.editBillAccountsForm.controls.totalDiscount.setValue(0);
    this.editBillAccountsForm.controls.actualAmount.setValue(0);
    
    if(this.data) {
      this.data.bill.invoiceItems.map(x=>{this.selectedItems.push(x.item)});
      this.editBill();
    }
  }

  onSelectPatient() {
    this.patientService.getPatientByPhoneNumber(this.editBillAccountsForm.value.patient?.phoneNumber).subscribe(res => {
      this.selectedPatient = Object.values(res).at(0);
      this.editBillAccountsForm.controls.patient.setValue(this.selectedPatient as Patient);
    })
  }

  searchItems(e: any) {
    const searchTerm = e.target.value;
    if(searchTerm.length >= 3) {
      this.itemsService.getItemByName(searchTerm).subscribe(
        res => {
          this.items = res;
          this.filterSearchItems(res);
        }
      )
    }
  }

  filterSearchItems(res: Item[]) {
    this.filteredItemOptions = this.editBillAccountsForm.controls.invoiceItems.controls.item.valueChanges.pipe(
      startWith(''),
      map(term => {
        return res
          .map(option => option.name)
          .filter(option => option.toLowerCase().includes(term as string));
        },
      )
    )
  }

  onSelectItem(option: string, index: number) {
    console.log("option: ", option,"index: ", index);
    
    this.invoiceService.getInvoiceByItemId(index).subscribe(res => {
      console.log("selected invoice: ", res);
      
    })


    const item = this.items.filter(item => item.name === option)[0];
    const productName = this.items.filter(item => item.name === option)[0].name;
    console.log("on select item: ", item);
    

    this.selectedItems.push(item);

    this.editBillForm.controls.billRows.at(index).controls.productName.setValue(productName);

    if(this.data) {
      this.selectedItems.splice(index,1,item);
    }
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.billDatasource.data.length;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.billDatasource.data.map(item => Object(item).value));
  }

  /* The label for the checkbox on the passed row */
  checkboxLabel(row?: BillRows): string {
    if(!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }  

  initiateBillForm(): FormGroup {
    /* initialize a blank row */
    return new FormGroup({
      id: new FormControl(),
      productName: new FormControl(),
      qty: new FormControl(), 
      batchNo: new FormControl(), 
      discount: new FormControl(), 
      mrp: new FormControl(), 
      mfgDate: new FormControl(), 
      expDate: new FormControl(), 
    })
  }

  patchBillRows(x: BillRows): FormGroup {
    return new FormGroup({
      id: new FormControl(x.id),
      productName: new FormControl(x.productName),
      qty: new FormControl(x.qty), 
      batchNo: new FormControl(x.batchNo), 
      discount: new FormControl(x.discount), 
      mrp: new FormControl(x.mrp), 
      /*
      mfgDate: new FormControl(x.mfgDate), 
      expDate: new FormControl(x.expDate), 
      */
      // /*
      mfgDate: new FormControl(x.mfgDate.toString().split('T')[0]), 
      expDate: new FormControl(x.expDate.toString().split('T')[0]), 
      // */
    })
  }

  addNewRow() {
    const control = this.editBillForm.get('billRows') as FormArray;
    /* Add new blank row below the last filled row */
    control.push(this.initiateBillForm());
    this.billDatasource = new MatTableDataSource(control.controls);
  }

  removeRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.billDatasource.data.findIndex(d => d.value === item);
      this.billDatasource.data.splice(index, 1);
      this.billDatasource = new MatTableDataSource(this.billDatasource.data);
    });
    this.selection =  new SelectionModel<BillRows>(true, []);
  }

  createFinalObject() {
    /*
    let billRow: any[] = [];
    
    for (var i=0; i<this.editBillForm.controls.billRows.value.length; i++){
      billRow.push({
        id: this.editBillForm.controls.billRows.value[i].id,
        item: this.selectedItems[i],
        batchNo: this.editBillForm.controls.billRows.value[i].batchNo,
        mfgDate: this.editBillForm.controls.billRows.value[i].mfgDate+"T00:00:00",
        expDate: this.editBillForm.controls.billRows.value[i].expDate+"T00:00:00",
        qty: this.editBillForm.controls.billRows.value[i].qty as number,
        discount: this.editBillForm.controls.billRows.value[i].discount as number,
        mrp: this.editBillForm.controls.billRows.value[i].mrp as number,
      })
    }

    const finalObject = {
      id: this.editBillAccountsForm.value.id,
      invoiceNumber: this.editBillAccountsForm.value.invoiceNumber,
      invoiceDate: this.editBillAccountsForm.value.invoiceDate,
      distributor: this.editBillAccountsForm.value.distributor,
      patient: this.editBillAccountsForm.value.patient,
      invoiceItems: billRow as InvoiceItems[],
      amount: this.editBillAccountsForm.value.amount,
      totalDiscount: this.editBillAccountsForm.value.totalDiscount,
      actualAmount: this.editBillAccountsForm.value.actualAmount
    } as Invoice

    return finalObject;
    */
  }

  saveBill() {
    /*
    if(!this.data) {
      // set ids of invoiceItems to 0 to post to database
      this.createFinalObject().invoiceItems.map(x=>{x.id = 0});
      // this.invoiceService.saveInvoice(this.createFinalObject());
      console.log(this.createFinalObject());
    } else {
      // this.invoiceService.updateInvoice(this.createFinalObject().id, this.createFinalObject());
      console.log(this.createFinalObject().id, this.createFinalObject());
    }
    */
  }

  editBill() {
    /*
    this.editBillForm.controls.billRows.patchValue(this.data.billRows);

    this.editBillAccountsForm.patchValue({
      id: this.data.bill.id, 
      invoiceNumber: this.data.bill.invoiceNumber,
      invoiceDate: this.data.bill.invoiceDate,
      distributor: this.data.bill.distributor, 
      patient: this.data.bill.patient, 
      amount: this.data.bill.amount,
      totalDiscount: this.data.bill.totalDiscount,
      actualAmount: this.data.bill.actualAmount,
    })

    const control = this.editBillForm.get('billRows') as FormArray;
    // Add new blank row below the last filled row
    this.data.billRows.map(x=>(
      control.push(this.patchBillRows(x))
    ));
    this.billDatasource = new MatTableDataSource(control.controls);
    */
  }

  generatePDF() {
    DocGenBill(this.createFinalObject());
  }
}
