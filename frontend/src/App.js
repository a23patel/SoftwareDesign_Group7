import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Link, Outlet } from 'react-router-dom'
import './styling.css';

import { createBrowserRouter, createRoutesFromElements, RouterProvider, useLocation } from 'react-router-dom'

import IndexForm from './IndexForm'
import LoginForm from './LoginForm'
import Profile from './Profile'
//import HistoryForm from './HistoryForm'
import EditProfileForm from './EditProfileForm';
import Logout from './Logout';
//import RegistrationForm from './RegistrationForm';
//import Navbar from './Navbar';

const Footer = () => {
  <>
    <footer>
      <p>Copyright &copy; 2023 Fuel Go. All Rights Reserved.</p>
    </footer>
  </>
}

const AppLayout = () => {
  return (
    <div className="layout">
      <header>
        <Navbar />
      </header>
      <Outlet />
      <Footer />
    </div>
  );
}

const Navbar = () => {
  let location = useLocation();
  const [ loggedIn, setLoggedIn ] = useState(localStorage.getItem('token') !== null);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedIn(true);
    }
    else {
      setLoggedIn(false);
    }
  }, [location]);
  
  if (loggedIn) {
    return (
      <div className="navigation">
        <Link to="/">
          <img src="appLogo.png" alt="" className="header-logo" />
        </Link>
        <nav>
          <ul>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/quote">Fuel Quote</Link></li>
            <li><Link to="/history">Quote History</Link></li>
            <li><Logout /></li>
          </ul>
        </nav>
      </div>
    )
  } else {
    return (
    <div className="navigation">
      <Link to="/">
        <img src="appLogo.png" alt="" className="header-logo" />
      </Link>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/registration">Register</Link></li>
        </ul>
      </nav>
    </div>
    );
  }
};

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<AppLayout />}>
    <Route path="/" element={<IndexForm />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/profile" element={<Profile />} />
    {/* <Route path="/history" element={<HistoryForm />} /> */}
    <Route path="/profile/edit" element={<EditProfileForm />} />
  </Route>
));

const App = () => {
  console.log(router)
  return (
    <RouterProvider router={router} />
  )
};

export default App;
