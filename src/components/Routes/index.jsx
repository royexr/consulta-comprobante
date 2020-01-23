// Dependencies
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Resources
import Login from '../User/Login';
import Register from '../User/Register';
import FormVoucherInquiry from '../FormVoucherInquiry';
import styles from './styles.module.css';

const Routes = () => (
  <>
    <div className={`${styles.container} p-grid p-dir-col p-nogutter p-align-center p-justify-center`}>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/voucherInquiry">
          <FormVoucherInquiry />
        </Route>
      </Switch>
    </div>
  </>
);

export default Routes;
