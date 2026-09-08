import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const FinishRide = (props) => {

    const navigate = useNavigate()

    async function endRide() {
        const captainToken = localStorage.getItem('captain-token') || localStorage.getItem('token')
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            rideId: props.ride._id
        }, {
            headers: {
                Authorization: `Bearer ${captainToken}`
            }
        })

        if (response.status === 200) {
            navigate('/captain-home')
        }
    }

    return (
        <div className='p-2 sm:p-4'>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left'>Finish this Ride</h3>
            <div className='flex items-center justify-between p-3.5 border-2 border-yellow-400 rounded-xl mt-2 bg-yellow-50'>
                <div className='flex items-center gap-3'>
                    <img className='h-11 w-11 rounded-full object-cover shadow-sm' src="https://tse2.mm.bing.net/th/id/OIP.bJpr9jpclIkXQT-hkkb1KQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Rider" />
                    <h2 className='text-base sm:text-lg font-medium capitalize text-gray-900'>{props.ride?.user?.fullname?.firstname || 'Rider'} {props.ride?.user?.fullname?.lastname || ''}</h2>
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

                <div className='mt-6 w-full'>
                    <button
                        onClick={endRide}
                        className='w-full flex text-base font-semibold justify-center bg-green-600 text-white p-3.5 rounded-lg active:bg-green-700 shadow-sm'
                    >
                        Complete Ride & Accept Payment
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FinishRide