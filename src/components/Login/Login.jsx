// Dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Resources
import { InputText } from 'primereact/inputtext';

const Login = () => {
  const history = useHistory();
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

  const SignIn = (e) => {
    e.preventDefault();
    history.push('/voucherInquiry');
  };

  const CreateAccount = (e) => {
    e.preventDefault();
    history.push('/register');
  };

  return (
    <form method="POST">
      <div className="p-col-9 p-sm-6 p-md-4 p-lg-3 p-xl-2">
        {formState.map((item) => (
          <span key={formState.indexOf(item)} className="p-float-label" style={{ margin: '2rem 0' }}>
            <InputText
              style={{ width: '100%' }}
              id={item.name}
              name={item.name}
              value={item.value}
              type={item.type}
              onChange={handleChange}
              autoComplete="off"
            />
            <label htmlFor={item.name}>{item.label}</label>
          </span>
        ))}
        <button onClick={SignIn} name="Ingresar" type="submit">Ingresar</button>
        <button onClick={CreateAccount} name="Registrate" type="submit">Registrate</button>
        {/* <Link to="/register">Registrate</Link> */}
      </div>
    </form>
  );
};

export default Login;
