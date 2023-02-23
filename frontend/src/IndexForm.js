import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './styling.css'

const client = axios.create({
  baseURL: 'api',
})

const IndexForm = () => {
  return (
    <>
      <div className='container_long_page'>
        <center>
          <h1 className='container_heading'>
            Get your fuel wherever and whenever!!!
          </h1>
        </center>
        <div className='social_container'>
          <center>
            <h1 className='heading'>SAVE MONEY AND TIME!!</h1>
            <br />
            <h1 className='text_heading'>
              Don't want to waste time at gas station? Do not worry !! Fuel Go
              has you covered !!
            </h1>
            <h1 className='text_heading'>
              We do it cheap, easy and fast. Why bother with long queue at gas
              stations, when the fuel can come to you?
            </h1>
            <br />

            <h1 className='heading2'>
              Get your free quote today!!
              <a href='/login'>Login Here</a>
            </h1>
            <h1 className='heading3'>
              Don't have an account?
              <a href='/registration'>Register Here</a>
            </h1>
          </center>
          <br />
          <center>
            <h3>Follow us on:</h3>
            <br />
            <link
              rel='stylesheet'
              href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'
            />
            <div className='wrapper'>
              <div className='button'>
                <div className='icon'>
                  <i className='fab fa-facebook-f'></i>
                </div>
                <span>Facebook</span>
              </div>

              <div className='button'>
                <div className='icon'>
                  <i className='fab fa-twitter'></i>
                </div>
                <span>Twitter</span>
              </div>

              <div className='button'>
                <div className='icon'>
                  <i className='fab fa-instagram'></i>
                </div>
                <span>Instagram</span>
              </div>
            </div>
          </center>
        </div>
      </div>
    </>
  )
}

export default IndexForm
