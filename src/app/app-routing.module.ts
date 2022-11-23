import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'item-list', loadChildren: () => import('./item-list/item-list.module').then(m => m.ItemListModule) }, 
  { path: 'distributor-list', loadChildren: () => import('./distributor-list/distributor-list.module').then(m => m.DistributorListModule) },
  { path: 'hsn-list', loadChildren: () => import('./hsn-list/hsn-list.module').then(m => m.HsnListModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
