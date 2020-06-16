// Dependencies
import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { useLocation, useHistory } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { AuthContext } from '../../../contexts/Auth';
import { useMessages } from '../../../hooks';
import { objectToQuery } from '../../../utils';
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';
import styles from './styles.module.css';

const CompleteRegister = () => {
  const history = useHistory();
  const location = useLocation();
  const urlParams = new window.URLSearchParams(location.search);
  const { signIn } = useContext(AuthContext);
  const [showMessages, renderMessages] = useMessages();

  const validate = (values) => {
    const errors = {};
    if (!values.serie) {
      errors.serie = 'Campo obligatorio';
    } else if (values.serie.length !== 4) {
      errors.serie = 'Serie de comprobante invalido';
    }
    if (!values.number) {
      errors.number = 'Campo obligatorio';
    } else if (values.number.length !== 8) {
      errors.number = 'Número de comprobante invalido';
    }
    if (!values.date) {
      errors.date = 'Campo obligatorio';
    }
    if (!values.businessNumber) {
      errors.businessNumber = 'Campo obligatorio';
    } else if (values.businessNumber.length !== 8 && values.businessNumber.length !== 11) {
      errors.businessNumber = 'RUC o DNI invalido';
    }
    return errors;
  };

  const verifyVoucher = async (values, actions) => {
    const obj = { ...values };
    obj.email = urlParams.get('email');
    obj.code = urlParams.get('userId');
    const query = objectToQuery(obj);
    const resV = await api.Voucher.VerifyVoucher(query);
    if (resV instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexión');
      actions.setSubmitting(false);
    } else {
      switch (resV.code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Hemos encontrado comprobantes a tu nombre');
          setTimeout(async () => {
            const resU = await api.User.CreateWithCode(obj);
            if (resU instanceof TypeError) {
              showMessages('error', 'Error!', 'No hay conexión');
              actions.setSubmitting(false);
            } else {
              switch (resU.code) {
                case '01':
                  showMessages('success', 'Muy bien!', 'Se han registrado los datos correctamente');
                  setTimeout(() => {
                    signIn(resU.user);
                    history.push('/dashboard');
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
          }, 3000);
          break;
        case '02':
          showMessages('warn', 'Alerta!', 'No hemos podido encontrar comprobantes a tu nombre');
          actions.setSubmitting(false);
          break;
        default:
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
    touched,
    values,
  } = useFormik({
    initialValues: {
      serie: '',
      number: '',
      businessNumber: '',
      date: new Date().toISOString().slice(0, 10),
    },
    validate,
    onSubmit: (vals, actions) => { verifyVoucher(vals, actions); },
  });

  return (
    <div className={`${styles.jumbotron} p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-4`}>
      <form
        className="form p-grid p-dir-col"
        onSubmit={handleSubmit}
      >
        <hgroup className="heading p-col-12 p-col-align-center">
          <h1 className="title">Completar registro</h1>
          <h2 className="subtitle">Para continuar con su registro por favor llene los campos con la serie, numero, su RUC o DNI y la fecha de emision</h2>
        </hgroup>
        <div className="p-col-12 p-col-align-center">
          {renderMessages()}
        </div>
        <FormField
          className="p-col-12 p-col-align-center"
          disabled={isSubmitting}
          errors={errors.serie && touched.serie}
          errorMessage={errors.serie}
          handleBlur={handleBlur}
          handleChange={handleChange}
          keyfilter="alphanum"
          label="Serie"
          maxLength="4"
          name="serie"
          type="text"
          value={values.serie}
        />
        <FormField
          className="p-col-12 p-col-align-center"
          disabled={isSubmitting}
          errors={errors.number && touched.number}
          errorMessage={errors.number}
          handleBlur={handleBlur}
          handleChange={handleChange}
          keyfilter="pint"
          label="Número"
          maxLength="8"
          name="number"
          type="text"
          value={values.number}
        />
        <FormField
          className="p-col-12 p-col-align-center"
          disabled={isSubmitting}
          errors={errors.businessNumber && touched.businessNumber}
          errorMessage={errors.businessNumber}
          handleBlur={handleBlur}
          handleChange={handleChange}
          keyfilter="pint"
          label="su RUC o DNI"
          maxLength="11"
          name="businessNumber"
          type="text"
          value={values.businessNumber}
        />
        <FormField
          className="p-col-12 p-col-align-center"
          disabled={isSubmitting}
          errors={errors.date && touched.date}
          errorMessage={errors.date}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label="Fecha de emisión"
          name="date"
          type="date"
          value={values.date}
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
        <div className="p-col-12 p-col-align-center">
          <Button
            className="p-button-rounded button"
            disabled={isSubmitting}
            label="Completar registro"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default CompleteRegister;
