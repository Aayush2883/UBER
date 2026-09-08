import React from 'react'

const RidePopUp = (props) => {
    return (
        <div className='p-2 sm:p-4'>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left'>New Ride Available!</h3>
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-xl mt-2 shadow-sm'>
                <div className='flex items-center gap-3'>
                    <img className='h-11 w-11 rounded-full object-cover shadow' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="Rider" />
                    <h2 className='text-base sm:text-lg font-medium capitalize text-gray-900'>
                        {props.ride?.user?.fullname?.firstname || 'Rider'} {props.ride?.user?.fullname?.lastname || ''}
                    </h2>
                </div>
                <h5 className='text-sm sm:text-base font-semibold px-2.5 py-1 bg-white/70 rounded-lg'>
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
                <div className='mt-4 w-full flex flex-col gap-2'>
                    <button
                        onClick={() => {
                            props.setConfirmRidePopupPanel(true)
                            props.confirmRide()
                        }}
                        className='bg-green-600 w-full text-white font-semibold p-3 rounded-lg active:bg-green-700 shadow-sm text-base'
                    >
                        Accept Ride
                    </button>
                    <button
                        onClick={() => {
                            props.setRidePopupPanel(false)
                        }}
                        className='w-full bg-gray-200 text-gray-800 font-semibold p-2.5 rounded-lg active:bg-gray-300 text-base'
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp