// Dependencies
import React from 'react';
import { Formik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import FormField from '../../../../sharedcomponents/FormField';
import styles from './styles.module.css';
import { isValidEmail } from '../../../../utils';

const PersonalInfo = () => {
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
      errors.docNumber = 'Numero de documento invalido';
    }
    if (!values.cellphone) {
      errors.cellphone = 'Campo obligatorio';
    }

    return errors;
  };

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          docNumber: '',
          cellphone: '',
        }}
        validate={(values) => fieldsValidation(values)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          handleBlur,
          isSubmitting,
        }) => (
          <form
            className="form p-grid p-dir-col p-nogutter"
            onSubmit={handleSubmit}
          >
            <hgroup className={`${styles.heading} p-col-11 p-col-align-center`}>
              <h1 className="title">Datos Personales</h1>
            </hgroup>
            <FormField
              className="m-bottom-15 p-col-11 p-col-align-center"
              errors={errors.name && touched.name}
              errorMessage={errors.name}
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
              handleChange={handleChange}
              keyfilter="pint"
              label="Celular"
              maxLength="9"
              name="cellphone"
              type="text"
              value={values.cellphone}
            />
            <div className="m-bottom-15 p-col-6 p-xl-4 p-col-align-center">
              <Button
                label="Siguiente"
                className="button"
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default PersonalInfo;
