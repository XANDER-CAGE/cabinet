import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { HttpService } from '../core/services/http.service';
import { LocationAddress, MapsLocation } from '../core/dtos/database-schema';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  constructor(private http: HttpService) {}

  customers(): Observable<any> {
    return this.http.get(`api/Driver/Customers`);
  }

  filterStations(customerIds: number[]): Observable<any> {
    return this.http.post(`api/Driver/web/TrackStations`, {
      customerIds: customerIds,
    });
  }

  calculateStops(
    locations: LocationAddress[],
    distance: number,
    customerIds: number[]
  ): Observable<any> {
    return this.http.post(`api/Driver/web/CalculateStops`, {
      locations,
      distance,
      customerIds,
    });
  }

  calculateRoute(
    fromLocation: LocationAddress,
    toLocation: LocationAddress,
    distance: number,
    customerIds: number[]
  ): Observable<any> {
    return this.http.post(`api/Driver/web/CalculateRoute`, {
      fromLocation,
      toLocation,
      distance,
      customerIds,
    });
  }

  searchRoute(location: LocationAddress): Observable<any> {
    return this.http.post(`api/Driver/web/SearchRoute`, location);
  }

  searchLocations(term: string): Observable<MapsLocation[]> {
    if (`${term || ''}`.length < 2) {
      return of([]);
    }

    return this.http.get(`api/Driver/SearchLocations?term=${term}`).pipe(
      map((response: any) => {
        if (!response.success) {
          throw new Error(response.error);
        } else {
          return <MapsLocation[]>response.data || [];
        }
      })
    );
  }

  getTransactions(fromDate: string, toDate: string): Observable<any> {
    return this.http.get(
      `api/Driver/FilterTransactions?fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  getInvoices(fromDate: string, toDate: string): Observable<any> {
    return this.http.get(
      `api/Driver/FilterInvoices?fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  printInvoices(fromDate: string, toDate: string): Observable<any> {
    return this.http.download(
      `api/Driver/PrintInvoices?fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`api/Account/UserInfo`);
  }
  
}
