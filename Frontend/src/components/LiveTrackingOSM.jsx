// ============================================================
// LiveTrackingOSM.jsx — Free OpenStreetMap + OSRM Route Display
// Shows: live GPS position, pickup marker, dropoff marker, route polyline
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// ── Fix Leaflet's broken marker icons under Vite ──────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── Custom Icons ──────────────────────────────────────────────────────────────
const liveCarIcon = L.divIcon({
    className: '',
    html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;width:46px;height:46px;">
            <div style="position:absolute;width:44px;height:44px;background:rgba(59,130,246,0.30);border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:relative;width:34px;height:34px;background:#111827;color:#fff;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:16px;">🚗</div>
        </div>`,
    iconSize:    [46, 46],
    iconAnchor:  [23, 23],
    popupAnchor: [0, -23],
});

const liveUserIcon = L.divIcon({
    className: '',
    html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;">
            <div style="position:absolute;width:38px;height:38px;background:rgba(37,99,235,0.35);border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:relative;width:22px;height:22px;background:#2563eb;border:3px solid #ffffff;border-radius:50%;box-shadow:0 3px 10px rgba(0,0,0,0.35);"></div>
        </div>`,
    iconSize:    [40, 40],
    iconAnchor:  [20, 20],
    popupAnchor: [0, -20],
});

const pickupIcon = L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;background:#22c55e;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
    iconSize:   [22, 22],
    iconAnchor: [11, 11],
});

const dropoffIcon = L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;background:#ef4444;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
    iconSize:   [22, 22],
    iconAnchor: [11, 11],
});

// ── Map controller: flies to position or fits route bounds ────────────────────
const MapController = ({ position, routeCoords, shouldFit, onFitted }) => {
    const map = useMap();
    useEffect(() => {
        if (!shouldFit) return;
        if (routeCoords && routeCoords.length > 1) {
            map.fitBounds(L.latLngBounds(routeCoords), { padding: [50, 50], animate: true });
        } else if (position) {
            map.flyTo(position, 16, { animate: true, duration: 1 });
        }
        if (onFitted) onFitted();
    }, [shouldFit, routeCoords, position, map, onFitted]);
    return null;
};

// ── Geocode a place string → [lat, lng] via Nominatim ────────────────────────
async function geocode(address) {
    if (!address) return null;
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=in`;
        const res = await fetch(url, { headers: { 'User-Agent': 'UberCloneApp/2.0' } });
        const data = await res.json();
        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
    } catch {}
    return null;
}

// ── Fetch OSRM route between two [lat,lng] points ────────────────────────────
async function fetchRoute(from, to) {
    if (!from || !to) return [];
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
            // GeoJSON is [lng, lat] — Leaflet wants [lat, lng]
            return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        }
    } catch {}
    return [];
}

const defaultCenter = [25.4358, 81.8463]; // Prayagraj

// ── Main Component ────────────────────────────────────────────────────────────
// Props:
//   pickup      {string}  — pickup address text (optional)
//   destination {string}  — destination address text (optional)
//   role        {string}  — 'captain' | 'user'
//   title       {string}  — popup label
const LiveTrackingOSM = ({ pickup, destination, role = 'captain', title = 'Your Location' }) => {
    const [livePos,       setLivePos]       = useState(null);
    const [locationText,  setLocationText]  = useState('Locating GPS...');
    const [isGpsActive,   setIsGpsActive]   = useState(false);
    const [pickupCoords,  setPickupCoords]  = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [routeCoords,   setRouteCoords]   = useState([]);
    const [routeInfo,     setRouteInfo]     = useState(null); // { distanceKm, durationMin }
    const [shouldFit,     setShouldFit]     = useState(true);
    const intervalRef = useRef(null);

    // ── Live GPS: initial fix + update every 10 seconds ──────────────────────
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationText('GPS Not Supported');
            return;
        }

        const onSuccess = (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            setLivePos([lat, lng]);
            setIsGpsActive(true);
            setLocationText(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
        };
        const onError = () => { setLocationText('Location Permission Denied'); };

        // Get initial fix immediately
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true, timeout: 10000, maximumAge: 0,
        });

        // Then refresh every 10 seconds (matches socket emit interval in CaptainHome)
        intervalRef.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition(onSuccess, () => {}, {
                enableHighAccuracy: false, timeout: 8000, maximumAge: 5000,
            });
        }, 10000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // ── Geocode pickup and destination whenever they change ───────────────────
    useEffect(() => {
        if (!pickup) { setPickupCoords(null); return; }
        geocode(pickup).then(coords => {
            setPickupCoords(coords);
            setShouldFit(true);
        });
    }, [pickup]);

    useEffect(() => {
        if (!destination) { setDropoffCoords(null); return; }
        geocode(destination).then(coords => {
            setDropoffCoords(coords);
            setShouldFit(true);
        });
    }, [destination]);

    // ── Fetch OSRM route once both endpoints are known ────────────────────────
    useEffect(() => {
        if (!pickupCoords || !dropoffCoords) {
            setRouteCoords([]);
            setRouteInfo(null);
            return;
        }
        fetchRoute(pickupCoords, dropoffCoords).then(coords => {
            setRouteCoords(coords);
            setShouldFit(true);
        });
        // Also fetch distance/duration from OSRM for the info pill
        (async () => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=false`;
                const res = await fetch(url);
                const data = await res.json();
                if (data.routes && data.routes.length > 0) {
                    const r = data.routes[0];
                    setRouteInfo({
                        distanceKm:  (r.distance / 1000).toFixed(1),
                        durationMin: Math.round(r.duration / 60),
                    });
                }
            } catch {}
        })();
    }, [pickupCoords, dropoffCoords]);

    const mapCenter = livePos || pickupCoords || defaultCenter;

    return (
        <div className='relative w-full h-full'>
            {/* ── GPS Status Pill ─────────────────────────────────────────── */}
            <div className='absolute top-20 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-gray-200/80 flex items-center gap-2 pointer-events-none'>
                <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${isGpsActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                <div className='flex flex-col'>
                    <span className='text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none'>
                        {isGpsActive ? 'Live GPS · Updates every 10s' : 'Locating...'}
                    </span>
                    <span className='text-xs font-semibold text-gray-800 leading-tight font-mono'>{locationText}</span>
                </div>
            </div>

            {/* ── Route Info Pill (shown once route is fetched) ────────────── */}
            {routeInfo && (
                <div className='absolute top-20 right-4 z-[400] bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-none'>
                    <i className="ri-route-line text-yellow-400 text-sm"></i>
                    <span className='text-xs font-bold text-white'>{routeInfo.distanceKm} km</span>
                    <span className='text-gray-400 text-xs'>·</span>
                    <span className='text-xs font-semibold text-gray-300'>{routeInfo.durationMin} min</span>
                </div>
            )}

            {/* ── Recenter Button ─────────────────────────────────────────── */}
            <button
                type='button'
                onClick={() => setShouldFit(true)}
                title='Fit route / Recenter'
                className='absolute right-4 bottom-6 z-[400] h-11 w-11 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 rounded-full shadow-xl border border-gray-200 flex items-center justify-center transition transform active:scale-95 pointer-events-auto'
            >
                <i className="ri-crosshair-2-fill text-xl text-blue-600"></i>
            </button>

            <MapContainer
                center={mapCenter}
                zoom={14}
                style={{ width: '100%', height: '100%', zIndex: 0 }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Live position marker */}
                {livePos && (
                    <Marker position={livePos} icon={role === 'user' ? liveUserIcon : liveCarIcon}>
                        <Popup>
                            <div className='text-center p-1'>
                                <p className='font-bold text-sm text-gray-900'>📍 {title}</p>
                                <p className='text-xs text-gray-500 font-mono mt-0.5'>{locationText}</p>
                                <span className='inline-block mt-1 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full'>
                                    Live · Every 10s
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Pickup marker (green dot) */}
                {pickupCoords && (
                    <Marker position={pickupCoords} icon={pickupIcon}>
                        <Popup>
                            <p className='font-semibold text-xs text-green-700'>🟢 Pickup</p>
                            <p className='text-xs text-gray-600 mt-0.5 max-w-[180px]'>{pickup}</p>
                        </Popup>
                    </Marker>
                )}

                {/* Dropoff marker (red dot) */}
                {dropoffCoords && (
                    <Marker position={dropoffCoords} icon={dropoffIcon}>
                        <Popup>
                            <p className='font-semibold text-xs text-red-600'>🔴 Drop-off</p>
                            <p className='text-xs text-gray-600 mt-0.5 max-w-[180px]'>{destination}</p>
                        </Popup>
                    </Marker>
                )}

                {/* OSRM Route polyline */}
                {routeCoords.length > 1 && (
                    <Polyline
                        positions={routeCoords}
                        pathOptions={{
                            color: '#2563eb',
                            weight: 5,
                            opacity: 0.85,
                            lineJoin: 'round',
                            lineCap: 'round',
                        }}
                    />
                )}

                <MapController
                    position={livePos || mapCenter}
                    routeCoords={routeCoords}
                    shouldFit={shouldFit}
                    onFitted={() => setShouldFit(false)}
                />
            </MapContainer>
        </div>
    );
};

export default LiveTrackingOSM;
