import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useUser from '../../Context';

const apiurl = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserData } = useUser(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiurl}/login`, { email, password }, { withCredentials: true });

      if (response.data.user) {
        setUserData({
          id: response.data.user.id,
          email: response.data.user.email,
          username: response.data.user.username,
          name: response.data.user.name,
        });
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        alert(response.data.message);
        navigate('/dashboard'); 
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred during login.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login Page</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
