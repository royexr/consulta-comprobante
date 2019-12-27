// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';

// Resources
import Form from '../../sharedcomponents/Form';
import api from '../../utils/api';
import './Login.css';

const Login = () => {
  const history = useHistory();
  const [loginState, setLoginState] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    setLoginState([
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
    ]);
  }, []);

  const handleChange = (e) => {
    const newFormState = loginState.map((item) => {
      const field = item;
      if (field.name !== undefined && field.value !== undefined) {
        if (field.name === e.target.name) {
          field.name = e.target.name;
          field.value = e.target.value;
        }
      }
      return field;
    });

    setLoginState(newFormState);
  };

  const SignIn = async (e) => {
    e.preventDefault();
    const credentials = {};
    for (let i = 0; i < loginState.length; i += 1) {
      const item = loginState[i];
      if (item.name !== undefined && item.value !== undefined) {
        credentials[item.name] = item.value;
      }
    }
    const loginR = await api.User.SignIn({ credentials });
    switch (loginR.resCode) {
      case '01':
        sessionStorage.setItem('userJWT', jwt.sign(loginR.data, 'pale'));
        history.push('/voucherInquiry');
        break;
      case '02':
        setAlertMessage('Contraseña incorrecta');
        break;
      case '03':
        setAlertMessage('El usuario esta inhabilitado');
        break;
      case '04':
        setAlertMessage('El usuario no existe');
        break;
      default:
        break;
    }
  };

  const CreateAccount = (e) => {
    e.preventDefault();
    history.push('/register');
  };

  return (
    <div className="container">
      <Form className="form login" state={loginState} onChangeEvent={handleChange}>
        <button onClick={SignIn} name="Ingresar" type="submit">Ingresar</button>
        <button onClick={CreateAccount} name="Registrate" type="submit">Registrate</button>
      </Form>
      {alertMessage.length !== 0 && <div><strong>{alertMessage}</strong></div>}
    </div>
  );
};

export default Login;
