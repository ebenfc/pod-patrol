// 🟢 SAFE TO EDIT - Export utilities for sightings data

/**
 * Export sightings data to CSV format
 * @param {Array} sightings - Array of sighting objects
 * @param {string} filename - Name for the downloaded file
 */
export function exportToCSV(sightings, filename = 'whale_sightings.csv') {
  if (!sightings || sightings.length === 0) {
    console.warn('No sightings to export');
    return;
  }

  // Define columns to export
  const columns = [
    'dateString',
    'report_time',
    'species',
    'pod',
    'direction',
    'location_desc',
    'lat',
    'lon',
    'confidence',
    'notes',
    'sms_id'
  ];

  // Build CSV header
  const header = columns.join(',');

  // Build CSV rows
  const rows = sightings.map(sighting => {
    return columns.map(col => {
      const value = sighting[col];
      // Escape quotes and wrap in quotes if contains comma or quote
      if (typeof value === 'string') {
        const escaped = value.replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
          ? `"${escaped}"`
          : escaped;
      }
      return value ?? '';
    }).join(',');
  });

  // Combine header and rows
  const csvContent = [header, ...rows].join('\n');

  // Create and trigger download
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export sightings data to JSON format
 * @param {Array} sightings - Array of sighting objects
 * @param {string} filename - Name for the downloaded file
 */
export function exportToJSON(sightings, filename = 'whale_sightings.json') {
  if (!sightings || sightings.length === 0) {
    console.warn('No sightings to export');
    return;
  }

  // Select relevant fields for export
  const exportData = sightings.map(sighting => ({
    date: sighting.dateString,
    time: sighting.report_time,
    species: sighting.species,
    pod: sighting.pod,
    direction: sighting.direction,
    location: sighting.location_desc,
    coordinates: {
      lat: sighting.lat,
      lon: sighting.lon
    },
    confidence: sighting.confidence,
    notes: sighting.notes,
    isRecent: sighting.isRecent,
    sms_id: sighting.sms_id
  }));

  const jsonContent = JSON.stringify(exportData, null, 2);

  // Create and trigger download
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Export sightings data to GeoJSON format (for GIS applications)
 * @param {Array} sightings - Array of sighting objects
 * @param {string} filename - Name for the downloaded file
 */
export function exportToGeoJSON(sightings, filename = 'whale_sightings.geojson') {
  if (!sightings || sightings.length === 0) {
    console.warn('No sightings to export');
    return;
  }

  const geoJson = {
    type: 'FeatureCollection',
    features: sightings.map(sighting => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [sighting.lon, sighting.lat]
      },
      properties: {
        date: sighting.dateString,
        time: sighting.report_time,
        species: sighting.species,
        pod: sighting.pod,
        direction: sighting.direction,
        location: sighting.location_desc,
        confidence: sighting.confidence,
        notes: sighting.notes,
        isRecent: sighting.isRecent,
        sms_id: sighting.sms_id
      }
    }))
  };

  const jsonContent = JSON.stringify(geoJson, null, 2);

  // Create and trigger download
  downloadFile(jsonContent, filename, 'application/geo+json');
}

/**
 * Helper function to download a file
 * @throws {Error} If download fails
 */
function downloadFile(content, filename, mimeType) {
  try {
    const blob = new Blob([content], { type: mimeType });

    if (!blob.size) {
      throw new Error('Failed to create file content');
    }

    const url = URL.createObjectURL(blob);

    if (!document.body) {
      throw new Error('Document not ready');
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup safely
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export failed:', err);
    throw new Error(`Failed to export ${filename}: ${err.message}`);
  }
}
