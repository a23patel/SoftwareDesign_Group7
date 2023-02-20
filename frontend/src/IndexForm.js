import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const client = axios.create({
    baseURL: 'api',
});

const IndexForm = () => {
    return (
        <div className='filler'>
            <a href='/login'>Login</a>
        </div>
    )
};

export default IndexForm;