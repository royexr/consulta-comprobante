// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import FormField from '../../../../sharedcomponents/FormField';
import { isValidEmail } from '../../../../utils';

const PersonalInfo = ({ data, saveValues }) => {
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

    return errors;
  };

  return (
    <Formik
      initialValues={data}
      validate={(values) => fieldsValidation(values)}
      onSubmit={(values) => saveValues(values)}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <>
          <form
            className="form p-grid p-dir-col p-nogutter"
            onSubmit={handleSubmit}
          >
            <hgroup className="form--heading p-col-11 p-col-align-center">
              <h1 className="title">Datos Personales</h1>
            </hgroup>
            <FormField
              className="m-bottom-15 p-col-11 p-col-align-center"
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
              className="m-bottom-15 p-col-11 p-col-align-center"
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
              className="m-bottom-15 p-col-11 p-col-align-center"
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
              className="m-bottom-15 p-col-11 p-col-align-center"
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
            <div className="m-bottom-15 p-col-11 p-col-align-center">
              <div className="p-grid p-justify-end">
                <div className="p-col-6 p-xl-5">
                  <Button
                    label="Siguiente"
                    className="button"
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </Formik>
  );
};

PersonalInfo.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    DNI: PropTypes.string,
    cellphone: PropTypes.string,
  }).isRequired,
  saveValues: PropTypes.func.isRequired,
};

export default PersonalInfo;
