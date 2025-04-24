import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministratorsComponent } from './administrators.component';
import { FuelStationsComponent } from './fuel-stations/fuel-stations.component';
import { ManageDriversComponent } from './manage-drivers/manage-drivers.component';

const routes: Routes = [
  {
    path: '',
    component: AdministratorsComponent,
    children: [
      { path: '', redirectTo: 'stations', pathMatch: 'full' },
      { path: 'stations', component: FuelStationsComponent },
      { path: 'stations/:customer', component: FuelStationsComponent },
      { path: 'drivers', component: ManageDriversComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministratorsRouting {}
