import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemListRoutingModule } from './item-list-routing.module';
import { ItemListComponent } from './item-list.component';


@NgModule({
  declarations: [
    ItemListComponent
  ],
  imports: [
    CommonModule,
    ItemListRoutingModule
  ]
})
export class ItemListModule { }
