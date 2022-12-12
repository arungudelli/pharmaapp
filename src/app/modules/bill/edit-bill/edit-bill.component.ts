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
import { PickDateAdapter } from 'src/app/models/pickDateAdapter';
import { DocGenBill } from 'src/app/pdfmake-docs/doc-gen-bill';
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
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat }
  ]
})

export class EditBillComponent {
  distributors: Distributor[] = [];
  
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
    invoiceNumber: new FormControl(''),
    // invoiceDate: new FormControl(new Date()),
    invoiceDate: new FormControl(),
    amount: new FormControl(),
    totalDiscount: new FormControl(),
    actualAmount: new FormControl()
  });

  billDatasource = new MatTableDataSource((this.editBillForm.get('billRows') as FormArray).controls);
  
  selection = new SelectionModel<BillRows>(true, []);

  billColumns: string[] = ['select','id','productName','qty','batchNo','discount','mrp','mfgDate','expDate'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {bill: Invoice, billRows: BillRows[]}, public invoiceService: InvoiceService, public distributorService: DistributorService, public itemsService: ItemService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editBillAccountsForm.controls.id.setValue(0);
    this.editBillAccountsForm.controls.invoiceNumber.setValue('');
    // this.editBillAccountsForm.controls.invoiceDate.setValue(new Date());
    this.editBillAccountsForm.controls.distributor.setValue({id:0,name:'',phoneNumber:0,email:'',dlno:'',pan:'',state:'',address:'',city:'',gstin:'',pinCode:''});
    this.editBillAccountsForm.controls.invoiceItems.setValue({id:0,item:{id:0,name:'',description:'',hsn:{id:0,hsnCode:'',description:'',gstRate:0},manfacturer:{id:0,name:''}},pack:'',batchNo:'',mfgDate:new Date(),expDate:new Date(),qty:0,freeItems:0,mrp:0,rate:0,discount:0});
    this.editBillAccountsForm.controls.amount.setValue(0);
    this.editBillAccountsForm.controls.totalDiscount.setValue(0);
    this.editBillAccountsForm.controls.actualAmount.setValue(0);
    
    this.getDistributorsList();

    if(this.data) {
      this.data.bill.invoiceItems.map(x=>{this.selectedItems.push(x.item)});
      this.editBill();
    }
  }

  getDistributorsList() {
    this.distributorService.getDistributors().subscribe(
      res => {
        this.distributors = res;
        this.filterSearchDistributors(res);
      }
    )
  }

  filterSearchDistributors(res: Distributor[]) {
    this.filteredDistributorOptions = this.editBillAccountsForm.controls.distributor.controls.name.valueChanges.pipe(
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
    this.editBillAccountsForm.controls.distributor.setValue(distributor);
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
    const item = this.items.filter(item => item.name === option)[0];
    const productName = this.items.filter(item => item.name === option)[0].name;

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
      mfgDate: new FormControl(x.mfgDate), 
      expDate: new FormControl(x.expDate), 
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
    let billRow: any[] = [];
    
    for (var i=0; i<this.editBillForm.controls.billRows.value.length; i++){
      billRow.push({
        id: this.editBillForm.controls.billRows.value[i].id,
        item: this.selectedItems[i],
        batchNo: this.editBillForm.controls.billRows.value[i].batchNo,
        mfgDate: this.editBillForm.controls.billRows.value[i].mfgDate,
        expDate: this.editBillForm.controls.billRows.value[i].expDate,
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
      invoiceItems: billRow as InvoiceItems[],
      amount: this.editBillAccountsForm.value.amount,
      totalDiscount: this.editBillAccountsForm.value.totalDiscount,
      actualAmount: this.editBillAccountsForm.value.actualAmount
    } as Invoice

    return finalObject;
  }

  saveBill() {
    if(!this.data) {
      /* set ids of invoiceItems to 0 to post to database */ 
      this.createFinalObject().invoiceItems.map(x=>{x.id = 0});
      this.invoiceService.saveInvoice(this.createFinalObject());
    } else {
      this.invoiceService.updateInvoice(this.createFinalObject().id, this.createFinalObject());
    }
  }

  editBill() {
    this.editBillForm.controls.billRows.patchValue(this.data.billRows);

    this.editBillAccountsForm.patchValue({
      id: this.data.bill.id, 
      invoiceNumber: this.data.bill.invoiceNumber,
      invoiceDate: this.data.bill.invoiceDate,
      distributor: this.data.bill.distributor, 
      amount: this.data.bill.amount,
      totalDiscount: this.data.bill.totalDiscount,
      actualAmount: this.data.bill.actualAmount,
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
