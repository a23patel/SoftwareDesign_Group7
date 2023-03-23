import React from 'react';
import ReactDOM from 'react-dom/client';
import './styling.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const prepare = () => {
  if (process.env.NODE_ENV === 'development') {
    // TODO fix this so that it is user selectable
    //const { worker } = require('./mocks/worker');
    //worker.start();
  }
  return Promise.resolve()
}

const root = ReactDOM.createRoot(document.getElementById('root'));
prepare().then(() => root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
