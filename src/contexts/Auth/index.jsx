// Dependencies
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';

// Resources
import api from '../../utils/api';

const AuthContext = createContext();
const isLoggedIn = sessionStorage.getItem('userJWT') !== null;

const Provider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(isLoggedIn);
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState('');

  const fetchCompanies = async () => {
    try {
      const token = jwt.verify(sessionStorage.getItem('userJWT'), process.env.REACT_APP_JWT_SECRET);
      const auxCompanies = (await api.User.GetCompanies(token._id.email)).data;
      const formatted = auxCompanies.map((comp) => ({
        value: comp.RUC,
        label: `${comp.RUC} ${comp.RazonSocial}`,
      }));
      setCompanies(formatted);
      setCompany(formatted[0].value);
    } catch (error) {
      setCompanies([]);
      setCompany('');
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchCompanies();
    }
  }, [isAuth]);

  const value = {
    isAuth,
    signIn: () => {
      setIsAuth(true);
    },
    signOut: () => {
      setIsAuth(false);
    },
    companies,
    currentCompany: company,
    changeCompany: (newCompany) => {
      setCompany(newCompany);
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
