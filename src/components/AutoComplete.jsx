// Dependencies
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AutoComplete = ({
  data, name, value, OnChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  let timeOutId = null;

  const isSimilar = (string) => {
    let validRegExp = true;
    let pattern = '';
    try {
      pattern = new RegExp(`${inputText}`);
    } catch (error) {
      validRegExp = false;
    }
    return string.search(pattern) !== -1 && validRegExp;
  };

  const onChangeHandler = (e) => {
    const newState = e.target.value;
    setInputText(newState);
    setIsOpen(true);
  };

  const selectedOption = (e) => {
    setInputText(e.target.innerText);
    setIsOpen(false);
  };

  const onFocusHandler = () => {
    clearTimeout(timeOutId);
  };

  const onBlurHandler = () => {
    timeOutId = setTimeout(() => {
      setIsOpen(false);
    });
  };

  const validateChange = (e) => {
    if (OnChange === null) {
      onChangeHandler(e);
    } else {
      OnChange(e);
    }
  };

  return (
    <div onFocus={onFocusHandler} onBlur={onBlurHandler}>
      <input
        role="searchbox"
        aria-label="Search"
        autoComplete="off"
        type="search"
        name={name}
        value={value}
        onChange={validateChange}
      />
      {inputText.length > 1 && isOpen && (
        <ul aria-expanded={isOpen} style={{ listStyle: 'none' }}>
          {
            data.map((item) => (
              isSimilar(item) && (
                <li key={data.indexOf(item)}>
                  <button type="button" onClick={selectedOption}>{item}</button>
                </li>
              )
            ))
          }
        </ul>
      )}
    </div>
  );
};

AutoComplete.defaultProps = {
  data: ['test', 'test 1', 'test 2', 'testigo', 'examen', 'example', 'example 1', 'example 2'],
  value: AutoComplete.inputText,
  OnChange: null,
};

AutoComplete.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  OnChange: PropTypes.func,
};

export default AutoComplete;
