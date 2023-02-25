import { React, useEffect, useState } from 'react'
import { clientWithAuth } from './axiosClient'
import { useNavigate } from 'react-router-dom'
import './styling.css'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const HistoryForm = () => {
  const navigate = useNavigate();
  const [ quotes, setQuotes ] = useState([]);
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  if (!username || !token) {
    navigate('/login');
  }
  useEffect(() => {
    clientWithAuth(token).get('/history/'+username).then((response) => {
      console.log(response.data.quotes);
      setQuotes(response.data.quotes);
    }).catch((error) => {
      if (error.response && error.response.status === 400)
      {
        navigate('/login');
      }
      alert('Quote server is down, try again later');
      navigate('/');
    });
  }, [])
  return (
    <>
      <br />
      <br />
      <center>
        <h1 className='h1'>FUEL QUOTE HISTORY</h1>
      </center>
      <div className='tablebox'>
        <table>
          <thead>
            <tr>
              <th>Delivery Date</th>
              <th>Gallons Requested</th>
              <th>Delivery Address</th>
              <th>Delivery City</th>
              <th>Delivery State</th>
              <th>Delivery Zipcode</th>
              <th>Suggested Price Per Gallon</th>
              <th>Total Amount Due</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.date}</td>
                  <td>{val.gallons}</td>
                  <td>{val.address}</td>
                  <td>{val.city}</td>
                  <td>{val.state}</td>
                  <td>{val.zipcode}</td>
                  <td>{formatter.format(val.price)}</td>
                  <td>{formatter.format(val.due)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default HistoryForm
