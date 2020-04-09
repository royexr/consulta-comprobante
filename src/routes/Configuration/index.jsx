// Dependencies
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import jwt from 'jsonwebtoken';

// Resources
import AuthRoute from '../AuthRoute';
import Companies from '../../components/Dashboard/Companies';
import Profile from '../../components/Dashboard/Profile';
import Users from '../../components/Dashboard/Users';
import Edit from '../../components/Dashboard/Users/Edit';
import NotFound from '../../components/NotFound';
import config from '../../config';

const ConfigurationRoutes = () => {
  const { path } = useRouteMatch();
  const { type } = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);

  return (
    <Switch>
      <AuthRoute
        exact
        path={path}
        render={() => <h1>Bienvenido</h1>}
      />
      <AuthRoute
        exact
        path={`${path}/profile`}
        render={() => <Profile />}
      />
      {
        type === 1 ? (
          <AuthRoute
            exact
            path={`${path}/companies`}
            render={() => <Companies />}
          />
        ) : (
          <>
            <AuthRoute
              exact
              path={`${path}/users`}
              render={() => <Users />}
            />
            <AuthRoute
              exact
              path={`${path}/users/edit/:userId`}
              render={() => <Edit />}
            />
            <AuthRoute
              exact
              path={`${path}/users/new`}
              render={() => <Edit />}
            />
          </>
        )
      }
      {/* {
        type === 2 && (
          <>
            <AuthRoute
              exact
              path={`${path}/users`}
              render={() => <Users />}
            />
            <AuthRoute
              exact
              path={`${path}/users/edit/:userId`}
              render={() => <Edit />}
            />
            <AuthRoute
              exact
              path={`${path}/users/new`}
              render={() => <Edit />}
            />
          </>
        )
      } */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default ConfigurationRoutes;
