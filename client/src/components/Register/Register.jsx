import React from 'react'
import axios from 'axios'

const Register = (props) => {

  const {email, setEmail, password, setPassword} = props;

  const API_URL= 'http://localhost:8000'

  const handlechange= async (e)=>{
    e.preventDefault();
    
    try {
      const response= await axios.post(API_URL + "/register", {email, password})
      alert(response.data)
    } catch (error) {
      console.log(error);
      alert("frontend function problem")
    }
  }


  return (
    <div>
        <h1>Register Page</h1>
        <form onSubmit={handlechange}>
          <input
          type="email"
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)} />

          <input
          type="password"
          placeholder='password'
          value={password} 
          onChange={(e) => setPassword(e.target.value)}/>

          <button type='submit'>submit</button>
        </form>
    </div>
  )
}

export default Register