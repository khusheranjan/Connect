import React, { useState } from 'react';
import axios from 'axios';
import useUser from '../../Context';
import { useNavigate } from 'react-router-dom';

const apiurl = import.meta.env.VITE_API_URL;

const Register = () => {
    const {userData, setUserData } = useUser();
    const navigate = useNavigate();
    const [localUserData, setLocalUserData] = useState({
        email: '',
        password: '',
        username: '',
        name: '',
    });

    const handleChange = (e) => {
        setLocalUserData({ ...localUserData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiurl}/register`, localUserData, { withCredentials: true });
            setUserData({
                email: response.data.user.email,
                username: response.data.user.username,
                name: response.data.user.name,
              });
              localStorage.setItem("userData", JSON.stringify(response.data.user));
            alert(response.data.message);
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
            alert("Registration failed");
        }
    };

    return (
        <div>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={localUserData.email}
                    onChange={handleChange} 
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={localUserData.password}
                    onChange={handleChange} 
                    required
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={localUserData.username}
                    onChange={handleChange} 
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={localUserData.name}
                    onChange={handleChange}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Register;
