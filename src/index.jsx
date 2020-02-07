// Dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

// Resources
import App from './components/App';
import AuthContext from './contexts/Auth';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './index.css';

ReactDOM.render(
  <AuthContext.Provider>
    <App />
  </AuthContext.Provider>,
  document.getElementById('root'),
);
