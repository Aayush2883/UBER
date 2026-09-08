import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)
    const firstName = captain?.fullname?.firstname || 'Captain'
    const lastName = captain?.fullname?.lastname || ''

    const earnings = typeof captain?.earnings === 'number' ? captain.earnings.toFixed(2) : '0.00'
    const distanceKm = typeof captain?.distanceCovered === 'number' ? captain.distanceCovered.toFixed(1) : '0.0'
    const ridesCount = typeof captain?.ridesCount === 'number' ? captain.ridesCount : 0
    const hoursOnline = typeof captain?.hoursOnline === 'number' && captain.hoursOnline > 0 ? captain.hoursOnline.toFixed(1) : '2.4'

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-11 w-11 rounded-full object-cover border border-gray-200 shadow-sm' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="Captain" />
                    <div>
                        <h4 className='text-base sm:text-lg font-bold capitalize text-gray-900'>{firstName + " " + lastName}</h4>
                        <p className='text-xs text-gray-500 capitalize'>
                            {captain?.vehicle?.vehicleType || 'Car'} • {captain?.vehicle?.plate || 'Active'}
                        </p>
                    </div>
                </div>
                <div className='text-right'>
                    <h4 className='text-lg sm:text-xl font-bold text-gray-900'>₹{earnings}</h4>
                    <p className='text-xs font-medium text-gray-500'>Total Earnings</p>
                </div>
            </div>
            <div className='flex p-3.5 mt-5 bg-gray-50 border border-gray-100 rounded-xl justify-around items-center'>
                <div className='text-center'>
                    <i className="text-2xl sm:text-3xl text-gray-700 ri-timer-2-line"></i>
                    <h5 className='text-base sm:text-lg font-bold text-gray-800 mt-1'>{hoursOnline}</h5>
                    <p className='text-xs text-gray-500'>Hours Online</p>
                </div>
                <div className='h-8 w-[1px] bg-gray-200'></div>
                <div className='text-center'>
                    <i className="text-2xl sm:text-3xl text-gray-700 ri-speed-up-line"></i>
                    <h5 className='text-base sm:text-lg font-bold text-gray-800 mt-1'>{distanceKm}</h5>
                    <p className='text-xs text-gray-500'>KM Driven</p>
                </div>
                <div className='h-8 w-[1px] bg-gray-200'></div>
                <div className='text-center'>
                    <i className="text-2xl sm:text-3xl text-gray-700 ri-booklet-line"></i>
                    <h5 className='text-base sm:text-lg font-bold text-gray-800 mt-1'>{ridesCount}</h5>
                    <p className='text-xs text-gray-500'>Rides Done</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails