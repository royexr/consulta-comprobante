// Dependencies
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { invoicesFields } from './Objects';

function exportDetailed() {
  console.log('Reporte detallado');
}

function exportResume(currentCompany, vouchers) {
  // Create work Book
  const workBook = new ExcelJS.Workbook();

  // Format structure of Excel file
  const iFieldsKeys = Object.keys(invoicesFields);

  // Create work Sheet
  const workSheet = workBook.addWorksheet('Comprobantes');
  workSheet.columns = iFieldsKeys.map((field) => {
    const formattedColumns = {};
    formattedColumns.header = invoicesFields[field];
    formattedColumns.key = field;
    formattedColumns.width = invoicesFields[field].length * 1.5;
    formattedColumns.style = {};
    if (invoicesFields[field].search(/[f|F]ECHA/) !== -1) {
      formattedColumns.style.numFmt = 'dd/mm/yyyy';
    }
    return formattedColumns;
  });

  for (let i = 0; i < vouchers.length; i += 1) {
    const v = vouchers[i];
    const vKeys = Object.keys(v);
    for (let j = 0; j < vKeys.length; j += 1) {
      const key = vKeys[j];
      if (key.search(/[f|F]echa/) !== -1) {
        v[key] = new Date(v[key]);
      }
    }
    workSheet.addRow(v);
  }

  workSheet.getRow(1).font = {
    family: 4,
    size: 12,
    bold: true,
  };

  // Format array of vouchers
  workSheet.addRows(vouchers);

  const date = new Date(Date.now());
  workBook.xlsx.writeBuffer()
    .then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `${currentCompany} Reporte${date.toLocaleString().replace(/,/gi, '').replace(/:|\//gi, '-').replace(/\s/gi, '_')}.xlsx`);
    });
}

export { exportResume, exportDetailed };
