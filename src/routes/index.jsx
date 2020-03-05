// Dependencies
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Resources
import Contexts from '../contexts';

import Dashboard from '../components/Dashboard';
import Configuration from '../components/Dashboard/Configuration';
import Sales from '../components/Dashboard/Sales';
import Purchases from '../components/Dashboard/Purchases';

import Login from '../components/User/Login';
import Register from '../components/User/Register';
import RequestResetPassword from '../components/User/RequestReset';
import ResetPassword from '../components/User/Reset';

import NotFound from '../components/NotFound';
import Header from '../components/Header';
import CustomRoute from './CustomRoute';
import LoginRoute from './LoginRoute';

import styles from './styles.module.css';

const Routes = () => (
  <Contexts.Consumer>
    {
      ({
        isAuth,
        isEnabled,
        companies,
        currentCompany,
        signIn,
        isMS,
      }) => (
        <div className={`${styles.container} p-grid p-dir-col p-align-center p-justify-center`}>
          {
            isAuth && companies[0] !== undefined && (
              <Header
                isMS={isMS}
              />
            )
          }
          <Switch>
            <LoginRoute isAuth={isAuth} exact path="/" render={() => (<Login signIn={signIn} />)} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/request-reset" component={RequestResetPassword} />
            <Route exact path="/reset" component={ResetPassword} />
            <CustomRoute
              exact
              isAuth={isAuth}
              isEnabled={isEnabled}
              path="/sales"
              render={() => (<Sales currentCompany={currentCompany} />)}
            />
            <CustomRoute
              exact
              isAuth={isAuth}
              isEnabled={isEnabled}
              path="/purchases"
              render={() => (<Purchases currentCompany={currentCompany} />)}
            />
            <CustomRoute
              exact
              isAuth={isAuth}
              isEnabled={isEnabled}
              path="/dashboard"
              render={() => (<Dashboard currentCompany={currentCompany} />)}
            />
            <Route
              exact={false}
              isAuth={isAuth}
              path="/configuration"
              render={() => (<Configuration isEnabled={isEnabled} />)}
            />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      )
    }
  </Contexts.Consumer>
);

export default Routes;
