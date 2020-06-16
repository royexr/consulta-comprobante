// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Resources
import styles from './styles.module.css';

const BurgerMenu = ({ isCollapsed, collapseMenu }) => (
  <div
    className={classNames(
      styles['burger-menu'],
      {
        [styles['burger-menu--open']]: isCollapsed,
      },
    )}
    onClick={collapseMenu}
    onKeyPress={collapseMenu}
    role="button"
    tabIndex={0}
  >
    <span />
    <span />
    <span />
    <span />
  </div>
);

BurgerMenu.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  collapseMenu: PropTypes.func.isRequired,
};

export default BurgerMenu;
