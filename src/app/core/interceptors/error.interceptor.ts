import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private service: AuthService, private toast: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!event.body) {
            location.reload();
          } else {
            if (!event.body.success) {
              this.showError(event.body.error);
            } else {
              if (event.body.code === 401 || event.body.code === 403) {
                this.service.logOut();
              }
            }
          }
        }
      }),
      catchError((err) => {
        let errorMessage = '';

        if (Object.keys(err).includes('status')) {
          if (err.status > 0) {
            errorMessage = err.error['error'];
          } else {
            errorMessage = 'Please,try late!';
          }
        } else {
          errorMessage = 'No connection internet!';
        }

        this.showError(errorMessage);

        return throwError(err);
      })
    );
  }

  private showError(message: string): void {
    if (!`${message || ''}`.trim().length) {
      return;
    }

    this.toast.error(message, 'Error');
  }
}
