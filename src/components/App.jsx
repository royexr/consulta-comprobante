// Dependencies
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Resources
import Routes from './Routes';

const App = () => (
  <div className="container">
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </div>
);

export default App;
