import { React, useState, useEffect } from 'react';
import './styling.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfileForm = () => {
    const navigate = useNavigate();
    const [ fullname, setFullname ] = useState('');
    const [ address1, setAddress1 ] = useState('');
    const [ address2, setAddress2 ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ zipcode, setZipcode ] = useState('');

    const handleChangeName = (e) => {
        setFullname(e.target.value);
    };

    const handleChangeAddress1 = (e) => {
        setAddress1(e.target.value);
    };

    const handleChangeAddress2 = (e) => {
        setAddress2(e.target.value);
    };

    const handleChangeCity = (e) => {
        setCity(e.target.value);
    };

    const handleChangeState = (e) => {
        setState(e.target.value);
    };

    const handleChangeZipcode = (e) => {
        setZipcode(e.target.value);
    };

    const handleProfileSubmit = () => {
        const profile = { fullname, address1, address2, city, state, zipcode };
        console.log('Not yet implemented');
        console.log(profile);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="container">
            <label className="label" htmlFor="fullname">Full Name:</label>
            <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Enter Full Name"
                maxLength="50"
                required
                onChange={handleChangeName}
            />
            <br />
            <label
                className="label"
                htmlFor="address1"
            >Address 1:
            </label>
            <input
                type="text"
                id="address1"
                name="address1"
                placeholder="Enter address 1"
                maxLength="100"
                required
                onChange={handleChangeAddress1}
            />
            <br />
            <label
                className="label"
                htmlFor="address2"
            >Address 2:
            </label>
            <input
                type="text"
                id="address2"
                name="address2"
                placeholder="Enter address 2 (optional)"
                maxLength="100"
                onChange={handleChangeAddress2}
            />
            <br />
            <label className="label" htmlFor="city"
            >City:
            </label>
            <input
                type="text"
                id="city"
                name="city"
                placeholder="Enter city"
                maxLength="100"
                required
                onChange={handleChangeCity}
            />
            <br />
            <label className="label" htmlFor="state"
            >State:
            </label>
            <select className="state" id="state" name="state" required onChange={handleChangeState}>
                <option value="" disabled selected></option>
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AR">AR</option>
                <option value="AZ">AZ</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DC">DC</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="IA">IA</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="MA">MA</option>
                <option value="MD">MD</option>
                <option value="ME">ME</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MO">MO</option>
                <option value="MS">MS</option>
                <option value="MT">MT</option>
                <option value="NC">NC</option>
                <option value="NE">NE</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NV">NV</option>
                <option value="NY">NY</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WI">WI</option>
                <option value="WV">WV</option>
                <option value="WY">WY</option>
            </select>
            <br />
            <label
                className="label"
                htmlFor="zipcode"
            >Zipcode:
            </label>
            <input
                type="text"
                id="zipcode"
                name="zipcode"
                placeholder="Enter Zipcode"
                minLength="5"
                maxLength="9"
                required
                onChange={handleChangeZipcode}
            />

            <button type="button" onClick={handleProfileSubmit}>FINISH PROFILE</button>
            <br />
        </div>
    );
}

export default EditProfileForm;