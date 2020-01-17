// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import Form from '../../sharedcomponents/Form';
import api from '../../utils/api';

const CreateUser = () => {
  const [formState, setFormState] = useState([]);
  const [isCreateDisable, setIsCreateDisable] = useState(true);
  const history = useHistory();
  // const [isPasswordSame, setIsPasswordSame] = useState(true);

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
    let count = 0;
    let samePass = false;
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

        if (field.name === 'confirmPassword') {
          samePass = formState[1].value === formState[2].value;
        }
      }
      return field;
    });

    setIsCreateDisable(formState.length !== count || !samePass);
    // setIsPasswordSame(samePass);
    setFormState(newFormState);
  };

  const create = (e) => {
    e.preventDefault();
    const user = {};
    for (let i = 0; i < formState.length; i += 1) {
      const item = formState[i];
      if (item.name !== undefined && item.value !== undefined && item.name !== 'confirmPassword') {
        user[item.name] = item.value;
      }
    }
    api.User.Create({ user });
  };

  const cancel = (e) => {
    e.preventDefault();
    history.push('/');
  };

  return (
    <Form state={formState} onChangeEvent={handleChange}>
      <Button label="Crear cuenta" disabled={isCreateDisable} onClick={create} className="button button--blue" />
      <Button label="Cancelar" onClick={cancel} className="p-button-danger button--red" />
    </Form>
  );
};

export default CreateUser;
