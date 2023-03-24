import React from 'react';
import ReactDOM from 'react-dom/client';
import './styling.css';
import App from './App';
import { baseURL, start_mock } from './config'
import reportWebVitals from './reportWebVitals';

const prepare = () => {
  if (start_mock) {
    console.log(`Starting MSW for mocking backend`);
    const { worker } = require('./mocks/worker');
    worker.start();
  }
  console.log(`Loading frontend...connect to API at ${baseURL}`);
  return Promise.resolve();
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
