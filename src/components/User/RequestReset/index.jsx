// Dependencies
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { ProgressSpinner } from 'primereact/progressspinner';
import FormField from '../../../sharedcomponents/FormField';
import styles from './styles.module.css';
import { isValidEmail } from '../../../utils';
import api from '../../../utils/api';

const RequestResetPassword = () => {
  const history = useHistory();
  const [messages, setMessages] = useState(new Messages());

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Campo obligatorio';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Correo electronico invalido';
    }
    return errors;
  };

  const showMessage = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
  };

  const RequestReset = async (values, actions) => {
    const res = await api.User.RequestReset({ email: values.email });
    switch (res.message) {
      case '01':
      case '02':
      case '03':
        showMessage('success', 'Muy bien!', 'Si tienes una cuenta, te enviaremos un enlace de restablecimiento');
        setTimeout(() => {
          actions.setSubmitting(false);
          history.push('/');
        }, 3000);
        break;
      default:
        showMessage('error', 'Error!', 'Se ah producido un error');
        actions.setSubmitting(false);
        break;
    }
  };

  return (
    <>
      <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
        <Formik
          initialValues={{ email: '' }}
          validate={(values) => fieldsValidation(values)}
          onSubmit={(values, actions) => {
            RequestReset(values, actions);
          }}
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
                  <h1 className="title">¿Olvidaste tu contraseña?</h1>
                  <h2 className="subtitle">Le ayudaremos a restablecerlo</h2>
                </hgroup>
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
                <div className="mb-15 p-col-8 p-xl-6 p-col-align-center">
                  <Button
                    label="Restablecer contraseña"
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

export default RequestResetPassword;
