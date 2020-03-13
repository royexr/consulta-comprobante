// Dependencies
import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

// Resources
import { AuthContext } from '../contexts/Auth';

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

const Routes = () => {
  const {
    isAuth,
    currentCompany,
    signIn,
    userToken,
  } = useContext(AuthContext);

  return (
    <div className={`${styles.container} p-grid p-dir-col p-align-center p-justify-center`}>
      {
        isAuth && (
          <Header />
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
          isEnabled={userToken.isEnabled}
          path="/sales"
          render={() => (<Sales currentCompany={currentCompany} />)}
        />
        <CustomRoute
          exact
          isAuth={isAuth}
          isEnabled={userToken.isEnabled}
          path="/purchases"
          render={() => (<Purchases currentCompany={currentCompany} />)}
        />
        <CustomRoute
          exact
          isAuth={isAuth}
          isEnabled={userToken.isEnabled}
          path="/dashboard"
          render={() => (<Dashboard currentCompany={currentCompany} />)}
        />
        <Route
          exact={false}
          isAuth={isAuth}
          path="/configuration"
          render={() => (<Configuration isEnabled={userToken.isEnabled} />)}
        />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
};

export default Routes;
