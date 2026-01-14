import { useEffect, useCallback } from 'react';

// 🟢 SAFE TO EDIT - URL state synchronization hook

/**
 * Custom hook to sync filter state with URL parameters
 * Enables shareable filtered views
 */
export function useUrlState({
  selectedSpecies,
  selectedPods,
  selectedDirections,
  recentOnly,
  dateRange,
  setFiltersFromUrl
}) {
  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlFilters = {
      species: params.get('species')?.split(',').filter(Boolean) || [],
      pods: params.get('pods')?.split(',').filter(Boolean) || [],
      directions: params.get('directions')?.split(',').filter(Boolean) || [],
      recentOnly: params.get('recent') === 'true',
      dateRange: null
    };

    // Parse date range if present
    const startDate = params.get('start');
    const endDate = params.get('end');
    if (startDate || endDate) {
      urlFilters.dateRange = {
        start: startDate ? new Date(startDate) : null,
        end: endDate ? new Date(endDate) : null
      };
    }

    // Only set if there are actual filters in URL
    if (urlFilters.species.length > 0 ||
        urlFilters.pods.length > 0 ||
        urlFilters.directions.length > 0 ||
        urlFilters.recentOnly ||
        urlFilters.dateRange) {
      setFiltersFromUrl?.(urlFilters);
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedSpecies.length > 0) {
      params.set('species', selectedSpecies.join(','));
    }
    if (selectedPods.length > 0) {
      params.set('pods', selectedPods.join(','));
    }
    if (selectedDirections.length > 0) {
      params.set('directions', selectedDirections.join(','));
    }
    if (recentOnly) {
      params.set('recent', 'true');
    }
    if (dateRange?.start) {
      params.set('start', dateRange.start.toISOString().split('T')[0]);
    }
    if (dateRange?.end) {
      params.set('end', dateRange.end.toISOString().split('T')[0]);
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }, [selectedSpecies, selectedPods, selectedDirections, recentOnly, dateRange]);

  // Generate shareable URL
  const getShareableUrl = useCallback(() => {
    return window.location.href;
  }, []);

  // Copy URL to clipboard
  const copyUrlToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      return true;
    } catch (err) {
      console.error('Failed to copy URL:', err);
      return false;
    }
  }, []);

  return {
    getShareableUrl,
    copyUrlToClipboard
  };
}
