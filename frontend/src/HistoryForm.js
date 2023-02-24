import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientWithAuth } from './axiosClient'
import './styling.css'

const HistoryForm = () => {
  return (
    <>
      <br />
      <center>
        <h1 className='h1'>FUEL QUOTE HISTORY</h1>
      </center>
      <div className='tablebox'>
        <table>
          <thead>
            <tr>
              <th>Gallons Requested</th>
              <th>Delivery Address</th>
              <th>Delivery City</th>
              <th>Delivery State</th>
              <th>Delivery Zipcode</th>
              <th>Delivery Date</th>
              <th>Suggested Price Per Gallon</th>
              <th>Total Amount Due</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
            </tr>
            <tr>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
            </tr>
            <tr>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
            </tr>
            <tr>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
              <td>
                <center>
                  <b>-</b>
                </center>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default HistoryForm
