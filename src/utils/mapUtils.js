import { SPECIES_CONFIG } from './constants';

// 🟡 EDIT CAREFULLY - Map helper functions

/**
 * Convert sightings array to GeoJSON format for Mapbox
 */
export function sightingsToGeoJSON(sightings, isDark = false) {
  return {
    type: 'FeatureCollection',
    features: sightings.map(sighting => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [sighting.lon, sighting.lat]
      },
      properties: {
        ...sighting,
        color: getSpeciesColor(sighting.species, isDark),
        radius: getMarkerRadius(sighting.confidence)
      }
    }))
  };
}

/**
 * Get color for a species (with dark mode support)
 */
export function getSpeciesColor(species, isDark = false) {
  const config = SPECIES_CONFIG[species] || SPECIES_CONFIG['Unknown'];
  return isDark ? config.darkColor : config.color;
}

/**
 * Get marker radius based on confidence level
 */
export function getMarkerRadius(confidence) {
  // confidence is 0-1, we want radius between 4-12
  const minRadius = 4;
  const maxRadius = 12;
  return minRadius + (confidence * (maxRadius - minRadius));
}

/**
 * Fit map bounds to show all sightings
 */
export function getBounds(sightings) {
  if (!sightings || sightings.length === 0) {
    return null;
  }
  
  const lons = sightings.map(s => s.lon);
  const lats = sightings.map(s => s.lat);
  
  return [
    [Math.min(...lons), Math.min(...lats)], // Southwest
    [Math.max(...lons), Math.max(...lats)]  // Northeast
  ];
}

/**
 * Format popup content for a sighting
 */
export function formatPopupContent(sighting) {
  const icon = SPECIES_CONFIG[sighting.species]?.icon || '🐋';
  
  return `
    <div class="popup-content">
      <div class="popup-header">
        <span class="popup-icon">${icon}</span>
        <strong>${sighting.species}</strong>
      </div>
      ${sighting.pod !== 'Unknown' ? `<div class="popup-pod">Pod: ${sighting.pod}</div>` : ''}
      <div class="popup-date">${sighting.dateString}${sighting.report_time ? ' ' + sighting.report_time : ''}</div>
      ${sighting.direction !== 'unknown' ? `<div class="popup-direction">Direction: ${sighting.direction}</div>` : ''}
      ${sighting.location_desc ? `<div class="popup-location">${sighting.location_desc}</div>` : ''}
      ${sighting.isRecent ? '<div class="popup-badge">🔥 Recent</div>' : ''}
    </div>
  `;
}

/**
 * Create hexbin layer configuration
 */
export function createHexbinLayer(data, isDark = false) {
  return {
    id: 'hexbin',
    type: 'hexagon',
    data,
    pickable: true,
    wireframe: false,
    filled: true,
    extruded: false,
    radius: 1000,
    elevationScale: 0,
    getPosition: d => [d.lon, d.lat],
    colorRange: isDark ? [
      [30, 58, 138],    // Dark ocean blues
      [29, 78, 216],
      [59, 130, 246],
      [96, 165, 250],
      [147, 197, 253],
      [224, 242, 254]
    ] : [
      [224, 242, 254],   // Light ocean blues
      [186, 230, 253],
      [125, 211, 252],
      [56, 189, 248],
      [14, 165, 233],
      [2, 132, 199]
    ]
  };
}

/**
 * Fly to a specific location
 */
export function flyToLocation(mapRef, lat, lon, zoom = 12) {
  if (!mapRef.current) return;
  
  mapRef.current.flyTo({
    center: [lon, lat],
    zoom: zoom,
    duration: 2000,
    essential: true
  });
}
