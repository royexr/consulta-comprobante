// Dependencies
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const LoginRoute = ({
  isAuth,
  exact,
  path,
  render,
}) => {
  if (isAuth) {
    return <Redirect to="/dashboard" />;
  }
  return <Route exact={exact} path={path} render={render} />;
};

LoginRoute.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default LoginRoute;
