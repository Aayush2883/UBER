import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const { setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('')
    setLoading(true)
    const captainData = {
      email: email,
      password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData)

      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        localStorage.setItem('captain-token', data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-5 sm:p-7 min-h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 sm:w-20 mb-4' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="Uber Driver" />

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded-lg mb-4 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <h3 className='text-base sm:text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-5 sm:mb-7 rounded-lg px-4 py-2.5 border w-full text-sm sm:text-base placeholder:text-sm'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-base sm:text-lg font-medium mb-2'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-5 sm:mb-7 rounded-lg px-4 py-2.5 border w-full text-sm sm:text-base placeholder:text-sm'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder='password'
          />

          <button
            disabled={loading}
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-base active:bg-gray-800 disabled:bg-gray-400'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='text-center text-sm'>Join a fleet? <Link to='/captain-signup' className='text-blue-600 font-medium'>Register as a Captain</Link></p>
      </div>
      <div>
        <Link
          to='/login'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-4 rounded-lg px-4 py-3 w-full text-base active:bg-orange-700'
        >Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin