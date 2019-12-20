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
}) => (
  <form className="form" method={method} onSubmit={onSubmitEvent}>
    {state.map((item) => (
      <FormField
        key={state.indexOf(item)}
        collectionName={item.collectionName}
        content={item.content}
        fieldName={item.fieldName}
        formType={item.formType}
        handleChange={onChangeEvent}
        name={item.name}
        selectOptions={item.selectOptions}
        type={item.type}
        value={item.value}
      />
    ))}
  </form>
);

Form.defaultProps = {
  method: 'GET',
};

Form.propTypes = {
  method: PropTypes.string,
  state: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeEvent: PropTypes.func.isRequired,
  onSubmitEvent: PropTypes.func.isRequired,
};

export default Form;
