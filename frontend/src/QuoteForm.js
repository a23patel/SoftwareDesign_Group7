import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './styling.css'

const client = axios.create({
  baseURL: 'api',
})

const QuoteForm = () => {
  const username = localStorage.getItem('username')
  const [gallons, setGallons] = useState('')
  const [date, setDate] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [FormValid, setFormValid] = useState(false)
  const [profile, setProfile] = useState({
    address1: '...',
    address2: '...',
    city: '...',
    state: '...',
    zip: '...',
  })

  const [quote, setQuote] = useState({
    price: '...',
    due: '...',
  })

  const handleCheckFormValid = () => {
    if (gallons !== '' && date !== '') {
      setFormValid(true)
    }
  }

  const handleGallonsChange = (e) => {
    setGallons(e.target.value)
    handleCheckFormValid()
  }

  const handleDateChange = (e) => {
    setDate(e.target.value)
    handleCheckFormValid()
  }

  const handleGetQuote = async (e) => {
    e.preventDefault()
    const client = axios.create({
      baseURL: 'api',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    await client.get('/quote/' + username + '/' + gallons).then((response) => {
      setQuote(response.data)
    })
    handleCheckFormValid()
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    const client = axios.create({
      baseURL: 'api',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (FormValid === false) {
      alert('Please complete the form !!')
      return
    }
    await client
      .post('/quote', {
        username,
        address1: profile.address1,
        address2: profile.address2,
        city: profile.city,
        state: profile.state,
        zipcode: profile.zipcode,
        gallons,
        date,
        price: quote.price,
        due: quote.due,
      })
      .then((response) => {})
      .catch((error) => {
        const status = error.response.status
        if (status === 400) {
          alert('Submission failed!')
          navigate('/quote')
        }
      })
    navigate('/history')
  }

  useEffect(() => {
    if (!token) {
      localStorage.clear()
      navigate('/login')
    } else {
      const client = axios.create({
        baseURL: 'api',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(username)
      console.log(token)
      client.get('/profile/' + username).then((response) => {
        setProfile(response.data)
      })
    }
  }, [])

  return (
    <>
      <br />
      <center>
        <h1 className='h1'>FUEL QUOTE FORM</h1>
      </center>
      <div className='container'>
        <form onSubmit={handleGetQuote}>
          <label className='label' htmlFor='Gallons_Requested'>
            Gallons Requested:
          </label>
          <input
            type='number'
            id='Gallons_Requested'
            name='Gallons_Requested'
            placeholder='Enter Gallons of Fuel'
            min='1'
            onChange={handleGallonsChange}
            required
          />
          <br />
          <label className='label' htmlFor='Delivery_date'>
            Delivery Date:
          </label>
          <input
            type='date'
            id='delivery_date'
            name='delivery_date'
            min={new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            required
          />
          <label className='label' htmlFor='address1'>
            Delivery Address:
          </label>
          <input
            type='text'
            id='delivery_address'
            name='delivery_address'
            placeholder='Address'
            value={profile.address1 + profile.address2}
            readOnly
          />
          <br />
          <label className='label' htmlFor='city'>
            Delivery City:
          </label>
          <input
            type='text'
            id='delivery_city'
            name='delivery_city'
            placeholder='City'
            value={profile.city}
            readOnly
          />
          <br />
          <label className='label' htmlFor='state'>
            Delivery State:
          </label>
          <input
            type='text'
            id='delivery_state'
            name='delivery_state'
            placeholder='State'
            value={profile.state}
            readOnly
          />
          <br />
          <label className='label' htmlFor='zipcode'>
            Delivery Zipcode:
          </label>
          <input
            type='text'
            id='delivery_zipcode'
            name='delivery_zipcode'
            placehoder='Zipcode'
            value={profile.zip}
            readOnly
          />
          <br />
          <button type='submit' onSubmit={handleGetQuote}>
            GET QUOTE
          </button>
          <br />
        </form>
        <form onSubmit={handleQuoteSubmit}>
          <label className='label' htmlFor='Suggested_price'>
            Suggested Price Per Gallon:
          </label>
          <input
            type='text'
            id='suggested_gallon_price'
            name='suggested_gallon_price'
            value={'$ ' + quote.price}
            readOnly
          />
          <br />
          <label className='label' htmlFor='total_amount'>
            Total Amount Due:
          </label>
          <input
            type='text'
            id='total_cost'
            name='total_cost'
            placeholder='$'
            value={'$ ' + quote.due}
            readOnly
          />
          <button type='submit' onSubmit={handleQuoteSubmit}>
            SUBMIT QUOTE
          </button>
          <br />
        </form>
      </div>
    </>
  )
}

export default QuoteForm
