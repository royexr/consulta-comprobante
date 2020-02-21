// Dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Messages } from 'primereact/messages';
import { ProgressSpinner } from 'primereact/progressspinner';
import api from '../../../utils/api';
import FormField from '../../../sharedcomponents/FormField';
import { voucherCodes } from '../../../utils/Objects';
import { exportInvoices } from '../../../utils';

const Sales = ({ currentCompany }) => {
  // Concept: Fields data
  const [entities, setEntities] = useState([]);
  const [voucherTypes, setVoucherTypes] = useState([]);

  const fetchEntities = async (cc) => {
    if (cc !== undefined && cc.length > 0) {
      const { data } = await api.Voucher.GetEntities(cc, '14');
      setEntities(data.entities);
    }
  };

  const fetchVoucherTypes = async (cc) => {
    if (cc !== undefined && cc.length > 0) {
      const { data } = await api.VoucherTypes.GetAll();
      const formatted = data.map((vt) => ({
        value: vt.Cod_TipoComprobante,
        label: vt.Nom_TipoComprobante,
      }));
      setVoucherTypes(formatted);
    }
  };

  useEffect(() => {
    fetchEntities(currentCompany);
    fetchVoucherTypes(currentCompany);
  }, [currentCompany]);

  // Concept: Alert messages
  const [messages, setMessages] = useState(new Messages());

  const showMessage = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
  };

  // Concept: Formik functions
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [vouchers, setVouchers] = useState([]);

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.voucherType) {
      errors.voucherType = 'Campo obligatorio';
    }
    if (!values.clientDoc) {
      errors.clientDoc = 'Campo obligatorio';
    }
    if (!values.startDate) {
      errors.startDate = 'Campo obligatorio';
    }
    if (!values.endDate) {
      errors.endDate = 'Campo obligatorio';
    } else if (new Date(values.endDate).getTime() <= new Date(values.startDate).getTime()) {
      errors.endDate = 'La fecha final debe ser superior a la fecha inicial';
    }
    return errors;
  };

  const onSubmit = async (values, actions) => {
    const aux = { ...values };

    let query = `bookCode=14&codeCompany=${currentCompany}&`;
    const vKeys = Object.keys(aux);
    for (let i = 0; i < vKeys.length; i += 1) {
      const key = vKeys[i];
      if (key === 'clientDoc') {
        const array = aux[key].split(' - ');
        query = query.concat(`${key}=${array[0]}`);
      } else {
        query = query.concat(`${key}=${aux[key]}`);
      }
      query = i < vKeys.length - 1 ? query.concat('&') : query.concat('');
    }
    const vouchersR = await api.Voucher.ReadMany(query);
    if (vouchersR instanceof TypeError) {
      showMessage('error', 'Error!', 'No hay conexion');
    } else if (vouchersR.message === '01') {
      const { data } = vouchersR;
      if (data.length !== 0) {
        let totalV = 0;
        for (let i = 0; i < data.length; i += 1) {
          const element = data[i];
          totalV += element.Total;
        }
        setTotal(Math.round(totalV * 100) / 100);
        setQuantity(data.length);
        setVouchers(data);
      } else {
        showMessage('warn', 'Alerta!', 'No se han encontrado comprobantes');
      }
    } else {
      showMessage('error', 'Error!', 'Se ah producido un error');
    }
    actions.setSubmitting(false);
  };

  // Concept: Datatable functions
  const [isShowingPDF, setShowingPDF] = useState(false);
  const [pdfSource, setPdfSource] = useState('');

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

  // Concept: Datatable templates
  const actionTemplate = (rowData) => (
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

  // Concept: Dialog functions
  const hidePDFModal = () => {
    setShowingPDF(false);
    setPdfSource('');
  };

  return (
    <>
      <div className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4">
        <Formik
          initialValues={{
            voucherType: '',
            clientDoc: '',
            startDate: '',
            endDate: '',
          }}
          validate={(values) => fieldsValidation(values)}
          onSubmit={(values, actions) => {
            onSubmit(values, actions);
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
                    errors={errors.clientDoc && touched.clientDoc}
                    errorMessage={errors.clientDoc}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    label="Entidad"
                    name="clientDoc"
                    suggestions={entities}
                    type="autoComplete"
                    value={values.clientDoc}
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
                    label="Fecha final"
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
                  {
                    isSubmitting && (
                      <div className="mb-15 p-col-align-center">
                        <ProgressSpinner
                          strokeWidth="6"
                          style={{
                            width: '2rem',
                            height: '2rem',
                          }}
                        />
                      </div>
                    )
                  }
                  <div className="p-col-11 p-col-align-center">
                    <Messages ref={(el) => { setMessages(el); }} />
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
      {
        vouchers.length !== 0 && (
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
                onClick={() => exportInvoices(currentCompany, vouchers)}
                type="button"
              />
            </div>
          </>
        )
      }
    </>
  );
};

Sales.propTypes = {
  currentCompany: PropTypes.string.isRequired,
};

export default Sales;
