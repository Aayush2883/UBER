import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const UserLogout = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token')
                navigate('/login')
            }
        }).catch(() => {
            localStorage.removeItem('token')
            navigate('/login')
        })
    }, [ token, navigate ])

    return (
        <div className='h-screen flex items-center justify-center font-medium text-gray-600'>Logging out...</div>
    )
}

export default UserLogout
