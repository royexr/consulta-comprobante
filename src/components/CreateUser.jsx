// Dependencies
import React, { useState, useEffect } from 'react';
import Form from '../sharedcomponents/Form';

const CreateUser = () => {
  const [formState, setFormState] = useState([]);

  useEffect(() => {
    setFormState([
      {
        label: 'Correo',
        name: 'email',
        type: 'email',
        value: '',
      },
      {
        label: 'Contraseña',
        name: 'password',
        type: 'password',
        value: '',
      },
      {
        label: 'Confirmar contraseña',
        name: 'confirmPassword',
        type: 'password',
        value: '',
      },
      {
        label: 'Celular',
        name: 'phone',
        type: 'tel',
        value: '',
      },
      {
        label: 'Tipo de documento',
        name: 'docType',
        type: 'select',
        value: '',
        options: [
          {
            label: 'RUC',
            value: '0',
          },
          {
            label: 'DNI',
            value: '1',
          },
        ],
      },
      {
        label: 'Numero de documento',
        name: 'docNumber',
        type: 'tel',
        value: '',
      },
    ]);
  }, []);

  const handleChange = (e) => {
    const newFormState = formState.map((item) => {
      const field = item;
      if (field.name !== undefined && field.value !== undefined) {
        if (field.name === e.target.name) {
          field.name = e.target.name;
          field.value = e.target.value;
        }
      }
      return field;
    });

    setFormState(newFormState);
  };

  const create = (e) => {
    e.preventDefault();
    console.log('Usuario creado');
  };

  return (
    <Form state={formState} onChangeEvent={handleChange}>
      <button type="button" onClick={create}>Crear cuenta</button>
    </Form>
  );
};

export default CreateUser;
