// 🟢 SAFE TO EDIT - These are your app's settings!

// ============================================
// SPECIES CONFIGURATION
// ============================================
export const SPECIES_CONFIG = {
  'Orca': {
    color: '#0066CC',      // Ocean blue
    darkColor: '#3B82F6',  // Lighter blue for dark mode
    icon: '🐋',
    label: 'Orca'
  },
  'Gray whale': {
    color: '#64748B',      // Slate gray
    darkColor: '#94A3B8',
    icon: '🐋',
    label: 'Gray Whale'
  },
  'Humpback Whale': {
    color: '#059669',      // Emerald green
    darkColor: '#10B981',
    icon: '🐋',
    label: 'Humpback'
  },
  'Minke': {
    color: '#8B5CF6',      // Purple
    darkColor: '#A78BFA',
    icon: '🐋',
    label: 'Minke'
  },
  'SRKW': {
    color: '#DC2626',      // Red (Southern Residents)
    darkColor: '#EF4444',
    icon: '⭐',
    label: 'SRKW'
  },
  'Biggs': {
    color: '#EA580C',      // Orange (Transients)
    darkColor: '#F97316',
    icon: '🔶',
    label: 'Biggs'
  },
  'Unknown': {
    color: '#6B7280',      // Gray
    darkColor: '#9CA3AF',
    icon: '❓',
    label: 'Unknown'
  }
};

// ============================================
// POD LISTS
// ============================================
export const PODS = {
  residents: ['J pod', 'K pod', 'L pod', 'SRKW'],
  biggs: ['Biggs', 'T46E', 'T65A5', 'T49A2', 'T100s', 'T124Ds', 'T124A2s', 'T137', 'T36', 'T99B'],
  other: ['Unknown']
};

// All pods in one list for filtering
export const ALL_PODS = [
  ...PODS.residents,
  ...PODS.biggs,
  ...PODS.other
];

// ============================================
// DIRECTIONS
// ============================================
export const DIRECTIONS = [
  'northbound',
  'southbound',
  'eastbound',
  'westbound',
  'unknown'
];

// ============================================
// MAP CONFIGURATION
// ============================================
export const MAP_CONFIG = {
  // Default map view (centered on Puget Sound)
  initialViewState: {
    latitude: 47.6,
    longitude: -122.4,
    zoom: 9,
    pitch: 0,
    bearing: 0
  },
  
  // Map style (you can change this!)
  // Options: 'light-v11', 'dark-v11', 'streets-v12', 'outdoors-v12', 'satellite-v9'
  mapStyle: {
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11'
  },
  
  // Bounds (keeps map focused on Puget Sound region)
  maxBounds: [
    [-124.5, 46.3],  // Southwest coordinates
    [-121.2, 49.2]   // Northeast coordinates
  ]
};

// ============================================
// LAYER CONFIGURATION
// ============================================
export const LAYER_CONFIG = {
  points: {
    minRadius: 4,
    maxRadius: 12,
    opacity: 0.8
  },
  
  hexbin: {
    radius: 1000,        // meters
    coverage: 0.9,
    upperPercentile: 100,
    colorRange: [
      [224, 242, 254],   // Light blue
      [186, 230, 253],
      [125, 211, 252],
      [56, 189, 248],
      [14, 165, 233],
      [2, 132, 199]      // Deep blue
    ]
  },
  
  heatmap: {
    intensity: 1,
    radius: 30,
    weight: 1
  }
};

// ============================================
// RECENT SIGHTINGS
// ============================================
export const RECENT_HOURS = 48;  // Highlight sightings from last 48 hours

// ============================================
// SEARCH LOCATIONS (Popular whale-watching spots)
// ============================================
export const SEARCH_LOCATIONS = [
  { name: 'Alki Point', lat: 47.5819, lon: -122.4347 },
  { name: 'Golden Gardens', lat: 47.6761, lon: -122.4328 },
  { name: 'Edmonds Ferry', lat: 47.8025, lon: -122.4521 },
  { name: 'Point Defiance', lat: 47.3387, lon: -122.4384 },
  { name: 'Lime Kiln (San Juan)', lat: 48.5156, lon: -123.1525 },
  { name: 'West Point', lat: 47.6614, lon: -122.4358 },
  { name: 'Blake Island', lat: 47.5381, lon: -122.4529 },
  { name: 'Vashon Island', lat: 47.4264, lon: -122.4215 },
  { name: 'Hood Canal Bridge', lat: 47.8609, lon: -122.6112 },
  { name: 'Mukilteo', lat: 47.9083, lon: -122.4841 }
];

// ============================================
// DATA REFRESH
// ============================================
export const AUTO_REFRESH_INTERVAL = 3600000; // 1 hour in milliseconds (set to 0 to disable)

// ============================================
// UI TEXT (Easy to customize!)
// ============================================
export const UI_TEXT = {
  appName: 'Pod Patrol',
  tagline: 'Tracking whale sightings in Puget Sound',
  noData: 'No sightings match your filters',
  loading: 'Loading whale sightings...',
  error: 'Unable to load sighting data',
  recentBadge: 'Recent',
  lastUpdated: 'Last updated'
};
