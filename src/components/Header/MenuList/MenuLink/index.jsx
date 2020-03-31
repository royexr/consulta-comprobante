// Dependencies
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Resources
import { ScreenContext } from '../../../../contexts/Screen';
import styles from './styles.module.css';

const MenuLink = ({
  children,
  className,
  exact,
  label,
  onClick,
  to,
}) => {
  const { isMS } = useContext(ScreenContext);

  return (
    <li
      className={classNames(
        styles['nav-item'],
        {
          className: className !== '',
          'p-col-10 p-sm-8 p-md-6': isMS,
        },
      )}
    >
      {
        children !== null
          ? children
          : (
            <>
              <NavLink
                activeClassName={styles['ancor-link--active']}
                exact={exact}
                className={styles['ancor-link']}
                onClick={onClick}
                to={to}
              >
                {label}
              </NavLink>
              {
                !isMS && <div />
              }
            </>
          )
      }
    </li>
  );
};

MenuLink.defaultProps = {
  children: null,
  className: '',
  exact: false,
  label: '',
  onClick: null,
  to: '',
};

MenuLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  className: PropTypes.string,
  exact: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default MenuLink;
