// Dependencies
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

// Resources
import { Sidebar } from 'primereact/sidebar';
import { ScreenContext } from '../../contexts/Screen';
import BurgerMenu from './BurgerMenu';
import MenuList from './MenuList';
import logoPale from '../../static/images/logoPale.png';
import styles from './styles.module.css';

const Header = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMS } = useContext(ScreenContext);

  const collapseMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <header className={`${styles.header} p-col-12`}>
        <nav className="navbar p-grid p-nogutter p-justify-between">
          <Link
            className={`${styles.navbar__brand} p-col-4 p-lg-2`}
            onClick={() => {
              setIsCollapsed(false);
            }}
            to="/dashboard"
          >
            <img className={styles.navbar__logo} src={logoPale} alt="logo Pale" />
          </Link>
          {
            isMS ? (
              <BurgerMenu
                isCollapsed={isCollapsed}
                collapseMenu={collapseMenu}
              />
            ) : (
              <MenuList
                collapseMenu={collapseMenu}
              />
            )
          }
        </nav>
      </header>
      {
        isMS && (
          <Sidebar
            blockScroll
            style={{ padding: '.5em' }}
            fullScreen
            onHide={() => setIsCollapsed(true)}
            showCloseIcon={false}
            visible={isCollapsed}
          >
            <nav className="navbar p-grid p-nogutter p-justify-between">
              <Link
                className={`${styles.navbar__brand} p-col-4 p-lg-2`}
                onClick={() => {
                  setIsCollapsed(false);
                }}
                to="/dashboard"
              >
                <img className={styles.navbar__logo} src={logoPale} alt="logo Pale" />
              </Link>
              { isMS && (
                <BurgerMenu
                  isCollapsed={isCollapsed}
                  collapseMenu={collapseMenu}
                />
              )}
              <MenuList
                collapseMenu={collapseMenu}
              />
            </nav>
          </Sidebar>
        )
      }
    </>
  );
};

export default Header;
