import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('')
    setLoading(true)

    const userData = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user-token', data.token)
        navigate('/home')
      }
    } catch (err) {
      console.error('Login error:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.code === 'ERR_NETWORK') {
        setError('Server is connecting/waking up. Please wait a moment and try again.')
      } else {
        setError('Unable to login. Please check your credentials and connection.')
      }
    } finally {
      setLoading(false)
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-5 sm:p-7 min-h-screen flex flex-col justify-between'>
      <div>
        <img className='w-14 sm:w-16 mb-6 sm:mb-8' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Uber" />

        {error && (
          <div className='bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-start gap-2 shadow-sm'>
            <i className="ri-error-warning-line text-lg flex-shrink-0 mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-base sm:text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-5 sm:mb-7 rounded-lg px-4 py-2.5 border w-full text-sm sm:text-base placeholder:text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-base sm:text-lg font-medium mb-2'>Enter Password</h3>

          <input
            className='bg-[#eeeeee] mb-5 sm:mb-7 rounded-lg px-4 py-2.5 border w-full text-sm sm:text-base placeholder:text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-black'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            placeholder='password'
          />

          <button
            disabled={loading}
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-base active:bg-gray-800 disabled:bg-gray-400 cursor-pointer flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>Logging in...</span>
              </>
            ) : 'Login'}
          </button>

        </form>
        <p className='text-center text-sm'>New here? <Link to='/signup' className='text-blue-600 font-medium'>Create new Account</Link></p>
      </div>
      <div>
        <Link
          to='/captain-login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-3 w-full text-base active:bg-green-700'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}


export default UserLogin