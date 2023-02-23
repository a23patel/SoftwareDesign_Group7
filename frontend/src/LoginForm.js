import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './styling.css'

const client = axios.create({
  baseURL: 'api',
})

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleLoginSubmit = async () => {
    await client
      .post('/login', { username, password })
      .then((response) => {
        localStorage.clear()
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        navigate('/profile')
      })
      .catch((error) => {
        const status = error.response.status
        if (status === 400) {
          alert('Login failed!')
          navigate('/login')
        }
      })
  }

  if (token) {
    navigate('/profile')
  }
  return (
    <>
      <br />
      <center>
        <h1 className='h1'>CLIENT LOGIN</h1>
      </center>
      <div className='container'>
        <label className='label' htmlFor='user'>
          Username:{' '}
        </label>
        <input
          type='text'
          id='user'
          name='user'
          placeholder='Enter Username'
          onChange={handleUsernameChange}
          required=''
        />
        <br />
        <label className='label' htmlFor='password'>
          Password:{' '}
        </label>
        <input
          type='password'
          id='password1'
          name='password1'
          placeholder='Enter password'
          onChange={handlePasswordChange}
          required=''
        />
        <br />
        <br />
        <input type='checkbox' /> Remember me <br />
        <button type='button' onClick={handleLoginSubmit}>
          LOGIN
        </button>{' '}
        <br />
        <center>
          <h1 className='heading1'>
            Don't have an account?
            <a href='registration.html'> Register Here </a>
          </h1>
        </center>
      </div>
    </>
  )
}

export default LoginForm
