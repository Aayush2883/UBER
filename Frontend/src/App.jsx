import React from 'react'
import { Route,Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import ProtectedWrapper from './pages/ProtectedWrapper'
import UserLogout from './pages/UserLogout'

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/home' element={ <ProtectedWrapper> <Home /> </ProtectedWrapper> } />
        <Route path='/logout' element={<ProtectedWrapper> <UserLogout /> </ProtectedWrapper>} />
      </Routes>
    </div>
  )
}

export default App
