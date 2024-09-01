import { useState } from 'react'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { UserProvider } from './Context';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {

  return (
    <>
    <UserProvider>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>
      </UserProvider>
    </>
  )
}

export default App
