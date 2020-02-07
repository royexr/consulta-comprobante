// Resources
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Finished = ({ success }) => (
  <>
    <hgroup>
      {
        success
          ? (<h1>Se registro correctamente</h1>)
          : (<h1>Error! No se pudo registrar al usurio</h1>)
      }
    </hgroup>
    <Link to="/">Iniciar Sesión</Link>
  </>
);

Finished.defaultProps = {
  success: true,
};

Finished.propTypes = {
  success: PropTypes.bool,
};

export default Finished;
