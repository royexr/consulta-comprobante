// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Resources
import AuthContext from './Auth';
import ScreenContext from './Screen';

const Provider = ({ children }) => (
  <AuthContext.Provider>
    <ScreenContext.Provider>
      {children}
    </ScreenContext.Provider>
  </AuthContext.Provider>
);

const Consumer = ({ children }) => (
  <AuthContext.Consumer>
    {({
      isAuth,
      changeCompany,
      companies,
      currentCompany,
      signIn,
      signOut,
      userToken,
    }) => (
      <ScreenContext.Consumer>
        {({
          isMS,
        }) => children({
          changeCompany,
          companies,
          currentCompany,
          isAuth,
          isMS,
          signIn,
          signOut,
          userToken,
        })}
      </ScreenContext.Consumer>
    )}
  </AuthContext.Consumer>
);

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};

Consumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export default {
  Provider,
  Consumer,
};
