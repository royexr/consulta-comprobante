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

  const fetchCompanies = async (auth) => {
    if (auth) {
      try {
        const token = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);
        setUserToken(token);
        const { data } = (await api.User.GetCompanies(token._id.email));
        const formatted = [];
        for (let i = 0; i < data[0].companies.length; i += 1) {
          const r = data[0].companies[i];
          if (r.isEnabled) {
            const aux = data[0].companiesInfo.filter((d) => d.RUC === r.number);
            formatted.push({
              label: `${aux[0].RUC} ${aux[0].RazonSocial}`,
              value: aux[0].RUC,
            });
          }
        }
        setCompanies(formatted);
        setCompany(formatted[0].value);
      } catch (error) {
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
