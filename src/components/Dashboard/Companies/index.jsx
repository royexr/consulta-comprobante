// Resources
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

// Resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { useMessages } from '../../../hooks';
import api from '../../../utils/api';
import { isEmptyObject } from '../../../utils';
import FormField from '../../../sharedcomponents/FormField';

const Companies = ({ userToken }) => {
  const [companies, setCompanies] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showMessages, renderMessages] = useMessages();

  const fetchCompanies = async (uT) => {
    if (!isEmptyObject(uT)) {
      const { data } = await api.User.GetCompanies(uT._id.email);
      const formatted = [];
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
    fetchCompanies(userToken);
  }, [userToken]);

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.businessNumber) {
      errors.businessNumber = 'Campo obligatorio';
    } else if (!(values.businessNumber.length === 11)) {
      errors.businessNumber = 'RUC invalido';
    }

    return errors;
  };

  const onSubmit = async (values, actions) => {
    const res = await api.Company.ReadById(values.businessNumber);
    if (res instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
    } else {
      switch (res.message) {
        case '01':
          showMessages('success', 'Muy bien!', 'Habilitaremos el acceso a la empresa despues de verificar tu acceso');
          setTimeout(() => {
            setShowDialog(false);
            actions.setSubmitting(false);
          }, 3000);
          break;
        default:
          showMessages('error', 'Error!', 'La Empresa no esta registrada en Pale');
          actions.setSubmitting(false);
          break;
      }
    }
  };

  const requestNewCompany = () => {
    setShowDialog(true);
  };

  return (
    <>
      {
        companies.length !== 0 && (
          <>
            <DataTable
              alwaysShowPaginator={false}
              className="p-col-12"
              columnResizeMode="fit"
              footer={(
                <div className="p-clearfix">
                  <Button
                    icon="pi pi-plus"
                    label="Solicitar nueva empresa"
                    style={{ float: 'right' }}
                    onClick={requestNewCompany}
                  />
                </div>
              )}
              rows={5}
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
        className="p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-4"
        header="Solicitar nueva empresa"
        modal
        visible={showDialog}
        onHide={() => setShowDialog(false)}
      >
        <Formik
          initialValues={{
            businessNumber: '',
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
                  className="form p-grid p-dir-col"
                  onSubmit={handleSubmit}
                >
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
                  <div className="p-col-10 p-col-align-center">
                    {renderMessages()}
                  </div>
                </form>
              </>
            )
          }
        </Formik>
      </Dialog>
    </>
  );
};

Companies.propTypes = {
  userToken: PropTypes.shape({
    _id: PropTypes.object,
    isEnabled: PropTypes.bool,
    password: PropTypes.string,
    type: PropTypes.number,
  }).isRequired,
};

export default Companies;
