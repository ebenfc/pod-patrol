import { useState, useMemo } from 'react';
import { filterSightings } from '../utils/csvParser';

// 🟢 SAFE TO EDIT - Filter management hook

/**
 * Custom hook to manage filter state and apply filters to sightings
 */
export function useFilters(sightings) {
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedPods, setSelectedPods] = useState([]);
  const [selectedDirections, setSelectedDirections] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [recentOnly, setRecentOnly] = useState(false);

  // Apply all filters to the sightings
  const filteredSightings = useMemo(() => {
    return filterSightings(sightings, {
      species: selectedSpecies,
      pods: selectedPods,
      directions: selectedDirections,
      dateRange,
      recentOnly
    });
  }, [sightings, selectedSpecies, selectedPods, selectedDirections, dateRange, recentOnly]);

  // Toggle a species filter
  const toggleSpecies = (species) => {
    setSelectedSpecies(prev => 
      prev.includes(species)
        ? prev.filter(s => s !== species)
        : [...prev, species]
    );
  };

  // Toggle a pod filter
  const togglePod = (pod) => {
    setSelectedPods(prev =>
      prev.includes(pod)
        ? prev.filter(p => p !== pod)
        : [...prev, pod]
    );
  };

  // Toggle a direction filter
  const toggleDirection = (direction) => {
    setSelectedDirections(prev =>
      prev.includes(direction)
        ? prev.filter(d => d !== direction)
        : [...prev, direction]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedSpecies([]);
    setSelectedPods([]);
    setSelectedDirections([]);
    setDateRange(null);
    setRecentOnly(false);
  };

  // Set filters from URL parameters
  const setFiltersFromUrl = (urlFilters) => {
    if (urlFilters.species?.length > 0) {
      setSelectedSpecies(urlFilters.species);
    }
    if (urlFilters.pods?.length > 0) {
      setSelectedPods(urlFilters.pods);
    }
    if (urlFilters.directions?.length > 0) {
      setSelectedDirections(urlFilters.directions);
    }
    if (urlFilters.recentOnly) {
      setRecentOnly(urlFilters.recentOnly);
    }
    if (urlFilters.dateRange) {
      setDateRange(urlFilters.dateRange);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = selectedSpecies.length > 0 || 
                          selectedPods.length > 0 || 
                          selectedDirections.length > 0 || 
                          dateRange !== null ||
                          recentOnly;

  return {
    // State
    selectedSpecies,
    selectedPods,
    selectedDirections,
    dateRange,
    recentOnly,
    
    // Filtered data
    filteredSightings,
    
    // Actions
    toggleSpecies,
    togglePod,
    toggleDirection,
    setDateRange,
    setRecentOnly,
    clearFilters,
    
    // Helpers
    hasActiveFilters,
    setFiltersFromUrl
  };
}
