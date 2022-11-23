import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'item-list', loadChildren: () => import('./modules/item/item.module').then(m => m.ItemModule) }, 
  { path: 'distributor-list', loadChildren: () => import('./modules/distributor/distributor.module').then(m => m.DistributorModule) },
  { path: 'hsn-list', loadChildren: () => import('./modules/hsn/hsn.module').then(m => m.HsnModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }