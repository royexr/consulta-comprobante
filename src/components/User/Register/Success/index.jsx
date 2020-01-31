// Resources
import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <>
      <hgroup>
        <h1>Se registro correctamente</h1>
      </hgroup>
      <Link to="/">Iniciar Sesión</Link>
    </>
  );
};

export default Success;
