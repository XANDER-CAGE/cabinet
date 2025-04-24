import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompaniesComponent } from './companies.component';
import { ManageDriversComponent } from './manage-drivers/manage-drivers.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
    children: [
      { path: '', redirectTo: 'drivers', pathMatch: 'full' },
      { path: 'drivers', component: ManageDriversComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'transactions', component: TransactionsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRouting {}
