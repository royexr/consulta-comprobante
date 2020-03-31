// Depenencies
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';

// Resources
import api from '../../utils/api';
import config from '../../config';

const CompaniesContext = createContext();

const Provider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState('');

  const fetchCompanies = async () => {
    try {
      const token = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);
      const { data } = await api.User.GetCompanies(token['_id'].email);
      const formatted = [];
      for (let i = 0; i < data[0].companies.length; i += 1) {
        const r = data[0].companies[i];
        if (r.isEnabled) {
          const aux = data[0].companiesInfo.filter((d) => r.number === d.RUC);
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
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const value = {
    companies,
    currentCompany: company,
  };

  return (
    <CompaniesContext.Provider value={value}>
      {children}
    </CompaniesContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};

export default {
  CompaniesContext,
  Provider,
};
