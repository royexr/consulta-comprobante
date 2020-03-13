// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Resources
import Auth from './Auth';
import Screen from './Screen';

const Provider = ({ children }) => (
  <Auth.Provider>
    <Screen.Provider>
      {children}
    </Screen.Provider>
  </Auth.Provider>
);

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};

export default {
  Provider,
};
