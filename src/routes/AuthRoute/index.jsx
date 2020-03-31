// Dependencies
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// Resources
import { AuthContext } from '../../contexts/Auth';

const AuthRoute = ({ exact, path, render }) => {
  const { isAuth } = useContext(AuthContext);

  if (isAuth) {
    return <Route exact={exact} path={path} render={render} />;
  }
  return <Redirect to="/" />;
};

AuthRoute.propTypes = {
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default AuthRoute;
