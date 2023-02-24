import { React, useState, useEffect } from 'react'
import './styling.css'
import { useNavigate } from 'react-router-dom'
import { clientWithAuth } from './axiosClient'

const Logout = () => {
  const navigate = useNavigate()
  const handleLogout = async () => {
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')
    if (!token) {
      localStorage.clear()
      navigate('/login')
    }
    await clientWithAuth(token)
      .post('/logout', { username })
      .then((response) => {})
      .catch((error) => {
        console.log(error)
      })
    localStorage.clear()
    navigate('/')
  }

  return (
    <button className='logout_button' onClick={handleLogout}>
      Log Out
    </button>
  )
}

export default Logout
