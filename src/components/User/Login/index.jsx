// Dependencies
import CryptoJS from 'crypto-js';
import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';

// Resources
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { isValidEmail } from '../../../utils';
import { useMessages } from '../../../hooks';
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';
import styles from './styles.module.css';

const Login = ({ signIn }) => {
  const history = useHistory();
  const [showMessages, renderMessages] = useMessages();

  const SignIn = async (credentials, actions) => {
    const userInfo = { ...credentials };
    userInfo.password = CryptoJS.AES.encrypt(userInfo.password, userInfo.email).toString();
    const loginR = await api.User.SignIn({ userInfo });
    if (loginR instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
      actions.setSubmitting(false);
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
        case '04':
          showMessages('error', 'Error!', 'El usuario no ah terminado su registro, revise su correo');
          break;
        default:
          break;
      }
      actions.setSubmitting(false);
    }
  };

  const validate = (values) => {
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

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: { email: '', password: '' },
    validate,
    onSubmit: (vals, actions) => { SignIn(vals, actions); },
  });

  const CreateAccount = (e) => {
    e.preventDefault();
    history.push('/register');
  };

  return (
    <>
      <div className={`${styles.jumbotron} p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-4`}>
        <form
          className="form p-grid p-dir-col"
          onSubmit={handleSubmit}
        >
          <hgroup className="heading p-col-12 p-col-align-center">
            <h1 className="title">Inicia sesión en Pale</h1>
            <h2 className="subtitle">Ingrese sus datos a continuación</h2>
          </hgroup>
          <div className="p-col-12 p-col-align-center">
            {renderMessages()}
          </div>
          <FormField
            className="p-col-12 p-col-align-center"
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
            className="p-col-12 p-col-align-center"
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
          <div className="p-col-6 p-xl-4 p-col-align-center">
            <Button
              label="Iniciar sesión"
              className="button p-button-rounded"
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
          <Link className="text--center p-col-align-center" to="/request-reset" style={{ pointerEvents: isSubmitting && 'none' }}>¿olvidaste tu contraseña?</Link>
          <hr className="mb-15" style={{ width: '100%' }} />
          <div className="p-grid p-dir-col">
            <small className="text--center p-col-align-center">¿no tienes cuenta?</small>
            <div className="p-col-6 p-xl-4 p-col-align-center">
              <Button
                className="p-button-secondary p-button-rounded button"
                disabled={isSubmitting}
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
