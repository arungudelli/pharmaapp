import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRoutingModule } from './item-routing.module';
import { AppMaterialModule } from '../app-material/app-material.module';
import { ItemListComponent } from './item-list/item-list.component';
import { EditItemComponent } from './edit-item/edit-item.component';


@NgModule({
  declarations: [
    ItemListComponent,
    EditItemComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    ItemRoutingModule
  ]
})

export class ItemListModule { }