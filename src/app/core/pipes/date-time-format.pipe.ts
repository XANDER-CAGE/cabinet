import { Pipe, PipeTransform } from '@angular/core';

import { DateHelper } from '../helpers/date.helper';

@Pipe({
  name: 'appDateTime',
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(value: Date, short: boolean = false): unknown {
    if (!value) {
      return '';
    }
    return !short
      ? DateHelper.longFormat(value)
      : DateHelper.shortFormat(value);
  }
}
