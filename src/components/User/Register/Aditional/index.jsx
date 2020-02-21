// Dependencies
import React, { useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
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
  const [messages, setMessages] = useState(new Messages());
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
      if (res.message === '01') {
        showMessage('success', 'Muy bien!');
        setData(objectAssign(
          {},
          data,
          {
            businessNumber: values.businessNumber,
            businessName: res.data.RazonSocial,
          },
        ));
        setIsVerified(true);
      } else {
        showMessage('error', 'Error!', 'La Empresa no esta registrada en Pale');
        setData(objectAssign(
          {},
          data,
          {
            businessNumber: '',
            businessName: '',
          },
        ));
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
      }) => (
        <form
          className="form p-grid p-dir-col p-nogutter"
          onSubmit={handleSubmit}
        >
          <hgroup className="heading">
            <h1 className="title">Datos adicionales</h1>
          </hgroup>
          <div className="mb-15 p-col-11 p-col-align-center">
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
                  tooltip="Haga click para buscar la empresa"
                  tooltipOptions={{ position: 'top' }}
                  type="button"
                />
              </div>
              <label htmlFor="businessNumber">RUC</label>
            </span>
          </div>
          {
            loading && (
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
          <FormField
            className="mb-15 p-col-11 p-col-align-center"
            label="Razón Social"
            name="businessName"
            type="text"
            value={data.businessName}
          />
          <FormField
            className="mb-15 p-col-11 p-col-align-center"
            disabled={loading}
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
            className="mb-15 p-col-11 p-col-align-center"
            disabled={loading}
            errors={errors.confirmPassword && touched.confirmPassword}
            errorMessage={errors.confirmPassword}
            handleBlur={handleBlur}
            handleChange={handleChange}
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
          />
          <div className="mb-15 p-col-11 p-col-align-center">
            <Messages ref={(el) => { setMessages(el); }} />
          </div>
          <div className="mb-15 p-col-11 p-col-align-center">
            <div className="p-grid p-justify-between">
              <div className="p-col-6 p-xl-5">
                <Button
                  className="button p-button-danger"
                  disabled={loading}
                  label="Atras"
                  onClick={previousStep}
                  type="button"
                />
              </div>
              <div className="p-col-6 p-xl-5">
                <Button
                  className="button"
                  disabled={!isVerified || loading}
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
