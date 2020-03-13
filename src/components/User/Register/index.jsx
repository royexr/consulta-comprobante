// Dependencies
import React from 'react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
// import CryptoJS from 'crypto-js';

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
    const emailRes = await api.User.GetById(values.email);
    if (emailRes instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
      actions.setSubmitting(false);
    } else if (emailRes.message === '02') {
      // delete userInfo.confirmPassword;
      // userInfo.password = CryptoJS.AES.encrypt(userInfo.password, userInfo.email).toString();
      const res = await api.User.Create(userInfo);
      switch (res.message) {
        case '01':
        case '02':
        case '03':
          showMessages('success', 'Muy bien!', 'Te enviaremos un mensaje para continuar con tu registro');
          setTimeout(() => {
            actions.setSubmitting(false);
            history.push('/');
          }, 3000);
          break;
        default:
          showMessages('error', 'Error!', 'Se ah producido un error');
          actions.setSubmitting(false);
          break;
      }
    } else {
      showMessages('error', 'Error!', 'El correo ya esta registrado');
      actions.setSubmitting(false);
    }
  };

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
    // if (!values.password) {
    //   errors.password = 'Campo obligatorio';
    // }
    // if (!values.confirmPassword) {
    //   errors.confirmPassword = 'Campo obligatorio';
    // } else if (values.password !== values.confirmPassword) {
    //   errors.confirmPassword = 'Las contraseñas no son iguales';
    // }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      docNumber: '',
      cellphone: '',
      // password: '',
      // confirmPassword: '',
    },
    validate: (values) => fieldsValidation(values),
    onSubmit: (values, actions) => { register(values, actions); },
  });

  return (
    <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
      <form
        className="form p-grid p-dir-col"
        onSubmit={formik.handleSubmit}
      >
        <hgroup className="heading p-col-11 p-col-align-center">
          <h1 className="title">Solicitud</h1>
          <h2 className="subtitle">Ingresa tus datos personales y nos contactaremos contigo</h2>
        </hgroup>
        <FormField
          className="p-col-11 p-col-align-center"
          disabled={formik.isSubmitting}
          errors={formik.errors.name && formik.touched.name}
          errorMessage={formik.errors.name}
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          label="Nombre completo"
          name="name"
          type="text"
          value={formik.values.name}
        />
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
          errors={formik.errors.docNumber && formik.touched.docNumber}
          errorMessage={formik.errors.docNumber}
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          keyfilter="pint"
          label="DNI"
          maxLength="8"
          name="docNumber"
          type="text"
          value={formik.values.docNumber}
        />
        <FormField
          className="p-col-11 p-col-align-center"
          disabled={formik.isSubmitting}
          errors={formik.errors.cellphone && formik.touched.cellphone}
          errorMessage={formik.errors.cellphone}
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          keyfilter="pint"
          label="Celular"
          maxLength="9"
          name="cellphone"
          type="text"
          value={formik.values.cellphone}
        />
        {/* <FormField
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
        <FormField
          className="p-col-11 p-col-align-center"
          disabled={formik.isSubmitting}
          errors={formik.errors.confirmPassword && formik.touched.confirmPassword}
          errorMessage={formik.errors.confirmPassword}
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
        /> */}
        <div className="p-col-11 p-col-align-center">
          <div className="p-grid p-justify-between">
            <div className="p-col-6 p-xl-5">
              <Button
                className="button p-button-rounded p-button-danger"
                disabled={formik.isSubmitting}
                label="Atras"
                onClick={leave}
                type="button"
              />
            </div>
            <div className="p-col-6 p-xl-5">
              <Button
                className="button p-button-rounded"
                disabled={formik.isSubmitting}
                label="Registrar"
                type="submit"
              />
            </div>
          </div>
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
        <div className="p-col-12 p-col-align-center">
          {renderMessages()}
        </div>
      </form>
    </div>
  );
};

export default Register;
