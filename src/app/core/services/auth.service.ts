import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { StorageService } from './storage.service';
import { TokenPayload } from '../dtos/token-payload';
import { UserInfo } from '../dtos/user-info';

export const AUTH_TOKEN_KEY = 'token';
export const AUTH_ROLE_KEY = 'role_code';
export const USER_INFO_KEY = 'user_info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private helper = new JwtHelperService();

  constructor(private storage: StorageService) {}

  logIn(value: string): void {
    this.storage.setString(AUTH_TOKEN_KEY, value);
    try {
      const payload = this.helper.decodeToken<TokenPayload>(value);
      this.storage.setString(AUTH_ROLE_KEY, payload.role_code);
    } catch {}
  }

  setUserInfo(value: UserInfo): void {
    this.storage.setData(USER_INFO_KEY, value);
  }

  get userId(): string {
    const token = this.getToken();
    try {
      const payload = this.helper.decodeToken<TokenPayload>(token);

      return payload.sub;
    } catch {}
    return null;
  }

  isExpired(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        return this.helper.isTokenExpired(token);
      } catch {}
    }
    return true;
  }

  get payload(): TokenPayload | null {
    const token = this.getToken();
    if (token) {
      try {
        return this.helper.decodeToken<TokenPayload>(token);
      } catch {}
    }
    return null;
  }

  getToken(): string {
    return this.storage.getString(AUTH_TOKEN_KEY);
  }

  logOut(): void {
    this.storage.clearAll();
  }

  getRole(): string {
    return this.storage.getString(AUTH_ROLE_KEY);
  }
}
