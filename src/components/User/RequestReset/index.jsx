// Dependencies
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { isValidEmail } from '../../../utils';
import { useMessages } from '../../../hooks';
import FormField from '../../../sharedcomponents/FormField';
import styles from './styles.module.css';
import api from '../../../utils/api';

const RequestResetPassword = () => {
  const history = useHistory();
  const [showMessages, renderMessages] = useMessages();

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Campo obligatorio';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Correo electronico invalido';
    }
    return errors;
  };

  const RequestReset = async (values, actions) => {
    const res = await api.User.RequestReset({ email: values.email });
    switch (res.message) {
      case '01':
      case '02':
      case '03':
        showMessages('success', 'Muy bien!', 'Si tienes una cuenta, te enviaremos un enlace de restablecimiento');
        setTimeout(() => {
          actions.setSubmitting(false);
          history.push('/');
        }, 3000);
        break;
      default:
        showMessages('error', 'Error!', 'Algo ah salido mal');
        actions.setSubmitting(false);
        break;
    }
  };

  const formik = useFormik({
    initialValues: { email: '' },
    validate: (values) => fieldsValidation(values),
    onSubmit: (values, actions) => { RequestReset(values, actions); },
  });

  return (
    <>
      <div className={`${styles.jumbotron} p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-4`}>
        <form
          className="form p-grid p-dir-col"
          onSubmit={formik.handleSubmit}
        >
          <hgroup className="heading p-col-11 p-col-align-center">
            <h1 className="title">¿Olvidaste tu contraseña?</h1>
            <h2 className="subtitle">Le ayudaremos a restablecerlo</h2>
          </hgroup>
          <div className="p-col-11 p-col-align-center">
            {renderMessages()}
          </div>
          <FormField
            className="p-col-11 p-col-align-center"
            disabled={formik.isSubmitting}
            errors={formik.errors.email && formik.touched.email}
            errorMessage={formik.errors.email}
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            keyfilter="email"
            label="Correo electronico"
            name="email"
            type="email"
            value={formik.values.email}
          />
          <div className="p-col-8 p-xl-6 p-col-align-center">
            <Button
              label="Restablecer contraseña"
              className="button p-button-rounded"
              type="submit"
              disabled={formik.isSubmitting}
            />
          </div>
          {
            formik.isSubmitting && (
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
        </form>
      </div>
    </>
  );
};

export default RequestResetPassword;
