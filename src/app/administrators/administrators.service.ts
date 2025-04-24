import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AdministratorsService {
  constructor(private http: HttpService) {}

  stations(
    customerId: number,
    searchTerm: string,
    pageNumber: number
  ): Observable<any> {
    return this.http.get(`api/Admin/Stations/${customerId}`, {
      pageNumber: `${pageNumber}`,
      searchTerm: searchTerm,
    });
  }

  updateStation(stationId: number, model: any): Observable<any> {
    return this.http.put(`api/Admin/UpdateStation/${stationId}`, model);
  }

  addStation(model: any): Observable<any> {
    return this.http.post(`api/Admin/AddStation`, model);
  }

  customers(): Observable<any> {
    return this.http.get(`api/Admin/Customers`);
  }

  states(): Observable<any> {
    return this.http.get(`api/Common/States`);
  }

  cities(stateId: string): Observable<any> {
    return this.http.get(`api/Common/Cities?state=${stateId}`);
  }

  discounts(stationId: number): Observable<any> {
    return this.http.get(`api/Admin/StationDiscounts/${stationId}`);
  }

  applyDiscount(customerId: number, discountPrice: number): Observable<any> {
    return this.http.post(`api/Admin/CustomerDiscount/${customerId}`, {
      discount: discountPrice,
    });
  }

  revertDiscounts(customerId: number): Observable<any> {
    return this.http.put(`api/Admin/RevertDiscounts/${customerId}`);
  }

  files(customerId: number): Observable<any> {
    return this.http.get(`api/Admin/ImportedFiles/${customerId}`);
  }

  confirmFeedback(id: number): Observable<any> {
    return this.http.put(`api/Admin/ConfirmFeedback/${id}`);
  }

  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`api/Admin/DeleteFeedback/${id}`);
  }

  driverList(
    searchTerm: string,
    pageNumber: number,
    fromDate: string,
    toDate: string
  ): Observable<any> {
    return this.http.get(`api/Admin/Drivers`, {
      pageNumber: `${pageNumber}`,
      searchTerm: searchTerm,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  driverDelete(id: string): Observable<any> {
    return this.http.delete(`api/Admin/DriverDelete/${id}`);
  }

  driverConfirm(id: string): Observable<any> {
    return this.http.put(`api/Admin/DriverConfirm/${id}`);
  }

  driverSettings(driverId: string, model: any): Observable<any> {
    return this.http.post(`api/Admin/DriverSettings/${driverId}`, model);
  }

  driverToCompany(driverId: string): Observable<any> {
    return this.http.put(`api/Admin/DriverToCompany/${driverId}`);
  }

  companyToDriver(companyId: string): Observable<any> {
    return this.http.put(`api/Admin/CompanyToDriver/${companyId}`);
  }

  getOrganizations(): Observable<any> {
    return this.http.get(`api/Admin/Organizations`);
  }

  efsAccounts(organizationId: number): Observable<any> {
    return this.http.get(`api/Admin/EfsAccounts/${organizationId}`);
  }

  filterCompanies(organizationId: number, efsAccount: number): Observable<any> {
    return this.http.get(
      `api/Admin/FilterCompanies/${organizationId}?efsAccount=${efsAccount}`
    );
  }

  driverCards(companyId: number): Observable<any> {
    return this.http.get(`api/Admin/DriverCards/${companyId}`);
  }

  resetSettings(driverId: string): Observable<any> {
    return this.http.put(`api/Admin/ResetSettings/${driverId}`);
  }

  downloadActiviy(
    fully: boolean,
    fromDate: string,
    toDate: string
  ): Observable<Blob> {
    return this.http.download(
      `api/Admin/DriverActivity?fully=${fully}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  changePassword(driverId: string, model: any): Observable<any> {
    return this.http.post(`api/Admin/DriverPassword/${driverId}`, model);
  }
}
