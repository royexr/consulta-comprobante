// Dependencies
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Resources
import BurgerMenu from './BurgerMenu';
import MenuList from './MenuList';
import logoPale from '../../static/images/logoPale.png';
import styles from './styles.module.css';

const Header = ({
  companies,
  currentCompany,
  changeCompany,
  signOut,
  isMS,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapseMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <header className={`${styles.header} p-col-12`}>
      <nav className="navbar p-grid p-nogutter p-justify-between">
        <Link to="/dashboard" className={`${styles.navbar__brand} p-col-2`}>
          <img className={styles.navbar__logo} src={logoPale} alt="logo" />
        </Link>
        {
          isMS && (
            <BurgerMenu
              isCollapsed={isCollapsed}
              collapseMenu={collapseMenu}
            />
          )
        }
        <MenuList
          companies={companies}
          currentCompany={currentCompany}
          changeCompany={changeCompany}
          isCollapsed={isCollapsed}
          isMS={isMS}
          signOut={signOut}
        />
      </nav>
    </header>
  );
};

Header.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentCompany: PropTypes.string.isRequired,
  changeCompany: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  isMS: PropTypes.bool.isRequired,
};

export default Header;
