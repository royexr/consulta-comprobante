// Dependencies
import React, { useState, useEffect } from 'react';

// Resources
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

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
        type: 'number',
        value: '',
      },
      {
        label: 'Tipo de documento',
        name: 'docType',
        type: 'dropdown',
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
        type: 'number',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit');
  };

  const selector = (item, index) => {
    switch (item.type) {
      case 'dropdown':
        return (
          <span key={index}>
            <Dropdown
              ariaLabel={item.name}
              placeholder="Tipo de documento"
              name={item.name}
              value={item.value}
              onChange={handleChange}
              options={item.options}
            />
          </span>
        );
      case 'number':
        return (
          <span key={index} className="p-float-label" style={{ margin: '2rem 0' }}>
            <InputText
              keyfilter="pint"
              name={item.name}
              value={item.value}
              onChange={handleChange}
              autoComplete="off"
            />
            <label htmlFor={item.name}>{item.label}</label>
          </span>
        );
      default:
        return (
          <span key={index} className="p-float-label" style={{ margin: '2rem 0' }}>
            <InputText
              name={item.name}
              value={item.value}
              type={item.type}
              onChange={handleChange}
              autoComplete="off"
            />
            <label htmlFor={item.name}>{item.label}</label>
          </span>
        );
    }
  };

  return (
    <form action="POST" onSubmit={handleSubmit}>
      <div className="p-col-9 p-sm-6 p-md-4 p-lg-3">
        {formState.map((item) => (
          selector(item, formState.indexOf(item))
        ))}
      </div>
      <Button type="submit" label="Registrar" />
    </form>
  );
};

export default CreateUser;
