import { Moon, Sun, RefreshCw, MapPin } from 'lucide-react';
import { UI_TEXT } from '../utils/constants';

// 🟢 SAFE TO EDIT - Header component

export default function Header({ 
  isDark, 
  onToggleDark, 
  onRefresh, 
  lastUpdated,
  totalSightings,
  filteredCount,
  isLoading 
}) {
  
  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-full px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">🐋</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {UI_TEXT.appName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {UI_TEXT.tagline}
              </p>
            </div>
          </div>

          {/* Stats & Controls */}
          <div className="flex items-center gap-4">
            {/* Sighting Count */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-ocean-600 dark:text-ocean-400">
                  {filteredCount}
                </span>
                {filteredCount !== totalSightings && (
                  <span className="text-gray-500 dark:text-gray-500">
                    {' '}of {totalSightings}
                  </span>
                )}
                {' '}sightings
              </span>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
                Updated {formatLastUpdated(lastUpdated)}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="Check for updates"
            >
              <RefreshCw 
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="sm:hidden mt-3 flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
          <span className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-ocean-600 dark:text-ocean-400">
              {filteredCount}
            </span>
            {filteredCount !== totalSightings && (
              <span className="text-gray-500 dark:text-gray-500">
                {' '}of {totalSightings}
              </span>
            )}
            {' '}sightings
          </span>
        </div>
      </div>
    </header>
  );
}
