// Dependencies
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import jwt from 'jsonwebtoken';

// Resources
import AuthRoute from '../AuthRoute';
import Companies from '../../components/Dashboard/Companies';
import EditCompany from '../../components/Dashboard/Companies/EditCompany';
import Profile from '../../components/Dashboard/Profile';
import RequestCompanies from '../../components/Dashboard/RequestCompanies';
import Users from '../../components/Dashboard/Users';
import EditUser from '../../components/Dashboard/Users/EditUser';
import NotFound from '../../components/NotFound';
import config from '../../config';

const ConfigurationRoutes = () => {
  const { path } = useRouteMatch();
  const { type } = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);

  const renderRouterByType = () => {
    switch (type) {
      case 2:
        return (
          <AuthRoute
            exact
            path={`${path}/request-companies`}
            render={() => <RequestCompanies />}
          />
        );
      case 3:
      case 4:
        return (
          <>
            <AuthRoute
              exact
              path={`${path}/companies`}
              render={() => <Companies />}
            />
            <AuthRoute
              exact
              path={`${path}/companies/edit/:companyId`}
              render={() => <EditCompany />}
            />
            <AuthRoute
              exact
              path={`${path}/companies/new`}
              render={() => <EditCompany />}
            />
            <AuthRoute
              exact
              path={`${path}/users`}
              render={() => <Users />}
            />
            <AuthRoute
              exact
              path={`${path}/users/edit/:userId`}
              render={() => <EditUser />}
            />
            <AuthRoute
              exact
              path={`${path}/users/new`}
              render={() => <EditUser />}
            />
          </>
        );
      default:
        return null;
    }
  };

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
      {renderRouterByType()}
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default ConfigurationRoutes;
