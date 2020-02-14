// Dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import api from '../../../utils/api';
import FormField from '../../../sharedcomponents/FormField';
import voucherCodes from '../../../utils/voucherCodes';

const Invoices = ({ currentCompany }) => {
  const [entities, setEntities] = useState([]);
  const [isShowingPDF, setShowingPDF] = useState(false);
  const [pdfSource, setPdfSource] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [voucherTypes, setVoucherTypes] = useState([]);

  const fetchEntities = async () => {
    const { data } = await api.Voucher.GetEntities('_id.Cod_Empresa', currentCompany);
    setEntities(data.entities);
  };

  const fetchVoucherTypes = async () => {
    const { data } = await api.VoucherTypes.GetAll();
    const formatted = data.map((vt) => ({
      value: vt.Cod_TipoComprobante,
      label: vt.Nom_TipoComprobante,
    }));
    setVoucherTypes(formatted);
  };

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.voucherType) {
      errors.voucherType = 'Campo obligatorio';
    }
    if (!values.docCliente) {
      errors.docCliente = 'Campo obligatorio';
    }
    if (!values.startDate) {
      errors.startDate = 'Campo obligatorio';
    }
    if (!values.endDate) {
      errors.endDate = 'Campo obligatorio';
    }
    return errors;
  };

  const onSubmit = async (values, setSubmitting) => {
    const aux = { ...values };

    let query = `dateName=FechaEmision&codeCompany=${currentCompany}&`;
    const vKeys = Object.keys(aux);
    for (let i = 0; i < vKeys.length; i += 1) {
      const key = vKeys[i];
      if (key === 'docCliente') {
        const array = aux[key].split(' - ');
        query = query.concat(`${key}=${array[0]}`);
      } else {
        query = query.concat(`${key}=${aux[key]}`);
      }
      query = i < vKeys.length - 1 ? query.concat('&') : query.concat('');
    }
    const vouchersR = await api.Voucher.ReadMany(query);
    if (vouchersR.message === '01') {
      const { data } = vouchersR;
      if (data.length !== 0) {
        let totalV = 0;
        for (let i = 0; i < data.length; i += 1) {
          const element = data[i];
          totalV += element.Total;
        }
        setTotal(Math.round(totalV * 100) / 100);
        setQuantity(data.length);
      }
      setVouchers(data);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (currentCompany !== undefined && currentCompany.length > 0) {
      fetchEntities();
      fetchVoucherTypes();
    }
  }, [currentCompany]);

  const downloadPDF = (voucher) => {
    let url = '';
    const ruc = currentCompany;
    const fullDate = new Date(voucher.FechaEmision);
    const year = fullDate.getFullYear();
    const month = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1).toString() : `0${(fullDate.getMonth() + 1).toString()}`;
    const date = fullDate.getDate().toString().length === 2 ? fullDate.getDate().toString() : `0${fullDate.getDate().toString()}`;
    const formatDate = `${year}/${month}/${date}`;
    const formatData = `${ruc}-${voucherCodes[voucher.Cod_TipoComprobante]}-${voucher.Serie}-${voucher.Numero}.pdf`;
    url = `https://www.api.consultasruc.com:4000/api/AArchivo/COMPROBANTES/${ruc}/${formatDate}/PDF/${formatData}`;
    setShowingPDF(true);
    setPdfSource(url);
  };

  const downloadXML = (voucher) => {
    const ruc = currentCompany;
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

  const hidePDFModal = () => {
    setShowingPDF(false);
    setPdfSource('');
  };


  const actionTemplate = (rowData) => {
    return (
      <>
        <Button
          className="p-button-danger"
          icon="pi pi-file-pdf"
          style={{ marginRight: '0.5rem' }}
          tooltip="Descargar PDF"
          type="button"
          onClick={() => { downloadPDF(rowData); }}
        />
        <Button
          className="p-button-success"
          icon="pi pi-file-o"
          style={{ marginRight: '0.5rem' }}
          tooltip="Descargar XML"
          type="button"
          onClick={() => { downloadXML(rowData); }}
        />
      </>
    );
  };

  const dateTemplate = (rowData) => {
    const formattedDate = (new Date(rowData.FechaEmision)).toLocaleDateString();
    return formattedDate;
  };

  const dtHeader = () => (
    <div className="p-clearfix">Comprobantes de ventas</div>
  );

  const dtFooter = () => (
    <div className="p-grid p-justify-between">
      <p>
        <span className="px-10">
          Total:
          {total}
        </span>
      </p>
      <p>
        <span className="px-10">
          Cantidad:
          {quantity}
        </span>
      </p>
    </div>
  );

  return (
    <>
      <div className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4">
        <Formik
          initialValues={{
            voucherType: '',
            docCliente: '',
            startDate: '',
            endDate: '',
          }}
          validate={(values) => fieldsValidation(values)}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values, setSubmitting);
          }}
        >
          {
            ({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <>
                <form
                  className="form p-grid p-dir-col p-nogutter"
                  onSubmit={handleSubmit}
                >
                  <hgroup className="heading p-col-11 p-col-align-center">
                    <h1 className="title">VENTAS</h1>
                  </hgroup>
                  <FormField
                    className="mb-15 p-col-11 p-col-align-center"
                    disabled={isSubmitting}
                    errors={errors.voucherType && touched.voucherType}
                    errorMessage={errors.voucherType}
                    handleChange={handleChange}
                    label="Tipo de comprobante"
                    name="voucherType"
                    options={voucherTypes}
                    type="select"
                    value={values.voucherType}
                  />
                  <FormField
                    className="mb-15 p-col-11 p-col-align-center"
                    disabled={isSubmitting}
                    errors={errors.docCliente && touched.docCliente}
                    errorMessage={errors.docCliente}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    label="Entidad"
                    name="docCliente"
                    suggestions={entities}
                    type="autoComplete"
                    value={values.docCliente}
                  />
                  <FormField
                    className="mb-15 p-col-11 p-col-align-center"
                    disabled={isSubmitting}
                    errors={errors.startDate && touched.startDate}
                    errorMessage={errors.startDate}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    label="Fecha inicial"
                    name="startDate"
                    type="date"
                    value={values.startDate}
                  />
                  <FormField
                    className="mb-15 p-col-11 p-col-align-center"
                    disabled={isSubmitting}
                    errors={errors.endDate && touched.endDate}
                    errorMessage={errors.endDate}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    label="Fecha inicial"
                    name="endDate"
                    type="date"
                    value={values.endDate}
                  />
                  <div className="mb-15 p-col-11 p-col-align-center">
                    <Button
                      className="button button--blue"
                      label="Filtrar"
                      disabled={isSubmitting}
                      type="submit"
                    />
                  </div>
                </form>
              </>
            )
          }
        </Formik>
      </div>
      <Dialog
        className="p-col-11"
        header="PDF"
        visible={isShowingPDF}
        modal
        onHide={hidePDFModal}
      >
        {
          pdfSource !== '' && (
            <object
              id="pdf"
              aria-label="pdf"
              data={pdfSource}
              type="application/pdf"
              width="100%"
              height="600px"
            >
              <p>
                Your web browser does not have a PDF plugin. Instead you can
                <a href={pdfSource}>click here to download the PDF file.</a>
              </p>
            </object>
          )
        }
      </Dialog>
      {vouchers.length !== 0 && (
        <>
          <DataTable
            className="p-col-11"
            header={dtHeader()}
            footer={dtFooter()}
            paginator
            responsive
            rows={5}
            value={vouchers}
            rowsPerPageOptions={[5, 20, 50]}
          >
            <Column body={dateTemplate} header="Fecha de emisión" />
            <Column field="Cod_TipoOperacion" header="Tipo de operacion" />
            <Column field="Serie" header="Serie" />
            <Column field="Numero" header="Numero" />
            <Column field="Doc_Cliente" header="Documento del cliente" />
            <Column field="Nom_Cliente" header="Nombre del cliente" />
            <Column field="Cod_Moneda" header="Codigo de moneda" />
            <Column field="Total" header="Total" />
            <Column field="Cod_EstadoComprobante" header="Estado de comprobante" />
            <Column body={actionTemplate} />
          </DataTable>
          <div className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4">
            <Button
              className="button button--blue"
              icon="pi pi-file-excel"
              label="Exportar a Excel"
              type="button"
            />
          </div>
        </>
      )}
    </>
  );
};

Invoices.propTypes = {
  currentCompany: PropTypes.string.isRequired,
};

export default Invoices;
