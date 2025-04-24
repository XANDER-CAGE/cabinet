import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from './core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpService) {}

  login(model: any): Observable<any> {
    return this.http.post(`api/Account/ClientLoginV2`, model);
  }

  register(model: any): Observable<any> {
    return this.http.post(`api/Account/ClientRegister`, model);
  }

  changePassword(model: any): Observable<any> {
    return this.http.post(`api/Driver/ChangePassword`, model);
  }

  getConfig(): Observable<any> {
    return this.http.get(`api/Common/Config`);
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`api/Account/UserInfo`);
  }
}
