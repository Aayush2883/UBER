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
import { useNavigate, Link } from 'react-router-dom';
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

    // Track the user's live GPS position so suggestions can be biased near them
    const userGpsRef = useRef(null)

    // Debounce timers for pickup and destination suggestion calls
    // Prevents hammering Nominatim on every keystroke (their limit is 1 req/sec)
    const pickupDebounceRef = useRef(null)
    const destinationDebounceRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    // Keep a live GPS fix in ref for suggestion proximity bias
    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                userGpsRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            },
            () => {},
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [])

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

    const handlePickupChange = (e) => {
        const value = e.target.value
        setPickup(value)

        // Clear any pending debounce timer
        if (pickupDebounceRef.current) clearTimeout(pickupDebounceRef.current)

        if (value.length < 3) {
            setPickupSuggestions([])
            return
        }

        // Wait 500ms after the user stops typing before hitting the API
        // This respects Nominatim's 1 req/sec rate limit
        pickupDebounceRef.current = setTimeout(async () => {
            try {
                const token = localStorage.getItem('user-token') || localStorage.getItem('token')
                const params = { input: value }
                if (userGpsRef.current) {
                    params.lat = userGpsRef.current.lat
                    params.lng = userGpsRef.current.lng
                }
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params,
                    headers: { Authorization: `Bearer ${token}` }
                })
                setPickupSuggestions(response.data)
            } catch {}
        }, 500)
    }

    const handleDestinationChange = (e) => {
        const value = e.target.value
        setDestination(value)

        // Clear any pending debounce timer
        if (destinationDebounceRef.current) clearTimeout(destinationDebounceRef.current)

        if (value.length < 3) {
            setDestinationSuggestions([])
            return
        }

        // Wait 500ms after the user stops typing before hitting the API
        destinationDebounceRef.current = setTimeout(async () => {
            try {
                const token = localStorage.getItem('user-token') || localStorage.getItem('token')
                const params = { input: value }
                if (userGpsRef.current) {
                    params.lat = userGpsRef.current.lat
                    params.lng = userGpsRef.current.lng
                }
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params,
                    headers: { Authorization: `Bearer ${token}` }
                })
                setDestinationSuggestions(response.data)
            } catch {}
        }, 500)
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

    const [ error, setError ] = useState('')
    const [ isFindingTrip, setIsFindingTrip ] = useState(false)

    async function findTrip() {
        setError('')
        if (!pickup || !destination) {
            setError('Please enter both pickup and destination locations')
            return
        }

        try {
            setIsFindingTrip(true)
            const token = localStorage.getItem('user-token') || localStorage.getItem('token')
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFare(response.data)
            setVehiclePanel(true)
            setPanelOpen(false)
        } catch (err) {
            console.error('Error getting fare:', err)
            setError(err.response?.data?.message || 'Unable to calculate fare. Please try a different location.')
        } finally {
            setIsFindingTrip(false)
        }
    }

    async function createRide() {
        try {
            setError('')
            const token = localStorage.getItem('user-token') || localStorage.getItem('token')
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (err) {
            console.error('Error creating ride:', err)
            setError(err.response?.data?.message || 'Failed to create ride. Please try again.')
            setVehicleFound(false)
            setConfirmRidePanel(true)
        }
    }

    const [ locating, setLocating ] = useState(false)


    // Helper: reverse-geocode coords → address string via OUR backend
    // (calling Nominatim directly from the browser causes CORS blocks + 429 rate limits)
    async function reverseGeocode(latitude, longitude) {
        try {
            const token = localStorage.getItem('user-token') || localStorage.getItem('token')
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/maps/reverse-geocode`,
                {
                    params: { lat: latitude, lng: longitude },
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            if (response.data && response.data.address) {
                return response.data.address
            }
        } catch {}
        return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
    }

    async function getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }
        setLocating(true)

        const tryGetPosition = (highAccuracy) =>
            new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: highAccuracy,
                    timeout: highAccuracy ? 15000 : 10000,
                    maximumAge: highAccuracy ? 0 : 30000,
                })
            })

        try {
            let position
            try {
                // First attempt: precise GPS (may timeout on desktops/Windows)
                position = await tryGetPosition(true)
            } catch {
                // Fallback: WiFi / IP-based location — almost always works
                position = await tryGetPosition(false)
            }
            const { latitude, longitude } = position.coords
            const address = await reverseGeocode(latitude, longitude)
            setPickup(address)
        } catch {
            alert('Unable to get your location. Please allow location access in your browser settings.')
        } finally {
            setLocating(false)
        }
    }

    return (
        <div className='h-screen relative overflow-hidden'>
        <div className='fixed p-4 sm:p-5 top-0 flex items-center justify-between w-full z-20 pointer-events-none'>
                <img className='w-14 sm:w-16 pointer-events-auto' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <Link to='/user/logout' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow pointer-events-auto'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-screen w-full absolute top-0 left-0 z-0'>
                {/* <LiveTracking /> */} {/* Google Maps — requires billing */}
                <LiveTrackingOSM 
                    pickup={pickup}
                    destination={destination}
                    role="user"
                    title="Your Location"
                />
            </div>

            {/* Floating circular 'Get Current Location' button for Rider on Map */}
            <button
                type='button'
                onClick={getCurrentLocation}
                disabled={locating}
                title='Get Current Location'
                className={`fixed right-4 z-20 h-12 w-12 bg-white text-blue-600 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-gray-200 flex items-center justify-center transition-all duration-300 transform active:scale-90 hover:bg-gray-50 disabled:opacity-75 pointer-events-auto cursor-pointer ${
                    panelOpen ? 'bottom-[72%]' : 'bottom-[31%] sm:bottom-[29%]'
                }`}
            >
                <i className={`ri-crosshair-2-fill text-2xl text-blue-600 ${locating ? 'animate-spin' : ''}`}></i>
            </button>

            <div className='flex flex-col justify-end h-screen absolute top-0 left-0 w-full z-10 pointer-events-none'>
                <div className='h-auto min-h-[28%] p-4 sm:p-6 bg-white relative pointer-events-auto rounded-t-3xl shadow-[0_-4px_25px_rgba(0,0,0,0.15)]'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-5 top-5 text-2xl cursor-pointer'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-xl sm:text-2xl font-semibold mb-2'>Find a trip</h4>
                    {error && (
                        <div className='bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-lg mb-2 text-xs sm:text-sm flex items-start gap-2'>
                            <i className="ri-error-warning-line text-base flex-shrink-0 mt-0.5"></i>
                            <span>{error}</span>
                        </div>
                    )}
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