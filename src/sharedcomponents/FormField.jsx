// Dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Resources
import { AutoComplete } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import api from '../utils/api';
import './FormField.css';

const FormField = ({
  arrayFN,
  className,
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
          <>
            <span>
              <label htmlFor={name}>
                {label}
                <AutoComplete
                  placeholder={label}
                  name={name}
                  value={value}
                  onChange={handleChange}
                  suggestions={filteredSuggs}
                  completeMethod={suggestBrands}
                />
              </label>
            </span>
          </>
        );
      case 'select':
        return (
          <>
            <span>
              <label htmlFor={name}>
                {label}
                <Dropdown
                  name={name}
                  value={value}
                  options={options}
                  onChange={handleChange}
                  placeholder={label}
                />
              </label>
            </span>
          </>
        );
      case 'textarea':
        return (
          <>
            <span>
              <label htmlFor={name}>{label}</label>
              <textarea
                rows={3}
                name={name}
                onChange={handleChange}
                value={value}
              />
            </span>
          </>
        );
      case 'date':
        return (
          <>
            <span>
              <InputText
                aria-label={label}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
              />
            </span>
          </>
        );
      default:
        return (
          <>
            <span className="p-float-label">
              <InputText
                style={{ width: '100%' }}
                autoComplete="off"
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
              />
              <label htmlFor={name}>{label}</label>
            </span>
          </>
        );
    }
  }

  return (
    <>
      <div className={`form-field ${className}`}>
        {selector()}
      </div>
    </>
  );
};

FormField.defaultProps = {
  arrayFN: undefined,
  className: null,
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
  className: PropTypes.string,
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
