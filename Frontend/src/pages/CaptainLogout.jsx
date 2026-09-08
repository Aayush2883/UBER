
import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const CaptainLogout = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('captain-token')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token')
                localStorage.removeItem('captain-token')
                navigate('/captain-login')
            }
        }).catch(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('captain-token')
            navigate('/captain-login')
        })
    }, [ token, navigate ])

    return (
        <div className='h-screen flex items-center justify-center font-medium text-gray-600'>Logging out Captain...</div>
    )
}

export default CaptainLogout