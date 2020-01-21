// Dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Resources
import { AutoComplete } from 'primereact/autocomplete';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import api from '../utils/api';
import './FormField.css';

const FormField = ({
  arrayFN,
  className,
  codes,
  collectionName,
  fieldName,
  handleChange,
  label,
  mask,
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
      case 'select':
        return (
          <>
            <span>
              <label htmlFor={name}>
                {label}
                <Dropdown
                  style={{ width: '100%' }}
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
      case 'mask':
        return (
          <>
            <span className="p-float-label">
              <InputMask
                autoComplete="off"
                id={name}
                mask={mask}
                name={name}
                onChange={handleChange}
                style={{ width: '100%' }}
                type={type}
                value={value}
              />
              <label htmlFor={name}>{label}</label>
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
      default:
        return (
          <>
            <span className="p-float-label">
              <InputText
                autoComplete="off"
                id={name}
                name={name}
                onChange={handleChange}
                style={{ width: '100%' }}
                type={type}
                value={value}
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
  fieldName: '',
  label: 'input',
  mask: '',
  name: 'input',
  options: [],
  suggestions: [],
  type: 'input',
  value: '',
};

FormField.propTypes = {
  arrayFN: PropTypes.string,
  className: PropTypes.string,
  codes: PropTypes.arrayOf(PropTypes.string),
  collectionName: PropTypes.string,
  fieldName: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  mask: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.objectOf),
  suggestions: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  value: PropTypes.string,
};

export default FormField;
