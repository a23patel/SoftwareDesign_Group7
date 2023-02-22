import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import IndexForm from './IndexForm'
import LoginForm from './LoginForm'
import Profile from './Profile'
import HistoryForm from './HistoryForm'

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
]

const App = () => {
  return <RouterProvider router={createBrowserRouter(routes)} />
}

export default App
