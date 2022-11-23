import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from '../app-material/app-material.module';
import { HsnRoutingModule } from './hsn-routing.module';
import { HsnListComponent } from './hsn-list/hsn-list.component';

@NgModule({
  declarations: [
    HsnListComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    HsnRoutingModule
  ]
})

export class HsnModule { }