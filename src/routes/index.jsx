// Dependencies
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

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

import styles from './styles.module.css';

const LoginRoute = ({
  isAuth,
  exact,
  path,
  render,
}) => {
  if (isAuth) {
    return <Redirect to="/dashboard" />;
  }
  return <Route exact={exact} path={path} render={render} />;
};

LoginRoute.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

const Routes = () => (
  <Contexts.Consumer>
    {
      ({
        isAuth,
        companies,
        currentCompany,
        changeCompany,
        signIn,
        signOut,
        isMS,
      }) => (
        <div className={`${styles.container} p-grid p-dir-col p-align-center p-justify-center`}>
          {
            isAuth && companies[0] !== undefined && (
              <Header
                companies={companies}
                currentCompany={currentCompany}
                changeCompany={changeCompany}
                signOut={signOut}
                isMS={isMS}
              />
            )
          }
          <Switch>
            <LoginRoute isAuth={isAuth} exact path="/" render={() => (<Login signIn={signIn} />)} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/request-reset" component={RequestResetPassword} />
            <Route exact path="/reset" component={ResetPassword} />
            <CustomRoute isAuth={isAuth} exact path="/dashboard" render={() => (<Dashboard currentCompany={currentCompany} />)} />
            <CustomRoute isAuth={isAuth} exact path="/sales" render={() => (<Sales currentCompany={currentCompany} />)} />
            <CustomRoute isAuth={isAuth} exact path="/purchases" render={() => (<Purchases currentCompany={currentCompany} />)} />
            <CustomRoute isAuth={isAuth} exact path="/configuration" render={() => (<Configuration />)} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      )
    }
  </Contexts.Consumer>
);

export default Routes;
