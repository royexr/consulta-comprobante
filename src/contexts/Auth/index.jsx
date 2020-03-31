// Dependencies
import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';

// Resources
import api from '../../utils/api';
import config from '../../config';

export const AuthContext = createContext();

const Provider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState('');
  const [isAuth, setIsAuth] = useState(() => sessionStorage.getItem('userJWT') !== null);

  const fetchCompanies = async (auth) => {
    if (auth) {
      try {
        const { _id, type } = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);
        switch (type) {
          case 1: {
            const { data } = await api.User.GetCompanies(_id.email);
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
            break;
          }
          case 2: {
            const { data } = await api.Company.ReadAll();
            const formatted = data.map((c) => ({
              label: `${c.RUC} ${c.RazonSocial}`,
              value: c.RUC,
            }));
            setCompanies(formatted);
            setCompany(formatted[0].value);
            break;
          }
          default:
            setCompanies([]);
            setCompany('');
            break;
        }
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
    signIn: (userInfo) => {
      sessionStorage.setItem('userJWT', jwt.sign(userInfo, config.jwtSecret));
      setIsAuth(true);
    },
    signOut: () => {
      setIsAuth(false);
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
};
