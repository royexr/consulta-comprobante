// Dependencies
import React, { useState } from 'react';
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
import {
  currentMonthRange,
  createGetQuery,
  exportResume,
  exportDetailed,
} from '../../../utils';
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
  dtFooterVouchers,
  stateTemplate,
} from '../../../formikTemplates';

const Purchases = ({ currentCompany }) => {
  const bookCode = '08';
  const { entities } = useEntities(currentCompany, bookCode);
  const { seriesNumbers } = useSeriesNumbers(currentCompany, bookCode);
  const { voucherTypes } = useVoucherTypes();
  const [showMessages, renderMessages] = useMessages();
  const [globalLoading, setGlobalLoading] = useState(false);

  // Concept: Formik default value
  const { firstDay, lastDay } = currentMonthRange();
  const [fd] = useState(firstDay);
  const [ld] = useState(lastDay);

  // Concept: Formik functions
  const [query, setQuery] = useState('');
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
    const q = createGetQuery(bookCode, currentCompany, values);
    setQuery(q);
    const vouchersR = await api.Voucher.ReadMany(q);
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

  // const fetchInitialInvoices = async (cc, first, last) => {
  //   if (cc !== undefined && cc.length > 0) {
  //     const aux = {
  //       startDate: first.toISOString().slice(0, 10),
  //       endDate: last.toISOString().slice(0, 10),
  //     };
  //     let query = `bookCode=14&companyCode=${cc}&`;
  //     const vKeys = Object.keys(aux);
  //     for (let i = 0; i < vKeys.length; i += 1) {
  //       const key = vKeys[i];
  //       if (aux[key] !== '') {
  //         query = query.concat(`${key}=${aux[key]}`);
  //       }
  //       query = i < vKeys.length - 1 ? query.concat('&') : query.concat('');
  //     }
  //     const vouchersR = await api.Voucher.ReadMany(query);
  //     if (vouchersR.message === '01') {
  //       const { data } = vouchersR;
  //       if (data.length !== 0) {
  //         let sumF = 0; let sumB = 0; let sumNC = 0; let sumND = 0;
  //         for (let i = 0; i < data.length; i += 1) {
  //           const e = data[i];
  //           switch (e.Cod_TipoComprobante) {
  //             case 'FE' || 'FC':
  //               sumF += e.Total * e.TipoCambio;
  //               break;
  //             case 'BE' || 'BC':
  //               sumB += e.Total * e.TipoCambio;
  //               break;
  //             case 'NCE' || 'NCC':
  //               sumNC += e.Total * e.TipoCambio;
  //               break;
  //             case 'NDE' || 'NDC':
  //               sumND += e.Total * e.TipoCambio;
  //               break;
  //             default:
  //               break;
  //           }
  //         }
  //         setTotalF(Math.round(sumF * 100) / 100);
  //         setTotalB(Math.round(sumB * 100) / 100);
  //         setTotalNC(Math.round(sumNC * 100) / 100);
  //         setTotalND(Math.round(sumND * 100) / 100);
  //         setQuantity(data.length);
  //         setVouchers(data);
  //       } else {
  //         setVouchers([]);
  //       }
  //     } else {
  //       setVouchers([]);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchInitialInvoices(currentCompany, fd, ld);
  // }, [currentCompany, fd, ld]);

  // Concept: Datatable functions
  const [isShowingPDF, setShowingPDF] = useState(false);
  const [pdfSource, setPdfSource] = useState('');
  const items = [
    {
      label: 'Resumen',
      icon: 'pi pi-file-o',
      command: () => {
        setGlobalLoading(true);
        exportResume(bookCode, currentCompany, query)
          .then(() => {
            setGlobalLoading(false);
          });
      },
    },
    {
      label: 'Detallado',
      icon: 'pi pi-file',
      command: () => {
        setGlobalLoading(true);
        exportDetailed(bookCode, currentCompany, query)
          .then(() => {
            setGlobalLoading(false);
          });
      },
    },
  ];

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
                  <hgroup className="heading p-col-12 p-col-align-center">
                    <h1 className="title">COMPRAS</h1>
                  </hgroup>
                  <div className="p-col-12 p-md-10 p-lg-10 p-col-align-center">
                    <div className="p-grid">
                      <FormField
                        className="p-col-12 p-sm-6 p-md-5 p-col-align-center"
                        disabled={isSubmitting || globalLoading}
                        handleChange={handleChange}
                        label="Tipo de comprobante"
                        name="voucherType"
                        options={voucherTypes}
                        type="select"
                        value={values.voucherType}
                      />
                      <FormField
                        className="p-col-12 p-sm-6 p-md-7 p-col-align-center"
                        disabled={isSubmitting || globalLoading}
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
                        className="p-col-12 p-sm-4 p-col-align-center"
                        disabled={isSubmitting || globalLoading}
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
                        className="p-col-12 p-sm-4 p-col-align-center"
                        disabled={isSubmitting || globalLoading}
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
                        className="p-col-12 p-sm-4 p-col-align-center"
                        disabled={isSubmitting || globalLoading}
                        errors={errors.endDate && touched.endDate}
                        errorMessage={errors.endDate}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        label="Fecha final"
                        name="endDate"
                        type="date"
                        value={values.endDate}
                      />
                    </div>
                  </div>
                  <div className="p-col-12 p-sm-4 p-md-2 p-col-align-center">
                    <Button
                      className="p-button-rounded button button--blue button--small"
                      label="Filtrar"
                      disabled={isSubmitting || globalLoading}
                      type="submit"
                    />
                  </div>
                  {
                    isSubmitting && (
                      <div className="p-col-align-center">
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
              footer={dtFooterVouchers(totalF, totalB, totalNC, totalND, quantity)}
              multiSortMeta={[{ field: 'FechaEmision', order: 1 }]}
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
                body={(rowData) => actionTemplate(
                  rowData,
                  globalLoading,
                  downloadPDF,
                  downloadXML,
                  downloadCDR,
                )}
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
                disabled={globalLoading}
                icon="pi pi-file-excel"
                label="Exportar a Excel"
                model={items}
              />
            </div>
          </>
        )
      }
      {
        globalLoading && (
          <ProgressSpinner
            strokeWidth="6"
            style={{
              width: '2rem',
              height: '2rem',
            }}
          />
        )
      }
    </>
  );
};

Purchases.propTypes = {
  currentCompany: PropTypes.string.isRequired,
};

export default Purchases;
