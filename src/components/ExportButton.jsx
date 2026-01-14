import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Download } from 'lucide-react';
import { exportToCSV, exportToJSON, exportToGeoJSON } from '../utils/exportUtils';

// 🟢 SAFE TO EDIT - Export button component

function ExportButton({ sightings }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format) => {
    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'csv':
        exportToCSV(sightings, `whale_sightings_${timestamp}.csv`);
        break;
      case 'json':
        exportToJSON(sightings, `whale_sightings_${timestamp}.json`);
        break;
      case 'geojson':
        exportToGeoJSON(sightings, `whale_sightings_${timestamp}.geojson`);
        break;
      default:
        break;
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow text-sm"
        title="Export filtered sightings"
      >
        <Download className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
        <span className="text-gray-700 dark:text-gray-300">Export</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-40 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Export {sightings.length} sightings
              </span>
            </div>

            <div className="py-1">
              <ExportOption
                label="CSV (Spreadsheet)"
                description="Excel, Google Sheets"
                onClick={() => handleExport('csv')}
              />
              <ExportOption
                label="JSON (Data)"
                description="APIs, programming"
                onClick={() => handleExport('json')}
              />
              <ExportOption
                label="GeoJSON (Maps)"
                description="GIS, QGIS, mapping tools"
                onClick={() => handleExport('geojson')}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ExportOption({ label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {description}
      </div>
    </button>
  );
}

ExportOption.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

ExportButton.propTypes = {
  sightings: PropTypes.array.isRequired
};

export default memo(ExportButton);
