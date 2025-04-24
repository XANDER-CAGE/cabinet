import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';

import { BaseComponent } from '../../core/components/base.component';
import { AppService } from '../../app.service';
import { environment } from '../../../environments/environment';
import { matchingFieldsValidation } from 'src/app/core/helpers/form.helper';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends BaseComponent implements OnInit {
  registerForm: FormGroup;
  registerSubmitting = false;
  siteKey = environment.captchaKey;

  constructor(
    private router: Router,
    private service: AppService,
    private toast: ToastrService
  ) {
    super();

    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [
          Validators.required,
          Validators.email,
          Validators.minLength(5),
          Validators.maxLength(50),
        ]),
        firstName: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        lastName: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        phone: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        companyName: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        cardNumber: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        captcha: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      {
        validators: [matchingFieldsValidation('password', 'confirmPassword')],
      }
    );
  }

  ngOnInit(): void {}

  onSubmit(captcha: ReCaptcha2Component) {
    if (!this.checkValidate(this.registerForm)) {
      return;
    }
    this.registerSubmitting = true;
    this.service.register(this.registerForm.value).subscribe(
      (response) => {
        this.registerSubmitting = false;
        captcha.resetCaptcha();

        if (response.success) {
          this.registerForm.reset();
          this.showSuccess(
            'An email with instructions to verify your email address has been sent to you.'
          );
          this.router.navigate(['/login']);
        } else {
          this.showError(response.error);
        }
      },
      (error) => {
        this.registerSubmitting = false;
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
