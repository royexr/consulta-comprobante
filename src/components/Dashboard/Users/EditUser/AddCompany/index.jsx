// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useMessages } from '../../../../../hooks';
import FormField from '../../../../../sharedcomponents/FormField';
import api from '../../../../../utils/api';

const AddCompany = ({
  number,
  index,
  isEnabled,
  modifyCompanies,
  type,
}) => {
  const [showMessages, renderMessages] = useMessages();

  const verifyBN = async (values, actions) => {
    switch (type) {
      case 2: {
        const res = await api.Company.ReadById(values.number);
        if (res instanceof TypeError) {
          showMessages('error', 'Error!', 'No hay conexion');
          actions.setSubmitting(false);
        } else {
          switch (res.code) {
            case '01':
              showMessages('success', 'Muy bien!', 'Se agregaran los cambios');
              setTimeout(() => {
                modifyCompanies(index, values);
                actions.setSubmitting(false);
              }, 1500);
              break;
            default:
              showMessages('error', 'Error!', 'La empresa no se encuentra registrada en Pale');
              actions.setSubmitting(false);
              break;
          }
        }
        break;
      }
      default: {
        const res = await api.Voucher.VerifyFinalUser(values.number);
        if (res instanceof TypeError) {
          showMessages('error', 'Error!', 'No hay conexion');
          actions.setSubmitting(false);
        } else {
          switch (res.code) {
            case '01':
              showMessages('success', 'Muy bien!', 'Se agregaron los cambios');
              setTimeout(() => {
                modifyCompanies(index, values);
                actions.setSubmitting(false);
              }, 1500);
              break;
            default:
              showMessages('error', 'Error!', 'La entidad no se encuentra registrada en Pale');
              actions.setSubmitting(false);
              break;
          }
        }
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
      number,
      isEnabled,
    },
    onSubmit: (vals, actions) => { verifyBN(vals, actions); },
  });

  return (
    <form
      className="form p-grid p-dir-col"
      onSubmit={handleSubmit}
    >
      <div className="p-col-10 p-col-align-center">
        {renderMessages()}
      </div>
      <FormField
        className="p-col-10 p-col-align-center"
        disabled={isSubmitting}
        errors={errors.number && touched.number}
        errorMessage={errors.number}
        handleBlur={handleBlur}
        handleChange={handleChange}
        keyfilter="pint"
        label="RUC o DNI"
        maxLength="11"
        name="number"
        type="text"
        value={values.number}
      />
      <div className="p-col-10 p-col-align-center">
        <span>
          <label htmlFor="HabilitarAcceso">
            <p className="form__field-label">
              Habilitar acceso
            </p>
            <div id="HabilitarAcceso">
              <Checkbox
                className="form__field"
                checked={values.isEnabled}
                disabled={isSubmitting}
                id="Habilitado"
                name="isEnabled"
                onChange={handleChange}
                value={values.isEnabled}
              />
              <label
                htmlFor="Habilitado"
                className="p-checkbox-label"
              >
                Habilitado
              </label>
            </div>
          </label>
        </span>
      </div>
      <div className="p-col-10 p-col-align-center">
        <Button
          className="button p-button-rounded"
          disabled={isSubmitting}
          label="Guardar"
          type="submit"
        />
      </div>
    </form>
  );
};

AddCompany.defaultProps = {
  number: '',
  isEnabled: false,
};

AddCompany.propTypes = {
  number: PropTypes.string,
  index: PropTypes.number.isRequired,
  isEnabled: PropTypes.bool,
  modifyCompanies: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
};

export default AddCompany;
