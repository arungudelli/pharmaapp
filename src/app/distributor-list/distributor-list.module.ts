import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributorListRoutingModule } from './distributor-list-routing.module';
import { DistributorListComponent } from './distributor-list.component';


@NgModule({
  declarations: [
    DistributorListComponent
  ],
  imports: [
    CommonModule,
    DistributorListRoutingModule
  ]
})
export class DistributorListModule { }
