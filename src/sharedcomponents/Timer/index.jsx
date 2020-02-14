// Dependencies
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Timer = ({ expirationDate }) => {
  let timerID;
  const [date, setDate] = useState(new Date(Date.now));

  const tick = () => {
    setDate(new Date(Date.now()));
  };

  useEffect(() => {
    timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  const timeString = () => {
    const distance = expirationDate.getTime() - date.getTime();
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance >= 0) {
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return (
          <hgroup className="mb-15 p-col-align-center">
            <h2 className="subtitle">{`${minutes}m ${seconds}s`}</h2>
          </hgroup>
        );
      }
    }
    return <></>;
  };

  return (
    <>
      {timeString()}
    </>
  );
};

Timer.propTypes = {
  expirationDate: PropTypes.instanceOf(Date).isRequired,
};

export default Timer;
