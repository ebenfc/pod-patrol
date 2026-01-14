import { useState, memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, MapPin } from 'lucide-react';
import { SEARCH_LOCATIONS } from '../utils/constants';

// 🟢 SAFE TO EDIT - Location search component

function LocationSearch({ onLocationSelect, mapRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize filtered locations to prevent recalculation on every render
  const filteredLocations = useMemo(() =>
    SEARCH_LOCATIONS.filter(loc =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSelect = (location) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [location.lon, location.lat],
        zoom: 12,
        duration: 2000
      });
    }
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="location-search-menu"
        aria-label="Jump to location"
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        <Search className="w-4 h-4 text-ocean-600 dark:text-ocean-400" aria-hidden="true" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Jump to Location
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            id="location-search-menu"
            role="listbox"
            aria-label="Location search results"
            className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-40 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <label htmlFor="location-search-input" className="sr-only">
                Search locations
              </label>
              <input
                id="location-search-input"
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-ocean-500"
                autoFocus
              />
            </div>

            {/* Location List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <button
                    key={location.name}
                    role="option"
                    onClick={() => handleSelect(location)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-ocean-600 dark:text-ocean-400 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {location.name}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No locations found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

LocationSearch.propTypes = {
  onLocationSelect: PropTypes.func,
  mapRef: PropTypes.shape({
    current: PropTypes.shape({
      flyTo: PropTypes.func
    })
  })
};

LocationSearch.defaultProps = {
  onLocationSelect: null,
  mapRef: null
};

export default memo(LocationSearch);
