import { useState, useRef } from 'react';
import { useWhaleData } from './hooks/useWhaleData';
import { useFilters } from './hooks/useFilters';
import { useDarkMode } from './hooks/useDarkMode';
import { calculateStats } from './utils/csvParser';

import Header from './components/Header';
import WhaleMap from './components/Map';
import Filters from './components/Filters';
import SightingPanel from './components/SightingPanel';
import LocationSearch from './components/LocationSearch';
import LayerControls from './components/LayerControls';

import { UI_TEXT } from './utils/constants';

// 🟡 EDIT CAREFULLY - Main app component

function App() {
  const mapRef = useRef(null);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState({
    points: true,
    hexbin: false,
    heatmap: false
  });

  // Dark mode
  const { isDark, toggle: toggleDark } = useDarkMode();

  // Load whale data
  const dataUrl = import.meta.env.VITE_DATA_URL;
  const { data: sightings, loading, error, lastUpdated, refresh } = useWhaleData(dataUrl);

  // Filters
  const {
    selectedSpecies,
    selectedPods,
    selectedDirections,
    recentOnly,
    filteredSightings,
    toggleSpecies,
    togglePod,
    toggleDirection,
    setRecentOnly,
    clearFilters,
    hasActiveFilters
  } = useFilters(sightings);

  // Toggle layer
  const handleToggleLayer = (layerId) => {
    setSelectedLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  // Calculate stats
  const stats = calculateStats(filteredSightings);

  // Loading state
  if (loading && sightings.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐋</div>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {UI_TEXT.loading}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-lg text-gray-900 dark:text-gray-100 font-semibold mb-2">
            {UI_TEXT.error}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </div>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
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
        <div className="w-80 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          {/* Location Search */}
          <div className="mb-4">
            <LocationSearch mapRef={mapRef} />
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
              sightings={filteredSightings}
              isDark={isDark}
              selectedLayers={selectedLayers}
              onSightingClick={setSelectedSighting}
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
          onClose={() => setSelectedSighting(null)}
        />
      )}
    </div>
  );
}

export default App;
