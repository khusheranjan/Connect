import { useState } from 'react'
import Register from './components/Register/Register'

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Register email={email}
      setEmail= {setEmail}
      password= {password}
      setPassword= {setPassword} />
    </>
  )
}

export default App
