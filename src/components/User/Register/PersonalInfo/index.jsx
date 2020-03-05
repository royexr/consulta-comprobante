// Dependencies
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { ProgressSpinner } from 'primereact/progressspinner';
import FormField from '../../../../sharedcomponents/FormField';
import { isValidEmail } from '../../../../utils';
import api from '../../../../utils/api';

const PersonalInfo = ({ data, saveValues }) => {
  const history = useHistory();
  const [messages, setMessages] = useState(new Messages());

  const fieldsValidation = (values) => {
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

    return errors;
  };

  const leave = () => {
    history.push('/');
  };

  const showMessage = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
  };

  const verifyEmail = async (values, actions) => {
    const response = await api.User.GetById(values.email);
    if (response instanceof TypeError) {
      showMessage('error', 'Error!', 'No hay conexion');
    } else if (response.message === '02') {
      saveValues(values);
    } else {
      showMessage('error', 'Error!', 'El correo ya esta registrado');
    }
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={data}
      validate={(values) => fieldsValidation(values)}
      onSubmit={(values, actions) => { verifyEmail(values, actions); }}
    >
      {({
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
              <h1 className="title">Datos Personales</h1>
            </hgroup>
            <FormField
              className="mb-15 p-col-11 p-col-align-center"
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
              className="mb-15 p-col-11 p-col-align-center"
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
              className="mb-15 p-col-11 p-col-align-center"
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
              className="mb-15 p-col-11 p-col-align-center"
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
            <div className="mb-15 p-col-11 p-col-align-center">
              <Messages ref={(el) => { setMessages(el); }} />
            </div>
            <div className="mb-15 p-col-11 p-col-align-center">
              <div className="p-grid p-justify-between">
                <div className="p-col-6 p-xl-5">
                  <Button
                    className="button p-button-danger p-button-rounded"
                    label="Atras"
                    onClick={leave}
                    type="button"
                  />
                </div>
                <div className="p-col-6 p-xl-5">
                  <Button
                    label="Siguiente"
                    className="button p-button-rounded"
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </Formik>
  );
};

PersonalInfo.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    DNI: PropTypes.string,
    cellphone: PropTypes.string,
  }).isRequired,
  saveValues: PropTypes.func.isRequired,
};

export default PersonalInfo;
