// Dependencies
import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';

// Resources
import api from '../../utils/api';
import config from '../../config';

const AuthContext = createContext();
const isLoggedIn = sessionStorage.getItem('userJWT') !== null;

const Provider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState('');
  const [isAuth, setIsAuth] = useState(isLoggedIn);
  const [userToken, setUserToken] = useState({});
  // const [isEnabled, setIsEnabled] = useState();
  // const [userType, setUserType] = useState();

  const fetchCompanies = async (auth) => {
    if (auth) {
      try {
        const token = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);
        setUserToken(token);
        // setIsEnabled(token.isEnabled);
        // setUserType(token.type);
        const { data } = (await api.User.GetCompanies(token._id.email));
        const formatted = data[0].companies.map((comp) => ({
          label: `${comp.RUC} ${comp.RazonSocial}`,
          value: comp.RUC,
        }));
        setCompanies(formatted);
        setCompany(formatted[0].value);
      } catch (error) {
        // setIsEnabled(false);
        setCompanies([]);
        setCompany('');
      }
    }
  };

  useEffect(() => {
    fetchCompanies(isAuth);
  }, [isAuth]);

  const value = {
    changeCompany: (newCompany) => {
      setCompany(newCompany);
    },
    companies,
    currentCompany: company,
    isAuth,
    // isEnabled,
    // userType,
    signIn: () => {
      setIsAuth(true);
    },
    signOut: () => {
      setIsAuth(false);
    },
    userToken,
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
