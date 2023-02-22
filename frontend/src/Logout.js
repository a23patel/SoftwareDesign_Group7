import { React, useState, useEffect } from 'react';
import './styling.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate()
    const handleLogout = async () => {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.clear();
            navigate('/login');
        }
        const client = axios.create({
            baseURL: 'api',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        await client.post('/logout', { username }).then((response) => {}).catch((error) => {
            console.log(error);
        });
        localStorage.clear();
        navigate('/')
    };

    return (
        <button className='logout_button' onClick={handleLogout}>Logout</button>
    );
}

export default Logout;