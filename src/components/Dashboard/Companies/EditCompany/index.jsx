// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useFormik } from 'formik';

// Resources
import { Button } from 'primereact/button';
import FormField from '../../../../sharedcomponents/FormField';
import { useMessages } from '../../../../hooks';
import api from '../../../../utils/api';

const EditCompany = () => {
  const history = useHistory();
  const { companyId } = useParams();
  const [company, setCompany] = useState({
    RUC: '',
    Nom_Comercial: '',
    RazonSocial: '',
    Direccion: '',
    Web: '',
    Flag_ExoneradoImpuesto: false,
    Des_Impuesto: '',
    Por_Impuesto: 0,
    EstructuraContable: '',
    Version: '',
    Cod_Ubigeo: '',
    Cod_UsuarioReg: '',
    Fecha_Reg: '',
  });
  const [showMessages, renderMessages] = useMessages();

  const createCompany = async (values, actions) => {
    const obj = { ...values };
    obj.Cod_Empresa = obj.RUC;
    const res = await api.Company.Create(obj);
    if (res instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
    } else {
      switch (res.code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Se ah registrado la empresa')
          setTimeout(() => {
            history.goBack();
            actions.setSubmitting(false);
          }, 3000);
          break;
        case '02':
          showMessages('warn', 'Alerta!', 'Esta empresa ya esta registrada');
          actions.setSubmitting(false);
          break;
        default:
          showMessages('error', 'Error!', 'Algo ah salido mal');
          actions.setSubmitting(false);
          break;
      }
    }
  };

  const updateCompany = async (values, actions) => {
    const obj = { ...values };
    const companyRes = await api.Company.Update(obj);
    if (companyRes instanceof TypeError) {
      showMessages('error', 'Error!', 'No hay conexion');
      actions.setSubmitting(false);
    } else {
      switch (companyRes.code) {
        case '01':
          showMessages('success', 'Muy bien!', 'Se actualizaron los datos');
          setTimeout(() => {
            history.goBack();
            actions.setSubmitting(false);
          }, 3000);
          break;
        default:
          showMessages('error', 'Error!', 'Algo ah salido mal');
          actions.setSubmitting(false);
          break;
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchCompany = async (id, h) => {
      if (id !== undefined) {
        const { data } = await api.Company.ReadById(id, controller.signal);
        if (data !== undefined && !controller.signal.aborted) {
          setCompany(data);
        } else {
          h.goBack();
        }
      }
    };

    fetchCompany(companyId, history);
    return () => {
      controller.abort();
    };
  }, [companyId, history]);

  const validate = (values) => {
    const errors = {};
    if (!values.RUC) {
      errors.RUC = 'Campo obligatorio';
    }
    if (!values.Nom_Comercial) {
      errors.Nom_Comercial = 'Campo obligatorio';
    }
    if (!values.RazonSocial) {
      errors.RazonSocial = 'Campo obligatorio';
    }
    if (!values.Direccion) {
      errors.Direccion = 'Campo obligatorio';
    }
    return errors;
  };

  const onSubmit = (values, actions) => {
    if (companyId !== undefined) {
      updateCompany(values, actions);
    } else {
      createCompany(values, actions);
    }
  };

  const {
    RUC,
    Nom_Comercial,
    RazonSocial,
    Direccion,
  } = company;

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      RUC,
      Nom_Comercial,
      RazonSocial,
      Direccion,
      Fecha_Reg: new Date().toISOString().slice(0, 10),
    },
    onSubmit: (vals, actions) => { onSubmit(vals, actions); },
    validate,
  });

  return (
    <form className="form p-grid p-justify-center" onSubmit={handleSubmit}>
      <div className="p-col-12 p-col-align-center">
        {renderMessages()}
      </div>
      <FormField
        className="p-col-12 p-sm-6 p-col-align-center"
        disabled={isSubmitting}
        errors={errors.RUC && touched.RUC}
        errorMessage={errors.RUC}
        handleBlur={handleBlur}
        handleChange={handleChange}
        keyfilter="pint"
        label="RUC"
        maxLength="11"
        name="RUC"
        type="text"
        value={values.RUC}
      />
      <FormField
        className="p-col-12 p-sm-6 p-col-align-center"
        disabled={isSubmitting}
        errors={errors.Nom_Comercial && touched.Nom_Comercial}
        errorMessage={errors.Nom_Comercial}
        handleBlur={handleBlur}
        handleChange={handleChange}
        label="Nombre comercial"
        name="Nom_Comercial"
        type="text"
        value={values.Nom_Comercial}
      />
      <FormField
        className="p-col-12 p-sm-6 p-col-align-center"
        disabled={isSubmitting}
        errors={errors.RazonSocial && touched.RazonSocial}
        errorMessage={errors.RazonSocial}
        handleBlur={handleBlur}
        handleChange={handleChange}
        label="Razón social"
        name="RazonSocial"
        type="text"
        value={values.RazonSocial}
      />
      <FormField
        className="p-col-12 p-sm-6 p-col-align-center"
        disabled={isSubmitting}
        errors={errors.Direccion && touched.Direccion}
        errorMessage={errors.Direccion}
        handleBlur={handleBlur}
        handleChange={handleChange}
        label="Dirección"
        name="Direccion"
        type="text"
        value={values.Direccion}
      />
      <div className="p-col-10 p-md-5 p-md-4 p-col-align-center">
        <div className="p-grid p-justify-between">
          <div className="p-col-12 p-sm-6 p-xl-5">
            <Button
              className="p-button-rounded p-button-danger button"
              disabled={isSubmitting}
              label="Cancelar"
              onClick={() => history.goBack()}
              type="button"
            />
          </div>
          <div className="p-col-12 p-sm-6 p-xl-5">
            <Button
              className="p-button-rounded button"
              disabled={isSubmitting}
              label="Guardar"
              type="submit"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditCompany;
