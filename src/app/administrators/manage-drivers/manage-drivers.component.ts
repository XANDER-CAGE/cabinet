import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { saveAs } from 'file-saver';
import moment from 'moment';

import { CustomerEntity, DriverEntity } from '../../core/dtos/database-schema';
import { AdministratorsService } from '../administrators.service';
import { PermissionList, SystemRoles } from 'src/app/core/enums/system-roles';
import { matchingFieldsValidation } from 'src/app/core/helpers/form.helper';

@Component({
  selector: 'app-manage-drivers',
  templateUrl: './manage-drivers.component.html',
  styleUrls: ['./manage-drivers.component.scss'],
})
export class ManageDriversComponent implements OnInit {
  items: DriverEntity[] = [];
  preLoading = true;
  pageNumber = 1;
  totalRecords = 0;
  subs: Subscription;
  settingsForm: FormGroup;
  selectedDriver: DriverEntity;
  organizations: any[];
  efsAccounts: any[];
  companies: any[];
  driverCards: any[];
  applyingSettings: boolean;
  customers: CustomerEntity[] = [];
  roleCode = SystemRoles;
  downloadingFile: boolean;
  includeUsers = false;
  filterForm: UntypedFormGroup;
  passwordForm: FormGroup;
  permissionList = PermissionList;

  constructor(
    private service: AdministratorsService,
    private toast: ToastrService,
    private modal: NgbModal,
    private fb: FormBuilder
  ) {
    this.filterForm = new UntypedFormGroup({
      searchTerm: new UntypedFormControl(''),
      dateRange: new UntypedFormControl([]),
    });

    this.settingsForm = this.fb.group({
      organizationId: this.fb.control(null, [Validators.required]),
      organizationName: this.fb.control(null),
      efsAccountId: this.fb.control(null, [Validators.required]),
      efsAccountName: this.fb.control(null),
      companyId: this.fb.control(null, [Validators.required]),
      companyName: this.fb.control(null),
      driverUnit: this.fb.control(null),
      cardNumber: this.fb.control(null),
      viewInvoices: this.fb.control(null),
      viewTransactions: this.fb.control(null),
      shownDiscountPrices: this.fb.control(null),
      shownDiscountedPrices: this.fb.control(null),
      stations: this.fb.control(null),
    });

    this.passwordForm = new FormGroup(
      {
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
    this.loadList();
    this.loadCustomers();
  }

  canSeePermission(item: DriverEntity, key: string): boolean {
    return item.permissionList?.includes(key) || false;
  }

  getCustomerName(id: number): string {
    return this.customers.find((a) => a.id == id)?.name || '';
  }

  onChangePassword(item: DriverEntity, content: TemplateRef<any>): void {
    this.selectedDriver = item;

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
      .changePassword(this.selectedDriver.id, this.passwordForm.value)
      .subscribe((response) => {
        if (response.success) {
          this.selectedDriver = null;
          this.passwordForm.reset();
          modal.close();
          this.showSuccess('Password has been changed');
        } else {
          this.showError(response.error);
        }
      });
  }

  downloadActivity(fully: boolean): void {
    this.downloadingFile = true;
    const filterValue = this.filterForm.value;
    const fromDate = filterValue.dateRange[0]
      ? moment(filterValue.dateRange[0]).format('DDMMYYYY')
      : '';
    const toDate = filterValue.dateRange[1]
      ? moment(filterValue.dateRange[1]).format('DDMMYYYY')
      : '';
    this.service.downloadActiviy(fully, fromDate, toDate).subscribe(
      (data) => {
        this.downloadingFile = false;
        saveAs(data, 'activity.csv');
      },
      (err) => {
        this.downloadingFile = false;
      }
    );
  }

  onChangePage(page: number): void {
    this.pageNumber = page;

    this.loadList();
  }

  onDelete(item: DriverEntity): void {
    if (confirm('Are you sure you want to delete?')) {
      this.service.driverDelete(item.id).subscribe((response) => {
        if (response.success) {
          this.showSuccess('Driver has been deleted!');

          this.loadList();
        } else {
          this.showError(response.error);
        }
      });
    }
  }

  onConfirm(item: DriverEntity): void {
    if (confirm('Are you sure you want to confirm?')) {
      this.service.driverConfirm(item.id).subscribe((response) => {
        if (response.success) {
          this.showSuccess('Driver has been confirmed!');

          this.loadList();
        } else {
          this.showError(response.error);
        }
      });
    }
  }

  onMoveCompany(item: DriverEntity): void {
    if (!confirm('Are you sure you want to moving Company?')) {
      return;
    }

    this.service.driverToCompany(item.id).subscribe((response) => {
      if (response.success) {
        this.showSuccess('Role has been moved to Company!');
        this.loadList();
      } else {
        this.showError(response.error);
      }
    });
  }

  onRevertDriver(item: DriverEntity): void {
    if (!confirm('Are you sure you want to reverting Driver?')) {
      return;
    }

    this.service.companyToDriver(item.id).subscribe((response) => {
      if (response.success) {
        this.showSuccess('Role has been reverted to Driver!');
        this.loadList();
      } else {
        this.showError(response.error);
      }
    });
  }

  onResetSettings(modal: any): void {
    if (!confirm('Are you sure you want to reset?')) {
      return;
    }

    this.service.resetSettings(this.selectedDriver.id).subscribe((response) => {
      if (response.success) {
        this.selectedDriver = null;

        modal.close('');
        this.showSuccess('Settings have been restored!');

        this.loadList();
      } else {
        this.showError(response.error);
      }
    });
  }

  onEditSettings(item: DriverEntity, content: any): void {
    this.loadCmpanies();

    this.selectedDriver = item;
    this.settingsForm.patchValue({
      ...item,
      stations: item.includeStations.map((a) => Number(a)),
      viewInvoices: item.permissionList?.includes('view_invoices') || false,
      viewTransactions:
        item.permissionList?.includes('view_transactions') || false,
      shownDiscountPrices:
        item.permissionList?.includes('shown_discount_prices') || false,
      shownDiscountedPrices:
        item.permissionList?.includes('shown_discounted_prices') || false,
    });

    this.onChangeOrganization(null);
    this.onChangeEfsAccount(null);
    this.onChangeCompany(null);

    this.modal.open(content, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  onApplySettings(modal: any): void {
    if (this.settingsForm.invalid) {
      return;
    }

    this.applyingSettings = true;

    this.service
      .driverSettings(this.selectedDriver.id, this.settingsForm.value)
      .subscribe(
        (response) => {
          this.applyingSettings = false;

          if (response.success) {
            this.selectedDriver = null;

            modal.close('');
            this.showSuccess('Settings applied!');

            this.loadList();
          } else {
            this.showError(response.error);
          }
        },
        (error) => {
          this.applyingSettings = false;
        }
      );
  }

  onChangeOrganization(event: any): void {
    if (event) {
      this.settingsForm.patchValue({
        organizationName: event.name,
      });
    }

    this.service.efsAccounts(this.settingsForm.value.organizationId).subscribe(
      (response) => {
        this.efsAccounts = response.data || [];
      },
      (error) => {
        this.efsAccounts = [];
      }
    );
  }

  onChangeEfsAccount(event: any): void {
    if (event) {
      this.settingsForm.patchValue({
        efsAccountName: event.name,
      });
    }

    this.service
      .filterCompanies(
        this.settingsForm.value.organizationId,
        this.settingsForm.value.efsAccountId
      )
      .subscribe(
        (response) => {
          this.companies = response.data || [];
        },
        (error) => {
          this.companies = [];
        }
      );
  }

  onChangeCompany(event: any): void {
    if (event) {
      this.settingsForm.patchValue({
        companyName: event.name,
      });
    }

    this.service.driverCards(this.settingsForm.value.companyId).subscribe(
      (response) => {
        this.driverCards = response.data || [];
      },
      (error) => {
        this.driverCards = [];
      }
    );
  }

  onChangeCard(event: any): void {
    if (event) {
      this.settingsForm.patchValue({
        driverUnit: event.name,
      });
    }
  }

  private loadCmpanies(): void {
    this.service.getOrganizations().subscribe(
      (response) => {
        this.organizations = response.data || [];
      },
      (error) => {
        this.organizations = [];
      }
    );
  }

  private loadCustomers(): void {
    this.service.customers().subscribe(
      (response) => {
        this.customers = <CustomerEntity[]>response.data || [];
      },
      (error) => {
        this.customers = [];
      }
    );
  }

  loadList(): void {
    this.preLoading = true;
    const filterValue = this.filterForm.value;
    const fromDate = filterValue.dateRange[0]
      ? moment(filterValue.dateRange[0]).format('DDMMYYYY')
      : '';
    const toDate = filterValue.dateRange[1]
      ? moment(filterValue.dateRange[1]).format('DDMMYYYY')
      : '';
    this.service
      .driverList(filterValue.searchTerm, this.pageNumber, fromDate, toDate)
      .subscribe(
        (response) => {
          this.preLoading = false;
          this.items = <DriverEntity[]>response.data.items || [];
          this.totalRecords = <number>response.data.total || 0;
        },
        (error) => {
          this.preLoading = false;
          this.items = [];
          this.totalRecords = 0;
        }
      );
  }

  private showError(message: string): void {
    this.toast.error(message, 'Error', {
      closeButton: true,
      disableTimeOut: true,
      newestOnTop: true,
      tapToDismiss: true,
    });
  }

  private showSuccess(message: string): void {
    this.toast.success(message, 'Success', {
      closeButton: true,
      disableTimeOut: true,
      newestOnTop: true,
      tapToDismiss: true,
    });
  }
}
