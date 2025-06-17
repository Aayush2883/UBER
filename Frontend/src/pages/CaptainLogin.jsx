"use client"
import React, { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import { Link } from 'react-router-dom' 

const CaptainLogin = () => {
 const [email, setemail] = useState('');
  const [password, setpassword] = useState('')
  const [captainData, setcaptainData] = useState({})

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(email,password);

    setcaptainData({
      email:email,
      password:password
    })
    console.log(captainData)
    setemail('')
    setpassword('')
  }


  return (
    <div className='p-6 flex flex-col gap-17 h-screen w-screen'>
    <div><h1 className="text-3xl leading-6 tracking-tighter font-[400]">Uber <br /><i class="ri-arrow-right-line"></i></h1></div>

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
      <p className='text-center mt-3'>Hey Captain is it your first time here? <br /> <Link to='/captain-signup' className='text-blue-700'>Register Here</Link></p>
    </div>
    </form>

    </div>
  )
}

export default CaptainLogin
