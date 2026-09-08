// ============================================================
// LiveTrackingOSM.jsx — Free OpenStreetMap version using Leaflet
// Replaces LiveTracking.jsx (Google Maps) due to billing requirement.
// Original Google Maps component is preserved in LiveTracking.jsx
// ============================================================

import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default marker icon broken by Vite's asset bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom pulsing radar marker for Captain / Live Location
const liveCaptainIcon = L.divIcon({
    className: 'live-captain-marker',
    html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 46px; height: 46px;">
            <div style="position: absolute; width: 44px; height: 44px; background: rgba(59, 130, 246, 0.35); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 34px; height: 34px; background-color: #111827; color: #ffffff; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-size: 16px;">
                🚗
            </div>
        </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -23]
});

// Controller to smoothly pan & recenter map
const MapController = ({ position, shouldRecenter, onRecentered }) => {
    const map = useMap()
    useEffect(() => {
        if (position && shouldRecenter) {
            map.flyTo(position, 16, { animate: true, duration: 1 })
            if (onRecentered) onRecentered()
        }
    }, [ position, shouldRecenter, map, onRecentered ])
    return null
}

const defaultCenter = [ 28.6139, 77.2090 ] // New Delhi fallback

const LiveTrackingOSM = ({ role = 'captain', title = 'Your Live Location' }) => {
    const [ currentPosition, setCurrentPosition ] = useState(defaultCenter)
    const [ locationText, setLocationText ] = useState('Locating GPS...')
    const [ isGpsActive, setIsGpsActive ] = useState(false)
    const [ shouldRecenter, setShouldRecenter ] = useState(true)

    const updateCoords = (lat, lng) => {
        setCurrentPosition([ lat, lng ])
        setIsGpsActive(true)
        setLocationText(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`)
    }

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationText('GPS Not Supported')
            return;
        }

        // Get initial precise location
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                updateCoords(pos.coords.latitude, pos.coords.longitude)
                setShouldRecenter(true)
            },
            () => {
                setLocationText('Location Permission Denied')
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )

        // Continuous high accuracy watch
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                updateCoords(pos.coords.latitude, pos.coords.longitude)
            },
            () => {},
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 }
        )

        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    return (
        <div className='relative w-full h-full'>
            {/* Live Location Status Pill */}
            <div className='absolute top-20 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-gray-200/80 flex items-center gap-2 pointer-events-auto'>
                <span className={`h-2.5 w-2.5 rounded-full ${isGpsActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                <div className='flex flex-col'>
                    <span className='text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none'>
                        {isGpsActive ? 'Live GPS Active' : 'Locating...'}
                    </span>
                    <span className='text-xs font-semibold text-gray-800 leading-tight font-mono'>
                        {locationText}
                    </span>
                </div>
            </div>

            {/* Recenter Button */}
            <button
                type='button'
                onClick={() => setShouldRecenter(true)}
                title="Recenter to my location"
                className='absolute right-4 bottom-6 z-[400] h-11 w-11 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 rounded-full shadow-xl border border-gray-200 flex items-center justify-center transition transform active:scale-95 pointer-events-auto'
            >
                <i className="ri-crosshair-2-fill text-xl text-blue-600"></i>
            </button>

            <MapContainer
                center={currentPosition}
                zoom={15}
                style={{ width: '100%', height: '100%', zIndex: 0 }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={currentPosition} icon={liveCaptainIcon}>
                    <Popup>
                        <div className='text-center p-1'>
                            <p className='font-bold text-sm text-gray-900'>📍 {title}</p>
                            <p className='text-xs text-gray-500 font-mono mt-0.5'>{locationText}</p>
                            <span className='inline-block mt-1 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full'>
                                Broadcasting to Network
                            </span>
                        </div>
                    </Popup>
                </Marker>
                <MapController
                    position={currentPosition}
                    shouldRecenter={shouldRecenter}
                    onRecentered={() => setShouldRecenter(false)}
                />
            </MapContainer>
        </div>
    )
}

export default LiveTrackingOSM
