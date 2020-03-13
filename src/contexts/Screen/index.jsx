// Dependencies
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ScreenContext = createContext();

const Provider = ({ children }) => {
  const [isMS, setIsMS] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth <= 991) {
        setIsMS(true);
      } else {
        setIsMS(false);
      }
    };

    window.onresize = onResize;
  });

  const value = {
    isMS,
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}
    </ScreenContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};

export default {
  Provider,
};
