const axios = require('axios');
const captainModel = require('../models/captain.model');

// ============================================================
// NOTE: Google Maps API code is commented out below.
// Reason: Google Maps APIs require billing to be enabled.
// We switched to free OpenStreetMap alternatives (Nominatim + OSRM).
// To re-enable Google Maps: uncomment Google sections, comment OSM sections,
// and enable billing at https://console.cloud.google.com/billing
// ============================================================


// ---- GET ADDRESS COORDINATES ----

// Helper: geocode address or parse direct lat/lng coordinates
const geocodeAddress = async (address) => {
    if (!address) throw new Error('Address is required');
    const coordMatch = String(address).match(/^([-+]?\d+(\.\d+)?),\s*([-+]?\d+(\.\d+)?)$/);
    if (coordMatch) {
        return { lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[3]) };
    }
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'UberCloneApp/1.0' },
            timeout: 5000
        });
        if (response.data && response.data.length > 0) {
            return { lat: parseFloat(response.data[0].lat), lon: parseFloat(response.data[0].lon) };
        }
    } catch {
        // Continue to fallback
    }

    // Fallback: deterministic coordinates around center point for arbitrary/custom text
    let hash = 0;
    for (let i = 0; i < address.length; i++) hash = (hash * 31 + address.charCodeAt(i)) & 0xffffff;
    const latOffset = ((hash % 100) - 50) / 1000;
    const lngOffset = (((hash >> 4) % 100) - 50) / 1000;
    return { lat: 28.6139 + latOffset, lon: 77.2090 + lngOffset };
};

// Simulated distance & time formula for pricing
const generateSimulatedDistanceTime = (origin, destination) => {
    const originStr = String(origin || '').trim().toLowerCase();
    const destStr = String(destination || '').trim().toLowerCase();
    const combined = `${originStr}-${destStr}`;

    let hash = 5381;
    for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) + hash) + combined.charCodeAt(i);
        hash = hash & 0x7fffffff;
    }

    // Generates a realistic urban distance between 3.2 km and 19.8 km
    const distanceKm = Math.round(((hash % 166) / 10 + 3.2) * 10) / 10;
    // Generates realistic city traffic time: ~2.3 mins per km plus base waiting time
    const durationMin = Math.max(6, Math.round(distanceKm * 2.3 + 5));

    return {
        distance: { text: `${distanceKm} km`, value: Math.round(distanceKm * 1000) },
        duration: { text: `${durationMin} mins`, value: durationMin * 60 }
    };
};

module.exports.generateSimulatedDistanceTime = generateSimulatedDistanceTime;

// Haversine formula fallback: computes driving estimate if OSRM is unreachable
const calculateHaversineFallback = (originCoords, destCoords, origin, dest) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(destCoords.lat - originCoords.lat);
    const dLon = toRad(destCoords.lon - originCoords.lon);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(originCoords.lat)) * Math.cos(toRad(destCoords.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightKm = R * c;

    // If geocoding returned identical fallback coordinates, use simulated distance
    if (straightKm < 0.8 && origin && dest) {
        return generateSimulatedDistanceTime(origin, dest);
    }

    const drivingKm = Math.max(2.5, Math.round(straightKm * 1.35 * 10) / 10);
    const durationMin = Math.max(5, Math.ceil((drivingKm / 25) * 60));
    return {
        distance: { text: `${drivingKm} km`, value: Math.round(drivingKm * 1000) },
        duration: { text: `${durationMin} mins`, value: durationMin * 60 }
    };
};

module.exports.getAddressCoordinate = async (address) => {

    // -- GOOGLE MAPS (requires billing) --
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         const location = response.data.results[0].geometry.location;
    //         return { ltd: location.lat, lng: location.lng };
    //     } else {
    //         throw new Error('Unable to fetch coordinates');
    //     }
    // } catch (error) {
    //     console.error(error);
    //     throw error;
    // }

    // -- NOMINATIM / OpenStreetMap (free, no billing) --
    try {
        const coords = await geocodeAddress(address);
        return {
            ltd: coords.lat,
            lng: coords.lon
        };
    } catch {
        return { ltd: 28.6139, lng: 77.2090 };
    }
}


// ---- GET DISTANCE & TIME ----

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // -- GOOGLE MAPS (requires billing) --
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') throw new Error('No routes found');
    //         return response.data.rows[0].elements[0];
    //     } else {
    //         throw new Error('Unable to fetch distance and time');
    //     }
    // } catch (err) {
    //     console.error(err);
    //     throw err;
    // }

    // -- NOMINATIM + OSRM (free, no billing) with Haversine & simulated fallback --
    try {
        const [originCoords, destCoords] = await Promise.all([
            geocodeAddress(origin),
            geocodeAddress(destination)
        ]);

        try {
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`;
            const osrmRes = await axios.get(osrmUrl, { timeout: 6000 });

            if (osrmRes.data.code === 'Ok' && osrmRes.data.routes && osrmRes.data.routes.length > 0) {
                const route = osrmRes.data.routes[0];
                const distanceKm = (route.distance / 1000).toFixed(1);
                const durationMin = Math.ceil(route.duration / 60);

                return {
                    distance: { text: `${distanceKm} km`, value: route.distance },
                    duration: { text: `${durationMin} mins`, value: route.duration }
                };
            }
        } catch {
            // OSRM failed, proceed to Haversine
        }

        // Fallback calculation using coordinates
        return calculateHaversineFallback(originCoords, destCoords, origin, destination);
    } catch {
        // If geocoding fails completely, use simulated distance formula
        return generateSimulatedDistanceTime(origin, destination);
    }
}


// ---- AUTOCOMPLETE SUGGESTIONS ----

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    // -- GOOGLE MAPS (requires billing) --
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    // try {
    //     const response = await axios.get(url);
    //     console.log('Places API status:', response.data.status);
    //     if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
    //         return (response.data.predictions || []).map(prediction => prediction.description).filter(value => value);
    //     } else {
    //         console.error('Google Places API error:', response.data.status, response.data.error_message);
    //         return [];
    //     }
    // } catch (err) {
    //     console.error(err);
    //     return [];
    // }

    // -- NOMINATIM / OpenStreetMap (free, no billing) --
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=5&addressdetails=1`;
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneApp/2.0' },
            timeout: 4000
        });
        if (response.data && response.data.length > 0) {
            return response.data.map(place => place.display_name).filter(Boolean);
        }
    } catch {
        // Continue to fallback
    }

    // Smart fallback suggestions so user is never blocked by Nominatim rate limiting
    const query = input.trim();
    return [
        `${query}, Main Road, New Delhi, Delhi, India`,
        `${query}, Sector 18, Noida, Uttar Pradesh, India`,
        `${query}, MG Road, Gurugram, Haryana, India`
    ];
}


// ---- CAPTAINS IN RADIUS ----

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius = 15) => {
    try {
        // Find all connected captains
        const allCaptains = await captainModel.find({
            socketId: { $exists: true, $ne: null }
        });

        if (!allCaptains || allCaptains.length === 0) {
            return [];
        }

        // Filter captains within radius (in km) using Haversine
        const captainsNear = allCaptains.filter(c => {
            if (!c.location || !c.location.ltd || !c.location.lng) return true; // Include captains who haven't updated GPS yet
            const dLat = ((c.location.ltd - ltd) * Math.PI) / 180;
            const dLng = ((c.location.lng - lng) * Math.PI) / 180;
            const a = Math.sin(dLat / 2) ** 2 + Math.cos((ltd * Math.PI) / 180) * Math.cos((c.location.ltd * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
            const dist = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return dist <= radius;
        });

        // If specific radius filter has matches, return them; otherwise broadcast to all online captains
        return captainsNear.length > 0 ? captainsNear : allCaptains;
    } catch (err) {
        console.error('Error finding captains in radius:', err);
        return await captainModel.find({ socketId: { $exists: true, $ne: null } });
    }
}