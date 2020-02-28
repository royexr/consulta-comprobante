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
      companies,
      currentCompany,
      changeCompany,
      signIn,
      signOut,
    }) => (
      <ScreenContext.Consumer>
        {({
          isMS,
        }) => children({
          isAuth,
          companies,
          currentCompany,
          changeCompany,
          signIn,
          signOut,
          isMS,
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
