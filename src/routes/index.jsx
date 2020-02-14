// Dependencies
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Resources
import AuthContext from '../contexts/Auth';
import Configuration from '../components/Dashboard/Configuration';
import Dashboard from '../components/Dashboard';
import Invoices from '../components/Dashboard/Invoices';
import Login from '../components/User/Login';
import NotFound from '../components/NotFound';
import Purchases from '../components/Dashboard/Purchases';
import Register from '../components/User/Register';
import styles from './styles.module.css';
import Header from '../components/Header';

const Routes = () => (
  <AuthContext.Consumer>
    {
      ({
        isAuth,
        companies,
        currentCompany,
        changeCompany,
        signOut,
      }) => (
        <div className={`${styles.container} p-grid p-dir-col p-align-center p-justify-center`}>
          {
            isAuth && companies[0] !== undefined && (
              <Header
                companies={companies}
                currentCompany={currentCompany}
                changeCompany={changeCompany}
                signOut={signOut}
              />
            )
          }
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            {
              isAuth ? (
                <>
                  <Route exact path="/dashboard" render={() => (<Dashboard currentCompany={currentCompany} />)} />
                  <Route exact path="/invoices" render={() => (<Invoices currentCompany={currentCompany} />)} />
                  <Route exact path="/purchases" component={Purchases} />
                  <Route exact path="/configuration" component={Configuration} />
                </>
              ) : <NotFound />
            }
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      )
    }
  </AuthContext.Consumer>
);

export default Routes;
