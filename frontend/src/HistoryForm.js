import { React } from 'react'
//import { useNavigate } from 'react-router-dom'
//import { clientWithAuth } from './axiosClient'
import './styling.css'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const data = [
  {
    gallons: 3.7,
    address: '7001 Calhoun Rd',
    city: 'Houston',
    state: 'TX',
    zipcode: '77001',
    date: '2023-01-01',
    price: 5.0,
    due: 3.7 * 5.0,
  },
  {
    gallons: 4.1,
    address: '302 N Grace St',
    city: 'Lombard',
    state: 'IL',
    zipcode: '60645',
    date: '2023-01-02',
    price: 6.0,
    due: 4.1 * 6.0,
  },
  {
    gallons: 6.2,
    address: '7132 Nicolls St',
    city: 'Riverside',
    state: 'CA',
    zipcode: '92509',
    date: '2023-01-03',
    price: 8.0,
    due: 6.2 * 8.0,
  },
  {
    gallons: 7.1,
    address: '2300 Perry Blvd',
    city: 'Atlanta',
    state: 'GA',
    zipcode: '30314',
    date: '2023-01-04',
    price: 4.5,
    due: 7.1 * 4.5,
  },
  {
    gallons: 5.6,
    address: '11802 N Lane Dr',
    city: 'Lakewood',
    state: 'OH',
    zipcode: '44107',
    date: '2023-01-05',
    price: 7.2,
    due: 5.6 * 7.2,
  },
]

const HistoryForm = () => {
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
            {data.map((val, key) => {
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
