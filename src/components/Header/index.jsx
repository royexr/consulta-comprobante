// Dependencies
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Resources
import BurgerMenu from './BurgerMenu';
import MenuList from './MenuList';
import logoPale from '../../static/images/logoPale.png';
import styles from './styles.module.css';
import Contexts from '../../contexts';

const Header = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapseMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Contexts.Consumer>
      {
        ({
          changeCompany,
          currentCompany,
          isMS,
          signOut,
          userToken,
        }) => (
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
                changeCompany={changeCompany}
                currentCompany={currentCompany}
                isCollapsed={isCollapsed}
                isMS={isMS}
                signOut={signOut}
                userToken={userToken}
              />
            </nav>
          </header>
        )
      }
    </Contexts.Consumer>
  );
};

export default Header;
