import { useState, useRef, useCallback } from 'react';
import { useWhaleData } from './hooks/useWhaleData';
import { useFilters } from './hooks/useFilters';
import { useDarkMode } from './hooks/useDarkMode';
import { useUrlState } from './hooks/useUrlState';
import { calculateStats } from './utils/csvParser';

import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import WhaleMap from './components/Map';
import Filters from './components/Filters';
import SightingPanel from './components/SightingPanel';
import LocationSearch from './components/LocationSearch';
import LayerControls from './components/LayerControls';
import ExportButton from './components/ExportButton';
import DateRangePicker from './components/DateRangePicker';
import SetupGuide from './components/SetupGuide';

import { UI_TEXT } from './utils/constants';

// Fallback to sample data in repo if no URL configured
const FALLBACK_DATA_URL = 'https://raw.githubusercontent.com/ebenfc/pod-patrol/main/public/whale_data.csv';

// 🟡 EDIT CAREFULLY - Main app component

function AppContent() {
  const mapRef = useRef(null);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState({
    points: true,
    hexbin: false,
    heatmap: false
  });

  // Dark mode
  const { isDark, toggle: toggleDark } = useDarkMode();

  // Load whale data - use env var or fallback to sample data
  const configuredUrl = import.meta.env.VITE_DATA_URL;
  const dataUrl = configuredUrl || FALLBACK_DATA_URL;
  const isUsingFallback = !configuredUrl;

  const { data: sightings, loading, error, lastUpdated, refresh } = useWhaleData(dataUrl);

  // Filters
  const {
    selectedSpecies,
    selectedPods,
    selectedDirections,
    dateRange,
    recentOnly,
    filteredSightings,
    toggleSpecies,
    togglePod,
    toggleDirection,
    setDateRange,
    setRecentOnly,
    clearFilters,
    hasActiveFilters,
    setFiltersFromUrl
  } = useFilters(sightings);

  // URL state synchronization
  useUrlState({
    selectedSpecies,
    selectedPods,
    selectedDirections,
    recentOnly,
    dateRange,
    setFiltersFromUrl
  });

  // Toggle layer
  const handleToggleLayer = useCallback((layerId) => {
    setSelectedLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  }, []);

  // Handle sighting click
  const handleSightingClick = useCallback((sighting) => {
    setSelectedSighting(sighting);
  }, []);

  // Close sighting panel
  const handleCloseSightingPanel = useCallback(() => {
    setSelectedSighting(null);
  }, []);

  // Calculate stats
  const stats = calculateStats(filteredSightings);

  // Loading state
  if (loading && sightings.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center" role="status" aria-live="polite" aria-busy="true">
          <div className="text-6xl mb-4 animate-bounce" aria-hidden="true">🐋</div>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {UI_TEXT.loading}
          </div>
          <span className="sr-only">Loading whale sightings data</span>
        </div>
      </div>
    );
  }

  // Error state (only show if no data loaded)
  if (error && sightings.length === 0) {
    return <SetupGuide error={error} onRetry={refresh} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Sample Data Banner */}
      {isUsingFallback && sightings.length > 0 && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            Using sample data. Set <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">VITE_DATA_URL</code> in Vercel for live data.
          </p>
        </div>
      )}

      {/* Header */}
      <Header
        isDark={isDark}
        onToggleDark={toggleDark}
        onRefresh={refresh}
        lastUpdated={lastUpdated}
        totalSightings={sightings.length}
        filteredCount={filteredSightings.length}
        isLoading={loading}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700 hidden md:block">
          {/* Location Search */}
          <div className="mb-4">
            <LocationSearch mapRef={mapRef} />
          </div>

          {/* Date Range & Export */}
          <div className="mb-4 flex gap-2">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <ExportButton sightings={filteredSightings} />
          </div>

          {/* Layer Controls */}
          <div className="mb-4">
            <LayerControls
              selectedLayers={selectedLayers}
              onToggleLayer={handleToggleLayer}
            />
          </div>

          {/* Filters */}
          <Filters
            selectedSpecies={selectedSpecies}
            selectedPods={selectedPods}
            selectedDirections={selectedDirections}
            recentOnly={recentOnly}
            onToggleSpecies={toggleSpecies}
            onTogglePod={togglePod}
            onToggleDirection={toggleDirection}
            onToggleRecent={setRecentOnly}
            onClearAll={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Stats */}
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {stats.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Recent (48h):</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {stats.recent}
                </span>
              </div>
              {stats.mostActivePod !== 'Unknown' && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Most Active:</span>
                  <span className="font-semibold text-ocean-600 dark:text-ocean-400">
                    {stats.mostActivePod}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {filteredSightings.length > 0 ? (
            <WhaleMap
              ref={mapRef}
              sightings={filteredSightings}
              isDark={isDark}
              selectedLayers={selectedLayers}
              onSightingClick={handleSightingClick}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {UI_TEXT.noData}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sighting Detail Panel */}
      {selectedSighting && (
        <SightingPanel
          sighting={selectedSighting}
          onClose={handleCloseSightingPanel}
        />
      )}
    </div>
  );
}

// Wrap with ErrorBoundary
function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
