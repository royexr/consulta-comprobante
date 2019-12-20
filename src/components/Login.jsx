// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Form from '../sharedcomponents/Form';

const Login = () => {
  const history = useHistory();
  const [loginState, setLoginState] = useState([]);

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

  const SignIn = (e) => {
    e.preventDefault();
    history.push('/voucherInquiry');
  };

  const CreateAccount = (e) => {
    e.preventDefault();
    history.push('/register');
  };

  return (
    <Form state={loginState} onChangeEvent={handleChange}>
      <button onClick={SignIn} name="Ingresar" type="submit">Ingresar</button>
      <button onClick={CreateAccount} name="Registrate" type="submit">Registrate</button>
    </Form>
  );
};

export default Login;
