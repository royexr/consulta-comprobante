// Dependencies
import CryptoJS from 'crypto-js';
import React, { useState } from 'react';
import jwt from 'jsonwebtoken';
import { useHistory, Link } from 'react-router-dom';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

// Resources
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { ProgressSpinner } from 'primereact/progressspinner';
import FormField from '../../../sharedcomponents/FormField';
import { isValidEmail } from '../../../utils';
import api from '../../../utils/api';
import styles from './styles.module.css';

const Login = ({ signIn }) => {
  const history = useHistory();
  const [messages, setMessages] = useState(new Messages());

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Campo obligatorio';
    } else if (!isValidEmail(values.email)) {
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

  const SignIn = async (credentials, actions) => {
    const userInfo = { ...credentials };
    userInfo.password = CryptoJS.AES.encrypt(userInfo.password, userInfo.email).toString();
    const loginR = await api.User.SignIn({ userInfo });
    actions.setSubmitting(false);
    if (loginR instanceof TypeError) {
      showMessage('error', 'Error!', 'No hay conexion');
    } else {
      switch (loginR.resCode) {
        case '01':
          sessionStorage.setItem('userJWT', jwt.sign(loginR.data, 'pale'));
          signIn();
          history.push('/dashboard');
          break;
        case '02':
          showMessage('error', 'Error!', 'Contraseña incorrecta');
          break;
        case '03':
          showMessage('error', 'Error!', 'El usuario no existe');
          break;
        default:
          break;
      }
    }
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
          onSubmit={(values, actions) => SignIn(values, actions)}
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
                  <h1 className="title">Inicia sesión en Pale</h1>
                  <h2 className="subtitle">Ingrese sus datos a continuación</h2>
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
                <div className="mb-15 p-col-6 p-xl-4 p-col-align-center">
                  <Button
                    label="Iniciar sesión"
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
                <Link className="mb-15 text--centered p-col-align-center" to="/request-reset" style={{ pointerEvents: isSubmitting && 'none' }}>¿olvidaste tu contraseña?</Link>
                <div className="p-col-11 p-col-align-center">
                  <Messages ref={(el) => { setMessages(el); }} />
                </div>
                <hr className="mb-15" style={{ width: '100%' }} />
                <div className="p-grid p-dir-col">
                  <small className="text--centered p-col-align-center">¿no tienes cuenta?</small>
                  <div className="mb-15 p-col-6 p-xl-4 p-col-align-center">
                    <Button
                      className="p-button-secondary button"
                      disabled={isSubmitting}
                      label="Regístrate"
                      onClick={CreateAccount}
                      type="button"
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

Login.propTypes = {
  signIn: PropTypes.func.isRequired,
};

export default Login;
