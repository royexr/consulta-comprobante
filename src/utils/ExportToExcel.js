// Dependencies
import { saveAs } from 'file-saver';
import api from './api';

function exportDetailed() {
  console.log('Reporte detallado');
}

async function exportResume(companyCode, query) {
  const { data } = await api.Voucher.GetReportResume(query);
  const date = new Date(Date.now());
  const auxBuffer = Buffer.from(data);
  const arraybuffer = Uint8Array.from(auxBuffer).buffer;
  const blob = new Blob([arraybuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${companyCode} Reporte${date.toLocaleString().replace(/,/gi, '').replace(/:|\//gi, '-').replace(/\s/gi, '_')}.xlsx`);
}

export { exportDetailed, exportResume };
