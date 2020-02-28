// Dependencies
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const CustomRoute = ({
  isAuth,
  exact,
  path,
  render,
}) => {
  if (isAuth) {
    return <Route exact={exact} path={path} render={render} />;
  }
  return <Redirect to="/" />;
};

CustomRoute.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default CustomRoute;