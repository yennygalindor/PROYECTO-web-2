const ExcelJS = require('exceljs');

/**
 * Exportar datos a CSV
 */
const exportToCSV = (data, columns) => {
  if (!data || data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Crear encabezados
  const headers = columns.map(col => col.header || col.key);
  const csvHeaders = headers.join(',');

  // Crear filas
  const csvRows = data.map(item => {
    return columns.map(col => {
      const value = getNestedValue(item, col.key);
      // Escapar comas y comillas
      const stringValue = String(value || '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Exportar datos a Excel
 */
const exportToExcel = async (data, columns, sheetName = 'Data') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Configurar columnas
  worksheet.columns = columns.map(col => ({
    header: col.header || col.key,
    key: col.key,
    width: col.width || 15
  }));

  // Estilo del encabezado
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F3460' }
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Agregar datos
  data.forEach(item => {
    const row = {};
    columns.forEach(col => {
      row[col.key] = getNestedValue(item, col.key);
    });
    worksheet.addRow(row);
  });

  // Auto-filtro
  worksheet.autoFilter = {
    from: 'A1',
    to: String.fromCharCode(64 + columns.length) + '1'
  };

  // Generar buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

/**
 * Helper para obtener valores anidados de objetos
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

/**
 * Middleware para manejar exportación
 */
const handleExport = (getData, columns) => {
  return async (req, res) => {
    try {
      const format = req.query.format || 'json';
      const data = await getData(req);

      if (!data || (Array.isArray(data) && data.length === 0)) {
        return res.status(404).json({
          success: false,
          message: 'No hay datos para exportar'
        });
      }

      switch (format.toLowerCase()) {
        case 'csv':
          const csv = exportToCSV(data, columns);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
          return res.send(csv);

        case 'excel':
        case 'xlsx':
          const excel = await exportToExcel(data, columns);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
          return res.send(excel);

        case 'json':
        default:
          return res.json({
            success: true,
            data,
            count: Array.isArray(data) ? data.length : 1
          });
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al exportar datos',
        error: error.message
      });
    }
  };
};

module.exports = {
  exportToCSV,
  exportToExcel,
  handleExport,
  getNestedValue
};
