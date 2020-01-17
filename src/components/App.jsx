// Dependencies
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Resources
import Header from './Header';
import Routes from './Routes';
import Footer from './Footer';
import './App.css';

const App = () => (
  <>
    <Header />
    <div className="container p-grid p-nogutter p-justify-center">
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
    <Footer />
  </>
);

export default App;
