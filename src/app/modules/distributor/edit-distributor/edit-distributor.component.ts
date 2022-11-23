import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Distributor } from 'src/app/models/distributor';
import { DistributorService } from 'src/app/services/distributor.service';

@Component({
  selector: 'app-edit-distributor',
  templateUrl: './edit-distributor.component.html',
  styleUrls: ['./edit-distributor.component.css']
})

export class EditDistributorComponent {
  distributor!: Distributor;

  editDistributorForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required]),
    email:new FormControl('', [Validators.email]),
    phoneNumber: new FormControl(0, [Validators.required]),
    
    gstin: new FormControl('', [Validators.required]),
    pan: new FormControl(''),
    dlno: new FormControl(''),

    address : new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    pinCode: new FormControl('')
  });
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: {distributor: Distributor}, public distributorService: DistributorService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.editDistributorForm.controls.id.setValue(0);

    if(this.data) {
      this.editFormValue();
    }
  }

  editFormValue(){
    this.editDistributorForm.patchValue({
      id: this.data.distributor.id,
      name: this.data.distributor.name,
      email: this.data.distributor.email,
      phoneNumber: this.data.distributor.phoneNumber,
      gstin: this.data.distributor.gstin,
      address: this.data.distributor.address,
      city: this.data.distributor.city,
      state: this.data.distributor.state,
      pinCode: this.data.distributor.pinCode
    })
  }

  addDistributor(){
    if(!this.data) {
      this.distributorService.saveDistributor(this.editDistributorForm.value as Distributor);
    } else {
      this.distributorService.updateDistributor(this.editDistributorForm.value.id, this.editDistributorForm.value as Distributor);
    }
  }

  resetForm(){
    this.editDistributorForm.reset();
    this.dialog.closeAll();
  }
  
  closeDialog(){
    this.dialog.closeAll();
  }

}