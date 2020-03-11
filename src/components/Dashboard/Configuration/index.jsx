// Dependencies
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';

// Resources
import { Menu } from 'primereact/menu';
import ConfigRoutes from '../../../routes/ConfigRoutes';

const Configuration = ({ isEnabled }) => {
  const { url } = useRouteMatch();
  const history = useHistory();

  const items = [
    {
      label: 'Perfil',
      icon: 'pi pi-fw pi-id-card',
      command: () => { history.push(url); },
    },
    {
      label: 'Empresas',
      disabled: !isEnabled,
      icon: 'pi pi-fw pi-briefcase',
      command: () => { history.push(`${url}/companies`); },
    },
  ];

  return (
    <>
      <hgroup className="heading p-col-11 p-col-align-center">
        <h1 className="title">Configuración</h1>
      </hgroup>
      <div className="p-col-11">
        <div className="p-grid p-dir-row p-justify-center">
          <aside className="content p-col-11 p-lg-3 p-xl-2">
            <Menu
              model={items}
              style={{ width: '100%' }}
            />
          </aside>
          <section className="p-col-11 p-lg-9 p-xl-10">
            <ConfigRoutes />
          </section>
        </div>
      </div>
    </>
  );
};

Configuration.defaultProps = {
  isEnabled: false,
};

Configuration.propTypes = {
  isEnabled: PropTypes.bool,
};

export default Configuration;
