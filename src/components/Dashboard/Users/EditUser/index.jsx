// Dependencies
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

// resources
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Fieldset } from 'primereact/fieldset';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMessages } from '../../../../hooks';
import FormField from '../../../../sharedcomponents/FormField';
import AddCompany from './AddCompany';
import config from '../../../../config';
import { isValidEmail } from '../../../../utils';
import api from '../../../../utils/api';

const EditUser = () => {
  const history = useHistory();
  const jwtToken = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);
  const userTypes = [
    {
      label: 'Cliente final',
      value: 1,
    },
    {
      label: 'Cliente Pale',
      value: 2,
    },
    {
      label: 'Administrador',
      value: 3,
    },
  ];
  if (jwtToken.type === 4) {
    userTypes.push({
      label: 'Super Administrador',
      value: 4,
    });
  }
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState({
    number: '',
    index: companies !== undefined ? companies.length : 0,
    isEnabled: false,
    type: 0,
  });
  const { userId } = useParams();
  const [user, setUser] = useState({
    _id: {
      email: '',
    },
    name: '',
    docNumber: '',
    cellphone: '',
    type: 0,
    companies: [],
  });
  const [showMessages, renderMessages] = useMessages();
  const [showDialog, setShowDialog] = useState(false);

  const createUser = async (values, actions) => {
    const obj = { ...values };
    delete obj.confirmPassword;
    obj.password = CryptoJS.AES.encrypt(obj.password, obj.email).toString();
    const res = await api.User.Create(obj);
    if (res instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexión');
      actions.setSubmitting(false);
    } else {
      switch (res.code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Se ha registrado al usuario');
          setTimeout(() => {
            history.goBack();
            actions.setSubmitting(false);
          }, 3000);
          break;
        case '02':
          showMessages('warn', 'Alerta!', 'Este usuario ya esta registrado');
          actions.setSubmitting(false);
          break;
        default:
          showMessages('error', 'Error!', 'Algo ah salido mal');
          actions.setSubmitting(false);
          break;
      }
    }
  };

  const updateUser = async (values, actions) => {
    const obj = { ...values };
    delete obj.confirmPassword;
    if (obj.password !== '') {
      obj.password = CryptoJS.AES.encrypt(
        obj.password,
        obj.email,
      ).toString();
    } else {
      delete obj.password;
    }
    const userRes = await api.User.Update(obj);
    if (userRes instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
      actions.setSubmitting(false);
    } else {
      switch (userRes.code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Se actualizaron los datos');
          setTimeout(() => {
            history.goBack();
            actions.setSubmitting(false);
          }, 3000);
          break;
        default:
          showMessages('error', 'Error!', 'Algo ah salido mal');
          actions.setSubmitting(false);
          break;
      }
    }
  };

  const fetchUser = async (id, h) => {
    if (id !== undefined) {
      const { data } = await api.User.GetById(id);
      if (data !== undefined) {
        setUser(data);
        setCompanies(data.companies);
      } else {
        h.goBack();
      }
    }
  };

  useEffect(() => {
    fetchUser(userId, history);
  }, [userId, history]);

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Campo obligatorio';
    }
    if (!values.email) {
      errors.email = 'Campo obligatorio';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Correo electronico invalido';
    }
    // if (!values.docNumber) {
    //   errors.docNumber = 'Campo obligatorio';
    // } else if (!(values.docNumber.length === 8)) {
    //   errors.docNumber = 'Número de documento invalido';
    // }
    // if (!values.cellphone) {
    //   errors.cellphone = 'Campo obligatorio';
    // } else if (!values.cellphone.startsWith('9') || !(values.cellphone.length === 9)) {
    //   errors.cellphone = 'Numero de celular invalido';
    // }
    if (userId !== undefined) {
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no son iguales';
      }
    } else {
      if (!values.password) {
        errors.password = 'Campo obligatorio';
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Campo obligatorio';
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no son iguales';
      }
    }
    if (values.type === 0) {
      errors.type = 'Campo obligatorio';
    }
    return errors;
  };

  const modifyCompanies = (index, element) => {
    const registered = companies.filter((c) => element.number === c.number);
    const auxC = [...companies];
    if (registered.length === 0) {
      if (index < auxC.length) {
        auxC.splice(index, 1, element);
      } else {
        auxC.push(element);
      }
    } else {
      auxC.splice(auxC.indexOf(registered[0]), 1, element);
    }
    setCompanies(auxC);
    setShowDialog(false);
  };

  const onSubmit = (values, actions) => {
    if (userId !== undefined) {
      updateUser(values, actions);
    } else {
      createUser(values, actions);
    }
  };

  const actionTemplate = (rowData, values) => (
    <>
      <Button
        className="p-button-rounded"
        icon="pi pi-pencil"
        onClick={() => {
          setShowDialog(true);
          setCompany({
            number: rowData.number,
            index: companies.indexOf(rowData),
            isEnabled: rowData.isEnabled,
            type: values.type,
          });
        }}
        style={{
          fontSize: '10px',
          marginRight: '0.5rem',
        }}
        type="button"
      />
      <Button
        className="p-button-rounded p-button-danger"
        icon="pi pi-trash"
        onClick={() => {
          const auxC = [...companies];
          auxC.splice(companies.indexOf(rowData), 1);
          setCompanies(auxC);
        }}
        style={{
          fontSize: '10px',
        }}
        type="button"
      />
    </>
  );

  const {
    _id,
    name,
    docNumber,
    cellphone,
    type,
  } = user;


  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          name,
          email: _id.email,
          docNumber,
          cellphone,
          password: '',
          confirmPassword: '',
          type,
          companies,
        }}
        onSubmit={(values, actions) => { onSubmit(values, actions); }}
        validate={validate}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <Form className="form p-grid p-dir-col" onSubmit={handleSubmit}>
            <div className="p-col-11 p-col-align-center">
              {renderMessages()}
            </div>
            <FormField
              className="p-col-11 p-col-align-center"
              disabled={isSubmitting}
              errors={errors.name && touched.name}
              errorMessage={errors.name}
              handleBlur={handleBlur}
              handleChange={handleChange}
              label="Nombre completo"
              name="name"
              type="text"
              value={values.name}
            />
            <FormField
              className="p-col-11 p-col-align-center"
              disabled={isSubmitting}
              errors={errors.email && touched.email}
              errorMessage={errors.email}
              handleBlur={handleBlur}
              handleChange={handleChange}
              keyfilter="email"
              label="Correo electronico"
              name="email"
              type="email"
              value={values.email}
            />
            <FormField
              className="p-col-11 p-col-align-center"
              disabled={isSubmitting}
              errors={errors.docNumber && touched.docNumber}
              errorMessage={errors.docNumber}
              handleBlur={handleBlur}
              handleChange={handleChange}
              keyfilter="pint"
              label="DNI"
              maxLength="8"
              name="docNumber"
              type="text"
              value={values.docNumber}
            />
            <FormField
              className="p-col-11 p-col-align-center"
              disabled={isSubmitting}
              errors={errors.cellphone && touched.cellphone}
              errorMessage={errors.cellphone}
              handleBlur={handleBlur}
              handleChange={handleChange}
              keyfilter="pint"
              label="Celular"
              maxLength="9"
              name="cellphone"
              type="text"
              value={values.cellphone}
            />
            <FormField
              className="p-col-11 p-col-align-center"
              disabled={isSubmitting}
              errors={errors.password && touched.password}
              errorMessage={errors.password}
              handleBlur={handleBlur}
              handleChange={handleChange}
              label="Contraseña"
              name="password"
              type="password"
              value={values.password}
            />
            <FormField
              className="p-col-11 p-col-align-center"
              disabled={isSubmitting}
              errors={errors.confirmPassword && touched.confirmPassword}
              errorMessage={errors.confirmPassword}
              handleBlur={handleBlur}
              handleChange={handleChange}
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
            />
            <FormField
              className="p-col-11 p-col-align-center"
              disabled={isSubmitting}
              errors={errors.type && touched.type}
              errorMessage={errors.type}
              handleChange={handleChange}
              label="Tipo de usuario"
              name="type"
              options={userTypes}
              type="select"
              value={values.type}
            />
            {
              values.type <= 2 && values.type !== 0 ? (
                <Fieldset className="p-col-11 p-col-align-center" legend="Empresas">
                  <div className="p-grid p-dir-col">
                    {
                      (values.type !== 1 || companies.length === 0) && (
                      <div className="p-col-10 p-sm-5 p-md-4 p-col-align-center">
                        <Button
                          className="button"
                          icon="pi pi-plus"
                          label="Agregar empresa"
                          onClick={() => {
                            setShowDialog(true);
                            setCompany({
                              number: '',
                              index: companies.length,
                              isEnabled: false,
                              type: values.type,
                            });
                          }}
                          type="button"
                        />
                      </div>
                      )
                    }
                    {
                      companies.length > 0 && (
                        <DataTable
                          alwaysShowPaginator={false}
                          className="p-col-12"
                          rows={5}
                          rowClassName={() => ({ 'table-row': true })}
                          value={companies}
                        >
                          <Column field="number" header="RUC" />
                          <Column
                            body={(rowData) => (rowData.isEnabled ? 'SI' : 'NO')}
                            header="Habilitado"
                          />
                          <Column
                            body={(rowData) => actionTemplate(rowData, values)}
                            header="Acciones"
                            style={{ textAlign: 'center' }}
                          />
                        </DataTable>
                      )
                    }
                  </div>
                </Fieldset>
              ) : (<></>)
            }
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
            <div className="p-col-10 p-md-5 p-md-4 p-col-align-center">
              <div className="p-grid p-justify-between">
                <div className="p-col-12 p-sm-6 p-xl-5">
                  <Button
                    className="p-button-rounded p-button-danger button"
                    disabled={isSubmitting}
                    label="Cancelar"
                    onClick={() => history.goBack()}
                    type="button"
                  />
                </div>
                <div className="p-col-12 p-sm-6 p-xl-5">
                  <Button
                    className="p-button-rounded button"
                    disabled={isSubmitting}
                    label="Guardar"
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <Dialog
        blockScroll
        className="p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-4"
        header="Agregar empresa"
        modal
        visible={showDialog}
        onHide={() => setShowDialog(false)}
      >
        <AddCompany
          number={company.number}
          index={company.index}
          isEnabled={company.isEnabled}
          modifyCompanies={modifyCompanies}
          type={company.type}
        />
      </Dialog>
    </>
  );
};

export default EditUser;
