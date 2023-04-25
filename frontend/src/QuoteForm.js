import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientWithAuth } from './axiosClient'
import './styling.css'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
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
    zipcode: '...',
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
    await clientWithAuth(token)
      .get('/quote/' + username + '/' + gallons)
      .then((response) => {
        setQuote(response.data)
      })
    handleCheckFormValid()
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    if (FormValid === false) {
      alert('Please complete the form !!')
      return
    }
    // DEBUG
    console.log(gallons)
    console.log(date)
    await clientWithAuth(token)
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
      clientWithAuth(token)
        .get('/profile/' + username)
        .then((response) => {
          if (response.data.full_name === null) {
            navigate('/profile/edit')
          }
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
          <label className='label' htmlFor='delivery_date'>
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
          <label className='label' htmlFor='delivery_address'>
            Delivery Address:
          </label>
          <input
            type='text'
            id='delivery_address'
            name='delivery_address'
            placeholder='Address'
            value={profile.address1 + ', ' + profile.address2}
            readOnly
          />
          <br />
          <label className='label' htmlFor='delivery_city'>
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
          <label className='label' htmlFor='delivery_state'>
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
          <label className='label' htmlFor='delivery_zipcode'>
            Delivery Zipcode:
          </label>
          <input
            type='text'
            id='delivery_zipcode'
            name='delivery_zipcode'
            placehoder='Zipcode'
            value={profile.zipcode}
            readOnly
          />
          <br />
          <button type='submit' onSubmit={handleGetQuote}>
            GET QUOTE
          </button>
          <br />
        </form>
        <form onSubmit={handleQuoteSubmit}>
          <label className='label' htmlFor='suggested_gallon_price'>
            Suggested Price Per Gallon:
          </label>
          <input
            type='text'
            id='suggested_gallon_price'
            name='suggested_gallon_price'
            value={formatter.format(quote.price)}
            readOnly
          />
          <br />
          <label className='label' htmlFor='total_cost'>
            Total Amount Due:
          </label>
          <input
            type='text'
            id='total_cost'
            name='total_cost'
            placeholder='$'
            value={formatter.format(quote.due)}
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
