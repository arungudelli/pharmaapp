import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';

import { Distributor } from 'src/app/models/distributor';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceItems } from 'src/app/models/invoiceItems';
import { Item } from 'src/app/models/item';
import { PickDateAdapter } from 'src/app/models/pickDateAdapter';
import { InvoiceRows } from 'src/app/models/invoiceRows';
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

  ELEMENT_DATA: InvoiceRows[] = [];

  selectedItems: Item[] = [];

  editInvoiceForm = new FormGroup({
    invoiceRows: new FormArray(this.ELEMENT_DATA.map(val => new FormGroup({
      id: new FormControl(val.id), 
      productName: new FormControl(val.productName),
      pack: new FormControl(val.pack), 
      batchNo: new FormControl(val.batchNo), 
      mfgDate: new FormControl(val.mfgDate), 
      expDate: new FormControl(val.expDate), 
      qty: new FormControl(val.qty), 
      freeItems: new FormControl(val.freeItems), 
      mrp: new FormControl(val.mrp), 
      rate: new FormControl(val.rate), 
      discount: new FormControl(val.discount), 
      gstRate: new FormControl(val.gstRate),
      hsnCode: new FormControl(val.hsnCode),

      /*
      action: new FormControl('existingRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false)
      */
    })))
  });

  editInvoiceAccountsForm = new FormGroup({
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
    invoiceDate: new FormControl(new Date(Date.now())),
    amount: new FormControl(),
    totalDiscount: new FormControl(),
    actualAmount: new FormControl()
  });

  invoiceDatasource = new MatTableDataSource((this.editInvoiceForm.get('invoiceRows') as FormArray).controls);
  
  selection = new SelectionModel<InvoiceRows>(true, []);

  invoiceColumns: string[] = ['select','id','productName','pack','batchNo','mfgDate','expDate','qty','freeItems','mrp','rate','discount','gstRate','hsnCode'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {invoice: Invoice, invoiceRows: InvoiceRows[]}, public invoiceService: InvoiceService, public distributorService: DistributorService, public itemsService: ItemService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editInvoiceAccountsForm.controls.id.setValue(0);
    this.editInvoiceAccountsForm.controls.invoiceNumber.setValue('');
    this.editInvoiceAccountsForm.controls.invoiceDate.setValue(new Date());
    this.editInvoiceAccountsForm.controls.distributor.setValue({id:1,name:'',phoneNumber:0,email:'',dlno:'',pan:'',state:'',address:'',city:'',gstin:'',pinCode:''});
    this.editInvoiceAccountsForm.controls.invoiceItems.setValue({id:0,item:{id:0,name:'',description:'',hsn:{id:0,hsnCode:'',description:'',gstRate:0},manfacturer:{id:0,name:''}},pack:'',batchNo:'',mfgDate:new Date(),expDate:new Date(),qty:0,freeItems:0,mrp:0,rate:0,discount:0});
    this.editInvoiceAccountsForm.controls.amount.setValue(0);
    this.editInvoiceAccountsForm.controls.totalDiscount.setValue(0);
    this.editInvoiceAccountsForm.controls.actualAmount.setValue(0);
    
    // this.getItemsList();
    this.getDistributorsList();

    if(this.data) {
      this.data.invoice.invoiceItems.map(x=>{
        this.selectedItems.push(x.item);
      })
      // console.log(this.selectedItems);

      this.editInvoice();
    }
  }

  getDistributorsList() {
    this.distributorService.getDistributors().subscribe(
      res => {
        // console.log('get distributors: ', res);
        // console.log('get first distributor: ', res[0]);
        this.distributors = res;
        // this.filterSearchDistributors(res);
        this.editInvoiceAccountsForm.controls.distributor.setValue(res[0])
      }
    )
  }

  /*
  getItemsList() {
    this.itemsService.getItems().subscribe(
      res => {
        // console.log('get invoices: ', res);
        this.items = res;
        this.filterSearchItems(res);
      } 
    )
  }
  */

  searchItems(e: any) {
    const searchTerm = e.target.value;
    // console.log('search term: ', e.target.value);
    if(searchTerm.length >= 3) {
      this.itemsService.getItemByName(searchTerm).subscribe(
        res => {
          // console.log('get invoices: ', res);
          this.items = res;
          this.filterSearchItems(res);
        }
      )
    }
  }

  filterSearchItems(res: Item[]) {
    this.filteredItemOptions = this.editInvoiceAccountsForm.controls.invoiceItems.controls.item.valueChanges.pipe(
      startWith(''),
      map(term => {
        return res
          .map(option => option.name)
          .filter(option => option.toLowerCase().includes(term as string));
        },
      )
    )
    
  }

  /*
  filterSearchItems(res: Item[]) {
    this.filteredItemOptions = this.editInvoiceAccountsForm.controls.invoiceItems.controls.item.valueChanges.pipe(
      startWith(''),
      map(term => {
        return res
          .map(option => option.name)
          .filter(option => option.toLowerCase().includes(term as string));
        },
      )
    )
  }
  */

  onSelectItem(option: string, index: number) {
    const item = this.items.filter(item => item.name === option)[0];
    const productName = this.items.filter(item => item.name === option)[0].name;
    const gstRate = this.items.filter(item => item.name === option)[0].hsn.gstRate;
    const hsnCode = this.items.filter(item => item.name === option)[0].hsn.hsnCode;

    this.selectedItems.push(item);

    // console.log('index: ', index);
    
    this.editInvoiceForm.controls.invoiceRows.at(index).controls.productName.setValue(productName);
    this.editInvoiceForm.controls.invoiceRows.at(index).controls.gstRate.setValue(gstRate);
    this.editInvoiceForm.controls.invoiceRows.at(index).controls.hsnCode.setValue(hsnCode);
    // this.editInvoiceForm.controls.invoiceRows.at(this.indexNumber-1).controls.id.setValue(this.indexNumber);

    if(this.data) {
      this.selectedItems.splice(index,1,item);
    }
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
  checkboxLabel(row?: InvoiceRows): string {
    if(!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }  

  initiateInvoiceForm(): FormGroup {
    /* initialize a blank row */
    return new FormGroup({
      id: new FormControl(),
      productName: new FormControl(),
      pack: new FormControl(), 
      batchNo: new FormControl(), 
      mfgDate: new FormControl(), 
      expDate: new FormControl(), 
      qty: new FormControl(), 
      freeItems: new FormControl(), 
      mrp: new FormControl(), 
      rate: new FormControl(), 
      discount: new FormControl(), 
      gstRate: new FormControl(),
      hsnCode: new FormControl(),

      // action: new FormControl('newRecord')
    })
  }

  patchInvoiceRows(x: InvoiceRows): FormGroup {
    return new FormGroup({
      id: new FormControl(x.id),
      productName: new FormControl(x.productName),
      pack: new FormControl(x.pack), 
      batchNo: new FormControl(x.batchNo), 
      mfgDate: new FormControl(x.mfgDate), 
      expDate: new FormControl(x.expDate), 
      qty: new FormControl(x.qty), 
      freeItems: new FormControl(x.freeItems), 
      mrp: new FormControl(x.mrp), 
      rate: new FormControl(x.rate), 
      discount: new FormControl(x.discount), 
      gstRate: new FormControl(x.gstRate),
      hsnCode: new FormControl(x.hsnCode),

      // action: new FormControl('existingRecord')
    })
  }

  addNewRow() {
    const control = this.editInvoiceForm.get('invoiceRows') as FormArray;
    /* Add new blank row below the last filled row */
    // control.insert(this.ELEMENT_DATA.length, this.initiateInvoiceForm());
    control.push(this.initiateInvoiceForm());
    this.invoiceDatasource = new MatTableDataSource(control.controls);
  }

  removeRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.invoiceDatasource.data.findIndex(d => d.value === item);
      this.invoiceDatasource.data.splice(index, 1);
      this.invoiceDatasource = new MatTableDataSource(this.invoiceDatasource.data);
    });
    this.selection =  new SelectionModel<InvoiceRows>(true, []);
  }

  saveInvoice() {
    // console.log('invoice items: ', this.editInvoiceForm.controls.invoiceRows.value);

    let invoiceRow: any[] = [];
    
    for (var i=0; i<this.editInvoiceForm.controls.invoiceRows.value.length; i++){
      // invoiceRow.push({ ...this.editInvoiceForm.controls.invoiceRows.value[i], item: this.selectedItems[i] })
      invoiceRow.push({
        id: this.editInvoiceForm.controls.invoiceRows.value[i].id,
        item: this.selectedItems[i],
        pack: this.editInvoiceForm.controls.invoiceRows.value[i].pack,
        batchNo: this.editInvoiceForm.controls.invoiceRows.value[i].batchNo,
        mfgDate: this.editInvoiceForm.controls.invoiceRows.value[i].mfgDate,
        expDate: this.editInvoiceForm.controls.invoiceRows.value[i].expDate,
        qty: this.editInvoiceForm.controls.invoiceRows.value[i].qty as number,
        freeItems: this.editInvoiceForm.controls.invoiceRows.value[i].freeItems as number,
        discount: this.editInvoiceForm.controls.invoiceRows.value[i].discount as number,
        mrp: this.editInvoiceForm.controls.invoiceRows.value[i].mrp as number,
        rate: this.editInvoiceForm.controls.invoiceRows.value[i].rate as number,

        /*
        action: this.editInvoiceForm.controls.invoiceRows.value[i].action,
        isEditable: this.editInvoiceForm.controls.invoiceRows.value[i].isEditable,
        isNewRow: this.editInvoiceForm.controls.invoiceRows.value[i].isNewRow
        */
        // action: new FormControl('existingRecord'),
        // isEditable: new FormControl(true),
        // isNewRow: new FormControl(false)
      })
    }

    const finalObject = {
      id: this.editInvoiceAccountsForm.value.id,
      invoiceNumber: this.editInvoiceAccountsForm.value.invoiceNumber,
      invoiceDate: this.editInvoiceAccountsForm.value.invoiceDate,
      distributor: this.editInvoiceAccountsForm.value.distributor,
      invoiceItems: invoiceRow as InvoiceItems[],
      amount: this.editInvoiceAccountsForm.value.amount,
      totalDiscount: this.editInvoiceAccountsForm.value.totalDiscount,
      actualAmount: this.editInvoiceAccountsForm.value.actualAmount
    } as Invoice

    if(!this.data) {
      finalObject.invoiceItems.map(x=>{x.id = 0});
      this.invoiceService.saveInvoice(finalObject);
    } else {
      // finalObject.invoiceItems.map(x=>{
      //   if(!x.item) {
          // console.log('items: ', x.item);

      //   }
      // })
      this.invoiceService.updateInvoice(finalObject.id, finalObject);
    }
  }

  editInvoice() {
    this.editInvoiceForm.controls.invoiceRows.patchValue(this.data.invoiceRows);

    this.editInvoiceAccountsForm.patchValue({
      id: this.data.invoice.id, 
      invoiceNumber: this.data.invoice.invoiceNumber,
      invoiceDate: this.data.invoice.invoiceDate,
      distributor: this.data.invoice.distributor, 
      // invoiceItems: this.data.invoice.invoiceItems,
      amount: this.data.invoice.amount,
      totalDiscount: this.data.invoice.totalDiscount,
      actualAmount: this.data.invoice.actualAmount,
    })

    const control = this.editInvoiceForm.get('invoiceRows') as FormArray;
    /* Add new blank row below the last filled row */
    this.data.invoiceRows.map(x=>(
      control.push(this.patchInvoiceRows(x))
    ));
    this.invoiceDatasource = new MatTableDataSource(control.controls);
  }

} 