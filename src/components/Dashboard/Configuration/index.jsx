// Dependencies
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import jwt from 'jsonwebtoken';

// Resources
import { Menu } from 'primereact/menu';
import ConfigurationRoutes from '../../../routes/Configuration';
import config from '../../../config';

const Configuration = () => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { type } = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);

  const items = [
    {
      label: 'Perfil',
      icon: 'pi pi-fw pi-id-card',
      command: () => { history.push(`${url}/profile`); },
    },
  ];

  switch (type) {
    case 2:
      items.push({
        label: 'Empresas',
        icon: 'pi pi-fw pi-briefcase',
        command: () => { history.push(`${url}/request-companies`); },
      });
      break;
    case 3:
    case 4:
      items.push(
        {
          label: 'Usuarios',
          icon: 'pi pi-fw pi-users',
          command: () => { history.push(`${url}/users`); },
        },
        {
          label: 'Empresas',
          icon: 'pi pi-fw pi-briefcase',
          command: () => { history.push(`${url}/companies`); },
        },
      );
      break;
    default:
      break;
  }

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
            <ConfigurationRoutes />
          </section>
        </div>
      </div>
    </>
  );
};

export default Configuration;
