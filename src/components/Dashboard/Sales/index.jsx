// Dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SplitButton } from 'primereact/splitbutton';
import api from '../../../utils/api';
import config from '../../../config';
import FormField from '../../../sharedcomponents/FormField';
import { voucherCodes } from '../../../utils/Objects';
import { exportResume, exportDetailed, currentMonthRange } from '../../../utils';
import {
  useEntities,
  useMessages,
  useSeriesNumbers,
  useVoucherTypes,
} from '../../../hooks';
import {
  actionTemplate,
  currencyTemplate,
  dateTemplate,
  dtFooter,
  stateTemplate,
} from '../../../formikTemplates';

const Sales = ({ currentCompany }) => {
  const { entities } = useEntities(currentCompany, '14');
  const { seriesNumbers } = useSeriesNumbers(currentCompany, '14');
  const { voucherTypes } = useVoucherTypes();
  const [showMessages, renderMessages] = useMessages();

  // Concept: Formik default value
  const { firstDay, lastDay } = currentMonthRange();
  const [fd] = useState(firstDay);
  const [ld] = useState(lastDay);

  // Concept: Formik functions
  const [quantity, setQuantity] = useState(0);
  const [totalF, setTotalF] = useState(0);
  const [totalB, setTotalB] = useState(0);
  const [totalNC, setTotalNC] = useState(0);
  const [totalND, setTotalND] = useState(0);
  const [vouchers, setVouchers] = useState([]);

  const fieldsValidation = (values) => {
    const errors = {};
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

    let query = `bookCode=14&companyCode=${currentCompany}&`;
    const vKeys = Object.keys(aux);
    for (let i = 0; i < vKeys.length; i += 1) {
      const key = vKeys[i];
      switch (key) {
        case 'clientDoc':
          if (aux[key] !== '') {
            const auxArray = aux[key].split('-');
            query = query.concat(`${key}=${auxArray[0]}`);
          }
          break;
        case 'seriesNumbers':
          if (aux[key] !== '') {
            const auxArray = aux[key].split('-');
            query = query.concat(`serie=${auxArray[0]}`);
            query = query.concat(`number=${auxArray[1]}`);
          }
          break;
        default:
          if (aux[key] !== '') {
            query = query.concat(`${key}=${aux[key]}`);
          }
          break;
      }
      query = i < vKeys.length - 1 ? query.concat('&') : query.concat('');
    }
    const vouchersR = await api.Voucher.ReadMany(query);
    if (vouchersR instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
    } else if (vouchersR.message === '01') {
      const { data } = vouchersR;
      if (data.length !== 0) {
        let sumF = 0; let sumB = 0; let sumNC = 0; let sumND = 0;
        for (let i = 0; i < data.length; i += 1) {
          const e = data[i];
          switch (e.Cod_TipoComprobante) {
            case 'FE' || 'FC':
              sumF += e.Total * e.TipoCambio;
              break;
            case 'BE' || 'BC':
              sumB += e.Total * e.TipoCambio;
              break;
            case 'NCE' || 'NCC':
              sumNC += e.Total * e.TipoCambio;
              break;
            case 'NDE' || 'NDC':
              sumND += e.Total * e.TipoCambio;
              break;
            default:
              break;
          }
        }
        setTotalF(Math.round(sumF * 100) / 100);
        setTotalB(Math.round(sumB * 100) / 100);
        setTotalNC(Math.round(sumNC * 100) / 100);
        setTotalND(Math.round(sumND * 100) / 100);
        setQuantity(data.length);
        setVouchers(data);
      } else {
        showMessages('warn', 'Alerta!', 'No se han encontrado comprobantes');
        setVouchers([]);
      }
    } else {
      showMessages('error', 'Error!', 'Se ah producido un error');
      setVouchers([]);
    }
    actions.setSubmitting(false);
  };

  const fetchInitialInvoices = async (cc, first, last) => {
    if (cc !== undefined && cc.length > 0) {
      const aux = {
        startDate: first.toISOString().slice(0, 10),
        endDate: last.toISOString().slice(0, 10),
      };
      let query = `bookCode=14&companyCode=${cc}&`;
      const vKeys = Object.keys(aux);
      for (let i = 0; i < vKeys.length; i += 1) {
        const key = vKeys[i];
        if (aux[key] !== '') {
          query = query.concat(`${key}=${aux[key]}`);
        }
        query = i < vKeys.length - 1 ? query.concat('&') : query.concat('');
      }
      const vouchersR = await api.Voucher.ReadMany(query);
      if (vouchersR.message === '01') {
        const { data } = vouchersR;
        if (data.length !== 0) {
          let sumF = 0; let sumB = 0; let sumNC = 0; let sumND = 0;
          for (let i = 0; i < data.length; i += 1) {
            const e = data[i];
            switch (e.Cod_TipoComprobante) {
              case 'FE' || 'FC':
                sumF += e.Total * e.TipoCambio;
                break;
              case 'BE' || 'BC':
                sumB += e.Total * e.TipoCambio;
                break;
              case 'NCE' || 'NCC':
                sumNC += e.Total * e.TipoCambio;
                break;
              case 'NDE' || 'NDC':
                sumND += e.Total * e.TipoCambio;
                break;
              default:
                break;
            }
          }
          setTotalF(Math.round(sumF * 100) / 100);
          setTotalB(Math.round(sumB * 100) / 100);
          setTotalNC(Math.round(sumNC * 100) / 100);
          setTotalND(Math.round(sumND * 100) / 100);
          setQuantity(data.length);
          setVouchers(data);
        } else {
          setVouchers([]);
        }
      } else {
        setVouchers([]);
      }
    }
  };

  useEffect(() => {
    fetchInitialInvoices(currentCompany, fd, ld);
  }, [currentCompany, fd, ld]);

  // Concept: Datatable functions
  const [isShowingPDF, setShowingPDF] = useState(false);
  const [pdfSource, setPdfSource] = useState('');
  const [items] = useState([
    {
      label: 'Resumen',
      icon: 'pi pi-file-o',
      command: () => { exportResume(currentCompany, vouchers); },
    },
    {
      label: 'Detallado',
      icon: 'pi pi-file',
      command: () => { exportDetailed(); },
    },
  ]);

  const downloadPDF = (voucher) => {
    let url = '';
    const ruc = currentCompany;
    const fullDate = new Date(voucher.FechaEmision);
    const year = fullDate.getFullYear();
    const month = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1).toString() : `0${(fullDate.getMonth() + 1).toString()}`;
    const date = fullDate.getDate().toString().length === 2 ? fullDate.getDate().toString() : `0${fullDate.getDate().toString()}`;
    const formatDate = `${year}/${month}/${date}`;
    const formatData = `${ruc}-${voucherCodes[voucher.Cod_TipoComprobante]}-${voucher.Serie}-${voucher.Numero}.pdf`;
    url = `${config.ftpApi}/AArchivo/COMPROBANTES/${ruc}/${formatDate}/PDF/${formatData}`;
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
    let url = `${config.ftpApi}/AArchivo/url/`;
    url += codificado;
    window.location.href = url;
  };

  const downloadCDR = (voucher) => {
    const ruc = currentCompany;
    const fullDate = new Date(voucher.FechaEmision);
    const year = fullDate.getFullYear();
    const month = (fullDate.getMonth() + 1).toString().length === 2 ? (fullDate.getMonth() + 1).toString() : `0${(fullDate.getMonth() + 1).toString()}`;
    const date = fullDate.getDate().toString().length === 2 ? fullDate.getDate().toString() : `0${fullDate.getDate().toString()}`;

    const formatDate = `${year}/${month}/${date}`;
    const urln = `${ruc}/${formatDate}/CDR/R-${ruc}-${voucherCodes[voucher.Cod_TipoComprobante]}-${voucher.Serie}-${voucher.Numero}.zip`;
    const codificado = btoa(urln);
    let url = `${config.ftpApi}/AArchivo/url/`;
    url += codificado;
    window.location.href = url;
  };

  // Concept: Dialog functions
  const hidePDFModal = () => {
    setShowingPDF(false);
    setPdfSource('');
  };

  return (
    <>
      <div className="p-col-11">
        <Formik
          initialValues={{
            voucherType: '',
            clientDoc: '',
            seriesNumbers: '',
            startDate: fd.toISOString().slice(0, 10),
            endDate: ld.toISOString().slice(0, 10),
          }}
          validate={(values) => fieldsValidation(values)}
          onSubmit={(values, actions) => { onSubmit(values, actions); }}
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
                  className="form form--filter p-grid p-justify-center"
                  onSubmit={handleSubmit}
                >
                  <hgroup className="heading p-col-11 p-col-align-center">
                    <h1 className="title">VENTAS</h1>
                  </hgroup>
                  <FormField
                    className="p-col-11 p-sm-6 p-md-6 p-lg-3 p-col-align-center"
                    disabled={isSubmitting}
                    handleChange={handleChange}
                    label="Tipo de comprobante"
                    name="voucherType"
                    options={voucherTypes}
                    type="select"
                    value={values.voucherType}
                  />
                  <FormField
                    className="p-col-11 p-col-align-center"
                    disabled={isSubmitting}
                    filter
                    filterBy="value, label"
                    handleChange={handleChange}
                    label="Serie - Número"
                    name="seriesNumbers"
                    options={seriesNumbers}
                    type="select"
                    value={values.seriesNumbers}
                  />
                  <FormField
                    className="p-col-11 p-sm-6 p-md-6 p-lg-4 p-col-align-center"
                    disabled={isSubmitting}
                    filter
                    filterBy="value, label"
                    handleChange={handleChange}
                    label="Empresa"
                    name="clientDoc"
                    options={entities}
                    type="select"
                    value={values.clientDoc}
                  />
                  <FormField
                    className="p-col-11 p-sm-6 p-md-4 p-lg-2 p-col-align-center"
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
                    className="p-col-11 p-sm-6 p-md-4 p-lg-2 p-col-align-center"
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
                  <div className="p-col-11 p-md-4 p-lg-1 p-col-align-center">
                    <p />
                    <Button
                      className="p-button-rounded button button--blue button--small"
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
                  <div className="p-col-12 p-col-align-center">
                    {renderMessages()}
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
              alwaysShowPaginator={false}
              className="p-col-11"
              columnResizeMode="fit"
              footer={dtFooter(totalF, totalB, totalNC, totalND, quantity)}
              multiSortMeta={[{ field: 'FechaEmision', order: -1 }]}
              paginator
              responsive
              rows={5}
              rowClassName={() => ({ 'table-row': true })}
              rowsPerPageOptions={[5, 10, 15]}
              removableSort
              sortMode="multiple"
              value={vouchers}
            >
              <Column body={dateTemplate} header="Fecha" style={{ width: '10%' }} />
              <Column field="Cod_TipoOperacion" header="Tipo" style={{ width: '5%' }} sortable />
              <Column field="Serie" header="Serie" style={{ width: '5%' }} sortable />
              <Column field="Numero" header="Numero" style={{ width: '10%' }} sortable />
              <Column field="Doc_Cliente" header="N. Documento" style={{ width: '12%' }} />
              <Column field="Nom_Cliente" header="Denominación" style={{ width: '28%' }} />
              <Column body={currencyTemplate} header="M" style={{ width: '3%' }} />
              <Column field="Total" header="Total" style={{ width: '7%' }} />
              <Column body={stateTemplate} header="Estado" style={{ width: '7%' }} />
              <Column
                body={(rowData) => actionTemplate(rowData, downloadPDF, downloadXML, downloadCDR)}
                header="Acciones"
                style={{ width: '14%' }}
              />
            </DataTable>
            <div
              className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4"
              style={{ textAlign: 'center' }}
            >
              <SplitButton
                className="button button--blue"
                icon="pi pi-file-excel"
                label="Exportar a Excel"
                model={items}
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
