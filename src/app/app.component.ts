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
    this.auth.logOut();
    location.href = '/';
  }

  onChangePassword(content: TemplateRef<any>): void {
    this.modal.open(content, {
      centered: true,
      keyboard: false,
      scrollable: true,
      backdrop: 'static',
    });
  }

  submitChangePassword(modal: any): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.service
      .changePassword(this.passwordForm.value)
      .subscribe((response) => {
        if (response.success) {
          this.passwordForm.reset();
          modal.close();
          this.showSuccess('Password has been changed');
        } else {
          this.showError(response.error);
        }
      });
  }

  private reloadVersion(): void {
    if (!this.isAuthorized) {
      return;
    }

    this.service.getConfig().subscribe((response) => {
      if (!response.data) {
        return;
      }

      var config = <ServerConfig>response.data;
      TrimbleMaps.setAPIKey(config.mapKey);

      if (this.appVersion != config.version) {
        this.auth.logOut();
        location.reload();
      }
    });
  }

  private getUserInfo(): void {
    if (!this.isAuthorized) {
      return;
    }

    this.service.getUserInfo().subscribe((response) => {
      this.userInfo = <UserInfo>response.data;

      this.canSeeTransactions =
        this.userInfo.permissionList?.includes(
          PermissionList.CAN_VIEW_TRANSACTIONS
        ) || false;
      this.canSeeInvoices =
        this.userInfo.permissionList?.includes(
          PermissionList.CAN_VIEW_INVOICES
        ) || false;
    });
  }

  private showError(message: string): void {
    this.toast.error(message, 'Error');
  }

  private showSuccess(message: string): void {
    this.toast.success(message, 'Success');
  }
}
