import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReCaptcha2Component } from 'ngx-captcha';

import { BaseComponent } from '../../core/components/base.component';
import { AppService } from '../../app.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from 'src/environments/environment';
import { TokenResponse } from 'src/app/core/dtos/database-schema';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  loginForm: FormGroup;
  loginSubmitting = false;
  siteKey = environment.captchaKey;

  constructor(
    private service: AppService,
    private auth: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {
    super();

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      captcha: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onSubmit(captcha: ReCaptcha2Component) {
    if (!this.checkValidate(this.loginForm)) {
      return;
    }

    this.loginSubmitting = true;
    this.service.login(this.loginForm.value).subscribe(
      (response) => {
        captcha.resetCaptcha();
        this.loginSubmitting = false;

        if (response.success) {
          this.loginForm.reset();
          const result = <TokenResponse>response.data;
          this.auth.logIn(result.access_token);

          this.showSuccess('Welcome!');

          this.router.navigate(['/']);
        } else {
          this.showError(response.error);
        }
      },
      (error) => {
        captcha.resetCaptcha();
        this.loginSubmitting = false;
      }
    );
  }

  private showError(message: string): void {
    this.toast.error(message, 'Error');
  }

  private showSuccess(message: string): void {
    this.toast.success(message, 'Success');
  }
}
