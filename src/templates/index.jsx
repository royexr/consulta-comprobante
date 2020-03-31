// Dependencies
import React from 'react';

// Resources
import { Button } from 'primereact/button';

const actionTemplate = (rowData, globalLoading, downloadPDF, downloadXML, downloadCDR) => (
  <>
    <Button
      className="p-button-danger p-button-rounded"
      disabled={globalLoading}
      label="PDF"
      onClick={() => { downloadPDF(rowData); }}
      style={{
        fontSize: '10px',
        marginRight: '0.3rem',
      }}
      tooltip="Descargar PDF"
      type="button"
    />
    <Button
      className="p-button-success p-button-rounded"
      disabled={globalLoading}
      label="XML"
      onClick={() => { downloadXML(rowData); }}
      style={{
        fontSize: '10px',
        marginRight: '0.3rem',
      }}
      tooltip="Descargar XML"
      type="button"
    />
    <Button
      className="p-button-primary p-button-rounded"
      disabled={globalLoading}
      label="CDR"
      onClick={() => { downloadCDR(rowData); }}
      style={{
        fontSize: '10px',
      }}
      tooltip="Descargar CDR"
      type="button"
    />
  </>
);

const currencyTemplate = (rowData) => {
  switch (rowData.Cod_Moneda) {
    case 'USD':
      return '$';
    default:
      return 'S/';
  }
};

const dateTemplate = (rowData) => {
  const formattedDate = (new Date(rowData.FechaEmision)).toLocaleDateString();
  return formattedDate;
};

const dtFooterVouchers = (totalF, totalB, totalNC, totalND, quantity) => (
  <table>
    <tbody className="">
      <tr className="p-grid p-dir-row">
        <td className="p-col-12 text--center">
          <Button
            className="button p-button-info p-button-rounded"
            icon="pi pi-info"
            style={{
              fontSize: '10px',
              marginLeft: '.3rem',
            }}
            tooltip="Montos calculados en Soles"
            tooltipOptions={{ event: 'focus' }}
          />
        </td>
        <td className="p-col-6 text--end">
          Total de
          <b> FACTURAS</b>
          :
        </td>
        <td className="p-col-6 text--start">{`S/.${totalF}`}</td>
        <td className="p-col-6 text--end">
          Total de
          <b> BOLETAS</b>
          :
        </td>
        <td className="p-col-6 text--start">{`S/.${totalB}`}</td>
        <td className="p-col-6 text--end">
          Total de
          <b> NOTAS DE CRÉDITO</b>
          :
        </td>
        <td className="p-col-6 text--start">{`S/.${totalNC}`}</td>
        <td className="p-col-6 text--end">
          Total de
          <b> NOTAS DE DÉBITO</b>
          :
        </td>
        <td className="p-col-6 text--start">{`S/.${totalND}`}</td>
        <td className="p-col-6 text--end">Cantidad:</td>
        <td className="p-col-6 text--start">{quantity}</td>
      </tr>
    </tbody>
  </table>
);

const stateTemplate = (rowData) => (
  <>
    {rowData.Cod_EstadoComprobante}
    <Button
      className="button p-button-secondary p-button-rounded"
      icon="pi pi-info"
      style={{
        fontSize: '10px',
        marginLeft: '.3rem',
      }}
      tooltip={
        `<b>INI</b>: Iniciado
        <b>EMI</b>: Emitido
        <b>ENS</b>: Enviado Sunat
        <b>REC</b>: Rechazado
        <b>ACS</b>: Aceptado Sunat
        <b>ENB</b>: Enviado a BD
        <b>ENF</b>: Enviado a FTP
        <b>ENE</b>: Enviado a email
        <b>FIN</b>: Finalizado
        <b>RFIN</b>: Verificado Sunat
        <b>BAJA</b>: Dado de baja`
      }
      tooltipOptions={{ event: 'focus' }}
    />
  </>
);

export {
  actionTemplate,
  currencyTemplate,
  dateTemplate,
  dtFooterVouchers,
  stateTemplate,
};
