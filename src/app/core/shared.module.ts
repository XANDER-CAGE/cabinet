import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SumPipe } from './pipes/sum.pipe';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  imports: [CommonModule, MomentModule],
  declarations: [DateTimeFormatPipe, TruncatePipe, SumPipe, FilterPipe],
  exports: [
    MomentModule,
    DateTimeFormatPipe,
    TruncatePipe,
    SumPipe,
    FilterPipe,
  ],
})
export class SharedModule {}
