import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { IData } from '../interfaces/data.interface';
import { CommonModule } from '@angular/common';
import { FilterColumnsPipe } from '../pipes/filter-columns.pipe';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FilterColumnsPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  availableColumns: { key: string; label: string }[] = [
    // { key: '_id', label: 'ID' }, системное поле, нужно ли?
    { key: 'isActive', label: 'Active' },
    { key: 'balance', label: 'Balance' },
    { key: 'picture', label: 'Picture' },
    { key: 'age', label: 'Age' },
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'tags', label: 'Tags' },
    { key: 'favoriteFruit', label: 'Favorite Fruit' }
  ];

  displayedColumns: string[] = ['name', 'company', 'email'];

  data$: Observable<IData[]> | undefined;

  page$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  size$: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  sortBy$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  sortDirection$: BehaviorSubject<'asc' | 'desc'> = new BehaviorSubject<'asc' | 'desc'>('asc');
  filter$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isColumnMenuVisible = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = this.page$.pipe(
      switchMap(pageIndex =>
        this.size$.pipe(
          switchMap(pageSize =>
            this.sortBy$.pipe(
              switchMap(sortBy =>
                this.sortDirection$.pipe(
                  switchMap(sortDirection =>
                    this.filter$.pipe(
                      switchMap(filter =>
                        this.dataService.getData(filter, pageSize, pageIndex, sortBy, sortDirection)
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  toggleColumnMenu(): void {
    this.isColumnMenuVisible = !this.isColumnMenuVisible;
  }

  sort(column: string): void {
    if (column === 'picture') {
      return;
    }

    const currentSortBy = this.sortBy$.value;
    const currentDirection = this.sortDirection$.value;

    if (currentSortBy === column) {
      this.sortDirection$.next(currentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy$.next(column);
      this.sortDirection$.next('asc');
    }
  }

  changePageSize(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.size$.next(Number(value));
    this.page$.next(0);
  }

  toggleColumn(columnKey: string): void {
    if (this.displayedColumns.includes(columnKey)) {
      this.displayedColumns = this.displayedColumns.filter(key => key !== columnKey);
    } else {
      this.displayedColumns = [...this.displayedColumns, columnKey];
    }
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filter$.next(value.trim().toLowerCase());
  }
}
