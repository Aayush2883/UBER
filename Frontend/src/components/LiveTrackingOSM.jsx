// ============================================================
// LiveTrackingOSM.jsx — Free OpenStreetMap version using Leaflet
// Replaces LiveTracking.jsx (Google Maps) due to billing requirement.
// Original Google Maps component is preserved in LiveTracking.jsx
// ============================================================

import React, { useState, useEffect } from 'react'
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

// Sub-component: smoothly re-centers map when user position changes
const MapUpdater = ({ position }) => {
    const map = useMap()
    useEffect(() => {
        map.setView(position, map.getZoom())
    }, [ position ])
    return null
}

const defaultCenter = [ 28.6139, 77.2090 ] // New Delhi

const LiveTrackingOSM = () => {
    const [ currentPosition, setCurrentPosition ] = useState(defaultCenter)

    useEffect(() => {
        if (!navigator.geolocation) return;

        // Get initial position
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition([ position.coords.latitude, position.coords.longitude ])
        })

        // Watch for movement
        const watchId = navigator.geolocation.watchPosition((position) => {
            setCurrentPosition([ position.coords.latitude, position.coords.longitude ])
        })

        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    // Interval update every 10 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentPosition([ position.coords.latitude, position.coords.longitude ])
            })
        }, 10000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <MapContainer
            center={currentPosition}
            zoom={15}
            style={{ width: '100%', height: '100%', zIndex: 0 }}
            zoomControl={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={currentPosition}>
                <Popup>📍 You are here</Popup>
            </Marker>
            <MapUpdater position={currentPosition} />
        </MapContainer>
    )
}

export default LiveTrackingOSM
