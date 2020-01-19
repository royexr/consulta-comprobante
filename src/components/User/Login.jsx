// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';

// Resources
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import Form from '../../sharedcomponents/Form';
import api from '../../utils/api';
import './Login.css';

const Login = () => {
  let messages = new Messages();
  const history = useHistory();
  const [loginState, setLoginState] = useState([]);

  useEffect(() => {
    setLoginState([
      {
        className: 'p-col-10 p-xl-8 p-col-align-center',
        label: 'Correo electronico',
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

  const showMessage = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
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
        showMessage('error', 'Error!', 'Contraseña incorrecta');
        break;
      case '03':
        showMessage('warn', 'Alerta!', 'El usuario esta inhabilitado');
        break;
      case '04':
        showMessage('error', 'Error!', 'El usuario no existe');
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
    <>
      <div className="jumbotron p-col-11 p-sm-9 p-md-7 p-lg-5 p-xl-3">
        <h2 className="login-title">INICIA SESIÓN EN PALE</h2>
        <Form className="form login p-grid p-dir-col p-nogutter" state={loginState} onChangeEvent={handleChange}>
          <div className="form-field p-col-6 p-xl-5 p-col-align-center">
            <Button label="Iniciar sesión" className="button button--blue" onClick={SignIn} />
          </div>
          <a className="p-col-align-center" href="/">¿olvidaste tu contraseña?</a>
          <div className="p-col-10 p-xl-8 p-col-align-center">
            <Messages ref={(el) => { messages = el; }} />
          </div>
        </Form>
        <hr />
        <div className="p-grid p-dir-col">
          <a className="p-col-align-center" href="/">¿no tienes cuenta?</a>
          <div className="p-col-6 p-xl-5 p-nogutter p-col-align-center">
            <Button label="Registrate" className="p-button-secondary button" onClick={CreateAccount} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
