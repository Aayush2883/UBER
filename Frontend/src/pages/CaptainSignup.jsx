import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainSignup = () => {
  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const { setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType: vehicleType
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        localStorage.setItem('captain-token', data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed. Please check inputs.')
    } finally {
      setLoading(false)
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }

  return (
    <div className='py-5 px-4 sm:px-6 min-h-screen flex flex-col justify-between overflow-y-auto'>
      <div>
        <img className='w-16 sm:w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="Uber Driver" />

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded-lg mb-4 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <h3 className='text-sm sm:text-base font-medium mb-1.5'>What's our Captain's name</h3>
          <div className='flex gap-3 mb-4 sm:mb-5'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-3.5 py-2 border text-sm sm:text-base placeholder:text-sm'
              type="text"
              placeholder='First name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-3.5 py-2 border text-sm sm:text-base placeholder:text-sm'
              type="text"
              placeholder='Last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <h3 className='text-sm sm:text-base font-medium mb-1.5'>What's our Captain's email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-4 sm:mb-5 rounded-lg px-3.5 py-2 border w-full text-sm sm:text-base placeholder:text-sm'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-sm sm:text-base font-medium mb-1.5'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-4 sm:mb-5 rounded-lg px-3.5 py-2 border w-full text-sm sm:text-base placeholder:text-sm'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder='password'
          />

          <h3 className='text-sm sm:text-base font-medium mb-1.5'>Vehicle Information</h3>
          <div className='flex gap-3 mb-3'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-3.5 py-2 border text-sm sm:text-base placeholder:text-sm'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-3.5 py-2 border text-sm sm:text-base placeholder:text-sm'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>
          <div className='flex gap-3 mb-5'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-3.5 py-2 border text-sm sm:text-base placeholder:text-sm'
              type="number"
              min="1"
              placeholder='Capacity'
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-3.5 py-2 border text-sm sm:text-base'
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="" disabled>Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <button
            disabled={loading}
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-base active:bg-gray-800 disabled:bg-gray-400'
          >
            {loading ? 'Creating Account...' : 'Create Captain Account'}
          </button>
        </form>
        <p className='text-center text-sm'>Already have an account? <Link to='/captain-login' className='text-blue-600 font-medium'>Login here</Link></p>
      </div>
      <div>
        <p className='text-[10px] mt-4 leading-tight text-gray-500'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div>
  )
}

export default CaptainSignup