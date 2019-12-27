// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';

// Resources
import Form from '../sharedcomponents/Form';
import api from '../utils/api';
import voucherCodes from '../utils/voucherCodes';
// import Modal from '../sharedcomponents/Modal';

const FormVoucherInquiry = ({ method }) => {
  const history = useHistory();
  const [formState, setFormState] = useState([]);
  const [vouchers, setVouchers] = useState([]);

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
        {
          type: 'submit',
          label: 'Filtrar',
        },
      ]);
    };

    FetchCompanies();
  }, []);

  const onChange = (e) => {
    const newFormState = formState.map((item) => {
      const field = item;
      if (field.name !== undefined && field.value !== undefined) {
        if (field.name === e.target.name) {
          field.name = e.target.name;
          field.value = e.target.value;
        }
      }
      return field;
    });

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
          if (i !== formState.length - 2) {
            query = query.concat(`${item.name}=${item.value}&`);
          } else {
            query = query.concat(`${item.name}=${item.value}`);
          }
        }
      }
      setVouchers((await api.Invoice.GetMany(query)).data);
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
    const ruc = formState[0].value;
    const date = (new Date(voucher.FechaEmision)).toLocaleDateString();
    const splitDate = date.split('/');
    const formatDate = `${splitDate[2]}/0${splitDate[1]}/0${splitDate[0]}`;
    const formatData = `${ruc}-${voucherCodes[voucher.Cod_TipoComprobante]}-${voucher.Serie}-${voucher.Numero}.pdf`;
    const url = `https://www.api.consultasruc.com:4000/api/AArchivo/COMPROBANTES/${ruc}/${formatDate}/PDF/${formatData}`;
    document.getElementById('pdf').src = url;
  };

  return (
    <>
      <nav>
        <button onClick={signOut} name="Salir" type="button">Salir</button>
      </nav>
      <Form method={method} state={formState} onChangeEvent={onChange} onSubmitEvent={onSubmit} />
      {/* <Modal show={shouldShowModal}>
        <div className="copy">
          <embed id="pdf" src="" type="application/pdf" width="100%" height="600px" />
          <button type="button">Cerrar</button>
        </div>
      </Modal> */}
      <div className="modal">
        <div className="modal-content">
          <div className="copy">
            <embed id="pdf" src="" type="application/pdf" width="100%" height="600px" />
          </div>
        </div>
        <div className="overlay" />
      </div>
      {vouchers.length !== 0 && (
      <table>
        <thead>
          <tr>
            <th>Fecha de emision</th>
            <th>Tipo de operacion</th>
            <th>Serie</th>
            <th>Numero</th>
            <th>Documento del cliente</th>
            <th>Nombre del cliente</th>
            <th>Codigo de moneda</th>
            <th>Total</th>
            <th>Estado de comprobante</th>
            <th>PDF</th>
            <th>XML</th>
            <th>CDR</th>
          </tr>
        </thead>
        <tbody>
          {
            vouchers.map((voucher) => (
              <tr key={vouchers.indexOf(voucher)}>
                <td>{(new Date(voucher.FechaEmision)).toLocaleDateString()}</td>
                <td>{voucher.Cod_TipoOperacion}</td>
                <td>{voucher.Serie}</td>
                <td>{voucher.Numero}</td>
                <td>{voucher.Doc_Cliente}</td>
                <td>{voucher.Nom_Cliente}</td>
                <td>{voucher.Cod_Moneda}</td>
                <td>{voucher.Total}</td>
                <td>{voucher.Cod_EstadoComprobante}</td>
                <td><button onClick={() => { downloadPDF(voucher); }} name="PDF" type="button">PDF</button></td>
                <td><button onClick={() => console.log('XML')} name="XML" type="button">XML</button></td>
                <td><button onClick={() => console.log('CDR')} name="CDR" type="button">CDR</button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
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
