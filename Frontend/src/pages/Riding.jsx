import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
// import LiveTracking from '../components/LiveTracking' // Google Maps (requires billing)
import LiveTrackingOSM from '../components/LiveTrackingOSM' // Free OpenStreetMap alternative

const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    motorcycle: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
}

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    const vType = (ride?.captain?.vehicle?.vehicleType || 'car').toLowerCase()
    const vehicleImg = vehicleImages[vType] || vehicleImages.car

    // Fix: move socket listener into useEffect with cleanup
    useEffect(() => {
        const onRideEnded = () => {
            navigate('/home')
        }

        socket.on("ride-ended", onRideEnded)

        return () => {
            socket.off("ride-ended", onRideEnded)
        }
    }, [ socket, navigate ])

    return (
        <div className='h-screen flex flex-col'>
            <Link to='/home' className='fixed right-3 top-3 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow z-10'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <div className='h-1/2'>
                {/* <LiveTracking /> */} {/* Google Maps — requires billing */}
                <LiveTrackingOSM /> {/* Free OpenStreetMap alternative */}
            </div>
            <div className='h-1/2 p-4 overflow-y-auto'>
                <div className='flex items-center justify-between mb-4 border-b pb-3'>
                    <img className='h-14 sm:h-16 rounded object-cover' src={vehicleImg} alt="Vehicle" />
                    <div className='text-right'>
                        <h2 className='text-base sm:text-lg font-bold capitalize'>{ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname || ''}</h2>
                        <h4 className='text-base sm:text-lg font-mono font-bold text-gray-800 -mt-0.5 tracking-wider'>{ride?.captain?.vehicle?.plate || 'DL 01 AB 1234'}</h4>
                        <p className='text-xs sm:text-sm text-gray-600 capitalize'>
                            {ride?.captain?.vehicle?.color || 'White'} {ride?.captain?.vehicle?.vehicleType || 'Car'}
                        </p>
                    </div>
                </div>

                <div className='w-full'>
                    <div className='flex items-center gap-4 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                        <div className='w-full overflow-hidden'>
                            <h3 className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Destination</h3>
                            <p className='text-sm font-medium text-gray-800 truncate'>{ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3'>
                        <i className="ri-currency-line text-lg text-gray-700"></i>
                        <div>
                            <h3 className='text-base sm:text-lg font-bold text-gray-900'>₹{ride?.fare}</h3>
                            <p className='text-xs font-medium text-gray-500'>Cash Payment</p>
                        </div>
                    </div>
                </div>
                <button className='w-full mt-4 bg-green-600 text-white font-semibold p-3 rounded-lg active:bg-green-700 shadow-sm'>Make a Payment</button>
            </div>
        </div>
    )
}

export default Riding