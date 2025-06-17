import React from 'react'
import homebg from '../images/homebg.png'
import '../App.css'
import 'remixicon/fonts/remixicon.css'
import { Link , useNavigate } from 'react-router-dom' 

const LandingPage = () => {
  return (
    <>
      <div
        className="h-screen relative bg-[#393e45] bg-top flex bg-contain bg-no-repeat flex-col items-center justify-between w-screen"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        <div><h1 className="text-5xl right-10 tracking-tighter absolute font-[400] top-10 ">Uber</h1></div>
        <div className=' text-white tracking-tighter flex flex-col items-center py-2 h-[40vh]'>
            <div className='text-xl text-center font-semibold '> <p>Getting started for a new journey?</p>
            <p>We will take you to your Destination</p></div>

            <Link to='/login' className='bg-gray-500 flex justify-center items-center relative text-lg w-[110%] mt-10 h-[50px] rounded-xl'> Continue as User<i class="ri-arrow-right-line absolute right-8 text-white ab"></i></Link>
            <Link to='/captain-login' className='bg-gray-800 flex justify-center items-center relative text-lg w-[110%] mt-5 h-[50px] rounded-xl'> Continue as Captain<i class="ri-arrow-right-line absolute right-8 text-white ab"></i></Link>
        </div>
        
      </div>
    </>
  )
}

export default LandingPage
