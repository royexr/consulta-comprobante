// Dependencies
import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();
const isLoggedIn = sessionStorage.getItem('userJWT') !== null;

const Provider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(isLoggedIn);

  const value = {
    isAuth,
    signIn: () => {
      setIsAuth(true);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};

export default {
  Provider,
  Consumer: AuthContext.Consumer,
};
