import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private service: AuthService, private router: Router) { }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(childRoute, state);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.service.isExpired()) {
      this.service.logOut();
      this.router.navigate(['/login']);
      return false;
    } else {
      const role = this.service.getRole();
      const roles = [...(route.data.roles || [])];
      if (roles.length) {
        if (roles.indexOf(role) != -1) {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      } else {
        return true;
      }
    }
  }
}
