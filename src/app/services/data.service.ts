import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Data as data } from './data';
import { IData } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getData(
    search: string,
    pageSize: number,
    pageIndex: number,
    sortBy: string = '',
    sortDirection: 'asc' | 'desc' = 'asc'
  ): Observable<IData[]> {
    const sortedData = [
      ...data.filter(
        single =>
          single.name?.first.toLowerCase().includes(search.toLowerCase()) ||
          single.name?.last?.toLowerCase().includes(search.toLowerCase())
      )
    ];

    if (sortBy) {
      sortedData.sort((a, b) => {
        let aValue = this.getPropertyValue(a, sortBy);
        let bValue = this.getPropertyValue(b, sortBy);

        if (sortBy === 'name') {
          aValue = `${a.name?.first} ${a.name?.last}`;
          bValue = `${b.name?.first} ${b.name?.last}`;
        }

        let comparison = 0;
        if (aValue > bValue) {
          comparison = 1;
        } else if (aValue < bValue) {
          comparison = -1;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    return of(<IData[]>paginatedData);
  }

  private getPropertyValue(item: any, propertyPath: string): any {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return propertyPath.split('.').reduce((obj, key) => obj[key], item);
  }
}
