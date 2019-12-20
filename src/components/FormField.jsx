// Dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Resources
import { AutoComplete } from 'primereact/autocomplete';
import api from '../utils/api';

const FormField = ({
  collectionName,
  content,
  fieldName,
  formType,
  handleChange,
  name,
  selectOptions,
  type,
  value,
}) => {
  const [suggs, setSuggs] = useState([]);
  const [filteredSuggs, setFilteredSuggs] = useState([]);

  useEffect(() => {
    const FetchSuggestions = async () => {
      if (formType === 'autoComplete') {
        setSuggs(await api.Distincts.GetValues(collectionName, fieldName));
      }
    };
    FetchSuggestions();
  }, [formType, fieldName]);

  const suggestBrands = async (event) => {
    const results = suggs
      .filter((brand) => brand.toLowerCase().startsWith(event.query.toLowerCase()));

    setFilteredSuggs(results);
  };

  function selector() {
    switch (formType) {
      case 'autoComplete':
        return (
          <AutoComplete
            name={name}
            value={value}
            onChange={handleChange}
            suggestions={filteredSuggs}
            completeMethod={suggestBrands}
          />
        );
      case 'select':
        return (
          <select className="form-control" name={name} value={value} onChange={handleChange}>
            {selectOptions.map((item) => (
              <option
                key={selectOptions.indexOf(item)}
                value={item.code}
              >
                {item.name}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return <textarea className="form-control" rows={3} name={name} placeholder={`Tu ${content}`} onChange={handleChange} value={value} />;
      case 'button':
        return <button className="button button--blue" type="submit">{content}</button>;
      default:
        return <input className="form-control" type={type} name={name} placeholder={`Tu ${content}`} onChange={handleChange} value={value} />;
    }
  }

  return (
    <div className="form-field">
      {selector()}
    </div>
  );
};

FormField.defaultProps = {
  collectionName: '',
  formType: 'input',
  type: 'text',
  name: 'input',
  fieldName: '',
  content: 'input',
  value: '',
  selectOptions: [''],
};

FormField.propTypes = {
  collectionName: PropTypes.string,
  formType: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  fieldName: PropTypes.string,
  content: PropTypes.string,
  value: PropTypes.string,
  selectOptions: PropTypes.arrayOf(PropTypes.objectOf),
  handleChange: PropTypes.func.isRequired,
};

export default FormField;
