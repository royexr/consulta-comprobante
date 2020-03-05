import XLSX from 'xlsx';
import normalizeObject from './dataStructures';
import { invoicesFields } from './Objects';

function exportDetailed() {
  console.log('Reporte detallado');
}

function exportResume(currentCompany, vouchers) {
  const formatedVouchers = vouchers.map((voucher) => {
    const fVoucher = {};
    const iFieldsKeys = Object.keys(invoicesFields);
    for (let i = 0; i < iFieldsKeys.length; i += 1) {
      const key = iFieldsKeys[i];
      fVoucher[invoicesFields[key]] = voucher[key];
    }
    return normalizeObject(fVoucher);
  });
  const date = new Date(Date.now());
  const ws = XLSX.utils.json_to_sheet(formatedVouchers);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Comprobantes');
  XLSX.writeFile(wb, `${currentCompany} Reporte${date.toLocaleString().replace(/,/gi, '').replace(/:|\//gi, '-').replace(/\s/gi, '_')}.xlsx`);
}

export { exportResume, exportDetailed };
