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

  // Track mounted state to prevent state updates after unmount
  const isMountedRef = useRef(true);
  // Use ref for retry count to avoid dependency issues
  const retryCountRef = useRef(0);

  const fetchData = useCallback(async (isRetry = false) => {
    // Reset retry count on fresh fetch
    if (!isRetry) {
      retryCountRef.current = 0;
      setRetryCount(0);
    }

    try {
      setLoading(true);
      setError(null);

      const sightings = await loadWhaleData(dataUrl);

      // Only update state if still mounted
      if (isMountedRef.current) {
        setData(sightings);
        setLastUpdated(new Date());
        setLoading(false);
        setRetryCount(0);
        retryCountRef.current = 0;
        console.log(`Loaded ${sightings.length} whale sightings`);
      }
    } catch (err) {
      // Don't process errors if unmounted
      if (!isMountedRef.current) return;

      console.error('Error loading whale data:', err);

      // Check if we should retry using ref (not state)
      const currentRetry = retryCountRef.current;
      if (currentRetry < MAX_RETRIES) {
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, currentRetry);
        console.log(`Retrying in ${backoffMs}ms (attempt ${currentRetry + 1}/${MAX_RETRIES})`);

        retryCountRef.current = currentRetry + 1;
        setRetryCount(currentRetry + 1);
        setError(`Connection failed. Retrying... (${currentRetry + 1}/${MAX_RETRIES})`);

        await sleep(backoffMs);

        // Only retry if still mounted
        if (isMountedRef.current) {
          return fetchData(true);
        }
      } else {
        // Max retries exceeded
        setError(err.message || 'Failed to load data after multiple attempts');
        setLoading(false);
      }
    }
  }, [dataUrl]); // Only dataUrl dependency, retry tracked via ref

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh (if enabled)
  useEffect(() => {
    if (autoRefreshMs > 0) {
      const interval = setInterval(() => {
        fetchData(false);
      }, autoRefreshMs);
      return () => clearInterval(interval);
    }
  }, [autoRefreshMs, fetchData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
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
