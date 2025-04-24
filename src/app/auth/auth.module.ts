import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgSelectModule } from '@ng-select/ng-select';

import { AuthRouting } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRouting,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
  ],
  declarations: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
