import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styling.css'
import { client } from './axiosClient'

const RegistrationForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const reformatNumber = (e) => {
    // Insert spaces into textbox for Credit Card #
    let textbox = e.target;
    // Base string value to be stored
    let baseString = '';
    // Formatted string to be displayed
    let formattedString = '';
    // We get the base string first
    baseString = (textbox.value).replace(/[ ()-]/gi, "");
    let len = baseString.length;
    let sections = ["", "", ""];
    let section = 0;
    for (let i = 0; i < len; i++)
    {
        if (/\d$/.test(baseString.charAt(i)))
        {
          
          if (sections[section].length === 4 && section === 2)
            {
              break;
            }
          else if (sections[section].length === 3 && section < 2)
            {
              section++;
            }
          sections[section] += baseString.charAt(i);
        }
    }
    if (sections[0].length === 3 && sections[1] !== "") {
      formattedString = '(' + sections[0] + ')';
    } else {
      formattedString = sections[0];
    }
    if (sections[1] !== "")
        formattedString += '-' + sections[1];
    if (sections[2] !== "")
        formattedString += '-' + sections[2];
    textbox.value = formattedString;
    return baseString.slice(0,10);
  };
  const handleNumberChange = (e) => {
    const baseNumber = reformatNumber(e)
    setNumber(baseNumber)
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmpassword) {
      alert('Passwords do not match !!')
      return
    }

    await client
      .post('/register', { username, password, email, number, confirmpassword })
      .then((response) => {})
      .catch((error) => {
        const status = error.response.status
        if (status === 400) {
          alert('Registration failed!')
          navigate('/registration')
        }
      })
    await client
      .post('/login', { username, password })
      .then((response) => {
        localStorage.clear()
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', username)
      })
      .catch((error) => {
        const status = error.response.status
        if (status === 400) {
          alert('Login failed!')
          navigate('/login')
        }
      })
    navigate('/profile/edit')
  }

  if (token) {
    navigate('/profile/edit')
  }

  return (
    <>
      <br />
      <center>
        <h1 className='h1'>CREATE ACCOUNT</h1>
      </center>
      <form onSubmit={handleRegisterSubmit}>
        <div className='container'>
          <label className='label' htmlFor='user'>
            User Name:{' '}
          </label>
          <input
            type='text'
            id='user'
            name='user'
            pattern='[a-zA-Z0-9]{3,}'
            placeholder='Enter Username'
            onChange={handleUsernameChange}
            required
          />
          <br />
          <label className='label' htmlFor='email'>
            Email:{' '}
          </label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Enter email address'
            onChange={handleEmailChange}
            required
          />
          <br />
          <label className='label' htmlFor='Phone'>
            Phone Number:
          </label>
          <input
            type='tel'
            id='Phone'
            name='Phone'
            placeholder='Enter phone number'
            minLength={10}
            title='Must contain exactly 10 digits'
            onChange={handleNumberChange}
          />
          <br />
          <label className='label' htmlFor='password1'>
            Password:{' '}
          </label>
          <input
            type='password'
            id='password1'
            name='password1'
            placeholder='Enter a password'
            pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
            title='Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
            onChange={handlePasswordChange}
            required
          />
          <br />
          <label className='label' htmlFor='password2'>
            Confirm Password:
          </label>
          <input
            type='password'
            id='password2'
            name='password2'
            placeholder='Re-enter password'
            onChange={handleConfirmPasswordChange}
            required
          />
          <button type='submit' onSubmit={handleRegisterSubmit}>
            REGISTER
          </button>
          <br />
          <center>
            <h1 className='heading1'>
              Already have an account? <a href='/login'> Sign in </a>
            </h1>
          </center>
        </div>
      </form>
    </>
  )
}

export default RegistrationForm
