import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

@NgModule({
  declarations: [
    EditInvoiceComponent,
    InvoiceListComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    InvoiceRoutingModule
  ]
})

export class InvoiceModule { }