import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterColumns',
  standalone: true
})
export class FilterColumnsPipe implements PipeTransform {
  transform(
    columns: { key: string; label: string }[],
    displayedColumns: string[]
  ): { key: string; label: string }[] {
    return columns.filter(column => displayedColumns.includes(column.key));
  }
}
