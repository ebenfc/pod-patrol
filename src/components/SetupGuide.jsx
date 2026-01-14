import { memo } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, ExternalLink } from 'lucide-react';

// 🟢 SAFE TO EDIT - Setup guide component for missing configuration

function SetupGuide({ error, onRetry }) {
  const isEnvVarError = error?.includes('VITE_DATA_URL') || error?.includes('Data URL');

  if (isEnvVarError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Configuration Required
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Pod Patrol needs a data source URL to load whale sightings.
            Set the <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">VITE_DATA_URL</code> environment variable in Vercel.
          </p>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Quick Setup:
            </h3>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
              <li>Go to your Vercel project dashboard</li>
              <li>Navigate to <strong>Settings → Environment Variables</strong></li>
              <li>Add a new variable:
                <div className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-xs">
                  <div><span className="text-ocean-600">Name:</span> VITE_DATA_URL</div>
                  <div><span className="text-ocean-600">Value:</span> https://your-dropbox-link.csv?dl=1</div>
                </div>
              </li>
              <li>Click <strong>Redeploy</strong> from the Deployments tab</li>
            </ol>
          </div>

          <div className="bg-ocean-50 dark:bg-ocean-900/20 border border-ocean-200 dark:border-ocean-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-ocean-800 dark:text-ocean-200">
              <strong>Tip:</strong> Your data URL should point to a CSV file with whale sighting data.
              For Dropbox links, make sure it ends with <code className="bg-ocean-100 dark:bg-ocean-800 px-1 rounded">?dl=1</code>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
            >
              Retry Loading
            </button>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <span>Open Vercel</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Generic error display
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md p-6">
        <div className="text-6xl mb-4">❌</div>
        <div className="text-lg text-gray-900 dark:text-gray-100 font-semibold mb-2">
          Failed to Load Data
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-gray-100 dark:bg-gray-800 p-3 rounded">
          {error}
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

SetupGuide.propTypes = {
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired
};

SetupGuide.defaultProps = {
  error: null
};

export default memo(SetupGuide);
