// Dependencies
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Resources
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { AuthContext } from '../../../contexts/Auth';
import { ScreenContext } from '../../../contexts/Screen';
import MenuLink from './MenuLink';
import styles from './styles.module.css';

const MenuList = ({
  collapseMenu,
}) => {
  const {
    companies,
    changeCompany,
    currentCompany,
    signOut,
  } = useContext(AuthContext);
  const { isMS } = useContext(ScreenContext);
  const history = useHistory();

  const handleSignOut = () => {
    signOut();
    sessionStorage.removeItem('userJWT');
    history.push('/');
  };

  return (
    <div className={classNames(
      'p-col-12 p-lg-9',
      [styles.header__menu],
    )}
    >
      <ul className={classNames(
        styles['menu-list'],
        'p-align-center',
        { 'p-dir-col': isMS },
      )}
      >
        {
          companies.length > 0 && (
            <>
              <MenuLink
                exact
                label="Inicio"
                onClick={collapseMenu}
                to="/dashboard"
              />
              <MenuLink
                exact
                label="Ventas"
                onClick={collapseMenu}
                to="/sales"
              />
              <MenuLink
                exact
                label="Compras"
                onClick={collapseMenu}
                to="/purchases"
              />
            </>
          )
        }
        <MenuLink
          label="Configuración"
          onClick={collapseMenu}
          to="/configuration"
        />
        {
          companies.length > 0 && (
          <MenuLink>
            <Dropdown
              disabled={companies.length < 2}
              name="company"
              onChange={(e) => {
                collapseMenu();
                changeCompany(e.value);
              }}
              options={companies}
              style={{ display: 'block' }}
              value={currentCompany}
            />
          </MenuLink>
          )
        }
        <MenuLink>
          <Button
            className="button p-button-rounded"
            icon="pi pi-power-off"
            label="Salir"
            onClick={() => handleSignOut()}
            type="button"
          />
        </MenuLink>
      </ul>
    </div>
  );
};

MenuList.propTypes = {
  collapseMenu: PropTypes.func.isRequired,
};

export default MenuList;
