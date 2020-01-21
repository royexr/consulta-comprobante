// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Resources
import FormField from './FormField';

const Form = ({
  children,
  className,
  method,
  state,
  onChangeEvent,
  onSubmitEvent,
}) => (
  <form className={className} method={method} onSubmit={onSubmitEvent}>
    {state.map((item) => (
      <FormField
        key={state.indexOf(item)}
        arrayFN={item.arrayFN}
        className={item.className}
        codes={item.codes}
        collectionName={item.collectionName}
        fieldName={item.fieldName}
        handleChange={onChangeEvent}
        label={item.label}
        mask={item.mask}
        name={item.name}
        options={item.options}
        suggestions={item.suggestions}
        type={item.type}
        value={item.value}
      />
    ))}
    {children}
  </form>
);

Form.defaultProps = {
  children: null,
  className: '',
  method: 'GET',
  onSubmitEvent: () => {},
};

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  className: PropTypes.string,
  method: PropTypes.string,
  state: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeEvent: PropTypes.func.isRequired,
  onSubmitEvent: PropTypes.func,
};

export default Form;
