// Resources
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import jwt from 'jsonwebtoken';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMessages } from '../../../hooks';
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';
import config from '../../../config';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showMessages, renderMessages] = useMessages();

  const fetchCompanies = async () => {
    const { _id } = jwt.verify(
      sessionStorage.getItem('userJWT'),
      config.jwtSecret,
    );
    const { data } = await api.User.GetCompanies(_id.email);
    const formatted = [];
    if (data[0].companies !== undefined) {
      for (let i = 0; i < data[0].companies.length; i += 1) {
        const r = data[0].companies[i];
        const aux = data[0].companiesInfo.filter((d) => d.RUC === r.number);
        aux[0].isEnabled = r.isEnabled;
        formatted.push(aux[0]);
      }
      setCompanies(formatted);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const validate = (values) => {
    const errors = {};
    if (!values.businessNumber) {
      errors.businessNumber = 'Campo obligatorio';
    } else if (!(values.businessNumber.length === 11)) {
      errors.businessNumber = 'RUC invalido';
    }

    return errors;
  };

  const onSubmit = async (values, actions) => {
    const registered = companies.filter((c) => values.businessNumber === c.RUC);
    if (registered.length === 0) {
      const { _id } = jwt.verify(
        sessionStorage.getItem('userJWT'),
        config.jwtSecret,
      );
      const res = await api.User.AddCompany({
        businessNumber: values.businessNumber,
        email: _id.email,
      });
      if (res instanceof TypeError) {
        showMessages('error', 'Error!', 'No hay conexion');
      } else {
        switch (res.code) {
          case '01':
            showMessages('success', 'Muy bien!', 'Habilitaremos el acceso a la empresa despues de verificar tus datos');
            companies.push(res.data);
            setCompanies(companies);
            setTimeout(() => {
              setShowDialog(false);
              actions.setSubmitting(false);
            }, 3000);
            break;
          case '02':
            showMessages('error', 'Error!', 'No se pude conpletar la solicitud');
            actions.setSubmitting(false);
            break;
          default:
            showMessages('error', 'Error!', 'La Empresa no esta registrada en Pale');
            actions.setSubmitting(false);
            break;
        }
      }
    } else {
      showMessages('warn', 'Alerta!', 'La empresa ya esta registrada');
      actions.setSubmitting(false);
    }
  };

  const requestNewCompany = () => {
    setShowDialog(true);
  };

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
  } = useFormik({
    initialValues: { businessNumber: '' },
    validate,
    onSubmit: (vals, actions) => { onSubmit(vals, actions); },
  });

  return (
    <>
      <Button
        icon="pi pi-plus"
        label="Solicitar nueva empresa"
        onClick={requestNewCompany}
      />
      {
        companies.length > 0 && (
          <>
            <DataTable
              alwaysShowPaginator={false}
              className="p-col-12"
              columnResizeMode="fit"
              rows={5}
              rowClassName={() => ({ 'table-row': true })}
              rowsPerPageOptions={[5, 10, 15]}
              paginator
              responsive
              removableSort
              sortMode="multiple"
              value={companies}
            >
              <Column field="RUC" header="RUC" />
              <Column field="Nom_Comercial" header="Nombre comercial" />
              <Column field="RazonSocial" header="Razón social" />
              <Column field="Cod_Ubigeo" header="Ubigeo" />
              <Column
                body={(rowData) => (
                  <a
                    href={`http://${rowData.Web}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {rowData.Web}
                  </a>
                )}
                header="Página web"
              />
              <Column
                body={(rowData) => (rowData.isEnabled ? 'SI' : 'NO')}
                header="Habilitado"
              />
            </DataTable>
          </>
        )
      }
      <Dialog
        blockScroll
        className="p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-4"
        header="Solicitar nueva empresa"
        modal
        visible={showDialog}
        onHide={() => setShowDialog(false)}
      >
        <form
          className="form p-grid p-dir-col"
          onSubmit={handleSubmit}
        >
          <div className="p-col-10 p-col-align-center">
            {renderMessages()}
          </div>
          <FormField
            className="p-col-10 p-col-align-center"
            disabled={isSubmitting}
            errors={errors.businessNumber && touched.businessNumber}
            errorMessage={errors.businessNumber}
            handleBlur={handleBlur}
            handleChange={handleChange}
            keyfilter="pint"
            label="RUC"
            maxLength="11"
            name="businessNumber"
            type="text"
            value={values.businessNumber}
          />
          <div className="p-col-10 p-md-5 p-md-4 p-col-align-center">
            <Button
              className="p-button-rounded p-button-primary button"
              label="Solicitar"
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
        </form>
      </Dialog>
    </>
  );
};

export default Companies;
