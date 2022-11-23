import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from '../app-material/app-material.module';
import { DistributorRoutingModule } from './distributor-routing.module';
import { DistributorListComponent } from './distributor-list/distributor-list.component';


@NgModule({
  declarations: [
    DistributorListComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    DistributorRoutingModule
  ]
})

export class DistributorModule { }