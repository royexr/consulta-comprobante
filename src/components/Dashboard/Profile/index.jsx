// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

// Resources
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import config from '../../../config';
import api from '../../../utils/api';
import FormField from '../../../sharedcomponents/FormField';
import { useMessages } from '../../../hooks';

const Profile = () => {
  const history = useHistory();
  const [showMessages, renderMessages] = useMessages();
  const [profileData, setProfileData] = useState({});

  const fetchProfile = async () => {
    const { _id } = jwt.verify(
      sessionStorage.getItem('userJWT'),
      config.jwtSecret,
    );
    const { data } = await api.User.GetById(_id.email);
    setProfileData(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Campo obligatorio';
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

  const updateProfile = async (values, actions) => {
    const userInfo = { ...values };
    const userRes = await api.User.GetById(values.email);
    if (userRes instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
      actions.setSubmitting(false);
    } else if (userRes.code === '01') {
      delete userInfo.confirmPassword;
      if (userInfo.password !== '') {
        userInfo.password = CryptoJS.AES.encrypt(
          userInfo.password,
          userInfo.email,
        ).toString();
      } else {
        delete userInfo.password;
      }
      const { code } = await api.User.UpdateUser(userInfo);
      switch (code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Se actualizaron los datos');
          history.goBack();
          actions.setSubmitting(false);
          break;
        default:
          showMessages('error', 'Error!', 'Algo ah salido mal');
          actions.setSubmitting(false);
          break;
      }
    } else {
      showMessages('error', 'Error!', 'El usuario no existe');
      actions.setSubmitting(false);
    }
  };

  const {
    _id,
    name,
    docNumber,
    cellphone,
  } = profileData;

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: _id !== undefined ? _id.email : '',
      name,
      docNumber,
      cellphone,
      password: '',
      confirmPassword: '',
    },
    validate,
    onSubmit: (vals, actions) => { updateProfile(vals, actions); },
  });

  return (
    <form
      className="form p-grid p-dir-col"
      onSubmit={handleSubmit}
    >
      <hgroup className="heading p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center">
        <h1 className="title">Perfil</h1>
      </hgroup>
      <div className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center">
        {renderMessages()}
      </div>
      <FormField
        className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center"
        label="Correo electronico"
        name="email"
        type="email"
        value={values.email}
      />
      <FormField
        className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center"
        disabled={isSubmitting}
        errors={errors.name && touched.name}
        errorMessage={errors.name && touched.name}
        handleBlur={handleBlur}
        handleChange={handleChange}
        label="Nombre completo"
        name="name"
        type="text"
        value={values.name}
      />
      <FormField
        className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center"
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
        className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center"
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
      <FormField
        className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center"
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
        className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center"
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
      <div className="p-col-6 p-lg-4 p-col-align-center">
        <Button
          className="p-button-rounded button"
          disabled={isSubmitting}
          label="Actualizar"
          onClick={handleSubmit}
          type="submit"
        />
      </div>
      {
        isSubmitting && (
          <div className="p-col-align-center">
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
  );
};

export default Profile;
