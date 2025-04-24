import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';

import { InvoiceEntity } from 'src/app/core/dtos/database-schema';
import { CompaniesService } from '../companies.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  preLoading: boolean;
  items: InvoiceEntity[] = [];
  driverCards: any[];
  pageNumber = 1;
  totalRecords = 0;
  pageSize = 20;
  filterForm: UntypedFormGroup;

  constructor(private service: CompaniesService) {
    const startDay = moment().startOf('month').toDate();
    const endDay = moment().endOf('month').toDate();

    this.filterForm = new UntypedFormGroup({
      dateRange: new UntypedFormControl([startDay, endDay]),
      cardNumber: new UntypedFormControl(null),
      isActive: new UntypedFormControl(true),
    });
  }

  ngOnInit(): void {
    this.loadList();
    this.loadCards();
  }

  onChangeActive(event: any): void {
    this.pageNumber = 1;
    this.filterForm.patchValue({ cardNumber: null });

    this.loadList();
    this.loadCards();
  }

  onChangeCard(event: any): void {
    this.pageNumber = 1;

    this.loadList();
  }

  onChangePage(page: number): void {
    this.pageNumber = page;

    this.loadList();
  }

  private loadCards(): void {
    const isActive = this.filterForm.value.isActive;
    this.service.driverCards(isActive).subscribe(
      (response) => {
        this.driverCards = response.data || [];
      },
      (error) => {
        this.driverCards = [];
      }
    );
  }

  loadList(): void {
    this.preLoading = true;
    const rangeValue = this.filterForm.value.dateRange;
    const cardNumber = this.filterForm.value.cardNumber;
    const fromDate = moment(rangeValue[0]).local().format('DDMMYYYY');
    const toDate = moment(rangeValue[1]).local().format('DDMMYYYY');
    this.service
      .getInvoices(this.pageSize, this.pageNumber, cardNumber, fromDate, toDate)
      .subscribe(
        (response) => {
          this.preLoading = false;
          this.items = <InvoiceEntity[]>response.data['items'] || [];
          this.totalRecords = <number>response.data['totalCount'] || 0;
        },
        (err) => {
          this.preLoading = false;
          this.items = [];
        }
      );
  }

  printFile(): void {
    const rangeValue = this.filterForm.value.dateRange;
    const cardNumber = this.filterForm.value.cardNumber;
    const fromDate = moment(rangeValue[0]).local().format('DDMMYYYY');
    const toDate = moment(rangeValue[1]).local().format('DDMMYYYY');
    this.service
      .printInvoices(cardNumber, fromDate, toDate)
      .subscribe((blob) => {
        saveAs(blob, 'invoices.pdf');
      });
  }
}
