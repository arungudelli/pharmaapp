import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
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

export class EditInvoiceStaticComponent implements OnInit, AfterViewInit {
  
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  
  columnSchema = [
    { key: 'id', type: 'text', label: '#', sortDescription: 'Sort by id' }, 
    { key: 'name', type: 'text', label: 'Product Name', sortDescription: 'Sort by name' }, 
    { key: 'pack', type: 'text', label: 'Pack', sortDescription: 'Sort by pack' }, 
    { key: 'batchNo', type: 'text', label: 'Batch No.', sortDescription: 'Sort by batchNo' }, 
    { key: 'expDate', type: 'date', label: 'Expiry Date', sortDescription: 'Sort by expDate' }, 
    { key: 'qty', type: 'number', label: 'Qty', sortDescription: 'Sort by qty' }, 
    { key: 'freeItems', type: 'number', label: 'Free', sortDescription: 'Sort by freeItems' }, 
    { key: 'mrp', type: 'number', label: 'MRP', sortDescription: 'Sort by mrp' }, 
    { key: 'rate', type: 'number', label: 'Rate', sortDescription: 'Sort by rate' }, 
    { key: 'amount', type: 'number', label: 'Amount', sortDescription: 'Sort by amount' }, 
    { key: 'gst', type: 'number', label: 'GST %', sortDescription: 'Sort by gst' }, 
    { key: 'hsnCode', type: 'text', label: 'HSN Code', sortDescription: 'Sort by hsnCode' },
  ];

  staticinvoiceColumns: string[] = this.columnSchema.map(col => col.key).concat('action');

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

  staticInvoiceDatasource = new MatTableDataSource((this.editInvoiceForm.get('invoiceRows') as FormArray).controls);
  
  constructor(public dialog: MatDialog, private distributorService: DistributorService/*, private _liveAnouncer: LiveAnnouncer*/) { }
  
  ngOnInit(): void {
    /*
    this.staticInvoiceDatasource.sortingDataAccessor = (data: AbstractControl, sorterHeaderId: string) => {
      const value: any = data.value[sorterHeaderId];
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
    */

    /*
    const filterPredicate = this.staticInvoiceDatasource.filterPredicate;
    this.staticInvoiceDatasource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.staticInvoiceDatasource, data.value, filter);
    };
    */
  }
  
  ngAfterViewInit(): void {
    this.staticInvoiceDatasource.paginator = this.paginator;
    // this.staticInvoiceDatasource.sort = this.sort;
  }

  /*
  applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.staticInvoiceDatasource.filter = filterValue.trim().toLowerCase();

    if(this.staticInvoiceDatasource.paginator) {
      this.staticInvoiceDatasource.paginator.firstPage();
    }
  }
  */
  
  /*
  announceSortChange(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnouncer.announce('Sorting cleared');
    }
  }
  */

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
  }

}