// Dependencies
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Resources
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import styles from './styles.module.css';

const FormField = ({
  buttonCN,
  className,
  disabled,
  errors,
  errorMessage,
  filter,
  filterBy,
  handleBlur,
  handleChange,
  handleClick,
  icon,
  keyfilter,
  label,
  mask,
  maxLength,
  name,
  options,
  suggestions,
  tooltip,
  type,
  value,
}) => {
  const [filteredSuggs, setFilteredSuggs] = useState([]);

  const suggestBrands = async (event) => {
    const results = suggestions.filter((brand) => brand.toLowerCase()
      .includes(event.query.toLowerCase()));

    setFilteredSuggs(results);
  };

  function selector() {
    switch (type) {
      case 'autoComplete':
        return (
          <>
            <label htmlFor={name}>
              <p
                className={classNames(
                  'form__field-label',
                  {
                    'label--error': errors,
                  },
                )}
              >
                {label}
              </p>
              <span>
                <AutoComplete
                  className={classNames(
                    'form__field',
                    {
                      'p-error': errors,
                    },
                  )}
                  disabled={disabled}
                  placeholder={label}
                  name={name}
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  suggestions={filteredSuggs}
                  completeMethod={suggestBrands}
                />
              </span>
            </label>
          </>
        );
      case 'date':
        return (
          <>
            <label htmlFor={name}>
              <p
                className={classNames(
                  'form__field-label',
                  {
                    'label--error': errors,
                  },
                )}
              >
                {label}
              </p>
              <span>
                <InputText
                  aria-label={label}
                  className={classNames(
                    'form__field',
                    {
                      'p-error': errors,
                    },
                  )}
                  disabled={disabled}
                  id={name}
                  name={name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={type}
                  value={value}
                />
              </span>
            </label>
          </>
        );
      case 'input-group':
        return (
          <span>
            <label htmlFor={name}>
              <p
                className={classNames(
                  'form__field-label',
                  {
                    'label--error': errors,
                  },
                )}
              >
                {label}
              </p>
              <div className="p-inputgroup">
                <InputText
                  autoComplete="off"
                  className={classNames(
                    'form__field',
                    {
                      'p-error': errors,
                    },
                  )}
                  disabled={handleChange === null ? true : disabled}
                  id={name}
                  keyfilter={keyfilter && keyfilter}
                  maxLength={maxLength}
                  name={name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={`Ingrese ${label}`}
                  type={type}
                  value={value}
                />
                <Button
                  icon={`pi ${icon}`}
                  className={buttonCN}
                  onClick={handleClick}
                  tooltip={tooltip}
                  tooltipOptions={{ position: 'top' }}
                  type="button"
                />
              </div>
            </label>
          </span>
        );
      case 'mask':
        return (
          <>
            <span>
              <label htmlFor={name}>
                <p
                  className={classNames(
                    'form__field-label',
                    {
                      'label--error': errors,
                    },
                  )}
                >
                  {label}
                </p>
                <InputMask
                  autoComplete="off"
                  className={classNames(
                    'form__field',
                    {
                      'p-error': errors,
                    },
                  )}
                  disabled={disabled}
                  id={name}
                  mask={mask}
                  name={name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={`Ingrese ${label}`}
                  type={type}
                  value={value}
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
                <p
                  className={classNames(
                    'form__field-label',
                    {
                      'label--error': errors,
                    },
                  )}
                >
                  {label}
                </p>
                <Dropdown
                  className={classNames(
                    'form__field',
                    {
                      'p-error': errors,
                    },
                  )}
                  disabled={disabled}
                  filter={filter}
                  filterBy={filterBy}
                  filterPlaceholder={label}
                  id={name}
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
              <label htmlFor={name}>
                <p
                  className={classNames(
                    'form__field-label',
                    {
                      'label--error': errors,
                    },
                  )}
                >
                  {label}
                </p>
                <InputTextarea
                  className={classNames(
                    'form__field',
                    {
                      'p-error': errors,
                    },
                  )}
                  name={name}
                  onChange={handleChange}
                  placeholder={`Ingrese ${label}`}
                  rows={3}
                  value={value}
                />
              </label>
            </span>
          </>
        );
      default:
        return (
          <>
            <span>
              <label htmlFor={name}>
                <p
                  className={classNames(
                    'form__field-label',
                    {
                      'label--error': errors,
                    },
                  )}
                >
                  {label}
                </p>
                <InputText
                  autoComplete="off"
                  className={classNames(
                    'form__field',
                    {
                      'p-error': errors,
                    },
                  )}
                  disabled={handleChange === null ? true : disabled}
                  id={name}
                  keyfilter={keyfilter && keyfilter}
                  maxLength={maxLength && maxLength}
                  name={name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={`Ingrese ${label}`}
                  type={type}
                  value={value}
                />
              </label>
            </span>
          </>
        );
    }
  }

  return (
    <>
      <div
        className={classNames(
          { [className]: className },
        )}
      >
        {selector()}
        {
          errors && (
            <>
              <hr className={styles['error-hr']} />
              <Message
                className="form__field"
                severity="error"
                text={errorMessage}
              />
            </>
          )
        }
      </div>
    </>
  );
};

FormField.defaultProps = {
  buttonCN: '',
  className: '',
  disabled: false,
  errors: false,
  errorMessage: '',
  filter: false,
  filterBy: '',
  handleBlur: null,
  handleChange: null,
  handleClick: null,
  icon: '',
  keyfilter: '',
  label: 'input',
  mask: '',
  maxLength: '',
  name: 'input',
  options: [],
  suggestions: [],
  type: 'input',
  tooltip: '',
  value: '',
};

FormField.propTypes = {
  buttonCN: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.bool,
  errorMessage: PropTypes.string,
  filter: PropTypes.bool,
  filterBy: PropTypes.string,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  icon: PropTypes.string,
  keyfilter: PropTypes.string,
  label: PropTypes.string,
  mask: PropTypes.string,
  maxLength: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.objectOf),
  suggestions: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  tooltip: PropTypes.string,
  value: PropTypes.string,
};

export default FormField;
