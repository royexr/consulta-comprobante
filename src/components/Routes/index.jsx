// Dependencies
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Resources
import Login from '../Login';
import CreateUser from '../CreateUser';
import FormVoucherInquiry from '../FormVoucherInquiry';

const Routes = () => (
  <>
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/register">
        <CreateUser />
      </Route>
      <Route exact path="/voucherInquiry">
        <FormVoucherInquiry />
      </Route>
    </Switch>
  </>
);

export default Routes;
