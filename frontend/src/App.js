import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Route, Link, Outlet } from 'react-router-dom'
import './styling.css'

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
} from 'react-router-dom'

import IndexForm from './IndexForm'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'
import Profile from './Profile'
import HistoryForm from './HistoryForm'
import EditProfileForm from './EditProfileForm'
import Logout from './Logout'
import QuoteForm from './QuoteForm'

const AppLayout = () => {
  return (
    <div className='layout'>
      <header>
        <Navbar />
      </header>
      <Outlet />
    </div>
  )
}

const Navbar = () => {
  let location = useLocation()
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('token') !== null
  )
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }, [location])

  if (loggedIn) {
    return (
      <div className='navigation'>
        <Link to='/'>
          <img src='appLogo.png' alt='' className='header-logo' />
        </Link>
        <nav>
          <ul>
            <li>
              <Link to='/profile'>My Profile</Link>
            </li>
            <li>
              <Link to='/quote'>Fuel Quote Form</Link>
            </li>
            <li>
              <Link to='/history'>Fuel Quote History</Link>
            </li>
            <li>
              <Logout />
            </li>
          </ul>
        </nav>
      </div>
    )
  } else {
    return (
      <div className='navigation'>
        <Link to='/'>
          <img src='appLogo.png' alt='' className='header-logo' />
        </Link>
        <nav>
          <ul>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/registration'>Sign up</Link>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<AppLayout />}>
      <Route path='/' element={<IndexForm />} />
      <Route path='/login' element={<LoginForm />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/history' element={<HistoryForm />} />
      <Route path='/quote' element={<QuoteForm />} />
      <Route path='/profile/edit' element={<EditProfileForm />} />
      <Route path='/registration' element={<RegistrationForm />} />
      <Route path='/quote' element={<QuoteForm />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />
}

export default App
