// Dependencies
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useLocation, useHistory } from 'react-router-dom';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { ProgressSpinner } from 'primereact/progressspinner';
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';

const ResetPassword = () => {
  const history = useHistory();
  const location = useLocation();
  const [messages, setMessages] = useState(new Messages());

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = 'Campo obligatorio';
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Campo obligatorio';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no son iguales';
    }
    return errors;
  };

  const showMessage = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
  };

  const Reset = async (values, actions) => {
    const aux = { ...values };
    const urlParams = new window.URLSearchParams(location.search);
    const email = urlParams.get('email');
    delete aux.confirmPassword;
    aux.password = CryptoJS.AES.encrypt(aux.password, email).toString();
    const res = await api.User.ResetPassword(aux, location.search);
    switch (res.message) {
      case '01':
        showMessage('success', 'Muy bien!', 'Se actualizaron tus datos');
        setTimeout(() => {
          actions.setSubmitting(false);
          history.push('/');
        }, 3000);
        break;
      default:
        showMessage('error', 'Error!', 'Tu codigo de restablecimiento expiro');
        setTimeout(() => {
          actions.setSubmitting(false);
        }, 3000);
        break;
    }
  };

  return (
    <>
      <div className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4">
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validate={(values) => fieldsValidation(values)}
          onSubmit={(values, actions) => { Reset(values, actions); }}
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
              <form
                className="form p-grid p-dir-col p-nogutter"
                onSubmit={handleSubmit}
              >
                <hgroup className="heading p-col-11 p-col-align-center">
                  <h1 className="title">Por favor, ingresa tu nueva contraseña</h1>
                </hgroup>
                <FormField
                  className="mb-15 p-col-11 p-col-align-center"
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
                  className="mb-15 p-col-11 p-col-align-center"
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
                <div className="mb-15 p-col-10 p-xl-6 p-col-align-center">
                  <Button
                    label="Establecer nueva contraseña"
                    className="button"
                    type="submit"
                    disabled={isSubmitting}
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
            )
          }
        </Formik>
      </div>
    </>
  );
};

export default ResetPassword;
