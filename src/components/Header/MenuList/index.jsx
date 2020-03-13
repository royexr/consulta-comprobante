// Dependencies
import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Resources
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import styles from './styles.module.css';
import api from '../../../utils/api';
import { isEmptyObject } from '../../../utils';
import { AuthContext } from '../../../contexts/Auth';
import { ScreenContext } from '../../../contexts/Screen';

const MenuList = ({
  isCollapsed,
}) => {
  const [companies, setCompanies] = useState([]);
  const {
    changeCompany,
    currentCompany,
    signOut,
    userToken,
  } = useContext(AuthContext);
  const { isMS } = useContext(ScreenContext);

  const fetchCompanies = async (uT) => {
    if (!isEmptyObject(uT)) {
      const { data } = await api.User.GetCompanies(uT._id.email);
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
    }
  };

  useEffect(() => {
    fetchCompanies(userToken);
  }, [userToken]);

  const history = useHistory();

  const handleSignOut = () => {
    signOut();
    sessionStorage.removeItem('userJWT');
    history.push('/');
  };

  return (
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
          userToken.isEnabled && (
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
            onClick={() => handleSignOut()}
            type="button"
          />
        </li>
      </ul>
    </div>
  );
};

MenuList.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

export default MenuList;
