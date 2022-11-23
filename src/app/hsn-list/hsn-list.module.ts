import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HsnListRoutingModule } from './hsn-list-routing.module';
import { HsnListComponent } from './hsn-list.component';
import { AppMaterialModule } from '../app-material/app-material.module';


@NgModule({
  declarations: [
    HsnListComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    HsnListRoutingModule
  ]
})
export class HsnListModule { }
