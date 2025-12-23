import { useRef, useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, ScaleControl } from 'react-map-gl';
import { MAP_CONFIG, SPECIES_CONFIG } from '../utils/constants';
import { getSpeciesColor, formatPopupContent } from '../utils/mapUtils';

// 🟡 EDIT CAREFULLY - Main map component

export default function WhaleMap({ sightings, isDark, selectedLayers, onSightingClick }) {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewState, setViewState] = useState(MAP_CONFIG.initialViewState);

  // Get Mapbox token from environment variable
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Choose map style based on dark mode
  const mapStyle = isDark ? MAP_CONFIG.mapStyle.dark : MAP_CONFIG.mapStyle.light;

  // Handle marker click
  const handleMarkerClick = (sighting, e) => {
    e.originalEvent.stopPropagation();
    setPopupInfo(sighting);
    if (onSightingClick) {
      onSightingClick(sighting);
    }
  };

  // Fit bounds when sightings change
  useEffect(() => {
    if (sightings.length > 0 && mapRef.current) {
      const bounds = calculateBounds(sightings);
      if (bounds) {
        mapRef.current.fitBounds(bounds, {
          padding: 40,
          duration: 1000
        });
      }
    }
  }, [sightings]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle={mapStyle}
        maxBounds={MAP_CONFIG.maxBounds}
        style={{ width: '100%', height: '100%' }}
        onClick={() => setPopupInfo(null)}
      >
        {/* Navigation controls */}
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />

        {/* Render markers */}
        {selectedLayers.points && sightings.map((sighting, idx) => (
          <Marker
            key={`${sighting.sms_id}-${sighting.sighting_index}-${idx}`}
            longitude={sighting.lon}
            latitude={sighting.lat}
            onClick={(e) => handleMarkerClick(sighting, e)}
          >
            <div
              className={`marker ${sighting.isRecent ? 'marker-recent' : ''}`}
              style={{
                backgroundColor: getSpeciesColor(sighting.species, isDark),
                width: `${8 + sighting.confidence * 8}px`,
                height: `${8 + sighting.confidence * 8}px`,
                borderRadius: '50%',
                border: sighting.isRecent ? '2px solid #FCD34D' : '2px solid white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: sighting.isRecent 
                  ? '0 0 10px rgba(252, 211, 77, 0.6)' 
                  : '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </Marker>
        ))}

        {/* Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.lon}
            latitude={popupInfo.lat}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="whale-popup"
          >
            <div className="p-3 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{SPECIES_CONFIG[popupInfo.species]?.icon || '🐋'}</span>
                <div>
                  <div className="font-semibold text-sm">{popupInfo.species}</div>
                  {popupInfo.pod !== 'Unknown' && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">{popupInfo.pod}</div>
                  )}
                </div>
              </div>
              
              <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                <div className="font-medium">
                  {popupInfo.dateString}
                  {popupInfo.report_time && ` ${popupInfo.report_time}`}
                </div>
                
                {popupInfo.direction !== 'unknown' && (
                  <div className="capitalize">
                    Direction: {popupInfo.direction}
                  </div>
                )}
                
                {popupInfo.location_desc && (
                  <div className="italic mt-2 text-xs">
                    {popupInfo.location_desc}
                  </div>
                )}
                
                {popupInfo.isRecent && (
                  <div className="mt-2 inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium">
                    🔥 Recent Sighting
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Layer legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs">
        <div className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Species</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SPECIES_CONFIG).map(([species, config]) => (
            <div key={species} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSpeciesColor(species, isDark) }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate bounds
function calculateBounds(sightings) {
  if (!sightings || sightings.length === 0) return null;
  
  const lons = sightings.map(s => s.lon);
  const lats = sightings.map(s => s.lat);
  
  return [
    [Math.min(...lons), Math.min(...lats)],
    [Math.max(...lons), Math.max(...lats)]
  ];
}
