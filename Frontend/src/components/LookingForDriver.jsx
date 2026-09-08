import React from 'react'

const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
}

const vehicleNames = {
    car: 'UberGo',
    moto: 'Moto',
    auto: 'UberAuto'
}

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