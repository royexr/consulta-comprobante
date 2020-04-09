// Dependencies
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Form, FieldArray } from 'formik';
import CryptoJS from 'crypto-js';

// resources
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMessages } from '../../../../hooks';
import FormField from '../../../../sharedcomponents/FormField';
import { isValidEmail } from '../../../../utils';
import api from '../../../../utils/api';

const Edit = () => {
  const history = useHistory();
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
    const userRes = await api.User.UpdateUser(obj);
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
    if (!values.docNumber) {
      errors.docNumber = 'Campo obligatorio';
    } else if (!(values.docNumber.length === 8)) {
      errors.docNumber = 'Número de documento invalido';
    }
    if (!values.cellphone) {
      errors.cellphone = 'Campo obligatorio';
    } else if (!values.cellphone.startsWith('9') || !(values.cellphone.length === 9)) {
      errors.cellphone = 'Numero de celular invalido';
    }
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
    if (values.type === '0') {
      errors.type = 'Campo obligatorio';
    }
    return errors;
  };

  const onSubmit = (values, actions) => {
    if (userId !== undefined) {
      updateUser(values, actions);
    } else {
      createUser(values, actions);
    }
  };

  const {
    _id,
    name,
    docNumber,
    cellphone,
    type,
    companies,
  } = user;


  return (
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
        companies: companies !== undefined ? companies : [],
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
            options={[
              {
                label: 'Cliente',
                value: 1,
              },
              {
                label: 'Administrador',
                value: 2,
              },
              {
                label: 'Super Administrador',
                value: 3,
              },
            ]}
            type="select"
            value={values.type}
          />
          {
            values.type.toString() !== '2' && (
              <Fieldset className="p-col-11 p-col-align-center" legend="Empresas">
                <FieldArray
                  className="p-grid p-dir-col"
                  name="companies"
                  render={(arrayHelpers) => (
                    <>
                      {values.companies.map((company, idx) => (
                        <div className="p-inputgroup p-col-12 form__field" key={companies.indexOf(company)}>
                          <span className="p-inputgroup-addon">
                            <Checkbox
                              id={`companies.${idx}.isEnabled`}
                              name={`companies.${idx}.isEnabled`}
                              checked={company.isEnabled}
                              onChange={handleChange}
                            />
                          </span>
                          <InputText
                            disabled={isSubmitting}
                            keyfilter="pint"
                            maxLength="11"
                            name={`companies.${idx}.number`}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="RUC"
                            type="text"
                            value={company.number}
                          />
                          <Button
                            className="p-button-danger"
                            icon="pi pi-minus"
                            onClick={() => arrayHelpers.remove(idx)}
                            type="button"
                          />
                        </div>
                      ))}
                      <Button
                        className="p-button-rounded"
                        label="Agregar empresa"
                        onClick={() => arrayHelpers.push({ number: '', isEnabled: false })}
                        type="button"
                      />
                    </>
                  )}
                />
              </Fieldset>
            )
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
              <div className="p-col-6 p-xl-5">
                <Button
                  className="p-button-rounded p-button-danger button"
                  disabled={isSubmitting}
                  label="Cancelar"
                  onClick={() => history.goBack()}
                  type="button"
                />
              </div>
              <div className="p-col-6 p-xl-5">
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
  );
};

export default Edit;
