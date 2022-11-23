import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { DistributorRoutingModule } from './distributor-routing.module';
import { DistributorListComponent } from './distributor-list/distributor-list.component';
import { EditDistributorComponent } from './edit-distributor/edit-distributor.component';


@NgModule({
  declarations: [
    DistributorListComponent,
    EditDistributorComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    DistributorRoutingModule
  ]
})

export class DistributorModule { }