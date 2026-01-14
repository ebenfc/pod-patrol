import { useState, useEffect, useCallback, useRef } from 'react';
import { loadWhaleData } from '../utils/csvParser';

// 🟢 SAFE TO EDIT - Data loading hook

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

/**
 * Sleep for a given number of milliseconds
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Custom hook to load whale sighting data from Dropbox
 * Handles loading states, errors, retry with exponential backoff, and optional auto-refresh
 */
export function useWhaleData(dataUrl, autoRefreshMs = 0) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (isRetry = false) => {
    // Reset retry count on fresh fetch
    if (!isRetry) {
      setRetryCount(0);
    }

    try {
      setLoading(true);
      setError(null);

      const sightings = await loadWhaleData(dataUrl);

      setData(sightings);
      setLastUpdated(new Date());
      setLoading(false);
      setRetryCount(0);

      console.log(`Loaded ${sightings.length} whale sightings`);
    } catch (err) {
      console.error('Error loading whale data:', err);

      // Check if we should retry
      const currentRetry = isRetry ? retryCount : 0;
      if (currentRetry < MAX_RETRIES) {
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, currentRetry);
        console.log(`Retrying in ${backoffMs}ms (attempt ${currentRetry + 1}/${MAX_RETRIES})`);

        setRetryCount(currentRetry + 1);
        setError(`Connection failed. Retrying... (${currentRetry + 1}/${MAX_RETRIES})`);

        await sleep(backoffMs);

        // Retry the fetch
        return fetchData(true);
      }

      // Max retries exceeded
      setError(err.message || 'Failed to load data after multiple attempts');
      setLoading(false);
    }
  }, [dataUrl, retryCount]);

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
  const refresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    retryCount
  };
}
