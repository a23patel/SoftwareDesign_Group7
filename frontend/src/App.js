import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import IndexForm from './IndexForm';
import LoginForm from './LoginForm';
import Profile from './Profile';

const routes = [
  {
    path: '/',
    element: <IndexForm />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
];

const App = () => {

  return (
    <RouterProvider router={createBrowserRouter(routes)} />
  )
};

export default App;