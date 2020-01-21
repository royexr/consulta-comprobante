// Dependencies
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Resources
import Login from '../User/Login';
import Register from '../User/Register';
import FormVoucherInquiry from '../FormVoucherInquiry';

const Routes = () => (
  <>
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
  </>
);

export default Routes;
