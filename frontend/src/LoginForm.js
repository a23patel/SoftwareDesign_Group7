import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const client = axios.create({
    baseURL: 'api',
});

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleLoginSubmit = async () => {
        await client.post('/login', { username, password }
        ).then((response) => {
            localStorage.clear();
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        })
        navigate('/profile')
    }

    return (
        <form>
            <div className="container">
                <label htmlFor="user"
                >Username:
                </label>
                <input
                    type="text"
                    id="user"
                    name="user"
                    placeholder="Enter Username"
                    onChange={handleUsernameChange}
                    required
                />
                <br />
                <label
                    //style="font-size: larger"
                    //style="color: rgb(0, 0, 0)"
                    htmlFor="password"
                >Password:
                </label>
                <input
                    type="password"
                    id="password1"
                    name="password1"
                    placeholder="Enter password"
                    onChange={handlePasswordChange}
                    required
                />
                <br />
                <br />
                <input type="checkbox" /> Remember me <br />
                <button type="button" onClick={handleLoginSubmit}>LOGIN</button> <br />
                <center>
                    <h1
                    //style="font-size: large" style="color: rgb(4, 0, 255)"
                    >
                        Don't have an account?
                        <a href="/registration"> Register Here </a>
                    </h1>
                </center>
            </div>
        </form>
    )
};

export default LoginForm;