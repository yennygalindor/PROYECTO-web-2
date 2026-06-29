import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../../core/services/export.service';

@Component({
  selector: 'app-export-buttons-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="export-buttons">
      <button 
        class="btn btn-success btn-sm me-2"
        (click)="exportCSV()"
        type="button">
        <i class="bi bi-file-earmark-spreadsheet"></i>
        CSV
      </button>
      
      <button 
        class="btn btn-danger btn-sm"
        (click)="exportPDF()"
        type="button">
        <i class="bi bi-file-earmark-pdf"></i>
        PDF
      </button>
    </div>
  `,
  styles: [`
    .export-buttons {
      display: inline-flex;
      gap: 8px;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.875rem;
    }
  `]
})
export class ExportButtonsSimpleComponent {
  @Input() data: any[] = [];
  @Input() filename: string = 'export';
  @Input() columns?: { key: string, label: string }[];
  @Input() title?: string;

  constructor(private exportService: ExportService) {}

  exportCSV() {
    if (!this.data || this.data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    this.exportService.exportToCSV(this.data, this.filename, this.columns);
  }

  exportPDF() {
    if (!this.data || this.data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    this.exportService.exportToPDF(this.data, this.filename, this.columns, this.title);
  }
}
