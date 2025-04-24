import { Component, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import TrimbleMaps from '@trimblemaps/trimblemaps-js';

import { AuthService } from './core/services/auth.service';
import { UserInfo } from './core/dtos/user-info';
import { PermissionList, SystemRoles } from './core/enums/system-roles';
import { AppService } from './app.service';
import { environment } from 'src/environments/environment';
import { matchingFieldsValidation } from './core/helpers/form.helper';
import { ServerConfig } from './core/dtos/database-schema';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  systemRoles = SystemRoles;
  appVersion: string;
  passwordForm: FormGroup;
  canSeeTransactions: boolean;
  canSeeInvoices: boolean;
  userInfo: UserInfo;
  sidebarVisible = false;

  constructor(
    private auth: AuthService,
    private location: Location,
    private service: AppService,
    private modal: NgbModal,
    private toast: ToastrService
  ) {
    this.appVersion = environment.appVersion;
    this.passwordForm = new FormGroup(
      {
        oldPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        newPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
        confirmPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
      },
      {
        validators: [
          matchingFieldsValidation('newPassword', 'confirmPassword'),
        ],
      }
    );
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.reloadVersion();
    
    // Close sidebar when route changes on mobile
    if (window.innerWidth < 768) {
      this.location.onUrlChange(() => {
        this.sidebarVisible = false;
      });
    }
  }

  get currentRole(): string {
    return this.auth.getRole();
  }

  get isAuthorized(): boolean {
    return !this.auth.isExpired();
  }

  get fullName(): string {
    return this.auth.payload.name;
  }

  matchUrlPart(page: string): boolean {
    return this.location.path().startsWith(page);
  }

  onLogout(): void {
    // Show confirmation before logout
    if (confirm('Are you sure you want to sign out?')) {
      this.auth.logOut();
      location.href = '/';
    }
  }

  onChangePassword(content: TemplateRef<any>): void {
    // Reset form before opening
    this.passwordForm.reset();
    
    this.modal.open(content, {
      centered: true,
      keyboard: false,
      scrollable: true,
      backdrop: 'static',
      size: 'md'
    });
  }

  submitChangePassword(modal: any): void {
    if (this.passwordForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.passwordForm.controls).forEach(key => {
        const control = this.passwordForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.service
      .changePassword(this.passwordForm.value)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.passwordForm.reset();
            modal.close();
            this.showSuccess('Password has been changed successfully');
          } else {
            this.showError(response.error || 'An error occurred while changing the password');
          }
        },
        error: (err) => {
          this.showError('Failed to change password. Please try again.');
        }
      });
  }
  
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  private reloadVersion(): void {
    if (!this.isAuthorized) {
      return;
    }

    this.service.getConfig().subscribe({
      next: (response) => {
        if (!response.data) {
          return;
        }

        const config = response.data as ServerConfig;
        if (config.mapKey) {
          TrimbleMaps.setAPIKey(config.mapKey);
        }

        // Force reload if version mismatch
        if (this.appVersion !== config.version) {
          this.toast.info('A new version is available. Reloading application...', 'Update Available');
          setTimeout(() => {
            this.auth.logOut();
            location.reload();
          }, 2000);
        }
      },
      error: (err) => {
        console.error('Failed to load config:', err);
      }
    });
  }

  private getUserInfo(): void {
    if (!this.isAuthorized) {
      return;
    }

    this.service.getUserInfo().subscribe({
      next: (response) => {
        if (response.data) {
          this.userInfo = response.data as UserInfo;

          this.canSeeTransactions = 
            this.userInfo.permissionList?.includes(PermissionList.CAN_VIEW_TRANSACTIONS) || false;
          this.canSeeInvoices = 
            this.userInfo.permissionList?.includes(PermissionList.CAN_VIEW_INVOICES) || false;
        }
      },
      error: (err) => {
        console.error('Failed to load user info:', err);
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