import { useState } from 'react'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import { SocketProvider } from './Context';

function App() {

  return (
    <>
    <SocketProvider>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>
    </SocketProvider>
    </>
  )
}

export default App
