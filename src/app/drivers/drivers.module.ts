import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbRatingModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AngularSplitModule } from 'angular-split';

import { SharedModule } from '../core/shared.module';
import { DriversRoutingModule } from './drivers.routing';
import { DriversComponent } from '../drivers/drivers.component';
import { FuelStationsComponentimplements } from './fuel-stations/fuel-stations.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  declarations: [
    DriversComponent,
    FuelStationsComponentimplements,
    InvoicesComponent,
    TransactionsComponent,
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    SharedModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbRatingModule,
    NgbNavModule,
    NgbModalModule,
    BsDatepickerModule,
    AngularSplitModule,
  ],
  providers: [CurrencyPipe],
})
export class DriversModule {}
