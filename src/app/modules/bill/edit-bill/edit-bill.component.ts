import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { Bill } from 'src/app/models/bill';
import { BillItems } from 'src/app/models/billItems';

import { BillRows } from 'src/app/models/billRows';
import { Invoice } from 'src/app/models/invoice';
import { Item } from 'src/app/models/item';
import { Patient } from 'src/app/models/patient';
import { PickDateAdapter } from 'src/app/models/pickDateAdapter';
import { DocGenBill } from 'src/app/pdfmake-docs/doc-gen-bill';
import { BillService } from 'src/app/services/bill.service';
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

  selectedInvoices: Invoice[] = [];

  selectedManufacturers: any[] = [];

  items: Item[] = [];

  filteredItemOptions?: Observable<string[]>;

  ELEMENT_DATA: BillRows[] = [];

  selectedItems: Item[] = [];

  editBillForm = new FormGroup({
    billRows: new FormArray(this.ELEMENT_DATA.map(val => new FormGroup({
      id: new FormControl(val.id), 
      productName: new FormControl(val.productName),
      invoiceItem: new FormControl(val.invoiceItem), 
      batchNo: new FormControl(val.batchNo), 
      mfgDate: new FormControl(val.mfgDate), 
      expDate: new FormControl(val.expDate), 
      qty: new FormControl(val.qty), 
      mrp: new FormControl(val.mrp), 
      discount: new FormControl(val.discount), 
      amount: new FormControl(val.amount)
    })))
  });

  editBillAccountsForm = new FormGroup({
    id: new FormControl(),
    billItems: new FormGroup({
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
      batchNo: new FormControl(), 
      mfgDate: new FormControl(), 
      expDate: new FormControl(), 
      qty: new FormControl(), 
      discount: new FormControl(), 
      mrp: new FormControl(), 
      amount: new FormControl(), 
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
    totalAmount: new FormControl(),
    totalDiscount: new FormControl(),
    discountedAmount: new FormControl()
  });

  billDatasource = new MatTableDataSource((this.editBillForm.get('billRows') as FormArray).controls);
  
  selection = new SelectionModel<BillRows>(true, []);

  billColumns: string[] = ['select','id','productName','batchNo','mfgDate','expDate','mrp','qty','discount','amount'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {bill: Bill, billRows: BillRows[]}, public patientService: PatientService, public itemservice: ItemService, public invoiceService: InvoiceService, public itemsService: ItemService, public billService: BillService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editBillAccountsForm.controls.id.setValue(0);
    this.editBillAccountsForm.controls.billNumber.setValue('');
    // this.editBillAccountsForm.controls.billDate.setValue(new Date());
    this.editBillAccountsForm.controls.billItems.setValue({id:0,item:{id:0,name:'',description:'',hsn:{id:0,hsnCode:'',description:'',gstRate:0},manfacturer:{id:0,name:''}},batchNo:'',mfgDate:new Date(),expDate:new Date(),qty:0,discount:0,mrp:0,amount:0});
    this.editBillAccountsForm.controls.patient.setValue({id:0,primaryPatiendId:0,patientName:'',dateOfBirth:'',gender:'',emailId:'',phoneNumber:0,bloodGroup:0,address:'',location:'',pinCode:''});
    this.editBillAccountsForm.controls.totalAmount.setValue(0);
    this.editBillAccountsForm.controls.totalDiscount.setValue(0);
    this.editBillAccountsForm.controls.discountedAmount.setValue(0);

    if(this.data) {
      this.data.bill.billItems.map(x=>{this.selectedItems.push(x.item)});
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
    this.filteredItemOptions = this.editBillAccountsForm.controls.billItems.controls.item.valueChanges.pipe(
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
    const itemId = this.items.filter(item => item.name === option)[0].id;
   
    this.invoiceService.getInvoiceByItemId(itemId).subscribe(res => {
      this.selectedInvoices = res as Invoice[];
      this.selectedInvoices.map(x=>x.invoiceItems.map(x=>x)).flat().map(x=>this.selectedManufacturers.push(x));
    })
  }

  onSelectBatchNo(index: number) {
    const id = this.editBillForm.controls.billRows.value.at(index)?.invoiceItem?.id;
    const batchNo = this.editBillForm.controls.billRows.value.at(index)?.invoiceItem?.batchNo;
    const mfgDate = this.editBillForm.controls.billRows.value.at(index)?.invoiceItem?.mfgDate;
    const expDate = this.editBillForm.controls.billRows.value.at(index)?.invoiceItem?.expDate;
    const mrp = this.editBillForm.controls.billRows.value.at(index)?.invoiceItem?.mrp;
    
    this.itemsService.getItemById(id as number).subscribe(res =>{
      // console.log(res);
      this.selectedItems.push(res);
      
      if(this.data) {
        this.selectedItems.splice(index,1,res);
      }
    });

    this.editBillForm.controls.billRows.controls.at(index)?.controls.batchNo.setValue(batchNo!);
    this.editBillForm.controls.billRows.controls.at(index)?.controls.mfgDate.setValue(mfgDate!.toString().split('T')[0] as unknown as Date);
    this.editBillForm.controls.billRows.controls.at(index)?.controls.expDate.setValue(expDate!.toString().split('T')[0] as unknown as Date);
    this.editBillForm.controls.billRows.controls.at(index)?.controls.mrp.setValue(mrp!);
  }
  
  calculateTotalAmount(index: number) {
    let mrp = this.editBillForm.controls.billRows.value.at(index)?.mrp as number;
    let qty = this.editBillForm.controls.billRows.value.at(index)?.qty as number;
    let discount = this.editBillForm.controls.billRows.value.at(index)?.discount as number;
    let amount = (mrp * qty) - discount;
    this.editBillForm.controls.billRows.controls.at(index)?.controls.amount.setValue(amount);
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
      invoiceItem: new FormControl(), 
      batchNo: new FormControl(), 
      mfgDate: new FormControl(), 
      expDate: new FormControl(), 
      qty: new FormControl(), 
      discount: new FormControl(), 
      mrp: new FormControl(), 
      amount: new FormControl(), 
    })
  }

  patchBillRows(x: BillRows): FormGroup {
    return new FormGroup({
      id: new FormControl(x.id),
      productName: new FormControl(x.productName),
      invoiceItem: new FormControl(x.invoiceItem), 
      batchNo: new FormControl(x.batchNo), 
      /*
      mfgDate: new FormControl(x.mfgDate), 
      expDate: new FormControl(x.expDate), 
      */
      // /*
      mfgDate: new FormControl(x.mfgDate.toString().split('T')[0]), 
      expDate: new FormControl(x.expDate.toString().split('T')[0]), 
      // */
      qty: new FormControl(x.qty), 
      discount: new FormControl(x.discount), 
      mrp: new FormControl(x.mrp), 
      amount: new FormControl(x.amount), 
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
    let billRows: any[] = [];
    
    for (var i=0; i<this.editBillForm.controls.billRows.value.length; i++){
      billRows.push({
        id: this.editBillForm.controls.billRows.value[i].id == null ? 0 :  this.editBillForm.controls.billRows.value[i].id,
        item: this.selectedItems[i],
        batchNo: this.editBillForm.controls.billRows.value[i].batchNo,
        mfgDate: new Date(this.editBillForm.controls.billRows.value[i].mfgDate!),
        expDate: new Date(this.editBillForm.controls.billRows.value[i].expDate!),
        qty: this.editBillForm.controls.billRows.value[i].qty as number,
        discount: this.editBillForm.controls.billRows.value[i].discount as number,
        mrp: this.editBillForm.controls.billRows.value[i].mrp as number,
        amount: this.editBillForm.controls.billRows.value[i].amount as number,
      })
    }

    const finalObject = {
      id: this.editBillAccountsForm.value.id == null ? 0 : this.editBillAccountsForm.value.id,
      billNumber: this.editBillAccountsForm.value.billNumber,
      billDate: this.editBillAccountsForm.value.billDate,
      patient: this.editBillAccountsForm.value.patient,
      billItems: billRows as BillItems[],
      totalAmount: this.editBillAccountsForm.value.totalAmount,
      totalDiscount: this.editBillAccountsForm.value.totalDiscount,
      discountedAmount: this.editBillAccountsForm.value.discountedAmount
    } as Bill

    return finalObject;
  }

  saveBill() {
    if(!this.data) {
      /* set ids of invoiceItems to 0 to post to database */
      // this.createFinalObject().billItems.map(x=>{x.id = 0});
      
      // console.log(this.createFinalObject());
      this.billService.saveBill(this.createFinalObject());
    } else {
      // this.invoiceService.updateInvoice(this.createFinalObject().id, this.createFinalObject());
      console.log(this.createFinalObject().id, this.createFinalObject());
    }
  }

  editBill() {
    this.editBillForm.controls.billRows.patchValue(this.data.billRows);

    this.editBillAccountsForm.patchValue({
      id: this.data.bill.id, 
      billNumber: this.data.bill.billNumber,
      billDate: this.data.bill.billDate,
      patient: this.data.bill.patient, 
      totalAmount: this.data.bill.totalAmount,
      totalDiscount: this.data.bill.totalDiscount,
      discountedAmount: this.data.bill.discountedAmount,
    })

    const control = this.editBillForm.get('billRows') as FormArray;
    /* Add new blank row below the last filled row */
    this.data.billRows.map(x=>(
      control.push(this.patchBillRows(x))
    ));
    this.billDatasource = new MatTableDataSource(control.controls);
  }

  generatePDF() {
    DocGenBill(this.createFinalObject());
  }
}
