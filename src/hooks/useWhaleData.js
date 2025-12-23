import { useState, useEffect } from 'react';
import { loadWhaleData } from '../utils/csvParser';

// 🟢 SAFE TO EDIT - Data loading hook

/**
 * Custom hook to load whale sighting data from Dropbox
 * Handles loading states, errors, and optional auto-refresh
 */
export function useWhaleData(dataUrl, autoRefreshMs = 0) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sightings = await loadWhaleData(dataUrl);
      
      setData(sightings);
      setLastUpdated(new Date());
      setLoading(false);
      
      console.log(`Loaded ${sightings.length} whale sightings`);
    } catch (err) {
      console.error('Error loading whale data:', err);
      setError(err.message || 'Failed to load data');
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, [dataUrl]);

  // Auto-refresh (if enabled)
  useEffect(() => {
    if (autoRefreshMs > 0) {
      const interval = setInterval(fetchData, autoRefreshMs);
      return () => clearInterval(interval);
    }
  }, [autoRefreshMs, dataUrl]);

  // Manual refresh function
  const refresh = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
}
