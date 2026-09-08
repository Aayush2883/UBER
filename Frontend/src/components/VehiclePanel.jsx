import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div className='p-2 sm:p-4'>
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left'>Choose a Vehicle</h3>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
            }} className='flex border-2 border-gray-200 hover:border-black active:border-black mb-3 rounded-2xl w-full p-3 sm:p-4 items-center justify-between cursor-pointer transition-colors bg-white hover:bg-gray-50'>
                <img className='h-12 sm:h-14 object-contain' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="UberGo" />
                <div className='ml-3 w-1/2'>
                    <h4 className='font-semibold text-sm sm:text-base flex items-center gap-1.5'>
                        UberGo <span className='text-xs text-gray-500 font-normal'><i className="ri-user-3-fill text-xs"></i> 4</span>
                    </h4>
                    <h5 className='text-xs font-medium text-gray-700 mt-0.5'>2 mins away</h5>
                    <p className='text-xs text-gray-500 hidden sm:block'>Affordable, compact rides</p>
                </div>
                <h2 className='text-base sm:text-lg font-bold text-gray-900'>
                    {props.fare?.car ? `₹${props.fare.car}` : '₹--'}
                </h2>
            </div>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex border-2 border-gray-200 hover:border-black active:border-black mb-3 rounded-2xl w-full p-3 sm:p-4 items-center justify-between cursor-pointer transition-colors bg-white hover:bg-gray-50'>
                <img className='h-12 sm:h-14 object-contain' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Moto" />
                <div className='ml-3 w-1/2'>
                    <h4 className='font-semibold text-sm sm:text-base flex items-center gap-1.5'>
                        Moto <span className='text-xs text-gray-500 font-normal'><i className="ri-user-3-fill text-xs"></i> 1</span>
                    </h4>
                    <h5 className='text-xs font-medium text-gray-700 mt-0.5'>3 mins away</h5>
                    <p className='text-xs text-gray-500 hidden sm:block'>Fast motorcycle rides</p>
                </div>
                <h2 className='text-base sm:text-lg font-bold text-gray-900'>
                    {props.fare?.moto ? `₹${props.fare.moto}` : '₹--'}
                </h2>
            </div>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex border-2 border-gray-200 hover:border-black active:border-black mb-2 rounded-2xl w-full p-3 sm:p-4 items-center justify-between cursor-pointer transition-colors bg-white hover:bg-gray-50'>
                <img className='h-12 sm:h-14 object-contain' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="UberAuto" />
                <div className='ml-3 w-1/2'>
                    <h4 className='font-semibold text-sm sm:text-base flex items-center gap-1.5'>
                        UberAuto <span className='text-xs text-gray-500 font-normal'><i className="ri-user-3-fill text-xs"></i> 3</span>
                    </h4>
                    <h5 className='text-xs font-medium text-gray-700 mt-0.5'>3 mins away</h5>
                    <p className='text-xs text-gray-500 hidden sm:block'>Affordable 3-wheeler rides</p>
                </div>
                <h2 className='text-base sm:text-lg font-bold text-gray-900'>
                    {props.fare?.auto ? `₹${props.fare.auto}` : '₹--'}
                </h2>
            </div>
        </div>
    )
}

export default VehiclePanel