import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * Exportar datos a CSV
   */
  exportToCSV(data: any[], filename: string, columns?: { key: string, label: string }[]) {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Si no se especifican columnas, usar las keys del primer objeto
    const keys = columns 
      ? columns.map(c => c.key)
      : Object.keys(data[0]);
    
    const headers = columns
      ? columns.map(c => c.label)
      : keys;

    // Crear CSV
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
      const values = keys.map(key => {
        const value = this.getNestedValue(row, key);
        // Escapar valores que contengan comas o comillas
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csv += values.join(',') + '\n';
    });

    // Descargar archivo
    this.downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  }

  /**
   * Exportar datos a PDF (HTML convertido a PDF)
   */
  exportToPDF(data: any[], filename: string, columns?: { key: string, label: string }[], title?: string) {
    if (!data || data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const keys = columns 
      ? columns.map(c => c.key)
      : Object.keys(data[0]);
    
    const headers = columns
      ? columns.map(c => c.label)
      : keys;

    // Crear HTML para el PDF
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title || filename}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      font-size: 12px;
    }
    h1 {
      color: #333;
      font-size: 20px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background-color: #4CAF50;
      color: white;
      padding: 8px;
      text-align: left;
      border: 1px solid #ddd;
    }
    td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    .footer {
      margin-top: 20px;
      font-size: 10px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>${title || filename}</h1>
  <p>Fecha de generación: ${new Date().toLocaleString('es-ES')}</p>
  <p>Total de registros: ${data.length}</p>
  
  <table>
    <thead>
      <tr>
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${data.map(row => `
        <tr>
          ${keys.map(key => {
            const value = this.getNestedValue(row, key);
            return `<td>${value !== null && value !== undefined ? value : ''}</td>`;
          }).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>Generado por Rick & Morty Platform</p>
  </div>
</body>
</html>
    `;

    // Abrir en nueva ventana para imprimir como PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      
      // Esperar a que se cargue y luego abrir diálogo de impresión
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    } else {
      alert('Por favor, permite las ventanas emergentes para generar el PDF');
    }
  }

  /**
   * Obtener valor anidado de un objeto usando notación de punto
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Descargar archivo
   */
  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
