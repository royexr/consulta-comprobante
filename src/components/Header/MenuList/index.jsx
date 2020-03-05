// Dependencies
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Resources
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import styles from './styles.module.css';
import Contexts from '../../../contexts';

const MenuList = ({ isCollapsed }) => {
  const history = useHistory();

  // const handleChange = (e) => {
  //   changeCompany(e.value);
  // };

  const handleSignOut = (signOut) => {
    signOut();
    sessionStorage.removeItem('userJWT');
    history.push('/');
  };

  return (
    <Contexts.Consumer>
      {
        ({
          companies,
          currentCompany,
          changeCompany,
          isMS,
          isEnabled,
          signOut,
        }) => (
          <div className={classNames(
            'p-col-align-center',
            [`p-col-${isMS ? '12' : '8'}`],
            [styles.header__menu],
            {
              [styles['header__menu--show']]: isCollapsed,
            },
          )}
          >
            <ul className={classNames(
              styles['menu-list'],
              'p-align-center',
              { 'p-dir-col': isMS },
            )}
            >
              {
                isEnabled && (
                  <>
                    <li
                      className={classNames({ 'p-col-10 p-sm-8 p-md-6': isMS })}
                    >
                      <Link to="/sales">Ventas</Link>
                    </li>
                    <li
                      className={classNames({ 'p-col-10 p-sm-8 p-md-6': isMS })}
                    >
                      <Link to="/purchases">Compras</Link>
                    </li>
                  </>
                )
              }
              <li
                className={classNames({ 'p-col-10 p-sm-8 p-md-6': isMS })}
              >
                <Link to="/configuration">Configuración</Link>
              </li>
              <li
                className={classNames({ 'p-col-10 p-sm-8 p-md-6': isMS })}
              >
                <Dropdown
                  disabled={companies.length < 2}
                  name="company"
                  onChange={(e) => { changeCompany(e.value); }}
                  options={companies}
                  style={{ display: 'block' }}
                  value={currentCompany}
                />
              </li>
              <li
                className={classNames({ 'p-col-8 p-sm-6 p-md-4': isMS })}
              >
                <Button
                  className="button p-button-rounded"
                  icon="pi pi-power-off"
                  label="Salir"
                  onClick={() => handleSignOut(signOut)}
                  type="button"
                />
              </li>
            </ul>
          </div>
        )
      }
    </Contexts.Consumer>
  );
};

MenuList.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

export default MenuList;
