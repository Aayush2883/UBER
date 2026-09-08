import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
// import LiveTracking from '../components/LiveTracking'; // Google Maps (requires billing)
import LiveTrackingOSM from '../components/LiveTrackingOSM'; // Free OpenStreetMap alternative

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    // Fix: move socket listeners into useEffect with cleanup to prevent memory leaks
    useEffect(() => {
        const onRideConfirmed = (ride) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        }

        const onRideStarted = (ride) => {
            console.log("ride started")
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } })
        }

        socket.on('ride-confirmed', onRideConfirmed)
        socket.on('ride-started', onRideStarted)

        return () => {
            socket.off('ride-confirmed', onRideConfirmed)
            socket.off('ride-started', onRideStarted)
        }
    }, [ socket, navigate ])

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        // Only call API when input has 3+ characters (backend validation requires min: 3)
        if (e.target.value.length < 3) {
            setPickupSuggestions([])
            return
        }
        try {
            const token = localStorage.getItem('user-token') || localStorage.getItem('token')
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        // Only call API when input has 3+ characters (backend validation requires min: 3)
        if (e.target.value.length < 3) {
            setDestinationSuggestions([])
            return
        }
        try {
            const token = localStorage.getItem('user-token') || localStorage.getItem('token')
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, { transform: 'translateY(0)' })
        } else {
            gsap.to(vehiclePanelRef.current, { transform: 'translateY(100%)' })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, { transform: 'translateY(0)' })
        } else {
            gsap.to(confirmRidePanelRef.current, { transform: 'translateY(100%)' })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, { transform: 'translateY(0)' })
        } else {
            gsap.to(vehicleFoundRef.current, { transform: 'translateY(100%)' })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, { transform: 'translateY(0)' })
        } else {
            gsap.to(waitingForDriverRef.current, { transform: 'translateY(100%)' })
        }
    }, [ waitingForDriver ])

    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const token = localStorage.getItem('user-token') || localStorage.getItem('token')
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setFare(response.data)
    }

    async function createRide() {
        const token = localStorage.getItem('user-token') || localStorage.getItem('token')
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    const [ locating, setLocating ] = useState(false)

    async function getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                try {
                    // Reverse geocode using Nominatim (free) instead of Google
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                        { headers: { 'User-Agent': 'UberCloneApp/1.0' } }
                    )
                    if (response.data && response.data.display_name) {
                        setPickup(response.data.display_name)
                    } else {
                        setPickup(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
                    }
                } catch {
                    setPickup(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
                }
                setLocating(false)
            },
            (error) => {
                setLocating(false)
                alert('Unable to get your location. Please allow location access.')
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-14 sm:w-16 absolute left-5 top-5 z-20' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
            <div className='h-screen w-full absolute top-0 left-0 z-0'>
                {/* <LiveTracking /> */} {/* Google Maps — requires billing */}
                <LiveTrackingOSM /> {/* Free OpenStreetMap alternative */}
            </div>
            <div className='flex flex-col justify-end h-screen absolute top-0 left-0 w-full z-10 pointer-events-none'>
                <div className='h-auto min-h-[28%] p-4 sm:p-6 bg-white relative pointer-events-auto rounded-t-3xl shadow-[0_-4px_25px_rgba(0,0,0,0.15)]'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-5 top-5 text-2xl cursor-pointer'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-xl sm:text-2xl font-semibold mb-2'>Find a trip</h4>
                    <form className='relative py-2 sm:py-3' onSubmit={(e) => { submitHandler(e) }}>
                        <div className="line absolute h-14 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-10 sm:px-12 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg w-full mb-2'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        {/* Current location button */}
                        <button
                            type='button'
                            onClick={getCurrentLocation}
                            disabled={locating}
                            className='flex items-center gap-2 text-sm text-blue-600 font-medium mb-2 ml-1 active:text-blue-800 disabled:text-gray-400'
                        >
                            <i className={`ri-crosshair-2-line text-base ${locating ? 'animate-spin' : ''}`}></i>
                            {locating ? 'Getting location...' : 'Use current location'}
                        </button>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-10 sm:px-12 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg w-full mt-1'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2.5 rounded-lg mt-2 w-full text-sm sm:text-base font-medium active:bg-gray-800'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0 overflow-y-auto pointer-events-auto'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                        pickup={pickup}
                        destination={destination}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-8 pt-10 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-10 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-10 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-10 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home