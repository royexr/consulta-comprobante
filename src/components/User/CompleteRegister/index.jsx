// Dependencies
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useLocation, useHistory } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMessages } from '../../../hooks';
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';
import styles from './styles.module.css';

const CompleteRegister = () => {
  const history = useHistory();
  const location = useLocation();
  const urlParams = new window.URLSearchParams(location.search);
  const [isVerified, setIsVerified] = useState(false);
  const [showMessages, renderMessages] = useMessages();

  const validate = (values) => {
    const errors = {};
    if (!values.businessNumber) {
      errors.businessNumber = 'Campo obligatorio';
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
    return errors;
  };

  const verifyBN = async (businessNumber, setSubmitting) => {
    if (businessNumber.length !== 11) {
      showMessages('error', 'Error!', 'Número de RUC invalido');
      setIsVerified(false);
    } else {
      const res = await api.Company.ReadById(businessNumber);
      if (res.message === '01') {
        showMessages('success', 'Muy bien!');
        setIsVerified(true);
      } else {
        showMessages('error', 'Error!', 'La Empresa no esta registrada en Pale');
        setIsVerified(false);
      }
    }
    setSubmitting(false);
  };

  const completeSignUp = async (values, actions) => {
    const obj = { ...values };
    obj.email = urlParams.get('email');
    obj.code = urlParams.get('userId');
    const res = await api.User.CreateWithCode(obj);
    if (res instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexión');
      actions.setSubmitting(false);
    } else {
      switch (res.message) {
        case '01':
          showMessages('success', 'Muy bien!', 'Se han registrado los datos correctamente');
          setTimeout(() => {
            history.push('/');
            actions.setSubmitting(false);
          }, 3000);
          break;
        case '02':
          showMessages('warn', 'Alerta!', 'Este usuario ya esta registrado');
          actions.setSubmitting(false);
          break;
        case '03':
          showMessages('error', 'Error!', 'Tu codigo de registro expiro');
          actions.setSubmitting(false);
          break;
        default:
          showMessages('error', 'Error!', 'Algo ah salido mal');
          break;
      }
    }
  };

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
    touched,
    values,
  } = useFormik({
    initialValues: {
      businessNumber: '',
      docNumber: '',
      cellphone: '',
    },
    validate,
    onSubmit: (vals, actions) => { completeSignUp(vals, actions); },
  });

  return (
    <div className={`${styles.jumbotron} p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-4`}>
      <form
        className="form p-grid p-dir-col"
        onSubmit={handleSubmit}
      >
        <hgroup className="heading">
          <h1 className="title">Completar registro</h1>
        </hgroup>
        <div className="p-col-11 p-col-align-center">
          {renderMessages()}
        </div>
        <FormField
          buttonCN="p-button-warning"
          className="p-col-11 p-col-align-center"
          disabled={isSubmitting}
          errors={errors.businessNumber && touched.businessNumber}
          errorMessage={errors.businessNumber}
          handleBlur={handleBlur}
          handleChange={handleChange}
          handleClick={() => verifyBN(values.businessNumber, setSubmitting)}
          icon="pi-search"
          keyfilter="pint"
          label="RUC"
          maxLength="11"
          name="businessNumber"
          type="input-group"
          tooltip="Haga click para verificar el RUC de la empresa"
          value={values.businessNumber}
        />
        <FormField
          className="p-col-11 p-col-align-center"
          disabled={isSubmitting}
          errors={errors.docNumber && touched.docNumber}
          errorMessage={errors.docNumber}
          handleBlur={handleBlur}
          handleChange={handleChange}
          keyfilter="pint"
          label="DNI"
          maxLength="8"
          name="docNumber"
          type="text"
          value={values.docNumber}
        />
        <FormField
          className="p-col-11 p-col-align-center"
          disabled={isSubmitting}
          errors={errors.cellphone && touched.cellphone}
          errorMessage={errors.cellphone}
          handleBlur={handleBlur}
          handleChange={handleChange}
          keyfilter="pint"
          label="Celular"
          maxLength="9"
          name="cellphone"
          type="text"
          value={values.cellphone}
        />
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
          <Button
            className="p-button-rounded button"
            disabled={!isVerified || isSubmitting}
            label="Completar registro"
            type="submit"
          />
        </div>
        {

          !isVerified && (
          <span className="p-col-11 p-col-align-center text--center">
            <small>Primero debes verificar el Ruc para registarte</small>
          </span>
          )
        }
      </form>
    </div>
  );
};

export default CompleteRegister;
