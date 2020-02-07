// Dependencies
import React, { useState } from 'react';
import jwt from 'jsonwebtoken';

// Resources
import FormField from '../../sharedcomponents/FormField';
import api from '../../utils/api';

const Header = () => {
  const token = sessionStorage.getItem('userJWT');
  const isLoggedIn = token !== null;
  const user = isLoggedIn && jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
  const [companies, setCompanies] = useState([]);

  const FetchCompanies = async () => {
    try {
      setCompanies(isLoggedIn && await api.User.GetCompanies(user._id.email));
    } catch (error) {
      setCompanies([]);
    }
  };

  useState

  return (
    <header className="header">
      <nav className="header__navbar">
        {
          isLoggedIn && (
            <FormField
              className="m-bottom-15 p-col-11 p-col-align-center"
            />
          )
        }
      </nav>
    </header>
  )
};

export default Header;
