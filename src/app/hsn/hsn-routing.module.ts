import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HsnListComponent } from './hsn-list/hsn-list.component';

const routes: Routes = [
  { path: '', component: HsnListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HsnRoutingModule { }