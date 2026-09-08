import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()

        const captainToken = localStorage.getItem('captain-token') || localStorage.getItem('token')
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${captainToken}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }
    }
    return (
        <div className='p-2 sm:p-4'>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left'>Confirm this ride to Start</h3>
            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-xl mt-2 bg-yellow-50'>
                <div className='flex items-center gap-3'>
                    <img className='h-11 w-11 rounded-full object-cover shadow-sm' src="https://tse2.mm.bing.net/th/id/OIP.bJpr9jpclIkXQT-hkkb1KQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Rider" />
                    <h2 className='text-base sm:text-lg font-medium capitalize'>{props.ride?.user?.fullname?.firstname || 'Rider'} {props.ride?.user?.fullname?.lastname || ''}</h2>
                </div>
                <h5 className='text-sm sm:text-base font-semibold px-2.5 py-1 bg-yellow-400 rounded-lg'>
                    {props.ride?.distance ? `${(props.ride.distance / 1000).toFixed(1)} KM` : '3.5 KM'}
                </h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-4'>
                    <div className='flex items-center gap-4 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-lg text-gray-700"></i>
                        <div className='w-full overflow-hidden'>
                            <h3 className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Pick-up</h3>
                            <p className='text-sm font-medium text-gray-800 truncate'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                        <div className='w-full overflow-hidden'>
                            <h3 className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Drop-off</h3>
                            <p className='text-sm font-medium text-gray-800 truncate'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3'>
                        <i className="ri-currency-line text-lg text-gray-700"></i>
                        <div>
                            <h3 className='text-base sm:text-lg font-bold text-gray-900'>₹{props.ride?.fare}</h3>
                            <p className='text-xs font-medium text-gray-500'>Cash Payment</p>
                        </div>
                    </div>
                </div>

                <div className='mt-4 w-full'>
                    <form onSubmit={submitHander}>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            type="text"
                            maxLength="6"
                            className='bg-[#eee] px-4 py-3 font-mono text-center text-xl tracking-widest font-bold rounded-lg w-full border border-gray-300 focus:outline-none focus:border-black'
                            placeholder='Enter 6-digit OTP'
                            required
                        />

                        <button className='w-full mt-4 text-base font-semibold flex justify-center bg-green-600 text-white p-3 rounded-lg active:bg-green-700 shadow-sm'>
                            Start Ride
                        </button>
                        <button
                            type='button'
                            onClick={() => {
                                props.setConfirmRidePopupPanel(false)
                                props.setRidePopupPanel(false)
                            }}
                            className='w-full mt-2 bg-gray-200 text-base text-gray-800 font-semibold p-2.5 rounded-lg active:bg-gray-300'>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp