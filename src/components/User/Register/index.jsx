// Dependencies
import React from 'react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import CryptoJS from 'crypto-js';

// Resources
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './styles.module.css';
import FormField from '../../../sharedcomponents/FormField';
import { isValidEmail } from '../../../utils';
import api from '../../../utils/api';
import { useMessages } from '../../../hooks';

const Register = () => {
  const history = useHistory();
  const [showMessages, renderMessages] = useMessages();

  const leave = () => {
    history.push('/');
  };

  const register = async (values, actions) => {
    const userInfo = { ...values };
    const userRes = await api.User.GetById(values.email);
    if (userRes instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
      actions.setSubmitting(false);
    } else if (userRes.code === '02') {
      delete userInfo.confirmPassword;
      userInfo.password = CryptoJS.AES.encrypt(userInfo.password, userInfo.email).toString();
      const { code } = await api.UserCode.Create(userInfo);
      switch (code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Te enviaremos un mensaje para continuar con tu registro');
          setTimeout(() => {
            actions.setSubmitting(false);
            history.push('/');
          }, 3000);
          break;
        case '02':
          showMessages('warn', 'Alerta!', 'El correo electronico ya se registro, revise su bandeja de entrada');
          actions.setSubmitting(false);
          break;
        default:
          showMessages('error', 'Error!', 'Algo ah salido mal');
          actions.setSubmitting(false);
          break;
      }
    } else {
      showMessages('error', 'Error!', 'El correo ya esta registrado');
      actions.setSubmitting(false);
    }
  };

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

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate,
    onSubmit: (vals, actions) => { register(vals, actions); },
  });

  return (
    <div className={`${styles.jumbotron} p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-4`}>
      <form
        className="form p-grid p-dir-col"
        onSubmit={handleSubmit}
      >
        <hgroup className="heading p-col-11 p-col-align-center">
          <h1 className="title">Solicitud</h1>
          <h2 className="subtitle">Ingresa tus datos personales y nos contactaremos contigo</h2>
        </hgroup>
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
        <div className="p-col-11 p-col-align-center">
          <div className="p-grid p-justify-between">
            <div className="p-col-6 p-xl-5">
              <Button
                className="button p-button-rounded p-button-danger"
                disabled={isSubmitting}
                label="Atras"
                onClick={leave}
                type="button"
              />
            </div>
            <div className="p-col-6 p-xl-5">
              <Button
                className="button p-button-rounded"
                disabled={isSubmitting}
                label="Registrar"
                type="submit"
              />
            </div>
          </div>
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
      </form>
    </div>
  );
};

export default Register;
