import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillListComponent } from './bill-list/bill-list.component';
import { EditBillComponent } from './edit-bill/edit-bill.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { BillRoutingModule } from './bill-routing.module';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';



@NgModule({
  declarations: [
    BillListComponent,
    EditBillComponent,
    ViewBillComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    BillRoutingModule
  ]
})
export class BillModule { }
