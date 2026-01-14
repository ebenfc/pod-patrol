import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

// 🟢 SAFE TO EDIT - Date range picker component

function DateRangePicker({ dateRange, onDateRangeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localStart, setLocalStart] = useState(
    dateRange?.start ? format(dateRange.start, 'yyyy-MM-dd') : ''
  );
  const [localEnd, setLocalEnd] = useState(
    dateRange?.end ? format(dateRange.end, 'yyyy-MM-dd') : ''
  );

  const handleApply = () => {
    const newRange = {
      start: localStart ? new Date(localStart + 'T00:00:00') : null,
      end: localEnd ? new Date(localEnd + 'T23:59:59') : null
    };

    // Only set if at least one date is provided
    if (newRange.start || newRange.end) {
      onDateRangeChange(newRange);
    } else {
      onDateRangeChange(null);
    }

    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalStart('');
    setLocalEnd('');
    onDateRangeChange(null);
    setIsOpen(false);
  };

  const hasDateRange = dateRange?.start || dateRange?.end;

  const formatDisplayDate = () => {
    if (!hasDateRange) return 'All dates';

    const start = dateRange?.start ? format(dateRange.start, 'MMM d') : 'Start';
    const end = dateRange?.end ? format(dateRange.end, 'MMM d') : 'Present';

    return `${start} - ${end}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow transition-shadow text-sm ${
          hasDateRange
            ? 'bg-ocean-100 dark:bg-ocean-900 hover:bg-ocean-200 dark:hover:bg-ocean-800'
            : 'bg-white dark:bg-gray-800 hover:shadow-md'
        }`}
      >
        <Calendar className={`w-4 h-4 ${
          hasDateRange
            ? 'text-ocean-600 dark:text-ocean-400'
            : 'text-gray-500 dark:text-gray-400'
        }`} />
        <span className={`${
          hasDateRange
            ? 'text-ocean-700 dark:text-ocean-300 font-medium'
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          {formatDisplayDate()}
        </span>
        {hasDateRange && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="ml-1 p-0.5 hover:bg-ocean-200 dark:hover:bg-ocean-700 rounded"
          >
            <X className="w-3 h-3 text-ocean-600 dark:text-ocean-400" />
          </button>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 left-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-40 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Filter by Date Range
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={localStart}
                  onChange={(e) => setLocalStart(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-ocean-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={localEnd}
                  onChange={(e) => setLocalEnd(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-ocean-500 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleApply}
                className="flex-1 px-3 py-2 bg-ocean-600 text-white text-sm rounded-lg hover:bg-ocean-700 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Quick presets */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Quick select:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                <PresetButton
                  label="Last 7 days"
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(end.getDate() - 7);
                    setLocalStart(format(start, 'yyyy-MM-dd'));
                    setLocalEnd(format(end, 'yyyy-MM-dd'));
                  }}
                />
                <PresetButton
                  label="Last 30 days"
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(end.getDate() - 30);
                    setLocalStart(format(start, 'yyyy-MM-dd'));
                    setLocalEnd(format(end, 'yyyy-MM-dd'));
                  }}
                />
                <PresetButton
                  label="This year"
                  onClick={() => {
                    const now = new Date();
                    setLocalStart(`${now.getFullYear()}-01-01`);
                    setLocalEnd(format(now, 'yyyy-MM-dd'));
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PresetButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      {label}
    </button>
  );
}

PresetButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

DateRangePicker.propTypes = {
  dateRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date)
  }),
  onDateRangeChange: PropTypes.func.isRequired
};

DateRangePicker.defaultProps = {
  dateRange: null
};

export default memo(DateRangePicker);
