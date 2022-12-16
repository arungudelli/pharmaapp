import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexboxComponent } from './flexbox/flexbox.component';
import { AppMaterialModule } from 'src/app/app-material/app-material.module';
import { PracticeDeleteRoutingModule } from './practice-delete-routing.module';

@NgModule({
  declarations: [
    FlexboxComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    PracticeDeleteRoutingModule
  ]
})

export class PracticeDeleteModule { }