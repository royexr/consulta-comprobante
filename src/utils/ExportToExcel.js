// Dependencies
import { saveAs } from 'file-saver';
import api from './api';

async function exportDetailed(bookCode, companyCode, query) {
  const res = await api.Voucher.GetDetailedReport(query);
  if (res instanceof TypeError) {
    console.error('Error!');
  } else {
    const date = new Date(Date.now());
    const auxBuffer = Buffer.from(res.data);
    const arraybuffer = Uint8Array.from(auxBuffer).buffer;
    const blob = new Blob([arraybuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    let fileName = `${companyCode}-Detallado`;
    switch (bookCode) {
      case '14':
        fileName += '-Ventas-';
        break;
      default:
        fileName += '-Compras-';
        break;
    }
    fileName += `-${date.toLocaleString().replace(/,/gi, '').replace(/:|\//gi, '-').replace(/\s/gi, '_')}.xlsx`;
    saveAs(blob, fileName);
  }
}

async function exportResume(bookCode, companyCode, query) {
  const res = await api.Voucher.GetResumedReport(query);
  if (res instanceof TypeError) {
    console.error('Error!');
  } else {
    const date = new Date(Date.now());
    const auxBuffer = Buffer.from(res.data);
    const arraybuffer = Uint8Array.from(auxBuffer).buffer;
    const blob = new Blob([arraybuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    let fileName = `${companyCode}-Resumen`;
    switch (bookCode) {
      case '14':
        fileName += '-Ventas-';
        break;
      default:
        fileName += '-Compras-';
        break;
    }
    fileName += `-${date.toLocaleString().replace(/,/gi, '').replace(/:|\//gi, '-').replace(/\s/gi, '_')}.xlsx`;
    saveAs(blob, fileName);
  }
}

export { exportDetailed, exportResume };
