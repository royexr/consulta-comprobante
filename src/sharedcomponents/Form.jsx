// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Resources
import FormField from './FormField';

const Form = ({
  method,
  state,
  onChangeEvent,
  onSubmitEvent,
  children,
}) => (
  <form className="form" method={method} onSubmit={onSubmitEvent}>
    {state.map((item) => (
      <FormField
        key={state.indexOf(item)}
        arrayFN={item.arrayFN}
        codes={item.codes}
        collectionName={item.collectionName}
        label={item.label}
        fieldName={item.fieldName}
        handleChange={onChangeEvent}
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
  method: 'GET',
  onSubmitEvent: () => {},
  children: null,
};

Form.propTypes = {
  method: PropTypes.string,
  state: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeEvent: PropTypes.func.isRequired,
  onSubmitEvent: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

export default Form;
