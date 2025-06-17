"use client";
import React, { useContext, useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainSignup = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');

  // Separated vehicle fields
  const [vehicleColor, setvehicleColor] = useState('');
  const [vehicleType, setvehicleType] = useState('');
  const [vehicleCapacity, setvehicleCapacity] = useState('');
  const [vehiclePlate, setvehiclePlate] = useState('');

  const {captain,setCaptain} = React.useContext(CaptainDataContext)

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname,
        lastname
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        vehicleType: vehicleType,
        capacity: vehicleCapacity,
        plate: vehiclePlate
      }
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/register`,
        captainData
      );

      if (response.status === 201) {
        localStorage.setItem('token',response.data.token);
        setCaptain(response.data.captain)
        navigate('/home');
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }

    // Clear form fields
    setfirstname('');
    setlastname('');
    setemail('');
    setpassword('');
    setvehicleColor('');
    setvehicleType('');
    setvehicleCapacity('');
    setvehiclePlate('');
  };

  return (
    <div className='p-6 flex flex-col gap-2 h-screen w-screen'>
      <div>
        <h1 className="text-3xl leading-6 tracking-tighter font-[400]">
          Uber <br /><i className="ri-arrow-right-line"></i>
        </h1>
      </div>

      <form onSubmit={submitHandler}>
        <div className='font-medium text-lg flex flex-col gap-4'>
          {/* Name */}
          <div>
            <p className='text-2xl'>What's your name</p>
            <div className='flex gap-2'>
              <input
                type="text"
                value={firstname}
                onChange={e => setfirstname(e.target.value)}
                required
                placeholder='First name'
                className='border-1 rounded px-2 py-1 w-1/2 text-[0.9em]'
              />
              <input
                type="text"
                value={lastname}
                onChange={e => setlastname(e.target.value)}
                placeholder='Last name'
                className='border-1 rounded px-2 py-1 w-1/2 text-[0.9em]'
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <p className='text-2xl'>What's your email</p>
            <input
              type="email"
              value={email}
              onChange={e => setemail(e.target.value)}
              required
              placeholder='Enter your email'
              className='border-1 rounded px-2 text-[0.9em] py-1 w-[100%]'
            />
          </div>

          {/* Password */}
          <div>
            <p className='text-2xl'>Password</p>
            <input
              type="password"
              required
              value={password}
              onChange={e => setpassword(e.target.value)}
              placeholder='Enter Password'
              className='border-1 rounded text-[0.9em] px-2 py-1 w-[100%]'
            />
          </div>
        </div>

        {/* Vehicle Information */}
        <div className='font-medium text-lg flex flex-col mt-8'>
          <p className='text-2xl'>Vehicle Information</p>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={vehicleColor}
              onChange={e => setvehicleColor(e.target.value)}
              required
              placeholder='Vehicle Color'
              className='border-1 rounded px-2 py-1 w-full text-[0.9em]'
            />

            <select
              value={vehicleType}
              onChange={e => setvehicleType(e.target.value)}
              required
              className='border-1 rounded px-2 py-1 w-full text-[0.9em]'
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>

            <input
              type="number"
              min="1"
              value={vehicleCapacity}
              onChange={e => setvehicleCapacity(e.target.value)}
              required
              placeholder='Vehicle Capacity'
              className='border-1 rounded px-2 py-1 w-full text-[0.9em]'
            />

            <input
              type="text"
              value={vehiclePlate}
              onChange={e => setvehiclePlate(e.target.value)}
              required
              placeholder='Vehicle Plate Number'
              className='border-1 rounded px-2 py-1 w-full text-[0.9em]'
            />
          </div>
        </div>

        <div className='mt-15'>
          <button className='bg-black text-white rounded font-semibold text-lg w-[100%] py-1'>
            Become Captain
          </button>
          <p className='text-center mt-3'>
            Already a Captain here? <br />
            <Link to='/captain-login' className='text-blue-700'>Login here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default CaptainSignup;
