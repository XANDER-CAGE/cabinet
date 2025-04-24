import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { CustomerEntity, DriverEntity } from '../../core/dtos/database-schema';
import { CompaniesService } from '../companies.service';
import { PermissionList } from 'src/app/core/enums/system-roles';

@Component({
  selector: 'app-manage-drivers',
  templateUrl: './manage-drivers.component.html',
  styleUrls: ['./manage-drivers.component.scss'],
})
export class ManageDriversComponent implements OnInit {
  items: DriverEntity[] = [];
  preLoading = true;
  subs: Subscription;
  applyingSettings: boolean;
  settingsForm: FormGroup;
  selectedDriver: DriverEntity;
  customers: CustomerEntity[] = [];
  driverCards: any[];
  filterForm: UntypedFormGroup;
  permissionList = PermissionList;

  constructor(
    private service: CompaniesService,
    private toast: ToastrService,
    private modal: NgbModal,
    private fb: FormBuilder
  ) {
    this.filterForm = new UntypedFormGroup({
      searchTerm: new UntypedFormControl(''),
    });

    this.settingsForm = this.fb.group({
      cardNumber: this.fb.control(null, [Validators.required]),
      driverUnit: this.fb.control(null),
      viewInvoices: this.fb.control(null),
      viewTransactions: this.fb.control(null),
      shownDiscountPrices: this.fb.control(null),
      shownDiscountedPrices: this.fb.control(null),
      stations: this.fb.control(null),
    });
  }

  ngOnInit(): void {
    this.loadList();
    this.loadCustomers();
  }

  onChangeCard(event: any): void {
    if (event) {
      this.settingsForm.patchValue({
        driverUnit: event.name,
      });
    }
  }

  hasPermission(item: DriverEntity, key: string): boolean {
    return item.permissionList?.includes(key) || false;
  }

  getCustomerName(id: number): string {
    return this.customers.find((a) => a.id == id)?.name || '';
  }

  onEditSettings(item: DriverEntity, content: any): void {
    this.selectedDriver = item;

    this.loadCards();

    this.settingsForm.patchValue({
      ...item,
      stations: item.includeStations.map((a) => Number(a)),
      viewInvoices: this.hasPermission(
        item,
        this.permissionList.CAN_VIEW_INVOICES
      ),
      viewTransactions: this.hasPermission(
        item,
        this.permissionList.CAN_VIEW_TRANSACTIONS
      ),
      shownDiscountPrices: this.hasPermission(
        item,
        this.permissionList.SHOW_DISCOUNT_PRICES
      ),
      shownDiscountedPrices: this.hasPermission(
        item,
        this.permissionList.SHOW_DISCOUNTED_PRICES
      ),
    });

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

  private loadCards(): void {
    this.service.driverCards().subscribe(
      (response) => {
        this.driverCards = response.data || [];
        this.onChangeCard(
          this.driverCards.find(
            (a) => a.id == this.settingsForm.value.cardNumber
          )
        );
      },
      (error) => {
        this.driverCards = [];
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
    this.service.driverList(filterValue.searchTerm).subscribe(
      (response) => {
        this.preLoading = false;
        this.items = <DriverEntity[]>response.data || [];
      },
      (error) => {
        this.preLoading = false;
        this.items = [];
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
