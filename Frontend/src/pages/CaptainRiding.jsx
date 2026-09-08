import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
// import LiveTracking from '../components/LiveTracking' // Google Maps (requires billing)
import LiveTrackingOSM from '../components/LiveTrackingOSM' // Free OpenStreetMap alternative

const CaptainRiding = () => {

    const [ finishRidePanel, setFinishRidePanel ] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride



    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ finishRidePanel ])


    const distanceText = rideData?.distance 
        ? `${(rideData.distance / 1000).toFixed(1)} KM away` 
        : '3.5 KM away'

    return (
        <div className='h-screen relative flex flex-col justify-end overflow-hidden'>

            <div className='fixed p-4 sm:p-6 top-0 flex items-center justify-between w-full z-10'>
                <img className='w-14 sm:w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow'>
                    <i className="text-lg font-medium ri-home-5-line"></i>
                </Link>
            </div>

            <div className='h-1/5 p-4 sm:p-6 flex items-center justify-between relative bg-yellow-400 pt-8 sm:pt-10 cursor-pointer shadow-lg z-10'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0'>
                    <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
                </h5>
                <div>
                    <h4 className='text-lg sm:text-xl font-bold'>{distanceText}</h4>
                    <p className='text-xs text-gray-700 font-medium truncate max-w-[200px]'>{rideData?.destination}</p>
                </div>
                <button className='bg-green-600 text-white font-semibold p-2.5 sm:p-3 px-6 sm:px-10 rounded-lg active:bg-green-700 shadow-sm text-sm sm:text-base'>
                    Complete Ride
                </button>
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-10 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen fixed w-full top-0 left-0 z-0'>
                {/* <LiveTracking /> */} {/* Google Maps — requires billing */}
                <LiveTrackingOSM /> {/* Free OpenStreetMap alternative */}
            </div>

        </div>
    )
}

export default CaptainRiding