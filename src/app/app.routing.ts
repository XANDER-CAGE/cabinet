import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { SystemRoles } from './core/enums/system-roles';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: 'administrators',
    loadChildren: () =>
      import('./administrators/administrators.module').then(
        (m) => m.AdministratorsModule
      ),
    canActivate: [AuthGuard],
    data: {
      roles: [SystemRoles.Administrator],
    },
  },
  {
    path: 'drivers',
    loadChildren: () =>
      import('./drivers/drivers.module').then((m) => m.DriversModule),
    canActivate: [AuthGuard],
    data: {
      roles: [SystemRoles.Driver, SystemRoles.Company],
    },
  },
  {
    path: 'companies',
    loadChildren: () =>
      import('./companies/companies.module').then((m) => m.CompaniesModule),
    canActivate: [AuthGuard],
    data: {
      roles: [SystemRoles.Company],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouting {}
