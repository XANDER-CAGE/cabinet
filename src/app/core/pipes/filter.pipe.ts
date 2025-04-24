import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    if (searchText.length < 3) {
      return items;
    }

    return items.filter((a) => {
      return JSON.stringify(a).includes(searchText);
    });
  }
}
