import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';

import { InvoiceEntity } from 'src/app/core/dtos/database-schema';
import { DriversService } from '../drivers.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  preLoading: boolean;
  items: InvoiceEntity[] = [];
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
    this.service.getInvoices(fromDate, toDate).subscribe(
      (response) => {
        this.preLoading = false;
        this.items = <InvoiceEntity[]>response.data || [];
      },
      (err) => {
        this.preLoading = false;
        this.items = [];
      }
    );
  }

  printFile(): void {
    const rangeValue = this.filterForm.value.dateRange;
    const fromDate = moment(rangeValue[0]).local().format('DDMMYYYY');
    const toDate = moment(rangeValue[1]).local().format('DDMMYYYY');
    this.service.printInvoices(fromDate, toDate).subscribe((blob) => {
      saveAs(blob, 'invoices.pdf');
    });
  }
}
