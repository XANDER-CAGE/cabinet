import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbPaginationModule, NgbRatingModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CompaniesRouting } from './companies.routing';
import { CompaniesComponent } from '../companies/companies.component';
import { SharedModule } from '../core/shared.module';
import { ManageDriversComponent } from './manage-drivers/manage-drivers.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { InvoicesComponent } from './invoices/invoices.component';

@NgModule({
  declarations: [
    CompaniesComponent,
    ManageDriversComponent,
    TransactionsComponent,
    InvoicesComponent
  ],
  imports: [
    CommonModule,
    CompaniesRouting,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTooltip,
    ReactiveFormsModule,
    NgbRatingModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule
  ]
})
export class CompaniesModule { }
