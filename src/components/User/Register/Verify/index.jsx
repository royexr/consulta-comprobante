// Dependencies
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import FormField from '../../../../sharedcomponents/FormField';
import api from '../../../../utils/api';
import Timer from '../../../../sharedcomponents/Timer';

const Verify = ({ data, previousStep, register }) => {
  let messages = new Messages();
  const [wasSended, setWasSended] = useState(false);
  const [expirationDate, setExpirationDate] = useState(new Date(Date.now()));

  const showMessage = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
  };

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.code) {
      errors.code = 'Introduzca el codigo de confirmacion';
    }
    return errors;
  };

  const sendMail = async (values) => {
    setWasSended(true);
    setTimeout(() => {
      setWasSended(false);
    }, 1000 * 60 * 5);
    const email = { email: values.email };
    const res = await api.User.SendMail(email);
    if (res instanceof TypeError) {
      showMessage('error', 'Error!', 'No hay conexion');
    } else if (res.message === '01' || res.message === '02') {
      setExpirationDate(new Date(res.data.expirationDate));
    } else {
      showMessage('error', 'Error!', 'no se pudo enviar el correo');
    }
  };

  const verifyCode = async (values) => {
    const aux = { ...values };
    aux.code = aux.code.replace(/-/g, '');
    const res = await api.User.VerifyEmail(aux);
    if (res instanceof TypeError) {
      showMessage('error', 'Error!', 'No hay conexion');
    } else if (res.message === '01') {
      register(aux);
    } else {
      showMessage('error', 'Error!', 'Código incorrecto');
    }
  };

  return (
    <>
      <Formik
        initialValues={data}
        validate={(values) => fieldsValidation(values)}
        onSubmit={(values) => verifyCode(values)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
        }) => (
          <form className="form p-grid p-dir-col p-nogutter" onSubmit={handleSubmit}>
            <hgroup className="heading">
              <h1 className="title">Verificación de correo</h1>
            </hgroup>
            <div className="mb-15 p-col-11 p-col-align-center">
              <span className="p-float-label">
                <input className="p-filled input--hidden" />
                <div className="p-inputgroup">
                  <InputText
                    autoComplete="off"
                    id="email"
                    name="email"
                    disabled
                    style={{ width: '100%' }}
                    value={data.email}
                  />
                  <Button
                    icon="pi pi-envelope"
                    className="p-button-warning"
                    onClick={() => sendMail(data)}
                    tooltip="Haga click para enviar el código"
                    tooltipOptions={{ position: 'top' }}
                    type="button"
                    disabled={wasSended}
                  />
                </div>
                <label htmlFor="email">Correo electronico</label>
              </span>
            </div>
            {
              expirationDate !== undefined && (
                <Timer expirationDate={expirationDate} />
              )
            }
            <FormField
              className="mb-15 p-col-11 p-col-align-center"
              disabled={!wasSended}
              errors={errors.code && touched.code}
              errorMessage={errors.code}
              handleChange={handleChange}
              label="Codigo"
              mask="999-999"
              name="code"
              type="mask"
              value={values.code}
            />
            <div className="mb-15 p-col-11 p-col-align-center">
              <Messages ref={(el) => { messages = el; }} />
            </div>
            <div className="mb-15 p-col-11 p-col-align-center">
              <div className="p-grid p-justify-between">
                <div className="p-col-6 p-xl-5">
                  <Button
                    className="button p-button-danger"
                    label="Atras"
                    onClick={previousStep}
                    style={wasSended ? { display: 'none' } : { display: 'inline-block' }}
                  />
                </div>
                <div className="p-col-6 p-xl-5">
                  <Button
                    className="button"
                    disabled={!wasSended}
                    label="Registrar"
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

Verify.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
  previousStep: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

export default Verify;
