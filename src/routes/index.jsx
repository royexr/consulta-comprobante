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

const Routes = () => (
  <>
    <div className={`${styles.container} p-grid p-dir-col p-align-center p-justify-center`}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <AuthContext.Consumer>
          {
            ({ isAuth }) => (
              isAuth ? (
                <>
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/invoices" component={Invoices} />
                  <Route exact path="/purchases" component={Purchases} />
                  <Route exact path="/configuration" component={Configuration} />
                </>
              ) : <NotFound />
            )
          }
        </AuthContext.Consumer>
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  </>
);

export default Routes;
