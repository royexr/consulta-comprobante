// Dependencies
import React from 'react';
import { useFormik } from 'formik';

// Resources
import { Checkbox } from 'primereact/checkbox';
import FormField from '../../../../../sharedcomponents/FormField';

const AddCompany = () => {
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
      businessNumber: '',
      isEnabled: false,
    },
  });

  return (
    <form
      className="form p-grid p-dir-col"
      onSubmit={handleSubmit}
    >
      <FormField
        className="p-col-10 p-col-align-center"
        disabled={isSubmitting}
        errors={errors.businessNumber && touched.businessNumber}
        errorMessage={errors.businessNumber}
        handleBlur={handleBlur}
        handleChange={handleChange}
        keyfilter="pint"
        label="RUC"
        maxLength="11"
        name="businessNumber"
        type="text"
        value={values.businessNumber}
      />
      <div className="p-col-10 p-col-align-center">
        <span>
          <Checkbox
            checked={values.isEnabled}
            name="isEnabled"
            onChange={handleChange}
          />
        </span>
      </div>
    </form>
  );
};

export default AddCompany;
