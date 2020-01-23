// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Resources
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import PersonalInfo from './PersonalInfo';
import Form from '../../../sharedcomponents/Form';
import api from '../../../utils/api';
import styles from './styles.module.css';

const Register = () => {
  const registerSteps = [
    { label: 'Datos', className: 'text--small' },
    { label: 'Verificación', className: 'text--small' },
    { label: 'Seguridad', className: 'text--small' },
    { label: 'Finalizado', className: 'text--small' },
  ];
  const [stepsIndex, setStepsIndex] = useState(0);
  const [formState, setFormState] = useState([]);
  const [isCreateDisable, setIsCreateDisable] = useState(true);
  const history = useHistory();

  useEffect(() => {
    setFormState([
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'Correo',
        name: 'email',
        type: 'email',
        value: '',
      },
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'Contraseña',
        name: 'password',
        type: 'password',
        value: '',
      },
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'Confirmar contraseña',
        name: 'confirmPassword',
        type: 'password',
        value: '',
      },
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'Celular',
        name: 'phone',
        type: 'tel',
        value: '',
      },
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
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
        className: 'p-col-10 p-xl-8 p-col-align-center',
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
    <>
      <div className={`${styles.jumbotron} p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4`}>
        <PersonalInfo />
      </div>
      <div className="p-col-12 p-sm-11 p-md-9 p-lg-8 p-xl-6">
        <Steps activeIndex={stepsIndex} model={registerSteps} />
      </div>
    </>
  );
};

export default Register;
