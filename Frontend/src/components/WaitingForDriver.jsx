import React from 'react'

const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    motorcycle: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
}

const WaitingForDriver = (props) => {
    const vType = (props.ride?.captain?.vehicle?.vehicleType || 'car').toLowerCase()
    const vehicleImg = vehicleImages[vType] || vehicleImages.car

    return (
        <div className='p-2 sm:p-4'>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                if (typeof props.setWaitingForDriver === 'function') {
                    props.setWaitingForDriver(false);
                }
            }}><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>

            <div className='flex items-center justify-between mt-2 pt-2 border-b pb-3'>
                <img className='h-12 sm:h-14 rounded object-cover' src={vehicleImg} alt="Vehicle" />
                <div className='text-right'>
                    <h2 className='text-base sm:text-lg font-bold capitalize text-gray-900'>
                        {props.ride?.captain?.fullname?.firstname || 'Captain'} {props.ride?.captain?.fullname?.lastname || ''}
                    </h2>
                    <h4 className='text-base sm:text-lg font-mono font-bold text-gray-800 -mt-0.5 tracking-wider'>
                        {props.ride?.captain?.vehicle?.plate || 'DL 01 AB 1234'}
                    </h4>
                    <p className='text-xs text-gray-500 capitalize'>
                        {props.ride?.captain?.vehicle?.color || 'White'} {props.ride?.captain?.vehicle?.vehicleType || 'Car'}
                    </p>
                    <div className='mt-2 inline-flex items-center gap-1.5 bg-yellow-100 border border-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm'>
                        <span>OTP:</span>
                        <span className='font-mono text-sm tracking-widest'>{props.ride?.otp || '••••••'}</span>
                    </div>
                </div>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center mt-2'>
                <div className='w-full mt-2'>
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
            </div>
        </div>
    )
}

export default WaitingForDriver