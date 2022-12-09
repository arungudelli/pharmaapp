import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

@NgModule({
  declarations: [
    EditInvoiceComponent,
    InvoiceListComponent,
    ViewInvoiceComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    InvoiceRoutingModule
  ]
})

export class InvoiceModule { }