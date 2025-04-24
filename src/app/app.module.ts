import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MomentModule } from 'ngx-moment';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSplitModule } from 'angular-split';

import '@angular/localize/init';

import * as moment from 'moment-timezone';
const centralTimeZone = 'Asia/Tashkent';
moment.tz.setDefault(centralTimeZone);

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent, DashboardComponent, AccessDeniedComponent],
  imports: [
    BrowserModule,
    AppRouting,
    NgbModule,
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRouting,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {
        timeOut: 5000,             // авто-закрытие через 5 сек
        closeButton: true,         // кнопка закрытия
        progressBar: true,         // прогресс-бар отображения
        positionClass: 'toast-top-right', // позиция на экране
        tapToDismiss: true,        // можно кликнуть, чтобы закрыть
        preventDuplicates: true    // не показывать одинаковые тосты
      }
    ),
    MomentModule.forRoot(),
    AuthModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    AngularSplitModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    provideNgxMask(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
