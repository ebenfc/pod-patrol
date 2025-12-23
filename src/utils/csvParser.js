import Papa from 'papaparse';
import { isWithinInterval, subHours, parseISO } from 'date-fns';

// 🟡 EDIT CAREFULLY - This handles your data loading

/**
 * Check if coordinates are likely on land (basic validation)
 */
function isLikelyOnLand(lat, lon) {
  // Define rough land boundaries for Puget Sound region
  // These are conservative - they'll catch obvious land points
  
  // Bremerton/Kitsap core (clearly inland)
  if (lat > 47.52 && lat < 47.62 && lon > -122.70 && lon < -122.60) {
    return true;
  }
  
  // Seattle core (clearly inland)
  if (lat > 47.58 && lat < 47.68 && lon > -122.36 && lon < -122.28) {
    return true;
  }
  
  // Vashon Island core (clearly inland)
  if (lat > 47.40 && lat < 47.47 && lon > -122.47 && lon < -122.43) {
    return true;
  }
  
  // Olympic Peninsula interior (way too far west)
  if (lon < -123.3) {
    return true;
  }
  
  // Too far north (Canadian mainland)
  if (lat > 49.0) {
    return true;
  }
  
  // Too far south (past Olympia)
  if (lat < 47.0) {
    return true;
  }
  
  return false;
}

/**
 * Load and parse whale sightings CSV from Dropbox
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
        
        // Process and clean the data
        const allData = results.data
          .filter(row => row.lat && row.lon) // Only keep rows with valid coordinates
          .map(processSighting);
        
        // Filter out obvious land-based sightings
        const waterData = allData.filter(s => !isLikelyOnLand(s.lat, s.lon));
        
        const filtered = allData.length - waterData.length;
        if (filtered > 0) {
          console.log(`Filtered ${filtered} likely land-based sightings (${waterData.length} water sightings remain)`);
        }
        
        resolve(waterData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Process a single sighting row
 * Adds computed fields and cleans data
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
    
    // Ensure numeric coordinates
    lat: parseFloat(row.lat),
    lon: parseFloat(row.lon),
    
    // Confidence as number (0-1)
    confidence: parseFloat(row.confidence) || 0.8,
    
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
  
  sightings.forEach(s => {
    // Count by species
    speciesCount[s.species] = (speciesCount[s.species] || 0) + 1;
    
    // Count by pod
    podCount[s.pod] = (podCount[s.pod] || 0) + 1;
    
    // Count recent
    if (s.isRecent) recentCount++;
  });
  
  // Find most active pod
  const mostActivePod = Object.entries(podCount)
    .sort((a, b) => b[1] - a[1])[0];
  
  return {
    total: sightings.length,
    recent: recentCount,
    speciesBreakdown: speciesCount,
    podBreakdown: podCount,
    mostActivePod: mostActivePod ? mostActivePod[0] : 'Unknown'
  };
}
