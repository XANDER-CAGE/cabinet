import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  constructor(private http: HttpService) {}

  customers(): Observable<any> {
    return this.http.get(`api/Company/Customers`);
  }

  driverList(searchTerm: string): Observable<any> {
    return this.http.get(`api/Company/Drivers`, {
      searchTerm: searchTerm,
    });
  }

  driverCards(isActive: boolean | null = null): Observable<any> {
    return this.http.get(`api/Company/DriverCards?isActive=${isActive}`);
  }

  driverSettings(driverId: string, model: any): Observable<any> {
    return this.http.post(`api/Company/DriverSettings/${driverId}`, model);
  }

  getTransactions(pageSize:number, pageNumber:number,cardNumber: string,fromDate: string, toDate: string): Observable<any> {
    return this.http.get(
      `api/Company/web/FilterTransactions?cardNumber=${cardNumber||''}&pageSize=${pageSize}&pageNumber=${pageNumber}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  getInvoices(pageSize:number, pageNumber:number, cardNumber: string, fromDate: string, toDate: string): Observable<any> {
    return this.http.get(`api/Company/web/FilterInvoices?cardNumber=${cardNumber||''}&pageSize=${pageSize}&pageNumber=${pageNumber}&fromDate=${fromDate}&toDate=${toDate}`);
  }

  printInvoices(cardNumber: string, fromDate: string, toDate: string): Observable<any> {
    return this.http.download(`api/Company/PrintInvoices?cardNumber=${cardNumber||''}&fromDate=${fromDate}&toDate=${toDate}`);
  }
}
