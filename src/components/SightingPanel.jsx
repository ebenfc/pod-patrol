import { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { SPECIES_CONFIG } from '../utils/constants';

// 🟢 SAFE TO EDIT - Sighting details panel (side drawer)

function SightingPanel({ sighting, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!sighting) return null;

  const speciesConfig = SPECIES_CONFIG[sighting.species] || SPECIES_CONFIG['Unknown'];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sighting-panel-title"
        className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{speciesConfig.icon}</span>
              <div>
                <h2
                  id="sighting-panel-title"
                  className="text-lg font-bold text-gray-900 dark:text-gray-100"
                >
                  {sighting.species}
                </h2>
                {sighting.pod !== 'Unknown' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sighting.pod}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close panel"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Recent Badge */}
          {sighting.isRecent && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">🔥</span>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Recent Sighting
                </span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Reported within the last 48 hours
              </p>
            </div>
          )}

          {/* Date & Time */}
          <InfoSection title="When">
            <InfoRow label="Date" value={sighting.dateString} />
            {sighting.report_time && (
              <InfoRow label="Time" value={sighting.report_time} />
            )}
          </InfoSection>

          {/* Location */}
          <InfoSection title="Where">
            {sighting.location_desc && (
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {sighting.location_desc}
              </div>
            )}
            {sighting.place_a && (
              <InfoRow label="Location A" value={sighting.place_a} />
            )}
            {sighting.place_b && (
              <InfoRow label="Location B" value={sighting.place_b} />
            )}
            <InfoRow
              label="Coordinates"
              value={`${sighting.lat.toFixed(5)}, ${sighting.lon.toFixed(5)}`}
              copyable
            />
          </InfoSection>

          {/* Movement */}
          {sighting.direction !== 'unknown' && (
            <InfoSection title="Movement">
              <InfoRow
                label="Direction"
                value={sighting.direction.charAt(0).toUpperCase() + sighting.direction.slice(1)}
              />
            </InfoSection>
          )}

          {/* Data Quality */}
          <InfoSection title="Data Quality">
            <InfoRow
              label="Confidence"
              value={`${Math.round(sighting.confidence * 100)}%`}
            />
            {sighting.location_method && (
              <InfoRow
                label="Location Method"
                value={sighting.location_method.replace(/_/g, ' ')}
              />
            )}
          </InfoSection>

          {/* Notes */}
          {sighting.notes && (
            <InfoSection title="Notes">
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                {sighting.notes}
              </p>
            </InfoSection>
          )}

          {/* Raw Text */}
          {sighting.raw_text && (
            <InfoSection title="Original Report">
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded p-3 font-mono">
                {sighting.raw_text}
              </div>
            </InfoSection>
          )}

          {/* SMS ID */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-500">
              SMS ID: {sighting.sms_id}
            </div>
            {sighting.sighting_index > 1 && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Sighting #{sighting.sighting_index} from this report
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Helper Components
function InfoSection({ title, children }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, copyable }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: select text in prompt
      window.prompt('Copy coordinates:', value);
    }
  }, [value]);

  return (
    <div className="flex justify-between items-start">
      <span className="text-xs text-gray-500 dark:text-gray-500">{label}:</span>
      <span className="text-sm text-gray-700 dark:text-gray-300 text-right flex-1 ml-2">
        {value}
        {copyable && (
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy coordinates'}
            className="ml-2 text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 text-xs"
          >
            {copied ? '✓' : '📋'}
          </button>
        )}
      </span>
    </div>
  );
}

InfoSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  copyable: PropTypes.bool
};

InfoRow.defaultProps = {
  copyable: false
};

SightingPanel.propTypes = {
  sighting: PropTypes.shape({
    sms_id: PropTypes.string,
    sighting_index: PropTypes.number,
    lat: PropTypes.number,
    lon: PropTypes.number,
    species: PropTypes.string,
    pod: PropTypes.string,
    direction: PropTypes.string,
    location_desc: PropTypes.string,
    place_a: PropTypes.string,
    place_b: PropTypes.string,
    dateString: PropTypes.string,
    report_time: PropTypes.string,
    confidence: PropTypes.number,
    location_method: PropTypes.string,
    notes: PropTypes.string,
    raw_text: PropTypes.string,
    isRecent: PropTypes.bool
  }),
  onClose: PropTypes.func.isRequired
};

SightingPanel.defaultProps = {
  sighting: null
};

export default memo(SightingPanel);
