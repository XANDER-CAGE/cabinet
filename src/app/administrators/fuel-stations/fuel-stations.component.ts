import {
  Component,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { HttpService } from '../../core/services/http.service';
import { AdministratorsService } from '../administrators.service';
import {
  CustomerEntity,
  DiscountedFileEntity,
  DiscountEntity,
  StationEntity,
} from '../../core/dtos/database-schema';

@Component({
  selector: 'app-fuel-stations',
  templateUrl: './fuel-stations.component.html',
  styleUrls: ['./fuel-stations.component.scss'],
})
export class FuelStationsComponent implements OnInit, OnDestroy {
  preLoading = false;
  items: StationEntity[] = [];
  discounts: DiscountEntity[] = [];
  files: DiscountedFileEntity[] = [];
  pageNumber = 0;
  searchTerm = '';
  totalRecords = 0;
  customerId: number;
  fileForm: FormGroup;
  importingDiscounts: boolean;
  customers: CustomerEntity[] = [];
  discountForm: FormGroup;
  applyingDiscount: boolean;
  subs: Subscription;
  selectedStationId: number;
  selectedStation: StationEntity;

  constructor(
    private service: AdministratorsService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpService,
    private toast: ToastrService
  ) {
    this.fileForm = this.fb.group({
      fileName: this.fb.control('', [Validators.required]),
      fileData: this.fb.control(null),
    });
    this.discountForm = this.fb.group({
      customer: this.fb.control(null),
      discount: this.fb.control(null, [Validators.min(0), Validators.max(10)]),
    });
  }

  ngOnInit(): void {
    this.subs = this.route.params.subscribe((rParams) => {
      this.customerId = +rParams['customer'];
      this.route.queryParams.subscribe((qParams) => {
        this.pageNumber = +qParams['page'] || 1;
        this.searchTerm = qParams['term'] || '';
        this.loadCustomers();
      });
    });
  }

  onSearch(searchTerm: string): void {
    this.router.navigate([`/administrators/stations/${this.customerId}`], {
      queryParams: {
        page: 1,
        term: searchTerm,
      },
    });
  }

  onChangePage(page: number): void {
    this.router.navigate([`/administrators/stations/${this.customerId}`], {
      queryParams: {
        page: page,
        term: this.searchTerm,
      },
    });
  }

  showImport(content: any): void {
    this.modalService
      .open(content, {
        size: 'md',
        centered: true,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.pageNumber = 1;
          this.searchTerm = '';
          this.loadList();
        },
        (reason) => {
          this.fileForm.reset();
        }
      );
  }

  showFiles(content: any): void {
    this.service.files(this.customerId).subscribe(
      (response) => {
        this.files = <DiscountedFileEntity[]>response.data || [];
        this.modalService.open(content, {
          scrollable: true,
          size: 'lg',
          centered: true,
          backdrop: 'static',
          keyboard: false,
        });
      },
      (error) => {
        this.files = [];
      }
    );
  }

  onSelectFile(e: any): void {
    const file = e.target.files[0] || {};
    if (!file) {
      this.fileForm.reset();
      return;
    }

    this.fileForm.patchValue({
      fileName: file.name,
      fileData: file,
    });
  }

  onUploadDiscounts(modal: any): void {
    if (this.fileForm.invalid) {
      return;
    }

    const formData = new FormData();

    formData.append('File', this.fileForm.value.fileData);

    this.importingDiscounts = true;

    this.http
      .upload(`api/Admin/ImportDiscounts/${this.customerId}`, formData)
      .subscribe(
        (response) => {
          if (response.type == HttpEventType.Response) {
            this.importingDiscounts = false;
            this.fileForm.reset();

            const result = response.body;
            if (result.success) {
              modal.close('');
              this.showSuccess('Discounts loaded!');
            } else {
              this.showError(result.error);
            }
          }
        },
        (error) => {
          this.fileForm.reset();
          this.importingDiscounts = false;
        }
      );
  }

  onViewDiscounts(item: StationEntity, content: any): void {
    this.service.discounts(item.id).subscribe(
      (response) => {
        this.discounts = <DiscountEntity[]>response.data || [];
        this.modalService.open(content, {
          scrollable: true,
          size: 'md',
          centered: true,
          backdrop: 'static',
          keyboard: false,
        });
      },
      (error) => {
        this.discounts = [];
      }
    );
  }

  showDiscount(content: any): void {
    this.modalService
      .open(content, {
        size: 'md',
        centered: true,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.loadList();
        },
        (reason) => {
          this.discountForm.reset();
          this.applyingDiscount = false;
        }
      );
  }

  showEdit(item: StationEntity, content: any): void {
    this.selectedStation = item;

    this.modalService.open(content, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  showAdd(content: any): void {
    this.modalService.open(content, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  onCloseEdit(result: boolean, content: any): void {
    if (result) {
      this.showSuccess('Station has been updated!');
      this.selectedStation = null;
      this.loadList();
    }

    content.dismiss('');
  }

  onCloseAdd(result: boolean, content: any): void {
    if (result) {
      this.showSuccess('Station has been added!');
      this.selectedStation = null;
      this.loadList();
    }

    content.dismiss('');
  }

  onRevertDiscounts(): void {
    if (confirm('Are you sure you want to revert?')) {
      this.service.revertDiscounts(this.customerId).subscribe((response) => {
        if (response.success) {
          this.showSuccess('Discounts has been reverted!');

          this.loadList();
        } else {
          this.showError(response.error);
        }
      });
    }
  }

  onApplyDiscount(modal: any): void {
    if (this.discountForm.invalid) {
      return;
    }

    this.applyingDiscount = true;
    const discountPrice = this.discountForm.value.discount || 0;

    this.service.applyDiscount(this.customerId, discountPrice).subscribe(
      (response) => {
        this.applyingDiscount = false;
        this.fileForm.reset();

        if (response.success) {
          modal.close('');
          this.showSuccess('Discount applied!');
        } else {
          this.showError(response.error);
        }
      },
      (error) => {
        this.discountForm.reset();
        this.applyingDiscount = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadList(): void {
    this.preLoading = true;
    this.service
      .stations(this.customerId, this.searchTerm, this.pageNumber)
      .subscribe(
        (response) => {
          this.preLoading = false;
          this.items = <StationEntity[]>response.data.items || [];
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
    this.toast.error(message, 'Error');
  }

  private showSuccess(message: string): void {
    this.toast.success(message, 'Success');
  }

  private loadCustomers(): void {
    this.service.customers().subscribe(
      (response) => {
        const items = <CustomerEntity[]>response.data || [];
        if (!this.customerId) {
          this.customerId = items[0].id;
        }
        if (!this.selectedStation) {
          this.selectedStation = <StationEntity>{
            id: 0,
            customerId: this.customerId,
            customerName: items.find((a) => a.id == this.customerId).name,
          };
        }
        this.customers = items;
        this.loadList();
      },
      (error) => {
        this.items = [];
      }
    );
  }
}
