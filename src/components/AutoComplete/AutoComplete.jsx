// Dependencies
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AutoComplete = ({ data, name }) => {
  let timeOut = null;

  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const onFocusHandler = () => {
    clearTimeout(timeOut);
  };

  const onBlurHandler = () => {
    if (focused) {
      timeOut = setTimeout(() => {
        setIsOpen(false);
        setFocused(false);
      });
    }
  };

  const onChangeHandler = (e) => {
    setValue(e.target.value);
    if (value.length > 1) {
      setIsOpen(true);
    }
  };

  const selectOption = (e) => {
    setValue(e.target.innerText);
    setIsOpen(false);
  };

  return (
    <div onFocus={onFocusHandler}>
      <input
        role="searchbox"
        aria-label="Search"
        autoComplete="off"
        type="search"
        name={name}
        value={value}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      />
      {isOpen && (
        <div>
          <div>
            <div>
              <div unselectable="on">
                <ul aria-expanded={isOpen} role="listbox">
                  {data.map((item) => (
                    <li key={data.indexOf(item)} role="option" aria-selected="false" onKeyPress={selectOption} onClick={selectOption}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AutoComplete.defaultProps = {
  data: ['test', 'test 1', 'test 2', 'testigo', 'examen', 'example', 'example 1', 'example 2'],
  name: '',
};

AutoComplete.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
};

export default AutoComplete;
