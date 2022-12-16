import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'bill-list', loadChildren: () => import('./modules/bill/bill.module').then(m => m.BillModule) }, 
  { path: 'item-list', loadChildren: () => import('./modules/item/item.module').then(m => m.ItemModule) }, 
  { path: 'distributor-list', loadChildren: () => import('./modules/distributor/distributor.module').then(m => m.DistributorModule) },
  { path: 'hsn-list', loadChildren: () => import('./modules/hsn/hsn.module').then(m => m.HsnModule) },
  { path: 'invoice-list', loadChildren: () => import('./modules/invoice/invoice.module').then(m => m.InvoiceModule) },
  { path: 'practice', loadChildren: () => import('./modules/practice-delete/practice-delete.module').then(m => m.PracticeDeleteModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }