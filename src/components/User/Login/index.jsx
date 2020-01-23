// Dependencies
import React from 'react';
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';
import styles from './styles.module.css';

const Login = () => {
  let messages = new Messages();
  const history = useHistory();

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Campo obligatorio';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Correo electronico invalido';
    }
    if (!values.password) {
      errors.password = 'Campo obligatorio';
    }
    return errors;
  };

  const showMessage = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
  };

  const SignIn = (credentials, setSubmitting) => {
    setTimeout(async () => {
      const loginR = await api.User.SignIn({ credentials });
      setSubmitting(false);
      switch (loginR.resCode) {
        case '01':
          sessionStorage.setItem('userJWT', jwt.sign(loginR.data, 'pale'));
          history.push('/voucherInquiry');
          break;
        case '02':
          showMessage('error', 'Error!', 'Contraseña incorrecta');
          break;
        case '03':
          showMessage('warn', 'Alerta!', 'El usuario esta inhabilitado');
          break;
        case '04':
          showMessage('error', 'Error!', 'El usuario no existe');
          break;
        default:
          break;
      }
    }, 1000);
  };

  const CreateAccount = (e) => {
    e.preventDefault();
    history.push('/register');
  };

  return (
    <>
      <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={(values) => fieldsValidation(values)}
          onSubmit={(values, { setSubmitting }) => SignIn(values, setSubmitting)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          /* and other goodies */
          }) => (
            <>
              <form
                className="form p-grid p-dir-col p-nogutter"
                onSubmit={handleSubmit}
              >
                <hgroup className={`${styles.heading} p-col-11 p-col-align-center`}>
                  <h1 className="title">Inicia sesión en Pale</h1>
                  <h2 className="subtitle">Ingrese sus datos a continuación</h2>
                </hgroup>
                <FormField
                  className="m-bottom-15 p-col-11 p-col-align-center"
                  errors={errors.email && touched.email}
                  errorMessage={errors.email}
                  handleChange={handleChange}
                  keyfilter="email"
                  label="Correo electronico"
                  name="email"
                  type="email"
                  value={values.email}
                />
                <FormField
                  className="m-bottom-15 p-col-11 p-col-align-center"
                  errors={errors.password && touched.password}
                  errorMessage={errors.password}
                  handleChange={handleChange}
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={values.password}
                />
                <div className="m-bottom-15 p-col-6 p-xl-4 p-col-align-center">
                  <Button
                    label="Iniciar sesión"
                    className="button"
                    type="submit"
                    disabled={isSubmitting}
                  />
                </div>
                <a className="m-bottom-15 text--centered p-col-align-center" href="/">¿olvidaste tu contraseña?</a>
                <div className="p-col-11 p-col-align-center">
                  <Messages ref={(el) => { messages = el; }} />
                </div>
              </form>
            </>
          )}
        </Formik>
        <hr className="m-bottom-15" />
        <div className="p-grid p-dir-col">
          <small className="text--centered p-col-align-center">¿no tienes cuenta?</small>
          <div className="m-bottom-15 p-col-6 p-xl-4 p-col-align-center">
            <Button label="Regístrate" className="p-button-secondary button" onClick={CreateAccount} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
