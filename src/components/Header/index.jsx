// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Resources
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';

const Header = ({
  companies,
  currentCompany,
  changeCompany,
  signOut,
}) => {
  const history = useHistory();

  const handleChange = (e) => {
    changeCompany(e.value);
  };

  const handleSignOut = () => {
    signOut();
    sessionStorage.removeItem('userJWT');
    history.push('/');
  };

  return (
    <header className="header p-col-12">
      <nav className="header__navbar p-grid p-nogutter p-justify-between">
        <div className="p-col-2" />
        <div className="p-col-11 p-sm-10 p-md-8 p-lg-6 p-xl-4 p-col-align-center">
          <Dropdown
            disabled={companies.length < 2}
            name="company"
            onChange={handleChange}
            options={companies}
            value={currentCompany}
          />
        </div>
        <div className="p-md-4 p-lg-2 p-xl-1">
          <Button
            className="button"
            icon="pi pi-sign-out"
            label="Salir"
            onClick={handleSignOut}
            type="button"
          />
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentCompany: PropTypes.string.isRequired,
  changeCompany: PropTypes.func.isRequired,
};

export default Header;
