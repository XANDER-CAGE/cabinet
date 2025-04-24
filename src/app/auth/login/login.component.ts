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
  loginAttempts = 0;
  currentYear = new Date().getFullYear();
  windowWidth: number = window.innerWidth;

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

  ngOnInit(): void {
    // Auto-redirect if already logged in
    if (!this.auth.isExpired()) {
      this.router.navigate(['/']);
    }
    
    // Track window size for responsive design
    window.addEventListener('resize', this.onResize.bind(this));
    
    // Focus on email field on component load
    setTimeout(() => {
      const emailInput = document.querySelector('input[formControlName="email"]');
      if (emailInput) {
        (emailInput as HTMLElement).focus();
      }
    }, 100);
  }
  
  ngOnDestroy(): void {
    // Clean up event listener
    window.removeEventListener('resize', this.onResize.bind(this));
  }
  
  onResize(): void {
    this.windowWidth = window.innerWidth;
  }
  
  get isMobile(): boolean {
    return this.windowWidth < 768;
  }

  onSubmit(captcha: ReCaptcha2Component): void {
    if (!this.checkValidate(this.loginForm)) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loginSubmitting = true;
    this.service.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Always reset captcha
        captcha.resetCaptcha();
        this.loginSubmitting = false;

        if (response.success) {
          this.loginForm.reset();
          const result = response.data as TokenResponse;
          this.auth.logIn(result.access_token);

          // Show welcome message with animation
          this.showSuccess('Welcome back!');
          
          // Add a small delay for better UX
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 300);
        } else {
          // Increment login attempts
          this.loginAttempts++;
          
          if (this.loginAttempts >= 3) {
            this.showError('Multiple failed login attempts detected. Please ensure you are using the correct credentials.');
          } else {
            this.showError(response.error || 'Login failed. Please check your credentials.');
          }
          
          // Only reset password field, keep email for convenience
          this.loginForm.get('password')?.reset();
          this.loginForm.get('password')?.markAsUntouched();
        }
      },
      error: (error) => {
        captcha.resetCaptcha();
        this.loginSubmitting = false;
        
        let errorMessage = 'Unable to connect to server. Please try again later.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.showError(errorMessage);
      }
    });
  }

  private showError(message: string): void {
    this.toast.error(message, 'Error');
  }

  private showSuccess(message: string): void {
    this.toast.success(message, 'Success');
  }
}