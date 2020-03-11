// Dependencies
import React from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import styles from './styles.module.css';
import FormField from '../../../sharedcomponents/FormField';
import { isValidEmail } from '../../../utils';

const Register = () => {
  const history = useHistory();

  const leave = () => {
    history.push('/');
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

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validate={(values) => fieldsValidation(values)}
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
        <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
          <form
            className="form p-grid p-dir-col"
            onSubmit={handleSubmit}
          >
            <hgroup className="heading p-col-11 p-col-align-center">
              <h1 className="title">Registro</h1>
            </hgroup>
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
                    label="Atras"
                    onClick={leave}
                    type="button"
                  />
                </div>
                <div className="p-col-6 p-xl-5">
                  <Button
                    className="button p-button-rounded"
                    label="Registrar"
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default Register;
