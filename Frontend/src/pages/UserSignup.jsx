"use client"
import React, { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import { Link , useNavigate } from 'react-router-dom' 
import axios from 'axios'
import { UserDataContext } from '../context/userContext'


const UserSignup = () => {

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('')
  const [firstname, setfirstname] = useState('')
  const [lastname, setlastname] = useState('')
  const navigate = useNavigate();
  const {user,setUser} = React.useContext(UserDataContext);
  
  const submitHandler =  async (e) => {
      e.preventDefault();
  
      const newUser = {
        fullname:{
          firstname:firstname,
          lastname:lastname,
        },
        email:email,
        password:password
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser);

      

      if(response.status==201){
        const data = response.data;
        setUser(data.user)
        localStorage.setItem('token',data.token);
        navigate('/home')

      }
      
      // console.log(userData)
      setfirstname('')
      setlastname('')
      setemail('')
      setpassword('')
  }


  return (
    <div className='p-5 flex flex-col gap-17 h-screen w-screen'>
    <div><h1 className="text-3xl tracking-tighter font-[400]">Uber</h1></div>

    <form onSubmit={(e)=>{
      submitHandler(e);
    }}>
      <div className='font-medium text-lg flex flex-col gap-5'>
      {/* Name */}
      <div >
        <p className='text-2xl'>What's your name</p>
        <div className='flex gap-2'>
          {/* firstname  */}
          <input 
        type="text" 
        value={firstname}
        onChange={ (e) => {
          setfirstname(e.target.value);
        }}
        required
        placeholder='First name'
        className='border-1 rounded px-2 py-1 w-1/2 text-[0.9em]'/>
        
        {/* lastname  */}
        <input 
        type="text" 
        value={lastname}
        onChange={ (e) => {
          setlastname(e.target.value);
        }}
        placeholder='Last name'
        className='border-1 rounded px-2 py-1 w-1/2 text-[0.9em]'/>
        </div>
      </div>

      {/* Email */}
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
        className='border-1 rounded px-2 text-[0.9em] py-1 w-[100%]'/>
      </div>

      {/* Password */}
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
        className='border-1 rounded text-[0.9em] px-2 py-1 w-[100%]'/>
      </div>
    </div>
    

    <div className='mt-20'>
      <button className='bg-black text-white rounded font-semibold text-lg w-[100%] py-1 '>Create Account</button>
      <p className='text-center mt-3'>Already have an account? <br /><Link to='/login' className='text-blue-700'>Login here</Link></p>
    </div>
    </form>

    </div>
  )
}

export default UserSignup
