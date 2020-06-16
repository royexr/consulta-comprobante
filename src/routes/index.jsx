// Dependencies
import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import jwt from 'jsonwebtoken';

// Resources
import { AuthContext } from '../contexts/Auth';

import Dashboard from '../components/Dashboard';
import Configuration from '../components/Dashboard/Configuration';
import Sales from '../components/Dashboard/Sales';
import Purchases from '../components/Dashboard/Purchases';

import Login from '../components/User/Login';
import Register from '../components/User/Register';
import CompleteRegister from '../components/User/CompleteRegister';
import RequestResetPassword from '../components/User/RequestReset';
import ResetPassword from '../components/User/Reset';

import NotFound from '../components/NotFound';
import Header from '../components/Header';
import AuthRoute from './AuthRoute';
import CustomRoute from './CustomRoute';
import LoginRoute from './LoginRoute';

import config from '../config';
import styles from './styles.module.css';

const Routes = () => {
  const {
    isAuth,
    currentCompany,
  } = useContext(AuthContext);

  let token = {};
  if (isAuth) {
    token = jwt.verify(sessionStorage.getItem('userJWT'), config.jwtSecret);
  }

  return (
    <div className={`${styles.container} p-grid p-dir-col p-align-center p-justify-center`}>
      {
        isAuth && (
          <Header />
        )
      }
      <Switch>
        <LoginRoute
          exact
          path="/"
          render={() => (<Login />)}
        />
        <Route exact path="/register" component={Register} />
        <Route exact path="/request-reset" component={RequestResetPassword} />
        <Route exact path="/reset" component={ResetPassword} />
        <Route exact path="/complete-register" component={CompleteRegister} />
        <CustomRoute
          exact
          path="/dashboard"
          render={() => (
            <Dashboard currentCompany={currentCompany} />
          )}
        />
        <CustomRoute
          exact
          path="/sales"
          render={() => (<Sales currentCompany={currentCompany} />)}
        />
        {
          (isAuth && token.type === 1) ? (
            <Route
              exact
              path="/purchases"
              render={() => (<Purchases currentCompany={currentCompany} />)}
            />
          ) : (
            <CustomRoute
              exact
              path="/purchases"
              render={() => (<Purchases currentCompany={currentCompany} />)}
            />
          )
        }
        <AuthRoute
          exact={false}
          path="/configuration"
          render={() => (<Configuration />)}
        />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
};

export default Routes;
