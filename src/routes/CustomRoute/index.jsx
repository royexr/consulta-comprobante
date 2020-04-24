// Dependencies
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// Resources
import { AuthContext } from '../../contexts/Auth';

const CustomRoute = ({
  exact,
  path,
  render,
}) => {
  const { isAuth, companies } = useContext(AuthContext);

  if (isAuth) {
    if (companies.length < 1) {
      return <h1>Usuario inhabilitado</h1>;
    }
    return <Route exact={exact} path={path} render={render} />;
  }
  return <Redirect to="/" />;
};

CustomRoute.propTypes = {
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default CustomRoute;
