// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import FormField from '../../../../sharedcomponents/FormField';

const Verify = ({ data }) => (
  <Formik
    initialValues={{
      email: data.email,
    }}
  >
    {({
      values,
      errors,
      touched,
      handleChange,
      handleSubmit,
    }) => (
      <form className="form p-grid p-dir-col p-nogutter">
        <hgroup className="form--heading">
          <div className="title">Verificación de correo</div>
        </hgroup>
        <FormField
          className="m-bottom-15 p-col-11 p-col-align-center"
          label="Correo electronico"
          name="email"
          type="email"
          value={values.email}
        />
        <div className="m-bottom-15 p-col-11 p-col-align-center">
          <div className="p-grid p-justify-between">
            <div className="p-col-6 p-xl-5">
              <Button
                className="button p-button-danger"
                label="Atras"
              />
            </div>
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
    )}
  </Formik>
);

Verify.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default Verify;
