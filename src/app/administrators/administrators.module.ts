import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbRatingModule,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AdministratorsRouting } from './administrators.routing';
import { AdministratorsComponent } from '../administrators/administrators.component';
import { FuelStationsComponent } from './fuel-stations/fuel-stations.component';
import { DiscountFilesComponent } from './fuel-stations/discount-files/discount-files.component';
import { FuelDiscountsComponent } from './fuel-stations/fuel-discounts/fuel-discounts.component';
import { SharedModule } from '../core/shared.module';
import { UpdateStationComponent } from './fuel-stations/update-station/update-station.component';
import { ManageDriversComponent } from './manage-drivers/manage-drivers.component';
import { AddStationComponent } from './fuel-stations/add-station/add-station.component';

@NgModule({
  declarations: [
    AdministratorsComponent,
    FuelStationsComponent,
    DiscountFilesComponent,
    FuelDiscountsComponent,
    UpdateStationComponent,
    AddStationComponent,
    ManageDriversComponent,
  ],
  imports: [
    CommonModule,
    AdministratorsRouting,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTooltip,
    ReactiveFormsModule,
    NgbRatingModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule,
  ],
})
export class AdministratorsModule {}
