import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { TransactionEntity } from 'src/app/core/dtos/database-schema';
import { DriversService } from '../drivers.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  preLoading: boolean;
  items: TransactionEntity[] = [];
  filterForm: UntypedFormGroup;

  constructor(private service: DriversService) {
    const startDay = moment().startOf('month').toDate();
    const endDay = moment().endOf('month').toDate();

    this.filterForm = new UntypedFormGroup({
      dateRange: new UntypedFormControl([startDay, endDay]),
    });
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadList(): void {
    this.preLoading = true;
    const rangeValue = this.filterForm.value.dateRange;
    const fromDate = moment(rangeValue[0]).local().format('DDMMYYYY');
    const toDate = moment(rangeValue[1]).local().format('DDMMYYYY');
    this.service.getTransactions(fromDate, toDate).subscribe(
      (response) => {
        this.preLoading = false;
        this.items = <TransactionEntity[]>response.data || [];
      },
      (err) => {
        this.preLoading = false;
        this.items = [];
      }
    );
  }
}
