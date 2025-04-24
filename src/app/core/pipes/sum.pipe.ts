import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum',
})
export class SumPipe implements PipeTransform {
  transform(dataSource: any[], colName: string): any {
    return this.getTotal(colName, dataSource) || 0;
  }

  private getTotal(colName: string, dataSource: any[]): number {
    const total = dataSource
      .map((row) => row[colName])
      .reduce((acc, value) => (value ? acc + Number(value) : acc), 0);
    return total;
  }
}
