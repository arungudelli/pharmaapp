import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { GstRate } from 'src/app/enums/gst-rate';
import { Hsn } from 'src/app/models/hsn';
import { Item } from 'src/app/models/item';
import { Manufacturer } from 'src/app/models/manufacturer';
import { HsnService } from 'src/app/services/hsn.service';
import { ItemService } from 'src/app/services/item.service';
import { ManufacturerService } from 'src/app/services/manufacturer.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})

export class EditItemComponent {
  hsnCodes: Hsn[] = [];

  manufacturers: Manufacturer[] = [];

  GstRate = GstRate;

  filteredOptionsHsnCode!: Observable<any[]>;
  
  filteredOptionsManufacturer!: Observable<any[]>;

  editItemForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    hsn: new FormGroup({
      id: new FormControl(),
      hsnCode: new FormControl(''),
      description: new FormControl(''),
      gstRate: new FormControl(0, [Validators.required]),
    }),
    manfacturer: new FormGroup({
      id: new FormControl(),
      name: new FormControl('')
    })
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: {item: Item}, public itemService: ItemService, public hsnService: HsnService, public manufacturerService: ManufacturerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editItemForm.controls.id.setValue(0);
    this.editItemForm.controls.hsn.setValue({id:0,hsnCode:'',description:'',gstRate:0});
    this.editItemForm.controls.manfacturer.setValue({id:0,name:''});

    this.getHsnList();
    this.getManufacturersList();    
    
    if(this.data) {
      this.editFormValue();
    }
  }

  getHsnList() {
    this.hsnService.getHsnList().subscribe(
      res => {
        // console.log(res);
        this.hsnCodes = res;
        this.filterSearchHsn(res);
      },
      err => console.log(err),
      () => console.log("completed")            
    )
  } 

  getManufacturersList() {
    this.manufacturerService.getManufacturers().subscribe(
      res => {
        // console.log(res);
        this.manufacturers = res;
        this.filterSearchManufacturers(res);
      },
      err => console.log(err),
      () => console.log("complete")
    )
  }

  filterSearchHsn(res: Hsn[]) {
    this.filteredOptionsHsnCode = this.editItemForm.controls.hsn.controls.hsnCode.valueChanges.pipe(
      startWith(''),
      map(term => { 
        return res
          .map(option => option.hsnCode)
          .filter(option => option.toString().toLowerCase().includes(term as string));
      },)
    );
  }

  filterSearchManufacturers(res: Manufacturer[]) {
    this.filteredOptionsManufacturer = this.editItemForm.controls.manfacturer.controls.name.valueChanges.pipe(
      startWith(''),
      map(term => { 
        return res
          .map(option => option.name)
          .filter(option => option.toLowerCase().includes(term as string));
      },)
    );
  }
        
  onSelectHsnCode(option: string) {
    const id = this.hsnCodes.filter(item => item.hsnCode === option)[0].id;
    const description = this.hsnCodes.filter(item => item.hsnCode === option)[0].description;
    const gstRate = this.hsnCodes.filter(item => item.hsnCode === option)[0].gstRate;

    this.editItemForm.controls.hsn.setValue({
      id: id,
      hsnCode: option,
      description,
      gstRate: gstRate
    });
  }

  onSelectManufacturer(option: string) {
    const id = this.manufacturers.filter(item => item.name === option)[0].id;
    const manufacturer = this.manufacturers.filter(item => item.name === option)[0].name;
  
    this.editItemForm.controls.manfacturer.setValue({
      id: id,
      name: manufacturer
    });
  }

  editFormValue() {
    this.editItemForm.patchValue({
      id: this.data.item.id,
      name: this.data.item.name,
      description: this.data.item.description,
      hsn: {
        id: this.data.item.hsn.id,
        hsnCode: this.data.item.hsn.hsnCode,
        description: this.data.item.hsn.description,
        gstRate: this.data.item.hsn.gstRate
      },
      manfacturer: {
        id: this.data.item.manfacturer.id,
        name: this.data.item.manfacturer.name
      }
    })
  }

  savePopupItem() {
    if(!this.data) {
      this.itemService.saveItem(this.editItemForm.value as Item);
    } else {
      this.itemService.updateItem(this.editItemForm.value.id, this.editItemForm.value as Item);
    };
  }

  resetForm() {
    this.editItemForm.reset();
    this.dialog.closeAll();
  }
}