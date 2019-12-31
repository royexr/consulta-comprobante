// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
import btoa from 'btoa';
import XLSX from 'xlsx';

// Resources
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Form from '../sharedcomponents/Form';
import api from '../utils/api';
import voucherCodes from '../utils/voucherCodes';

const FormVoucherInquiry = ({ method }) => {
  const history = useHistory();
  const [formState, setFormState] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [shouldShowPDF, setShouldShowPDF] = useState(false);
  const [isFilterDisable, setIsFilterDisable] = useState(true);
  const [pdfSource, setPdfSource] = useState('');
  const [totalVouchers, setTotalVouchers] = useState(0);

  useEffect(() => {
    let companies = [];
    const FetchCompanies = async () => {
      try {
        companies = (jwt.verify(sessionStorage.getItem('userJWT'), 'pale')).companies;
      } catch (error) {
        companies = [];
      }
      setFormState([
        {
          collectionName: 'companies',
          fieldName: '_id.Cod_Empresa',
          label: 'Empresa originaria',
          name: 'codeCompany',
          suggestions: companies,
          type: 'autoComplete',
          value: '',
        },
        {
          label: 'Tipo de comprobante',
          name: 'voucherType',
          type: 'select',
          value: 'FE',
          options: [
            {
              value: 'FE',
              label: 'Factura electronica',
            },
            {
              value: 'BE',
              label: 'Boleta de venta electronica',
            },
            {
              value: 'NCE',
              label: 'Nota de credito electronica',
            },
            {
              value: 'NDE',
              label: 'Nota de debito electronica',
            },
            {
              value: 'GRE',
              label: 'Guida de remision remitente electronica',
            },
          ],
        },
        {
          arrayFN: '_id.Cod_Empresa',
          codes: companies,
          collectionName: 'invoices',
          fieldName: 'Doc_Cliente',
          label: 'RUC o DNI',
          name: 'docCliente',
          type: 'autoComplete',
          value: '',
        },
        {
          label: 'Fecha inicial',
          name: 'startDate',
          type: 'date',
          value: '',
        },
        {
          label: 'Fecha final',
          name: 'endDate',
          type: 'date',
          value: '',
        },
      ]);
    };

    FetchCompanies();
  }, []);

  const onChange = (e) => {
    let count = 0;
    const newFormState = formState.map((item) => {
      const field = item;
      if (field.name !== undefined && field.value !== undefined) {
        if (field.name === e.target.name) {
          field.name = e.target.name;
          field.value = e.target.value;
        }

        if (field.value !== '') {
          count += 1;
        }
      }
      return field;
    });

    setIsFilterDisable(formState.length !== count);

    setFormState(newFormState);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (method === 'POST') {
      const bodyData = {};
      for (let i = 0; i < formState.length; i += 1) {
        const item = formState[i];
        if (item.name !== undefined && item.value !== undefined) {
          bodyData[item.label] = item.value;
        }
      }
    } else {
      let query = 'dateName=FechaEmision&';
      for (let i = 0; i < formState.length; i += 1) {
        const item = formState[i];
        if (item.name !== undefined && item.value !== '') {
          if (i !== formState.length - 1) {
            query = query.concat(`${item.name}=${item.value}&`);
          } else {
            query = query.concat(`${item.name}=${item.value}`);
          }
        }
      }
      const vouchersData = (await api.Invoice.GetMany(query)).data;
      if (vouchersData.length !== 0) {
        let totalV = 0;
        for (let i = 0; i < vouchersData.length; i += 1) {
          const element = vouchersData[i];
          totalV += element.Total;
        }
        setTotalVouchers(Math.round(totalV * 100) / 100);
      }
      setVouchers(vouchersData);
      // fetch(`http://localhost:3001/api/invoices/?${query}`)
      //   .then((response) => response.json())
      //   .then((json) => setVouchers(json.data));
    }
  };

  const signOut = () => {
    sessionStorage.removeItem('userJWT');
    history.push('/');
  };

  const downloadPDF = (voucher) => {
    let url = '';
    const ruc = formState[0].value;
    const fullDate = new Date(voucher.FechaEmision);
    const year = fullDate.getFullYear();
    const month = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1).toString() : `0${(fullDate.getMonth() + 1).toString()}`;
    const date = fullDate.getDate().toString().length === 2 ? fullDate.getDate().toString() : `0${fullDate.getDate().toString()}`;
    const formatDate = `${year}/${month}/${date}`;
    const formatData = `${ruc}-${voucherCodes[voucher.Cod_TipoComprobante]}-${voucher.Serie}-${voucher.Numero}.pdf`;
    url = `https://www.api.consultasruc.com:4000/api/AArchivo/COMPROBANTES/${ruc}/${formatDate}/PDF/${formatData}`;
    setShouldShowPDF(true);
    setPdfSource(url);
  };

  const downloadXML = (voucher) => {
    const ruc = formState[0].value;
    const fullDate = new Date(voucher.FechaEmision);
    const year = fullDate.getFullYear();
    const month = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1).toString() : `0${(fullDate.getMonth() + 1).toString()}`;
    const date = fullDate.getDate().toString().length === 2 ? fullDate.getDate().toString() : `0${fullDate.getDate().toString()}`;

    const formatDate = `${year}/${month}/${date}`;
    const urln = `${ruc}/${formatDate}/XML/${ruc}-${voucherCodes[voucher.Cod_TipoComprobante]}-${voucher.Serie}-${voucher.Numero}.zip`;
    const codificado = btoa(urln);
    let url = 'https://www.api.consultasruc.com:4000/api/AArchivo/url/';
    url += codificado;
    window.location.href = url;
  };

  const downloadCDR = (voucher) => {
    const ruc = formState[0].value;
    const fullDate = new Date(voucher.FechaEmision);
    const year = fullDate.getFullYear();
    const month = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1).toString() : `0${(fullDate.getMonth() + 1).toString()}`;
    const date = fullDate.getDate().toString().length === 2 ? fullDate.getDate().toString() : `0${fullDate.getDate().toString()}`;

    const formatDate = `${year}/${month}/${date}`;
    const urln = `${ruc}/${formatDate}/CDR/R-${ruc}-${voucherCodes[voucher.Cod_TipoComprobante]}-${voucher.Serie}-${voucher.Numero}.zip`;
    const codificado = btoa(urln);
    let url = 'https://www.api.consultasruc.com:4000/api/AArchivo/url/';
    url += codificado;
    window.location.href = url;
  };

  const hidePDFModal = () => {
    setShouldShowPDF(false);
    setPdfSource('');
  };

  const ExportXlsx = () => {
    const formatedVouchers = vouchers.map((voucher) => {
      const newVoucher = { ...voucher };
      delete newVoucher._id;
      delete newVoucher.Cod_TipoComprobante;
      newVoucher.FechaEmision = (new Date(voucher.FechaEmision)).toLocaleDateString();
      return newVoucher;
    });
    const date = new Date(Date.now());
    const ws = XLSX.utils.json_to_sheet(formatedVouchers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TestSheet');
    XLSX.writeFile(wb, `Reporte_${date.toLocaleString().replace(/,/gi, '').replace(/:|\//gi, '-').replace(/\s/gi, '_')}.xlsx`);
  };

  const dateTemplate = (rowData) => {
    const formatedDate = (new Date(rowData.FechaEmision)).toLocaleDateString();
    return <p>{formatedDate}</p>;
  };

  const actionTemplate = (rowData) => (
    <>
      <button type="button" onClick={() => { downloadPDF(rowData); }}>PDF</button>
      <button type="button" onClick={() => { downloadXML(rowData); }}>XML</button>
      {/* <button type="button" onClick={() => { downloadCDR(rowData); }}>CDR</button> */}
    </>
  );

  return (
    <>
      <nav>
        <button onClick={signOut} name="Salir" type="button">Salir</button>
      </nav>
      <Form method={method} state={formState} onChangeEvent={onChange} onSubmitEvent={onSubmit}>
        <button disabled={isFilterDisable} type="submit">Filtrar</button>
      </Form>
      <Dialog header="PDF" visible={shouldShowPDF} style={{ width: '70vw' }} modal onHide={hidePDFModal}>
        {pdfSource !== '' && <embed id="pdf" src={pdfSource} type="application/pdf" width="100%" height="600px" />}
      </Dialog>
      {vouchers.length !== 0 && (
        <>
          <DataTable value={vouchers} paginator rows={10}>
            <Column body={dateTemplate} header="Fecha de emision" />
            <Column field="Cod_TipoOperacion" header="Tipo de operacion" />
            <Column field="Serie" header="Serie" />
            <Column field="Numero" header="Numero" />
            <Column field="Doc_Cliente" header="Documento del cliente" />
            <Column field="Nom_Cliente" header="Nombre del cliente" />
            <Column field="Cod_Moneda" header="Codigo de moneda" />
            <Column field="Total" header="Total" />
            <Column field="Cod_EstadoComprobante" header="Estado de comprobante" />
            <Column body={actionTemplate} header="PDF" />
          </DataTable>
          <div>
            <span>
              <label htmlFor="TotalVouchers">Total</label>
              <input type="text" id="TotalVouchers" name="TotalVouchers" disabled value={totalVouchers} />
            </span>
            <button type="button" onClick={ExportXlsx}>Exportar a Excel</button>
          </div>
        </>
      )}
    </>
  );
};

FormVoucherInquiry.defaultProps = {
  method: 'GET',
};

FormVoucherInquiry.propTypes = {
  method: PropTypes.string,
};

export default FormVoucherInquiry;
