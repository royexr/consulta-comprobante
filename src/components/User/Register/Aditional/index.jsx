// Dependencies
import React, { useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import objectAssign from 'object-assign';

// Resources
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { ProgressSpinner } from 'primereact/progressspinner';
import FormField from '../../../../sharedcomponents/FormField';
import api from '../../../../utils/api';

const Aditional = ({
  data,
  previousStep,
  saveValues,
  setData,
}) => {
  let messages;
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(data.businessName !== '');
  const [touchedBN, setTouchedBN] = useState(false);

  const fieldsValidation = (values) => {
    const errors = {};
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

  const showMessage = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
  };

  const verifyBN = async (values) => {
    setLoading(true);
    if (values.businessNumber.length !== 11) {
      showMessage('error', 'Error!', 'Número de RUC invalido');
    } else {
      const res = await api.Company.ReadById(values.businessNumber);
      switch (res.message) {
        case '01':
          setData(objectAssign(
            {},
            data,
            {
              businessNumber: values.businessNumber,
              businessName: res.data.RazonSocial,
            },
          ));
          showMessage('success', 'Bien!', 'Encontramos tu empresa en nuestros registros');
          setIsVerified(true);
          break;
        default:
          showMessage('error', 'Error!', 'La empresa no esta registrada en Pale');
          break;
      }
    }
    setLoading(false);
  };

  return (
    <Formik
      initialValues={data}
      validate={(values) => fieldsValidation(values)}
      onSubmit={(values) => {
        const aux = { ...values };
        aux.businessName = data.businessName;
        saveValues(aux);
      }}
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
        <form
          className="form p-grid p-dir-col p-nogutter"
          onSubmit={handleSubmit}
        >
          <div className="m-bottom-15 p-col-11 p-col-align-center">
            <Messages ref={(el) => { messages = el; }} />
          </div>
          <hgroup className="form--heading">
            <h1 className="title">Datos adicionales</h1>
          </hgroup>
          <div className="m-bottom-15 p-col-11 p-col-align-center">
            <span className="p-float-label">
              <input className={`input--hidden${values.businessNumber !== '' || touchedBN ? ' p-filled' : ''}`} />
              <div className="p-inputgroup">
                <InputText
                  autoComplete="off"
                  onChange={handleChange}
                  id="businessNumber"
                  keyfilter="pint"
                  maxLength="11"
                  name="businessNumber"
                  onFocus={() => {
                    setTouchedBN(true);
                  }}
                  onBlur={() => {
                    setTouchedBN(false);
                  }}
                  style={{ width: '100%' }}
                  value={values.businessNumber}
                />
                <Button
                  icon="pi pi-search"
                  className="p-button-warning"
                  onClick={() => verifyBN(values)}
                  tooltip="Haga click para buscar el RUC"
                  tooltipOptions={{ position: 'top' }}
                  type="button"
                />
              </div>
              <label htmlFor="businessNumber">RUC</label>
            </span>
          </div>
          {
            loading && (
              <ProgressSpinner
                className="m-bottom-15"
                strokeWidth="6"
                style={{
                  width: '2rem',
                  height: '2rem',
                }}
              />
            )
          }
          <FormField
            className="m-bottom-15 p-col-11 p-col-align-center"
            label="Razón Social"
            name="businessName"
            type="text"
            value={data.businessName}
          />
          <FormField
            className="m-bottom-15 p-col-11 p-col-align-center"
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
            className="m-bottom-15 p-col-11 p-col-align-center"
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
          <div className="m-bottom-15 p-col-11 p-col-align-center">
            <div className="p-grid p-justify-between">
              <div className="p-col-6 p-xl-5">
                <Button
                  className="button p-button-danger"
                  label="Atras"
                  onClick={previousStep}
                  type="button"
                />
              </div>
              <div className="p-col-6 p-xl-5">
                <Button
                  className="button"
                  disabled={!isVerified}
                  label="Siguiente"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

Aditional.propTypes = {
  data: PropTypes.shape({
    businessName: PropTypes.string,
  }).isRequired,
  previousStep: PropTypes.func.isRequired,
  saveValues: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
};

export default Aditional;
