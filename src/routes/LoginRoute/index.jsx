// Dependencies
import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../contexts/Auth';

const LoginRoute = ({
  exact,
  path,
  render,
}) => {
  const { isAuth, currentCompany } = useContext(AuthContext);

  if (isAuth) {
    if (currentCompany === '') {
      return <Redirect to="/configuration" />;
    }
    return <Redirect to="/dashboard" />;
  }
  return <Route exact={exact} path={path} render={render} />;
};

LoginRoute.propTypes = {
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default LoginRoute;
