import Papa from 'papaparse';
import { isWithinInterval, subHours, parseISO } from 'date-fns';
import { isInWater, processCoordinates } from './waterUtils';

// 🟡 EDIT CAREFULLY - This handles your data loading

/**
 * Load and parse whale sightings CSV from Dropbox
 * Automatically snaps land-based coordinates to nearest water
 * @param {string} url - Dropbox public URL (must end with ?dl=1)
 * @returns {Promise<Array>} - Array of parsed sighting objects
 */
export async function loadWhaleData(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }

        // Process and clean the data with water snapping
        const allData = results.data
          .filter(row => row.lat && row.lon) // Only keep rows with valid coordinates
          .map(processSighting);

        // Count adjustments for logging
        const stats = {
          total: allData.length,
          snapped: allData.filter(s => s.coordinateAdjustment === 'snapped').length,
          knownLocation: allData.filter(s => s.coordinateAdjustment === 'known_location').length,
          unresolved: allData.filter(s => s.coordinateAdjustment === 'unresolved').length,
          inWater: allData.filter(s => s.coordinateAdjustment === 'none').length
        };

        console.log(`Loaded ${stats.total} sightings:`);
        console.log(`  - ${stats.inWater} already in water`);
        console.log(`  - ${stats.snapped} snapped to nearest water`);
        console.log(`  - ${stats.knownLocation} matched to known locations`);
        if (stats.unresolved > 0) {
          console.log(`  - ${stats.unresolved} could not be resolved (too far from water)`);
        }

        // Filter out completely unresolvable points (too far from any water)
        const validData = allData.filter(s => s.coordinateAdjustment !== 'unresolved');

        resolve(validData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Process a single sighting row
 * Adds computed fields, cleans data, and snaps coordinates to water
 */
function processSighting(row) {
  // Parse the date
  let parsedDate;
  try {
    // Handle both "M/D/YYYY" and ISO date formats
    if (row.ingest_timestamp.includes('/')) {
      const [month, day, year] = row.ingest_timestamp.split('/');
      parsedDate = new Date(year, month - 1, day);
    } else {
      parsedDate = parseISO(row.ingest_timestamp);
    }
  } catch (e) {
    parsedDate = new Date(row.ingest_timestamp);
  }

  // Get original coordinates
  const originalLat = parseFloat(row.lat);
  const originalLon = parseFloat(row.lon);

  // Process coordinates - snap to water if needed
  const processed = processCoordinates(
    originalLat,
    originalLon,
    row.location_desc || '',
    row.location_method || ''
  );

  return {
    ...row,
    // Standardize fields
    species: row.species || 'Unknown',
    pod: row.pod || 'Unknown',
    direction: row.direction || 'unknown',

    // Add computed fields
    date: parsedDate,
    dateString: parsedDate.toLocaleDateString(),
    isRecent: isRecentSighting(parsedDate),

    // Use processed (potentially snapped) coordinates
    lat: processed.lat,
    lon: processed.lon,

    // Track original coordinates and adjustment
    originalLat,
    originalLon,
    wasCoordinateAdjusted: processed.wasAdjusted,
    coordinateAdjustment: processed.adjustmentType,
    snapDistance: processed.snapDistance,

    // Confidence as number (0-1)
    // Reduce confidence slightly if coordinates were adjusted
    confidence: processed.wasAdjusted
      ? Math.min(parseFloat(row.confidence) || 0.8, 0.7)
      : parseFloat(row.confidence) || 0.8,

    // Parse sighting_index
    sighting_index: parseInt(row.sighting_index) || 1
  };
}

/**
 * Check if a sighting is recent (within last 48 hours)
 */
function isRecentSighting(date, hoursAgo = 48) {
  const now = new Date();
  const cutoff = subHours(now, hoursAgo);

  try {
    return isWithinInterval(date, { start: cutoff, end: now });
  } catch (e) {
    return false;
  }
}

/**
 * Filter sightings by criteria
 */
export function filterSightings(sightings, filters) {
  return sightings.filter(sighting => {
    // Species filter
    if (filters.species.length > 0 && !filters.species.includes(sighting.species)) {
      return false;
    }

    // Pod filter
    if (filters.pods.length > 0 && !filters.pods.includes(sighting.pod)) {
      return false;
    }

    // Direction filter
    if (filters.directions.length > 0 && !filters.directions.includes(sighting.direction)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const sightingDate = sighting.date;
      if (filters.dateRange.start && sightingDate < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && sightingDate > filters.dateRange.end) {
        return false;
      }
    }

    // Recent only filter
    if (filters.recentOnly && !sighting.isRecent) {
      return false;
    }

    return true;
  });
}

/**
 * Get unique values for a field (for filter options)
 */
export function getUniqueValues(sightings, field) {
  const values = new Set();
  sightings.forEach(s => {
    if (s[field]) values.add(s[field]);
  });
  return Array.from(values).sort();
}

/**
 * Calculate statistics from sightings
 */
export function calculateStats(sightings) {
  const speciesCount = {};
  const podCount = {};
  let recentCount = 0;
  let adjustedCount = 0;

  sightings.forEach(s => {
    // Count by species
    speciesCount[s.species] = (speciesCount[s.species] || 0) + 1;

    // Count by pod
    podCount[s.pod] = (podCount[s.pod] || 0) + 1;

    // Count recent
    if (s.isRecent) recentCount++;

    // Count adjusted coordinates
    if (s.wasCoordinateAdjusted) adjustedCount++;
  });

  // Find most active pod
  const mostActivePod = Object.entries(podCount)
    .sort((a, b) => b[1] - a[1])[0];

  return {
    total: sightings.length,
    recent: recentCount,
    adjusted: adjustedCount,
    speciesBreakdown: speciesCount,
    podBreakdown: podCount,
    mostActivePod: mostActivePod ? mostActivePod[0] : 'Unknown'
  };
}
