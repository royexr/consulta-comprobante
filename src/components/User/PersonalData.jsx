// Dependencies
import React, { useState, useEffect } from 'react';

// Resources
import { Button } from 'primereact/button';
import Form from '../../sharedcomponents/Form';

const PersonalData = () => {
  const [formState, setFormState] = useState([]);
  const [isCreateDisable, setIsCreateDisable] = useState(true);

  useEffect(() => {
    setFormState([
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'Nombre completo',
        name: 'name',
        type: 'text',
        value: '',
      },
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'Correo',
        name: 'email',
        type: 'email',
        value: '',
      },
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'DNI',
        mask: '99999999',
        name: 'docNumber',
        type: 'mask',
        value: '',
      },
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'Teléfono celular',
        mask: '999-999999',
        name: 'cellPhone',
        type: 'mask',
        value: '',
      },
    ]);
  }, []);

  const handleChange = (e) => {
    let count = 0;
    const newFormState = formState.map((item) => {
      const field = item;
      if (field.name !== undefined && field.value !== undefined) {
        if (field.name === e.target.name) {
          field.name = e.target.name;
          field.value = e.target.value;
        }

        if (field.value !== '') {
          count += 1;
        }
      }
      return field;
    });

    setIsCreateDisable(formState.length !== count);
    setFormState(newFormState);
  };

  return (
    <>
      <div className="jumbotron p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-3">
        <h2 className="form-title">DATOS PERSONALES</h2>
        <Form
          className="form p-grid p-dir-col p-nogutter"
          state={formState}
          onChangeEvent={handleChange}
        >
          <div className="form-field p-col-6 p-xl-5 p-col-align-center">
            <Button
              className="button button--blue"
              disabled={isCreateDisable}
              label="Siguiente"
              type="submit"
            />
          </div>
        </Form>
      </div>
    </>
  );
};

export default PersonalData;
