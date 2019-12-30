// Dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Resources
import { AutoComplete } from 'primereact/autocomplete';
import api from '../utils/api';

const FormField = ({
  arrayFN,
  codes,
  collectionName,
  label,
  fieldName,
  handleChange,
  name,
  options,
  suggestions,
  type,
  value,
}) => {
  const [suggs, setSuggs] = useState([]);
  const [filteredSuggs, setFilteredSuggs] = useState([]);

  useEffect(() => {
    const FetchSuggestions = async () => {
      if (type === 'autoComplete' && suggestions.length === 0) {
        try {
          setSuggs((await api.Distincts.GetValues(collectionName, fieldName, arrayFN, codes)).data);
        } catch (error) {
          setSuggs([]);
        }
      }
    };
    FetchSuggestions();
  }, [arrayFN, codes, collectionName, type, fieldName, suggestions]);

  const suggestBrands = async (event) => {
    const results = suggestions.length === 0
      ? suggs.filter((brand) => brand.toLowerCase().startsWith(event.query.toLowerCase()))
      : suggestions.filter((brand) => brand.toLowerCase().startsWith(event.query.toLowerCase()));

    setFilteredSuggs(results);
  };

  function selector() {
    switch (type) {
      case 'autoComplete':
        return (
          <div>
            <span>
              <label htmlFor={name}>{label}</label>
              <AutoComplete
                name={name}
                value={value}
                onChange={handleChange}
                suggestions={filteredSuggs}
                completeMethod={suggestBrands}
              />
            </span>
          </div>
        );
      case 'select':
        return (
          <div>
            <span>
              <label htmlFor={name}>{label}</label>
              <select name={name} value={value} onChange={handleChange}>
                {options.map((option) => (
                  <option
                    key={options.indexOf(option)}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
          </div>
        );
      case 'textarea':
        return (
          <div>
            <span>
              <label htmlFor={name}>{label}</label>
              <textarea
                rows={3}
                name={name}
                onChange={handleChange}
                value={value}
              />
            </span>
          </div>
        );
      default:
        return (
          <div>
            <span>
              <label htmlFor={name}>{label}</label>
              <input
                type={type}
                id={name}
                name={name}
                onChange={handleChange}
                value={value}
                autoComplete="off"
              />
            </span>
          </div>
        );
    }
  }

  return (
    <>
      {selector()}
    </>
  );
};

FormField.defaultProps = {
  arrayFN: undefined,
  codes: undefined,
  collectionName: '',
  type: 'input',
  name: 'input',
  fieldName: '',
  label: 'input',
  value: '',
  options: [],
  suggestions: [],
};

FormField.propTypes = {
  arrayFN: PropTypes.string,
  codes: PropTypes.arrayOf(PropTypes.string),
  collectionName: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.objectOf),
  suggestions: PropTypes.arrayOf(PropTypes.string),
  handleChange: PropTypes.func.isRequired,
};

export default FormField;
