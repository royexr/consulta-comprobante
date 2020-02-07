// Dependencies
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import jwt from 'jsonwebtoken';

// Resources
import FormField from '../../../sharedcomponents/FormField';
import api from '../../../utils/api';
import { Dropdown } from 'primereact/dropdown';

const Invoices = () => {
  const [companies, setCompanies] = useState([]);
  const token = jwt.verify(sessionStorage.getItem('userJWT'), process.env.REACT_APP_JWT_SECRET);

  const FetchCompanies = async () => {
    try {
      const auxCompanies = (await api.User.GetCompanies(token._id.email)).data;
      const formatted = auxCompanies.map((company) => ({
        value: company.RUC,
        label: `${company.RUC} ${company.RazonSocial}`,
      }));
      setCompanies(formatted);
    } catch (error) {
      setCompanies([]);
    }
  };

  useEffect(() => {
    FetchCompanies();
  }, []);

  return (
    <>
      <div className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4">
        <Formik
          initialValues={{
            company: companies[0] !== undefined ? companies[0].value : null,
            voucherType: '',
            docCliente: '',
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
            <>
              <form
                className="form p-grid p-dir-col p-nogutter"
                onSubmit={handleSubmit}
              >
                {/* <hgroup className="heading p-col-11 p-col-align-center">
                  <h1 className="title">Invoices</h1>
                </hgroup>
                <select
                  name="company"
                  onChange={handleChange}
                  value={values.company}
                  disabled={companies.length < 2}
                >
                  {companies.map((company) => (
                    <option
                      key={company.value}
                      value={company.value}
                    >
                      {company.label}
                    </option>
                  ))}
                </select> */}
                <Dropdown
                  className="m-bottom-15 p-col-11 p-col-align-center"
                  disabled={companies.length < 2}
                  name="company"
                  onChange={handleChange}
                  options={companies}
                  placeholder="Empresa"
                  value={values.company}
                />
                {/* <FormField
                  className="m-bottom-15 p-col-11 p-col-align-center"
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  label="Empresa"
                  name="company"
                  options={companies}
                  type="select"
                  value={values.company}
                /> */}
                {/* <FormField
                  className="m-bottom-15 p-col-11 p-col-align-center"
                  disabled={isSubmitting || companies.length === 1}
                  errors={errors.company && touched.company}
                  errorMessage={errors.company}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  label="Empresa Originaria"
                  name="company"
                  options={companies}
                  type="select"
                  value={values.company}
                /> */}
              </form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Invoices;
