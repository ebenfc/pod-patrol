import { memo } from 'react';
import PropTypes from 'prop-types';
import { X, Filter } from 'lucide-react';
import { SPECIES_CONFIG, ALL_PODS, DIRECTIONS } from '../utils/constants';

// 🟢 SAFE TO EDIT - Filters panel component

function Filters({
  selectedSpecies,
  selectedPods,
  selectedDirections,
  recentOnly,
  onToggleSpecies,
  onTogglePod,
  onToggleDirection,
  onToggleRecent,
  onClearAll,
  hasActiveFilters
}) {
  
  const speciesList = Object.keys(SPECIES_CONFIG);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-ocean-600 dark:text-ocean-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Recent Only Toggle */}
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={recentOnly}
            onChange={(e) => onToggleRecent(e.target.checked)}
            className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Show only recent (48hrs) 🔥
          </span>
        </label>
      </div>

      {/* Species Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Species</h4>
        <div className="space-y-1">
          {speciesList.map(species => (
            <FilterCheckbox
              key={species}
              label={SPECIES_CONFIG[species].label}
              checked={selectedSpecies.includes(species)}
              onChange={() => onToggleSpecies(species)}
              color={SPECIES_CONFIG[species].color}
            />
          ))}
        </div>
      </div>

      {/* Pod Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pod</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {ALL_PODS.map(pod => (
            <FilterCheckbox
              key={pod}
              label={pod}
              checked={selectedPods.includes(pod)}
              onChange={() => onTogglePod(pod)}
            />
          ))}
        </div>
      </div>

      {/* Direction Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Direction</h4>
        <div className="space-y-1">
          {DIRECTIONS.map(direction => (
            <FilterCheckbox
              key={direction}
              label={direction.charAt(0).toUpperCase() + direction.slice(1)}
              checked={selectedDirections.includes(direction)}
              onChange={() => onToggleDirection(direction)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable checkbox component
function FilterCheckbox({ label, checked, onChange, color }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 rounded transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
      />
      {color && (
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );
}

FilterCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string
};

FilterCheckbox.defaultProps = {
  color: null
};

Filters.propTypes = {
  selectedSpecies: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedPods: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedDirections: PropTypes.arrayOf(PropTypes.string).isRequired,
  recentOnly: PropTypes.bool.isRequired,
  onToggleSpecies: PropTypes.func.isRequired,
  onTogglePod: PropTypes.func.isRequired,
  onToggleDirection: PropTypes.func.isRequired,
  onToggleRecent: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired
};

export default memo(Filters);
