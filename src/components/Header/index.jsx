// Dependencies
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

// Resources
import BurgerMenu from './BurgerMenu';
import MenuList from './MenuList';
import logoPale from '../../static/images/logoPale.png';
import styles from './styles.module.css';
import { ScreenContext } from '../../contexts/Screen';

const Header = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMS } = useContext(ScreenContext);

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
          isCollapsed={isCollapsed}
        />
      </nav>
    </header>
  );
};

export default Header;
