import React, { useState } from 'react';
import axios from 'axios';
import useUser from '../../Context';
import { useNavigate, Link } from 'react-router-dom';

const apiurl = import.meta.env.VITE_API_URL;

const Register = () => {
    const { setUserData } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
        setError('');
        setLoading(true);

        // Basic validation
        if (localUserData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (localUserData.username.length < 3) {
            setError('Username must be at least 3 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${apiurl}/register`, localUserData, { withCredentials: true });
            setUserData({
                id: response.data.user.id,
                email: response.data.user.email,
                username: response.data.user.username,
                name: response.data.user.name,
            });
            localStorage.setItem("userData", JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                padding: '40px',
                width: '100%',
                maxWidth: '420px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#333',
                        marginBottom: '8px'
                    }}>
                        Create Account
                    </h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Join Connect and start chatting
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fee',
                            color: '#c33',
                            padding: '12px',
                            borderRadius: '6px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            border: '1px solid #fcc'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#333',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={localUserData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '14px',
                                border: '2px solid #e1e8ed',
                                borderRadius: '8px',
                                transition: 'border-color 0.2s ease',
                                backgroundColor: '#f9fafb'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#333',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            value={localUserData.username}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '14px',
                                border: '2px solid #e1e8ed',
                                borderRadius: '8px',
                                transition: 'border-color 0.2s ease',
                                backgroundColor: '#f9fafb'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#333',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={localUserData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '14px',
                                border: '2px solid #e1e8ed',
                                borderRadius: '8px',
                                transition: 'border-color 0.2s ease',
                                backgroundColor: '#f9fafb'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#333',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={localUserData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                fontSize: '14px',
                                border: '2px solid #e1e8ed',
                                borderRadius: '8px',
                                transition: 'border-color 0.2s ease',
                                backgroundColor: '#f9fafb'
                            }}
                        />
                        <p style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '6px'
                        }}>
                            Must be at least 6 characters
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
