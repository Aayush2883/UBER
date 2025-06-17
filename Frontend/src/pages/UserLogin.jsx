"use client"
import React, { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import { Link, useNavigate } from 'react-router-dom' 
import { UserDataContext } from '../context/userContext'
import axios from 'axios'


const UserLogin = () => {

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('')
  const [userData, setuserData] = useState({})

  const {user , setUser} = React.useContext(UserDataContext)
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email:email,
      password:password
    }

    try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);

    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token',data.token);
      navigate('/home');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    alert('Login failed');
  }
    
    setemail('')
    setpassword('')
  }


  return (
    <div className='p-5 flex flex-col gap-17 h-screen w-screen'>
    <div><h1 className="text-3xl tracking-tighter font-[400]">Uber</h1></div>

    <form onSubmit={(e)=>{
      submitHandler(e);
    }}>
      <div className='font-medium text-lg flex flex-col gap-4'>
      <div>
        <p className='text-2xl'>What's your email</p>
        <input 
        type="email" 
        value={email}
        onChange={ (e) => {
          setemail(e.target.value);
        }}
        required
        placeholder='Enter your email'
        className='border-1 rounded px-2 py-1 w-[100%]'/>
      </div>
      <div>
        <p className='text-2xl'>Password</p>
        <input 
        type="password" 
        required
        value={password}
        onChange={(e)=>{
          setpassword(e.target.value);
        }}
        placeholder='Enter Password'
        className='border-1 rounded px-2 py-1 w-[100%]'/>
      </div>
    </div>
    

    <div className='mt-20'>
      <button className='bg-black text-white rounded font-semibold text-lg w-[100%] py-1 '>Login</button>
      <p className='text-center mt-3'>New here? <Link to='/signup' className='text-blue-700'>Create Account</Link></p>
    </div>
    </form>

    </div>
  )
}

export default UserLogin
