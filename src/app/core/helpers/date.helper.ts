import * as moment from 'moment-timezone';

export class DateHelper {
  static shortFormat(date: string | Date): string {
    return moment(date).format('MM/DD/yyyy');
  }

  static longFormat(date: string | Date): string {
    return moment(date).format('MM/DD/yyyy HH:mm:ss');
  }

  static timeFormat(date: string | Date): string {
    return moment(date).format('HH:mm:ss');
  }

  static nowTime(): Date {
    return moment().toDate();
  }

  static addSeconds(second: number): Date {
    return moment().add(second, 'seconds').toDate();
  }
}
