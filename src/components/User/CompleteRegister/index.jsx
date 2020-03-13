// Dependencies
import React, { useState } from 'react';
import { useFormik } from 'formik';
// import { useLocation } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMessages } from '../../../hooks';
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';
import styles from './styles.module.css';

const CompleteRegister = () => {
  // const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const [showMessages, renderMessages] = useMessages();
  // const urlParams = new window.URLSearchParams(location.search);

  const fieldsValidation = (values) => {
    const errors = {};
    if (!values.businessNumber) {
      errors.businessNumber = 'Campo obligatorio';
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

  const formik = useFormik({
    initialValues: {
      businessNumber: '',
      businessName: '',
      password: '',
      confirmPassword: '',
    },
    validate: (values) => fieldsValidation(values),
    onSubmit: (values) => { console.log(values); },
  });

  return (
    <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
      <form
        className="form p-grid p-dir-col"
        onSubmit={formik.handleSubmit}
      >
        <hgroup className="heading">
          <h1 className="title">Completar registro</h1>
        </hgroup>
        <FormField
          buttonCN="p-button-warning"
          className="p-col-11 p-col-align-center"
          errors={formik.errors.businessNumber && formik.touched.businessNumber}
          errorMessage={formik.errors.businessNumber}
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          handleClick={() => verifyBN(formik.values.businessNumber, formik.setSubmitting)}
          icon="pi-search"
          keyfilter="pint"
          label="RUC"
          maxLength="11"
          name="businessNumber"
          type="input-group"
          tooltip="Haga click para buscar la empresa"
          value={formik.values.businessNumber}
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
        />
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
        <div className="p-col-11 p-col-align-center">
          <Button
            className="p-button-rounded button"
            disabled={!isVerified || formik.isSubmitting}
            label="Completar registro"
            type="submit"
          />
        </div>
        <div className="p-col-11 p-col-align-center">
          {renderMessages()}
        </div>
      </form>
    </div>
  );
};

export default CompleteRegister;
