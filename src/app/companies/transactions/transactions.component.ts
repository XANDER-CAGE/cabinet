import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { TransactionEntity } from 'src/app/core/dtos/database-schema';
import { CompaniesService } from '../companies.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  preLoading: boolean;
  items: TransactionEntity[] = [];
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
      .getTransactions(
        this.pageSize,
        this.pageNumber,
        cardNumber,
        fromDate,
        toDate
      )
      .subscribe(
        (response) => {
          this.preLoading = false;
          this.items = <TransactionEntity[]>response.data['items'] || [];
          this.totalRecords = <number>response.data['totalCount'] || 0;
        },
        (err) => {
          this.preLoading = false;
          this.items = [];
        }
      );
  }
}
