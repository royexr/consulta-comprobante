// Dependencies
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const CustomRoute = ({
  isAuth,
  isEnabled,
  exact,
  path,
  render,
}) => {
  if (isAuth && isEnabled) {
    return <Route exact={exact} path={path} render={render} />;
  }
  if (isAuth && !isEnabled) {
    return <h1>Usuario Inhabilitado</h1>;
  }
  return <Redirect to="/" />;
};

CustomRoute.defaultProps = {
  isEnabled: true,
};

CustomRoute.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  isEnabled: PropTypes.bool,
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default CustomRoute;
