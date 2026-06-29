import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SortOption {
  value: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-sort-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sort-container">
      <label class="sort-label">
        <i class="bi bi-sort-down"></i>
        Ordenar por:
      </label>
      <select 
        class="form-select form-select-sm sort-select"
        [(ngModel)]="selectedSort"
        (change)="onSortChange()">
        <option value="">Sin ordenar</option>
        <option *ngFor="let option of sortOptions" [value]="option.value">
          {{ option.icon || '' }} {{ option.label }}
        </option>
      </select>
      
      <button 
        class="btn btn-sm btn-outline-secondary sort-direction"
        (click)="toggleDirection()"
        [disabled]="!selectedSort"
        title="{{ sortDirection === 'asc' ? 'Ascendente' : 'Descendente' }}">
        <i class="bi" [class.bi-sort-up]="sortDirection === 'asc'" [class.bi-sort-down]="sortDirection === 'desc'"></i>
      </button>
    </div>
  `,
  styles: [`
    .sort-container {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .sort-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #495057;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .sort-select {
      min-width: 200px;
      font-size: 0.875rem;
    }

    .sort-direction {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      transition: all 0.2s;
    }

    .sort-direction:hover:not(:disabled) {
      background-color: #0d6efd;
      color: white;
      border-color: #0d6efd;
    }

    .sort-direction:disabled {
      opacity: 0.3;
    }

    @media (max-width: 576px) {
      .sort-container {
        flex-direction: column;
        align-items: stretch;
      }

      .sort-select {
        min-width: 100%;
      }

      .sort-direction {
        width: 100%;
      }
    }
  `]
})
export class SortDropdownComponent {
  @Input() sortOptions: SortOption[] = [];
  @Output() sortChange = new EventEmitter<{ field: string, direction: 'asc' | 'desc' }>();

  selectedSort: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  onSortChange() {
    if (this.selectedSort) {
      this.sortChange.emit({
        field: this.selectedSort,
        direction: this.sortDirection
      });
    } else {
      this.sortChange.emit({ field: '', direction: 'asc' });
    }
  }

  toggleDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    if (this.selectedSort) {
      this.onSortChange();
    }
  }
}
