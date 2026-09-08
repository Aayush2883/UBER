import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user-token', data.token)
        navigate('/home')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
  }

  return (
    <div className='p-5 sm:p-7 min-h-screen flex flex-col justify-between overflow-y-auto'>
      <div>
        <img className='w-14 sm:w-16 mb-6 sm:mb-8' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Uber" />

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded-lg mb-4 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <h3 className='text-sm sm:text-base font-medium mb-1.5'>What's your name</h3>
          <div className='flex gap-3 mb-4 sm:mb-5'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-3.5 py-2.5 border text-sm sm:text-base placeholder:text-sm'
              type="text"
              placeholder='First name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-3.5 py-2.5 border text-sm sm:text-base placeholder:text-sm'
              type="text"
              placeholder='Last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <h3 className='text-sm sm:text-base font-medium mb-1.5'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-4 sm:mb-5 rounded-lg px-3.5 py-2.5 border w-full text-sm sm:text-base placeholder:text-sm'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-sm sm:text-base font-medium mb-1.5'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-5 sm:mb-6 rounded-lg px-3.5 py-2.5 border w-full text-sm sm:text-base placeholder:text-sm'
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className='text-center text-sm'>Already have an account? <Link to='/login' className='text-blue-600 font-medium'>Login here</Link></p>
      </div>
      <div>
        <p className='text-[10px] mt-4 leading-tight text-gray-500'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div>
  )
}

export default UserSignup