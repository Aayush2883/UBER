import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
    Home 


    <br />

    <Link to='/logout' className='text-blue-500'>Logout</Link>
    </div>
  )
}

export default Home
