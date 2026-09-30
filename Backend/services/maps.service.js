const axios = require('axios');
const captainModel = require('../models/captain.model');

// ============================================================
// Google Maps API code is commented out below.
// Reason: Google Maps APIs require billing to be enabled.
// We switched to free OpenStreetMap alternatives.
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


// ---- REVERSE GEOCODE (server-side only — avoids browser CORS & rate-limit issues) ----

module.exports.reverseGeocode = async (lat, lng) => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16&addressdetails=1`;
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneApp/2.0' },
            timeout: 5000,
        });
        if (response.data && response.data.display_name) {
            return response.data.display_name;
        }
    } catch (err) {
        console.error('[reverseGeocode error]', err.message);
    }
    // Fallback: return raw coordinates
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};


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

/**
 * Build a short readable label from Nominatim addressdetails.
 * Priority: name/road → suburb/neighbourhood → city/town/village → state → country
 */
const buildLabel = (place) => {
    const a = place.address || {};

    // Primary: the specific named place or road
    const primary =
        place.name ||
        a.amenity ||
        a.road ||
        a.pedestrian ||
        a.path ||
        a.footway ||
        null;

    // City-level: prefer city > town > village > county > district
    const city =
        a.city ||
        a.town ||
        a.village ||
        a.county ||
        a.district ||
        null;

    const state = a.state || null;

    // Sub-label: city + state (what user cares about most)
    const sublabelParts = [ city, state ].filter(Boolean);
    const sublabel = sublabelParts.join(', ') || a.country || '';

    // Full label: primary (if different from city), then city, state
    const labelParts = [];
    if (primary && primary !== city) labelParts.push(primary);
    if (city) labelParts.push(city);
    if (state && state !== city) labelParts.push(state);
    if (labelParts.length === 0) labelParts.push(place.display_name.split(',')[0]);

    return {
        label: labelParts.join(', '),
        sublabel,
        full: place.display_name, // used as the actual value sent to backend
        importance: parseFloat(place.importance || 0),
    };
};

/**
 * Sort suggestions: city/state matches first, then by Nominatim importance score.
 * User in Prayagraj typing "IIIT" → IIITA Prayagraj comes before IIIT Delhi.
 */
const sortByProximityRelevance = (results, input) => {
    const q = input.toLowerCase();
    return results.sort((a, b) => {
        // Boost results whose city/state contains the query token
        const aBoost = (a.label.toLowerCase().includes(q) ? 2 : 0) + a.importance;
        const bBoost = (b.label.toLowerCase().includes(q) ? 2 : 0) + b.importance;
        return bBoost - aBoost;
    });
};

module.exports.getAutoCompleteSuggestions = async (input, lat, lng) => {
    if (!input) {
        throw new Error('query is required');
    }

    // Build Nominatim URL with proximity bias when user location is available
    let url = `https://nominatim.openstreetmap.org/search`
        + `?q=${encodeURIComponent(input)}`
        + `&format=json`
        + `&limit=8`
        + `&addressdetails=1`
        + `&countrycodes=in`; // India-only results

    // If user's GPS coords are available, add a viewbox around them (~50 km radius)
    // This makes nearby places bubble up first
    if (lat && lng) {
        const delta = 0.5; // ~55 km bounding box
        url += `&viewbox=${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;
        url += `&bounded=0`; // prefer inside viewbox but don't restrict to it
    }

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneApp/2.0' },
            timeout: 5000,
        });

        if (response.data && response.data.length > 0) {
            const structured = response.data.map(buildLabel);
            const sorted = sortByProximityRelevance(structured, input);

            // Return structured objects: { label, sublabel, full }
            // Frontend uses label+sublabel for display, full as the actual address value
            return sorted.map(({ label, sublabel, full }) => ({ label, sublabel, full }));
        }
    } catch (err) {
        console.error('[Nominatim suggestions error]', err.message);
    }

    // Return empty — no fake hardcoded places
    return [];
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

        // Filter captains within radius (in km) using Haversine.
        // Captains with no GPS data are excluded from the radius filter —
        // they will only receive rides if nobody with a known position is nearby.
        const captainsWithGps = allCaptains.filter(c => c.location && c.location.ltd && c.location.lng);
        const captainsNear = captainsWithGps.filter(c => {
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