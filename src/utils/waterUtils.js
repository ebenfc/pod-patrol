// 🟢 SAFE TO EDIT - Water detection and coordinate snapping utilities

/**
 * Simplified Puget Sound water polygon
 * This covers the main waterways where whale sightings occur
 * Coordinates are [lon, lat] pairs forming the water boundary
 */
const PUGET_SOUND_WATER_POLYGON = {
  type: 'Polygon',
  coordinates: [[
    // Starting from the north (Strait of Juan de Fuca entrance)
    [-123.5, 48.4],
    [-123.2, 48.5],
    [-122.8, 48.55],
    [-122.5, 48.5],
    // San Juan Islands area
    [-122.4, 48.6],
    [-122.3, 48.7],
    [-122.5, 48.75],
    [-122.7, 48.7],
    [-122.9, 48.6],
    [-123.1, 48.5],
    // Back down through Rosario Strait
    [-122.6, 48.45],
    [-122.45, 48.35],
    // Whidbey Island west side
    [-122.65, 48.3],
    [-122.7, 48.1],
    [-122.75, 47.95],
    // Admiralty Inlet
    [-122.7, 47.85],
    [-122.65, 47.7],
    // Hood Canal entrance
    [-122.75, 47.8],
    [-122.85, 47.7],
    [-122.95, 47.6],
    [-123.0, 47.5],
    [-123.1, 47.35],
    [-123.0, 47.3],
    // Back to main sound
    [-122.85, 47.4],
    [-122.7, 47.5],
    // Kitsap Peninsula east side
    [-122.55, 47.7],
    [-122.5, 47.8],
    [-122.45, 47.9],
    // Possession Sound
    [-122.35, 48.0],
    [-122.25, 48.1],
    [-122.3, 48.2],
    [-122.4, 48.25],
    // Saratoga Passage
    [-122.5, 48.15],
    [-122.55, 48.0],
    // Back down east side
    [-122.4, 47.9],
    [-122.35, 47.8],
    [-122.3, 47.7],
    // Elliott Bay / Seattle waterfront
    [-122.35, 47.65],
    [-122.38, 47.6],
    // East Passage
    [-122.35, 47.55],
    [-122.38, 47.5],
    [-122.4, 47.45],
    // Tacoma / Commencement Bay
    [-122.35, 47.3],
    [-122.4, 47.25],
    [-122.45, 47.2],
    // Tacoma Narrows
    [-122.55, 47.25],
    [-122.6, 47.3],
    // Carr Inlet / Henderson Bay
    [-122.65, 47.35],
    [-122.7, 47.4],
    [-122.65, 47.3],
    [-122.55, 47.2],
    // South Sound
    [-122.65, 47.15],
    [-122.8, 47.1],
    [-122.9, 47.15],
    // Close the polygon back to start via west side
    [-123.0, 47.2],
    [-123.1, 47.4],
    [-123.2, 47.6],
    [-123.3, 47.8],
    [-123.4, 48.0],
    [-123.5, 48.2],
    [-123.5, 48.4]
  ]]
};

/**
 * Additional water areas (bays, inlets, passages)
 * These are separate polygons for areas that might be missed by the main polygon
 */
const ADDITIONAL_WATER_AREAS = [
  // Commencement Bay (Tacoma)
  {
    type: 'Polygon',
    coordinates: [[
      [-122.45, 47.28],
      [-122.4, 47.3],
      [-122.38, 47.27],
      [-122.4, 47.24],
      [-122.45, 47.25],
      [-122.45, 47.28]
    ]]
  },
  // Elliott Bay (Seattle)
  {
    type: 'Polygon',
    coordinates: [[
      [-122.42, 47.63],
      [-122.35, 47.62],
      [-122.33, 47.58],
      [-122.38, 47.58],
      [-122.42, 47.6],
      [-122.42, 47.63]
    ]]
  },
  // Rich Passage / Sinclair Inlet
  {
    type: 'Polygon',
    coordinates: [[
      [-122.55, 47.56],
      [-122.5, 47.54],
      [-122.52, 47.5],
      [-122.58, 47.52],
      [-122.55, 47.56]
    ]]
  }
];

/**
 * Check if a point is inside a polygon using ray casting algorithm
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Array} polygon - Array of [lon, lat] coordinate pairs
 * @returns {boolean}
 */
function pointInPolygon(lat, lon, polygon) {
  const coords = polygon.coordinates[0];
  let inside = false;

  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const xi = coords[i][0], yi = coords[i][1];
    const xj = coords[j][0], yj = coords[j][1];

    if (((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Check if coordinates are in water (Puget Sound region)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {boolean}
 */
export function isInWater(lat, lon) {
  // Check main Puget Sound polygon
  if (pointInPolygon(lat, lon, PUGET_SOUND_WATER_POLYGON)) {
    return true;
  }

  // Check additional water areas
  for (const area of ADDITIONAL_WATER_AREAS) {
    if (pointInPolygon(lat, lon, area)) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the nearest point on a polygon edge to a given point
 * @param {number} lat - Point latitude
 * @param {number} lon - Point longitude
 * @param {Array} coords - Polygon coordinates
 * @returns {{lat: number, lon: number, distance: number}}
 */
function nearestPointOnPolygon(lat, lon, coords) {
  let minDist = Infinity;
  let nearestPoint = { lat, lon };

  for (let i = 0; i < coords.length - 1; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[i + 1];

    // Find nearest point on line segment
    const nearest = nearestPointOnSegment(lon, lat, x1, y1, x2, y2);
    const dist = haversineDistance(lat, lon, nearest.lat, nearest.lon);

    if (dist < minDist) {
      minDist = dist;
      nearestPoint = nearest;
    }
  }

  return { ...nearestPoint, distance: minDist };
}

/**
 * Find the nearest point on a line segment
 */
function nearestPointOnSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return { lon: x1, lat: y1 };
  }

  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));

  return {
    lon: x1 + t * dx,
    lat: y1 + t * dy
  };
}

/**
 * Snap coordinates to the nearest water location if they're on land
 * @param {number} lat - Original latitude
 * @param {number} lon - Original longitude
 * @param {number} maxSnapDistance - Maximum distance to snap (km), default 5km
 * @returns {{lat: number, lon: number, wasSnapped: boolean, snapDistance: number}}
 */
export function snapToWater(lat, lon, maxSnapDistance = 5) {
  // If already in water, return original coordinates
  if (isInWater(lat, lon)) {
    return { lat, lon, wasSnapped: false, snapDistance: 0 };
  }

  // Find nearest point on water polygon
  const mainPolygonNearest = nearestPointOnPolygon(lat, lon, PUGET_SOUND_WATER_POLYGON.coordinates[0]);
  let bestNearest = mainPolygonNearest;

  // Check additional water areas
  for (const area of ADDITIONAL_WATER_AREAS) {
    const nearest = nearestPointOnPolygon(lat, lon, area.coordinates[0]);
    if (nearest.distance < bestNearest.distance) {
      bestNearest = nearest;
    }
  }

  // Only snap if within maximum distance
  if (bestNearest.distance <= maxSnapDistance) {
    // Move point slightly into the water (offset from edge)
    const offsetFactor = 0.001; // Small offset to ensure point is in water
    const dx = bestNearest.lon - lon;
    const dy = bestNearest.lat - lat;
    const magnitude = Math.sqrt(dx * dx + dy * dy);

    if (magnitude > 0) {
      const offsetLon = bestNearest.lon + (dx / magnitude) * offsetFactor;
      const offsetLat = bestNearest.lat + (dy / magnitude) * offsetFactor;

      return {
        lat: offsetLat,
        lon: offsetLon,
        wasSnapped: true,
        snapDistance: bestNearest.distance
      };
    }

    return {
      lat: bestNearest.lat,
      lon: bestNearest.lon,
      wasSnapped: true,
      snapDistance: bestNearest.distance
    };
  }

  // Too far from water, return original (likely bad data)
  return { lat, lon, wasSnapped: false, snapDistance: bestNearest.distance };
}

/**
 * Pre-defined water points for common locations
 * These are known good water coordinates for frequently mentioned locations
 * Expanded based on Orca Network SMS patterns and Puget Sound geography
 */
const KNOWN_WATER_LOCATIONS = {
  // Major waterways
  'Elliott Bay': { lat: 47.605, lon: -122.38 },
  'Puget Sound': { lat: 47.5, lon: -122.45 },
  'Admiralty Inlet': { lat: 48.0, lon: -122.65 },
  'Hood Canal': { lat: 47.7, lon: -122.85 },
  'Possession Sound': { lat: 48.0, lon: -122.35 },
  'Saratoga Passage': { lat: 48.15, lon: -122.5 },
  'Rosario Strait': { lat: 48.45, lon: -122.75 },
  'Haro Strait': { lat: 48.5, lon: -123.15 },
  'Strait of Juan de Fuca': { lat: 48.3, lon: -123.5 },

  // Passages and channels
  'Colvos Passage': { lat: 47.45, lon: -122.48 },
  'Dalco Passage': { lat: 47.34, lon: -122.47 },
  'Rich Passage': { lat: 47.55, lon: -122.52 },
  'Agate Passage': { lat: 47.72, lon: -122.57 },
  'Tacoma Narrows': { lat: 47.27, lon: -122.55 },
  'East Passage': { lat: 47.45, lon: -122.4 },
  'Deception Pass': { lat: 48.41, lon: -122.65 },

  // Bays and inlets
  'Commencement Bay': { lat: 47.27, lon: -122.42 },
  'Carr Inlet': { lat: 47.32, lon: -122.58 },
  'Henderson Bay': { lat: 47.35, lon: -122.58 },
  'Case Inlet': { lat: 47.28, lon: -122.82 },
  'Sinclair Inlet': { lat: 47.55, lon: -122.63 },
  'Dyes Inlet': { lat: 47.62, lon: -122.68 },
  'Liberty Bay': { lat: 47.73, lon: -122.62 },
  'Eagle Harbor': { lat: 47.62, lon: -122.52 },
  'Quartermaster Harbor': { lat: 47.38, lon: -122.46 },
  'Budd Inlet': { lat: 47.07, lon: -122.9 },

  // Ferry routes (midpoints)
  'Edmonds Kingston': { lat: 47.81, lon: -122.45 },
  'Mukilteo Clinton': { lat: 47.95, lon: -122.35 },
  'Seattle Bainbridge': { lat: 47.62, lon: -122.42 },
  'Seattle Bremerton': { lat: 47.58, lon: -122.5 },
  'Fauntleroy Vashon': { lat: 47.52, lon: -122.42 },
  'Southworth Fauntleroy': { lat: 47.52, lon: -122.47 },
  'Point Defiance Tahlequah': { lat: 47.32, lon: -122.5 },
  'Anacortes': { lat: 48.5, lon: -122.68 },

  // Points and landmarks (offshore)
  'Point Robinson': { lat: 47.39, lon: -122.37 },
  'Point No Point': { lat: 47.91, lon: -122.53 },
  'Alki Point': { lat: 47.58, lon: -122.42 },
  'West Point': { lat: 47.66, lon: -122.44 },
  'Jefferson Head': { lat: 47.75, lon: -122.42 },
  'Meadow Point': { lat: 47.7, lon: -122.4 },
  'Three Tree Point': { lat: 47.45, lon: -122.38 },
  'Restoration Point': { lat: 47.56, lon: -122.52 },
  'Foulweather Bluff': { lat: 47.93, lon: -122.6 },
  'Double Bluff': { lat: 47.97, lon: -122.52 },
  'Marrowstone Point': { lat: 48.1, lon: -122.69 },
  'Bush Point': { lat: 48.03, lon: -122.6 },
  'Lagoon Point': { lat: 48.06, lon: -122.53 },
  'Possession Point': { lat: 47.9, lon: -122.38 },

  // Whale watching spots
  'Lime Kiln': { lat: 48.52, lon: -123.15 },
  'San Juan Channel': { lat: 48.53, lon: -123.0 },
  'Active Pass': { lat: 48.87, lon: -123.3 },
  'Boundary Pass': { lat: 48.75, lon: -123.1 },

  // Islands (offshore points)
  'Vashon Island': { lat: 47.42, lon: -122.47 },
  'Bainbridge Island': { lat: 47.65, lon: -122.55 },
  'Blake Island': { lat: 47.54, lon: -122.49 },
  'Hat Island': { lat: 48.02, lon: -122.33 },
  'Whidbey Island': { lat: 48.1, lon: -122.6 },
  'Camano Island': { lat: 48.18, lon: -122.45 },
  'Fox Island': { lat: 47.25, lon: -122.62 },
  'Anderson Island': { lat: 47.17, lon: -122.7 },
  'McNeil Island': { lat: 47.22, lon: -122.68 },

  // Common reference points from SMS
  'Golden Gardens': { lat: 47.69, lon: -122.41 },
  'Carkeek Park': { lat: 47.71, lon: -122.38 },
  'Discovery Park': { lat: 47.66, lon: -122.42 },
  'Shilshole': { lat: 47.68, lon: -122.41 },
  'Mukilteo': { lat: 47.95, lon: -122.31 },
  'Edmonds': { lat: 47.81, lon: -122.39 },
  'Kingston': { lat: 47.8, lon: -122.5 },
  'Manchester': { lat: 47.57, lon: -122.55 },
  'Southworth': { lat: 47.51, lon: -122.5 },
  'Harper': { lat: 47.52, lon: -122.52 },
  'Olalla': { lat: 47.43, lon: -122.5 },
  'Gig Harbor': { lat: 47.33, lon: -122.58 },
  'Tacoma': { lat: 47.26, lon: -122.44 },
  'Olympia': { lat: 47.05, lon: -122.88 }
};

/**
 * Get water coordinates for a known location name
 * @param {string} locationDesc - Location description
 * @returns {{lat: number, lon: number} | null}
 */
export function getKnownWaterLocation(locationDesc) {
  if (!locationDesc) return null;

  const lowerDesc = locationDesc.toLowerCase();

  for (const [name, coords] of Object.entries(KNOWN_WATER_LOCATIONS)) {
    if (lowerDesc.includes(name.toLowerCase())) {
      return coords;
    }
  }

  return null;
}

/**
 * Process coordinates with water validation and snapping
 * @param {number} lat - Original latitude
 * @param {number} lon - Original longitude
 * @param {string} locationDesc - Location description (for fallback)
 * @param {string} locationMethod - How the coordinates were determined
 * @returns {{lat: number, lon: number, wasAdjusted: boolean, adjustmentType: string}}
 */
export function processCoordinates(lat, lon, locationDesc = '', locationMethod = '') {
  // First check if already in water
  if (isInWater(lat, lon)) {
    return { lat, lon, wasAdjusted: false, adjustmentType: 'none' };
  }

  // Try to snap to nearest water
  const snapped = snapToWater(lat, lon, 3); // 3km max snap distance

  if (snapped.wasSnapped) {
    return {
      lat: snapped.lat,
      lon: snapped.lon,
      wasAdjusted: true,
      adjustmentType: 'snapped',
      snapDistance: snapped.snapDistance
    };
  }

  // If snap failed (too far), try known location fallback
  const knownLocation = getKnownWaterLocation(locationDesc);
  if (knownLocation) {
    return {
      lat: knownLocation.lat,
      lon: knownLocation.lon,
      wasAdjusted: true,
      adjustmentType: 'known_location'
    };
  }

  // Last resort: return original but flag it
  return {
    lat,
    lon,
    wasAdjusted: false,
    adjustmentType: 'unresolved'
  };
}
