import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import LiveTrackingOSM from '../components/LiveTrackingOSM'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain, setCaptain } = useContext(CaptainDataContext)

    // Refresh captain profile data on mount to get latest earnings, ridesCount, distanceCovered
    useEffect(() => {
        const token = localStorage.getItem('captain-token') || localStorage.getItem('token')
        if (token) {
            axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                if (response.status === 200 && response.data?.captain) {
                    setCaptain(response.data.captain)
                }
            }).catch(() => {})
        }
    }, [ setCaptain ])

    useEffect(() => {
        if (!captain?._id || !socket) return;

        // Join room and register socket ID on backend
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })

        const updateLocation = () => {
            if (navigator.geolocation && captain?._id) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [ captain, socket ])

    // Socket listener for new ride requests
    useEffect(() => {
        if (!socket) return;

        const onNewRide = (data) => {
            console.log("New ride received on captain:", data)
            setRide(data)
            setRidePopupPanel(true)
        }

        socket.on('new-ride', onNewRide)

        return () => {
            socket.off('new-ride', onNewRide)
        }
    }, [ socket ])

    async function confirmRide() {
        const captainToken = localStorage.getItem('captain-token') || localStorage.getItem('token')
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
        }, {
            headers: {
                Authorization: `Bearer ${captainToken}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, { transform: 'translateY(0)' })
        } else {
            gsap.to(ridePopupPanelRef.current, { transform: 'translateY(100%)' })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(0)' })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(100%)' })
        }
    }, [ confirmRidePopupPanel ])

    return (
        <div className='h-screen overflow-hidden relative'>
            <div className='fixed p-4 sm:p-6 top-0 flex items-center justify-between w-full z-10 pointer-events-none'>
                <img className='w-14 sm:w-16 pointer-events-auto' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <Link to='/captain/logout' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow pointer-events-auto'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            {/* Realtime OpenStreetMap interactive map */}
            <div className='h-3/5 w-full relative z-0'>
                <LiveTrackingOSM />
            </div>
            <div className='h-2/5 p-4 sm:p-6 overflow-y-auto bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] relative z-10'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-10 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-10 rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome