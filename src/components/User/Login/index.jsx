// Dependencies
import CryptoJS from 'crypto-js';
import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';

// Resources
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import FormField from '../../../sharedcomponents/FormField';
import { isValidEmail } from '../../../utils';
import api from '../../../utils/api';
import styles from './styles.module.css';
import { useMessages } from '../../../hooks';

const Login = ({ signIn }) => {
  const history = useHistory();
  const [showMessages, renderMessages] = useMessages();

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

  const SignIn = async (credentials, actions) => {
    const userInfo = { ...credentials };
    userInfo.password = CryptoJS.AES.encrypt(userInfo.password, userInfo.email).toString();
    const loginR = await api.User.SignIn({ userInfo });
    actions.setSubmitting(false);
    if (loginR instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
    } else {
      switch (loginR.resCode) {
        case '01':
          signIn(loginR.data);
          history.push('/dashboard');
          break;
        case '02':
          showMessages('error', 'Error!', 'Contraseña incorrecta');
          break;
        case '03':
          showMessages('error', 'Error!', 'El usuario no existe');
          break;
        default:
          break;
      }
    }
  };

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validate: (values) => fieldsValidation(values),
    onSubmit: (values, actions) => { SignIn(values, actions); },
  });

  const CreateAccount = (e) => {
    e.preventDefault();
    history.push('/register');
  };

  return (
    <>
      <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
        <form
          className="form p-grid p-dir-col"
          onSubmit={formik.handleSubmit}
        >
          <hgroup className="heading p-col-11 p-col-align-center">
            <h1 className="title">Inicia sesión en Pale</h1>
            <h2 className="subtitle">Ingrese sus datos a continuación</h2>
          </hgroup>
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
          <FormField
            className="p-col-11 p-col-align-center"
            disabled={formik.isSubmitting}
            errors={formik.errors.password && formik.touched.password}
            errorMessage={formik.errors.password}
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            label="Contraseña"
            name="password"
            type="password"
            value={formik.values.password}
          />
          <div className="p-col-6 p-xl-4 p-col-align-center">
            <Button
              label="Iniciar sesión"
              className="button p-button-rounded"
              type="submit"
              disabled={formik.isSubmitting}
            />
          </div>
          {
            formik.isSubmitting && (
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
          <Link className="text--center p-col-align-center" to="/request-reset" style={{ pointerEvents: formik.isSubmitting && 'none' }}>¿olvidaste tu contraseña?</Link>
          <div className="p-col-11 p-col-align-center">
            {renderMessages()}
          </div>
          <hr className="mb-15" style={{ width: '100%' }} />
          <div className="p-grid p-dir-col">
            <small className="text--center p-col-align-center">¿no tienes cuenta?</small>
            <div className="p-col-6 p-xl-4 p-col-align-center">
              <Button
                className="p-button-secondary p-button-rounded button"
                disabled={formik.isSubmitting}
                label="Regístrate"
                onClick={CreateAccount}
                type="button"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

Login.propTypes = {
  signIn: PropTypes.func.isRequired,
};

export default Login;
