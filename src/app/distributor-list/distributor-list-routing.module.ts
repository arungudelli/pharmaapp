import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistributorListComponent } from './distributor-list.component';

const routes: Routes = [{ path: '', component: DistributorListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributorListRoutingModule { }
