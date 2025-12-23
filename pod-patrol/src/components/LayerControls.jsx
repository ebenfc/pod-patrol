import { Layers } from 'lucide-react';

// 🟢 SAFE TO EDIT - Layer toggle controls

export default function LayerControls({ selectedLayers, onToggleLayer }) {
  const layers = [
    { id: 'points', label: 'Points', icon: '📍' },
    { id: 'hexbin', label: 'Hexbin', icon: '⬡' },
    { id: 'heatmap', label: 'Heatmap', icon: '🔥' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Map Layers
        </h3>
      </div>

      <div className="space-y-2">
        {layers.map(layer => (
          <label
            key={layer.id}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedLayers[layer.id]}
              onChange={() => onToggleLayer(layer.id)}
              className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
            />
            <span className="text-lg">{layer.icon}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {layer.label}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Toggle layers to customize your view
        </p>
      </div>
    </div>
  );
}
