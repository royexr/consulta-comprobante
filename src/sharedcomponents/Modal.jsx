// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Resources
import './Modal.css';

const Modal = ({ show, children }) => (
  <>
    <div className={`modal${show ? ' show' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
    {/* <div className="modal-overlay" /> */}
  </>
);

Modal.defaultProps = {
  children: null,
  show: false,
};

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  show: PropTypes.bool,
};

export default Modal;
