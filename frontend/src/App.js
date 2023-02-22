import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom'
import './styling.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import IndexForm from './IndexForm'
import LoginForm from './LoginForm'
import Profile from './Profile'
import HistoryForm from './HistoryForm'
import EditProfileForm from './EditProfileForm';

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

  {
    path: '/history',
    element: <HistoryForm />,
  },
  {
    path: '/profile/edit',
    element: <EditProfileForm />,
  },
];

const App = () => {
  return (
    <div className="app">
      <div class="navigation">
        <nav>
          <ul>
            {/* <li><a href="/registration">Sign Up</a></li>
            <li><a href="/profile">My Profile</a></li>
  <li><a href="/quote">Fuel Quote Form</a></li> */}
            <li><Link to="/registration">Sign Up</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/quote">Fuel Quote</Link></li>
          </ul>
        </nav>
      </div>
      <RouterProvider router={createBrowserRouter(routes)} />
      <footer>
        <p>Copyright &copy; 2023 Fuel Go. All Rights Reserved.</p>
      </footer>
    </div>
  )
};

export default App;
