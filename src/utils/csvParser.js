import Papa from 'papaparse';
import { isWithinInterval, subHours, parseISO } from 'date-fns';

// 🟡 EDIT CAREFULLY - This handles your data loading

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
        const cleanedData = results.data
          .filter(row => row.lat && row.lon) // Only keep rows with valid coordinates
          .map(processSighting);
        
        resolve(cleanedData);
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
