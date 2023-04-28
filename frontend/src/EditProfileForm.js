import { React, useState, useEffect } from 'react'
import './styling.css'
import { useNavigate } from 'react-router-dom'
import { clientWithAuth } from './axiosClient'

const EditProfileForm = () => {
  const [fullname, setFullname] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipcode, setZipcode] = useState('')
  const navigate = useNavigate()

  const handleChangeName = (e) => {
    setFullname(e.target.value)
  }

  const handleChangeAddress1 = (e) => {
    setAddress1(e.target.value)
  }

  const handleChangeAddress2 = (e) => {
    setAddress2(e.target.value)
  }

  const handleChangeCity = (e) => {
    setCity(e.target.value)
  }

  const handleChangeState = (e) => {
    setState(e.target.value)
  }

  const handleChangeZipcode = (e) => {
    setZipcode(e.target.value)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')
    await clientWithAuth(token)
      .post('/profile/edit', {
        username,
        fullname,
        address1,
        address2,
        city,
        state,
        zipcode,
      })
      .then((response) => {})
      .catch((error) => {
        const status = error.response.status
        if (status === 400) {
          alert('Submission failed!')
          navigate('/profile/edit')
        }
      })

    navigate('/profile')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [])

  return (
    <>
      <br />
      <center>
        <h1 className='h1'>UPDATE PROFILE</h1>
      </center>
      <form onSubmit={handleProfileSubmit}>
        <div className='container'>
          <label className='label' htmlFor='fullname'>
            Full Name:
          </label>
          <input
            type='text'
            id='fullname'
            name='fullname'
            placeholder='Enter Full Name'
            maxLength={50}
            onChange={handleChangeName}
            required
          />
          <br />
          <label className='label' htmlFor='address1'>
            Address 1:
          </label>
          <input
            type='text'
            id='address1'
            name='address1'
            placeholder='Enter address 1'
            maxLength={100}
            onChange={handleChangeAddress1}
            required
          />
          <br />
          <label className='label' htmlFor='address2'>
            Address 2:
          </label>
          <input
            type='text'
            id='address2'
            name='address2'
            placeholder='Enter address 2 (optional)'
            maxLength={100}
            onChange={handleChangeAddress2}
          />
          <br />
          <label className='label' htmlFor='city'>
            City:
          </label>
          <input
            type='text'
            id='city'
            name='city'
            placeholder='Enter city'
            maxLength={100}
            onChange={handleChangeCity}
            required
          />
          <br />
          <label className='label' htmlFor='state'>
            State:
          </label>
          <select
            className='state'
            id='state'
            name='state'
            onChange={handleChangeState}
            required
          >
            <option value='' disabled selected></option>
            <option value='AL'>AL</option>
            <option value='AK'>AK</option>
            <option value='AR'>AR</option>
            <option value='AZ'>AZ</option>
            <option value='CA'>CA</option>
            <option value='CO'>CO</option>
            <option value='CT'>CT</option>
            <option value='DC'>DC</option>
            <option value='DE'>DE</option>
            <option value='FL'>FL</option>
            <option value='GA'>GA</option>
            <option value='HI'>HI</option>
            <option value='IA'>IA</option>
            <option value='ID'>ID</option>
            <option value='IL'>IL</option>
            <option value='IN'>IN</option>
            <option value='KS'>KS</option>
            <option value='KY'>KY</option>
            <option value='LA'>LA</option>
            <option value='MA'>MA</option>
            <option value='MD'>MD</option>
            <option value='ME'>ME</option>
            <option value='MI'>MI</option>
            <option value='MN'>MN</option>
            <option value='MO'>MO</option>
            <option value='MS'>MS</option>
            <option value='MT'>MT</option>
            <option value='NC'>NC</option>
            <option value='NE'>NE</option>
            <option value='NH'>NH</option>
            <option value='NJ'>NJ</option>
            <option value='NM'>NM</option>
            <option value='NV'>NV</option>
            <option value='NY'>NY</option>
            <option value='ND'>ND</option>
            <option value='OH'>OH</option>
            <option value='OK'>OK</option>
            <option value='OR'>OR</option>
            <option value='PA'>PA</option>
            <option value='RI'>RI</option>
            <option value='SC'>SC</option>
            <option value='SD'>SD</option>
            <option value='TN'>TN</option>
            <option value='TX'>TX</option>
            <option value='UT'>UT</option>
            <option value='VT'>VT</option>
            <option value='VA'>VA</option>
            <option value='WA'>WA</option>
            <option value='WI'>WI</option>
            <option value='WV'>WV</option>
            <option value='WY'>WY</option>
          </select>
          <br />
          <label className='label' htmlFor='zipcode'>
            Zipcode:
          </label>
          <input
            type='text'
            id='zipcode'
            name='zipcode'
            placeholder='Enter Zipcode'
            minLength={5}
            maxlength={5}
            onChange={handleChangeZipcode}
            required
          />
          <button type='submit' onSubmit={handleProfileSubmit}>
            FINISH PROFILE
          </button>
          <br />
        </div>
      </form>
    </>
  )
}

export default EditProfileForm
