import React from 'react'
import { vehicleImages, vehicleNames } from '../assets/vehicles'

const LookingForDriver = (props) => {
    const vehicleKey = props.vehicleType || 'car'
    const vehicleImg = vehicleImages[vehicleKey] || vehicleImages.car
    const vehicleTitle = vehicleNames[vehicleKey] || 'Driver'
    const fareAmount = props.fare?.[vehicleKey] || props.fare?.car || '--'

    return (
        <div className='p-2 sm:p-4'>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-xl sm:text-2xl font-semibold mb-3 text-center sm:text-left'>Looking for nearby {vehicleTitle}</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='relative my-2'>
                    <img className='h-20 sm:h-24 object-contain animate-pulse' src={vehicleImg} alt="Finding driver" />
                </div>

                {props.fare?.distance?.text && (
                    <div className='inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium'>
                        <span><i className="ri-road-map-line"></i> {props.fare.distance.text}</span>
                        <span>•</span>
                        <span><i className="ri-time-line"></i> {props.fare.duration?.text || '15 mins'}</span>
                    </div>
                )}

                <div className='w-full mt-3'>
                    <div className='flex items-center gap-4 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-lg text-gray-700"></i>
                        <div className='w-full overflow-hidden'>
                            <h3 className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Pick-up</h3>
                            <p className='text-sm font-medium text-gray-800 truncate'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                        <div className='w-full overflow-hidden'>
                            <h3 className='text-xs uppercase font-bold text-gray-500 tracking-wider'>Drop-off</h3>
                            <p className='text-sm font-medium text-gray-800 truncate'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3'>
                        <i className="ri-currency-line text-lg text-gray-700"></i>
                        <div>
                            <h3 className='text-base sm:text-lg font-bold text-gray-900'>₹{fareAmount}</h3>
                            <p className='text-xs font-medium text-gray-500'>Cash Payment</p>
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500 mt-2'>
                    <div className='w-2.5 h-2.5 rounded-full bg-green-500 animate-ping'></div>
                    <span>Broadcasting request to nearby captains...</span>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver