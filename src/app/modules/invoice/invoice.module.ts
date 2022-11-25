import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { EditInvoiceStaticComponent } from './edit-invoice-static/edit-invoice-static.component';

@NgModule({
  declarations: [
    EditInvoiceComponent,
    InvoiceListComponent,
    EditInvoiceStaticComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    InvoiceRoutingModule
  ]
})

export class InvoiceModule { }