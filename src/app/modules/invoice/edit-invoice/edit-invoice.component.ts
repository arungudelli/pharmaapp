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

  indexNumber: number = 0;

  selectedItems: Item[] = [];

  /*
  columnSchema = [
    { key: 'select', type: '', label: '' }, 
    { key: 'id', type: 'text', label: '#' }, 
    { key: 'productName', type: 'text', label: 'Product Name' }, 
    { key: 'pack', type: 'text', label: 'Pack' }, 
    { key: 'batchNo', type: 'text', label: 'Batch No.' }, 
    { key: 'mfgDate', type: 'date', label: 'Manufacturing Date' }, 
    { key: 'expDate', type: 'date', label: 'Expiry Date' }, 
    { key: 'qty', type: 'number', label: 'Qty' }, 
    { key: 'freeItems', type: 'number', label: 'Free' }, 
    { key: 'mrp', type: 'number', label: 'MRP' }, 
    { key: 'rate', type: 'number', label: 'Rate' }, 
    { key: 'discount', type: 'number', label: 'Discount' }, 
    { key: 'gstRate', type: 'number', label: 'GST %' }, 
    { key: 'hsnCode', type: 'text', label: 'HSN Code' },
  ];
  */

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

      action: new FormControl('existingRecord'),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false)
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

  // invoiceColumns: string[] = this.columnSchema.map(col => col.key);
  invoiceColumns: string[] = ['select','productName','pack','batchNo','mfgDate','expDate','qty','freeItems','mrp','rate','discount','gstRate','hsnCode'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {invoice: Invoice}, public invoiceService: InvoiceService, public distributorService: DistributorService, public itemsService: ItemService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editInvoiceAccountsForm.controls.id.setValue(0);
    this.editInvoiceAccountsForm.controls.invoiceNumber.setValue('');
    this.editInvoiceAccountsForm.controls.invoiceDate.setValue(new Date());
    this.editInvoiceAccountsForm.controls.distributor.setValue({id:1,name:'',phoneNumber:0,email:'',dlno:'',pan:'',state:'',address:'',city:'',gstin:'',pinCode:''});
    this.editInvoiceAccountsForm.controls.invoiceItems.setValue({id:0,item:{id:0,name:'',description:'',hsn:{id:0,hsnCode:'',description:'',gstRate:0},manfacturer:{id:0,name:''}},pack:'',batchNo:'',mfgDate:new Date(),expDate:new Date(),qty:0,freeItems:0,mrp:0,rate:0,discount:0});
    this.editInvoiceAccountsForm.controls.amount.setValue(0);
    this.editInvoiceAccountsForm.controls.totalDiscount.setValue(0);
    this.editInvoiceAccountsForm.controls.actualAmount.setValue(0);
    
    this.getItemsList();
    this.getDistributorsList();
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

  onSelectItem(option: string) {
    const item = this.items.filter(item => item.name === option)[0];
    const productName = this.items.filter(item => item.name === option)[0].name;
    const gstRate = this.items.filter(item => item.name === option)[0].hsn.gstRate;
    const hsnCode = this.items.filter(item => item.name === option)[0].hsn.hsnCode;

    this.selectedItems.push(item);

    /*
    this.editInvoiceForm.controls.invoiceRows.at(0).controls.productName.setValue(productName);
    this.editInvoiceForm.controls.invoiceRows.at(0).controls.gstRate.setValue(gstRate);
    this.editInvoiceForm.controls.invoiceRows.at(0).controls.hsnCode.setValue(hsnCode);
    this.editInvoiceForm.controls.invoiceRows.at(0).controls.id.setValue(this.indexNumber);
    */

    // /*
    console.log('index: ', this.indexNumber);
    this.editInvoiceForm.controls.invoiceRows.at(this.indexNumber-1).controls.productName.setValue(productName);
    this.editInvoiceForm.controls.invoiceRows.at(this.indexNumber-1).controls.gstRate.setValue(gstRate);
    this.editInvoiceForm.controls.invoiceRows.at(this.indexNumber-1).controls.hsnCode.setValue(hsnCode);
    // this.editInvoiceForm.controls.invoiceRows.at(this.indexNumber-1).controls.id.setValue(this.indexNumber);
    // */
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

      action: new FormControl('newRecord')
    })
  }

  addNewRow() {
    const control = this.editInvoiceForm.get('invoiceRows') as FormArray;
    /* Add new blank row below the last filled row */
    // control.insert(this.ELEMENT_DATA.length, this.initiateInvoiceForm());
    control.push(this.initiateInvoiceForm());
    this.invoiceDatasource = new MatTableDataSource(control.controls);
    // console.log('length: ', control.length);
    this.indexNumber = control.length;
  }

  removeRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.invoiceDatasource.data.findIndex(d => d.value === item);
      this.invoiceDatasource.data.splice(index, 1);
      this.invoiceDatasource = new MatTableDataSource(this.invoiceDatasource.data);
    });
    // this.selection =  new SelectionModel<InvoiceItems>(true, []);
    this.selection =  new SelectionModel<InvoiceRows>(true, []);
  }

  saveInvoice() {

    console.log('invoice items: ', this.editInvoiceForm.controls.invoiceRows.value);
    
    let invoiceRow: any[] = [];

    for (var i=0; i<this.editInvoiceForm.controls.invoiceRows.value.length; i++){
      // invoiceRow.push({ ...this.editInvoiceForm.controls.invoiceRows.value[i], item: this.selectedItems[i] })

      invoiceRow.push({
        id: 0,
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

    console.log('final object: ', finalObject);

    this.invoiceService.saveInvoice(finalObject);
  }

  editInvoice() {
    /*
    this.editInvoiceForm.controls.invoiceRows.at(0).patchValue({
      productName: this.data.invoice.invoiceItems.at(0)?.item.name,
      pack: this.data.invoice.invoiceItems.at(0)?.pack,
      batchNo: this.data.invoice.invoiceItems.at(0)?.batchNo, 
      mfgDate: this.data.invoice.invoiceItems.at(0)?.mfgDate, 
      expDate: this.data.invoice.invoiceItems.at(0)?.expDate, 
      qty: this.data.invoice.invoiceItems.at(0)?.qty, 
      freeItems: this.data.invoice.invoiceItems.at(0)?.freeItems, 
      mrp: this.data.invoice.invoiceItems.at(0)?.mrp, 
      rate: this.data.invoice.invoiceItems.at(0)?.rate, 
      discount: this.data.invoice.invoiceItems.at(0)?.discount, 
      gstRate: this.data.invoice.invoiceItems.at(0)?.item.hsn.gstRate,
      hsnCode: this.data.invoice.invoiceItems.at(0)?.item.hsn.hsnCode,
    })
    */

    this.editInvoiceForm.controls.invoiceRows.controls.map(x=>x.patchValue({
      productName: this.data.invoice.invoiceItems.at(0)?.item.name,
      pack: this.data.invoice.invoiceItems.at(0)?.pack,
      batchNo: this.data.invoice.invoiceItems.at(0)?.batchNo, 
      mfgDate: this.data.invoice.invoiceItems.at(0)?.mfgDate, 
      expDate: this.data.invoice.invoiceItems.at(0)?.expDate, 
      qty: this.data.invoice.invoiceItems.at(0)?.qty, 
      freeItems: this.data.invoice.invoiceItems.at(0)?.freeItems, 
      mrp: this.data.invoice.invoiceItems.at(0)?.mrp, 
      rate: this.data.invoice.invoiceItems.at(0)?.rate, 
      discount: this.data.invoice.invoiceItems.at(0)?.discount, 
      gstRate: this.data.invoice.invoiceItems.at(0)?.item.hsn.gstRate,
      hsnCode: this.data.invoice.invoiceItems.at(0)?.item.hsn.hsnCode,
    }))
    
    this.editInvoiceAccountsForm.patchValue({
      id: this.data.invoice.id, 
      invoiceNumber: this.data.invoice.invoiceNumber,
      invoiceDate: this.data.invoice.invoiceDate,
      // invoiceItems: this.data.invoice.invoiceItems,
      invoiceItems: {
        item: {
          id: this.data.invoice.invoiceItems.at(0)?.item.id,
          name: this.data.invoice.invoiceItems.at(0)?.item.name,
          description: this.data.invoice.invoiceItems.at(0)?.item.description,
          hsn: this.data.invoice.invoiceItems.at(0)?.item.hsn,
          manfacturer: this.data.invoice.invoiceItems.at(0)?.item.manfacturer,
        }
      },
      distributor: this.data.invoice.distributor, 
      amount: this.data.invoice.amount,
      totalDiscount: this.data.invoice.totalDiscount,
      actualAmount: this.data.invoice.actualAmount,
    })
  }
   
} 