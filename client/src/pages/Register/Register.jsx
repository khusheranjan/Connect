import React, { useState } from 'react';
import axios from 'axios';

const apiurl = import.meta.env.VITE_API_URL;

const Register = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        username: '',
        name: '',
        avatar: '',
        bio: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiurl}/register`, userData, { withCredentials: true });
            alert(response.data.message);
            console.log(response.data);
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
                    value={userData.email}
                    onChange={handleChange} 
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleChange} 
                    required
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={userData.username}
                    onChange={handleChange} 
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={userData.name}
                    onChange={handleChange}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Register;
