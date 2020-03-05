// Dependencies
import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';

// Resources
import CustomRoute from '../CustomRoute';
import Companies from '../../components/Dashboard/Companies';
import Users from '../../components/Dashboard/Users';
import Contexts from '../../contexts';

const ConfigRoutes = () => {
  const { path } = useRouteMatch();

  return (
    <Contexts.Consumer>
      {
        ({ isAuth }) => (
          <Switch>
            <CustomRoute
              isAuth={isAuth}
              exact
              path={path}
              render={() => <h1>Bienvenido</h1>}
            />
            <CustomRoute
              isAuth={isAuth}
              exact
              path={`${path}/companies`}
              render={() => <Companies />}
            />
            <CustomRoute
              isAuth={isAuth}
              exact
              path={`${path}/users`}
              render={() => <Users />}
            />
          </Switch>
        )
      }
    </Contexts.Consumer>
  );
};

export default ConfigRoutes;
