// Dependencies
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';

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
import voucherCodes from '../../../utils/Objects';
import {
  currentMonthRange,
  createGetQuery,
  exportResume,
  exportDetailed,
} from '../../../utils';
import {
  useEntities,
  useMessages,
  useVoucherTypes,
} from '../../../hooks';
import {
  actionTemplate,
  currencyTemplate,
  dateTemplate,
  dtFooterVouchers,
  stateHeaderTemplate,
} from '../../../templates';

const Sales = ({ currentCompany }) => {
  const bookCode = '14';
  const { entities } = useEntities(currentCompany, bookCode);
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

  const validate = (values) => {
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
    const res = await api.Voucher.ReadMany(q);
    if (res instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
    } else if (res.code === '01') {
      const { data } = res;
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
      showMessages('error', 'Error!', 'Algo ah salido mal');
      setVouchers([]);
    }
    actions.setSubmitting(false);
  };

  // Concept: Datatable functions
  const [showPdfDialog, setShowPdfDialog] = useState(false);
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
      command: async () => {
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
    setShowPdfDialog(true);
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
    setShowPdfDialog(false);
    setPdfSource('');
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      voucherType: '',
      clientDoc: '',
      serie: '',
      number: '',
      startDate: fd.toISOString().slice(0, 10),
      endDate: ld.toISOString().slice(0, 10),
    },
    validate,
    onSubmit: (vals, actions) => { onSubmit(vals, actions); },
  });

  return (
    <>
      <div className="p-col-11">
        <form
          className="form form--filter p-grid p-justify-center"
          onSubmit={handleSubmit}
        >
          <hgroup className="heading p-col-12 p-col-align-center">
            <h1 className="title">VENTAS</h1>
          </hgroup>
          <div className="p-col-12 p-col-align-center">
            {renderMessages()}
          </div>
          <div className="p-col-12 p-md-10 p-lg-10 p-col-align-center">
            <div className="p-grid">
              <FormField
                className="p-col-12 p-sm-6 p-md-5 p-col-align-center"
                disabled={isSubmitting || globalLoading}
                handleChange={handleChange}
                label="Tipo de comprobante"
                name="voucherType"
                options={voucherTypes}
                showClear={values.voucherType !== ''}
                type="select"
                value={values.voucherType}
              />
              <FormField
                className="p-col-12 p-sm-6 p-md-7 p-col-align-center"
                disabled={isSubmitting || globalLoading || entities.length < 2}
                handleChange={handleChange}
                label="Empresa"
                name="clientDoc"
                suggestions={entities}
                type="autoComplete"
                value={values.clientDoc}
              />
              <FormField
                className="p-col-12 p-sm-2 p-col-align-center"
                disabled={isSubmitting || globalLoading}
                handleChange={handleChange}
                label="Serie"
                name="serie"
                type="text"
                value={values.serie}
              />
              <FormField
                className="p-col-12 p-sm-2 p-col-align-center"
                disabled={isSubmitting || globalLoading}
                handleChange={handleChange}
                label="Número"
                name="number"
                type="text"
                value={values.number}
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
        </form>
      </div>
      <Dialog
        blockScroll
        className="p-col-11"
        header="PDF"
        visible={showPdfDialog}
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
              multiSortMeta={[{ field: 'FechaEmision', order: -1 }]}
              paginator
              responsive
              rows={50}
              rowClassName={() => ({ 'table-row': true })}
              rowsPerPageOptions={[50, 100, 200]}
              removableSort
              sortMode="multiple"
              value={vouchers}
            >
              <Column
                body={dateTemplate}
                field="FechaEmision"
                header="Fecha"
                style={{ width: '10%' }}
                sortable
              />
              <Column
                field="Cod_TipoOperacion"
                header="Tipo"
                style={{ width: '5%' }}
                sortable
              />
              <Column
                field="Serie"
                header="Serie"
                style={{ width: '5%' }}
                sortable
              />
              <Column
                field="Numero"
                header="Numero"
                style={{ width: '10%' }}
                sortable
              />
              <Column
                field="Doc_Cliente"
                header="N. Documento"
                style={{ width: '12%' }}
              />
              <Column
                field="Nom_Cliente"
                header="Denominación"
                style={{ width: '28%' }}
              />
              <Column
                body={currencyTemplate}
                header="M"
                style={{ width: '3%', textAlign: 'right' }}
              />
              <Column
                body={(rowData) => rowData.Total.toFixed(2)}
                header="Total"
                style={{ width: '7%', textAlign: 'right' }}
              />
              <Column
                field="Cod_EstadoComprobante"
                header={stateHeaderTemplate}
                style={{ width: '7%' }}
              />
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
                tooltip="El tiempo para generar el reporte dependera de la cantidad de comprobantes"
                tooltipOptions={{
                  event: 'hover',
                  position: 'top',
                }}
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

Sales.propTypes = {
  currentCompany: PropTypes.string.isRequired,
};

export default Sales;
