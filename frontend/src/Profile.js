import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';



const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: '...',
        city: '...',
    });

    useEffect(() => {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.clear();
            navigate('/login');
        }
        else {
            const client = axios.create({
                baseURL: 'api',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(username);
            console.log(token);
            client.get('/profile/'+username)
                .then((response) => {
                    setProfile(response.data);
                });
        }
    }, []);


    return (
        <div className='filler'>
            This is the profile page
            <h3>Username is {profile.username}</h3>
            <h3>Lives in {profile.city}</h3>
        </div>
    )
};

export default Profile;