// Dependencies
import React, { useContext } from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';

// Resources
import CustomRoute from '../CustomRoute';
import Companies from '../../components/Dashboard/Companies';
import Users from '../../components/Dashboard/Users';
import { AuthContext } from '../../contexts/Auth';
import Profile from '../../components/Dashboard/Profile';

const ConfigRoutes = () => {
  const { path } = useRouteMatch();
  const { isAuth, userToken } = useContext(AuthContext);

  return (
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
        render={() => <Companies userToken={userToken} />}
      />
      <CustomRoute
        isAuth={isAuth}
        exact
        path={`${path}/profile`}
        render={() => <Profile />}
      />
      <CustomRoute
        isAuth={isAuth}
        exact
        path={`${path}/users`}
        render={() => <Users />}
      />
    </Switch>
  );
};

export default ConfigRoutes;
