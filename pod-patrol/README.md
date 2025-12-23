# 🐋 Pod Patrol

**A sleek, modern whale sightings tracker for Puget Sound**

Track orca, gray whale, and humpback sightings from Orca Network data with an interactive map, powerful filters, and real-time updates.

---

## 🎯 Features

- ✅ **Interactive Map** - Mapbox-powered with Puget Sound focus
- ✅ **Multiple Layers** - Points, hexbin density, and heatmap views
- ✅ **Smart Filters** - Filter by species, pod, direction, and date
- ✅ **Recent Highlights** - See sightings from the last 48 hours
- ✅ **Dark Mode** - Beautiful ocean blues theme in light or dark
- ✅ **Detailed Panels** - Click any sighting for full details
- ✅ **Location Search** - Jump to popular whale-watching spots
- ✅ **Auto-Refresh** - Manual "Check for updates" button
- ✅ **Mobile Responsive** - Works great on phones and tablets

---

## 🚀 Quick Start for Beginners

### Prerequisites

You need these accounts (all free):
- ✅ GitHub account
- ✅ Vercel account (connected to GitHub)
- ✅ Mapbox account
- ✅ Dropbox with whale_data.csv

### Step 1: Get Your Tokens

1. **Mapbox Token**:
   - Go to https://account.mapbox.com/access-tokens/
   - Copy your "Default public token" (starts with `pk.`)

2. **Dropbox Link**:
   - Share your `whale_data.csv` file in Dropbox
   - Make sure the link ends with `?dl=1` (not `dl=0`)

### Step 2: Deploy to Vercel

#### Option A: Deploy Button (Easiest)

1. Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
2. Connect your GitHub account
3. Create a new repository named `pod-patrol`
4. Upload all the files from this folder
5. Add environment variables:
   - `VITE_MAPBOX_TOKEN` = your Mapbox token
   - `VITE_DATA_URL` = your Dropbox link
6. Click "Deploy"
7. Wait 2-3 minutes
8. Your app is live! 🎉

#### Option B: Manual Deploy (More Control)

1. **Upload Code to GitHub**:
   ```bash
   # If you have Git installed:
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ebenfc/pod-patrol.git
   git push -u origin main
   ```
   
   **Don't have Git?** Use GitHub's web interface:
   - Go to https://github.com/new
   - Create repository named `pod-patrol`
   - Upload all files using "Upload files" button

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your `pod-patrol` repository
   - Click "Import"

3. **Add Environment Variables**:
   - In Vercel dashboard, go to "Settings" → "Environment Variables"
   - Add these two variables:
     - **Name**: `VITE_MAPBOX_TOKEN`  
       **Value**: `pk.eyJ1Ij...` (your Mapbox token)
     - **Name**: `VITE_DATA_URL`  
       **Value**: `https://www.dropbox.com/.../whale_data.csv?dl=1`
   - Click "Save"

4. **Deploy**:
   - Go to "Deployments" tab
   - Click "Redeploy" (or wait for auto-deploy)
   - Your app will be live in 2-3 minutes!

---

## 🎨 Customization Guide

### Easy Changes (Safe to Edit)

#### Change App Title

**File**: `src/utils/constants.js`  
**Line**: 138-141

```javascript
export const UI_TEXT = {
  appName: 'Pod Patrol',        // ← Change this!
  tagline: 'Tracking whale sightings in Puget Sound',  // ← And this!
  // ...
};
```

#### Change Colors

**File**: `src/utils/constants.js`  
**Line**: 8-25

```javascript
export const SPECIES_CONFIG = {
  'Orca': {
    color: '#0066CC',      // ← Change to any hex color!
    darkColor: '#3B82F6',  // ← Dark mode color
    // ...
  },
  // ... other species
};
```

Try these colors:
- Coral Red: `#FF6B6B`
- Ocean Teal: `#14B8A6`
- Deep Purple: `#8B5CF6`
- Emerald: `#10B981`

#### Add New Search Locations

**File**: `src/utils/constants.js`  
**Line**: 115-128

```javascript
export const SEARCH_LOCATIONS = [
  { name: 'Alki Point', lat: 47.5819, lon: -122.4347 },
  // Add your favorite spot here:
  { name: 'My Favorite Beach', lat: 47.xxxx, lon: -122.xxxx },
];
```

#### Change Recent Sighting Window

**File**: `src/utils/constants.js`  
**Line**: 112

```javascript
export const RECENT_HOURS = 48;  // Change to 24, 72, etc.
```

---

## 📁 Project Structure

```
pod-patrol/
├── src/
│   ├── components/          # React components
│   │   ├── Map.jsx         # Main map with Mapbox
│   │   ├── Filters.jsx     # Species/Pod filters
│   │   ├── Header.jsx      # Top navigation bar
│   │   ├── SightingPanel.jsx  # Detail drawer
│   │   ├── LocationSearch.jsx # Jump to location
│   │   └── LayerControls.jsx  # Toggle layers
│   ├── hooks/              # Custom React hooks
│   │   ├── useWhaleData.js    # Data loading
│   │   ├── useFilters.js      # Filter logic
│   │   └── useDarkMode.js     # Dark mode toggle
│   ├── utils/              # Utilities
│   │   ├── constants.js       # 🟢 SAFE TO EDIT
│   │   ├── csvParser.js       # CSV processing
│   │   └── mapUtils.js        # Map helpers
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Styles
├── public/                 # Static assets
├── package.json            # Dependencies
├── vite.config.js          # Build config
└── README.md              # This file!
```

### Files Marked by Safety Level

- 🟢 **SAFE TO EDIT** - Change these freely!
- 🟡 **EDIT CAREFULLY** - Can edit, but understand what you're changing
- 🔴 **DON'T TOUCH** - Core functionality, leave alone

---

## 🛠️ Development

### Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env.local`** file:
   ```
   VITE_MAPBOX_TOKEN=pk.your_token_here
   VITE_DATA_URL=https://www.dropbox.com/.../whale_data.csv?dl=1
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```

4. **Open** http://localhost:3000

### Build for Production

```bash
npm run build
```

---

## 🐛 Troubleshooting

### "Map not loading / gray screen"

**Problem**: Mapbox token not set  
**Fix**: 
1. Go to Vercel → Settings → Environment Variables
2. Check that `VITE_MAPBOX_TOKEN` is set correctly
3. Redeploy

### "No sightings appear"

**Problem**: Dropbox link incorrect  
**Fix**:
1. Make sure link ends with `?dl=1` (not `dl=0`)
2. Test link in browser - should download CSV
3. Update `VITE_DATA_URL` in Vercel
4. Redeploy

### "Console errors about missing modules"

**Problem**: Dependencies not installed  
**Fix**:
```bash
npm install
```

### "Changes not appearing"

**Problem**: Need to redeploy  
**Fix**:
1. Push changes to GitHub
2. Vercel auto-deploys
3. Or manually redeploy in Vercel dashboard

---

## 📱 Mobile Tips

- **Add to Home Screen**: On iOS/Android, use "Add to Home Screen" for app-like experience
- **Best viewed**: Portrait mode on phones, landscape on tablets
- **Works offline**: Once loaded, you can browse cached data

---

## 🎓 Learning Resources

Want to understand the code better?

- **React**: https://react.dev/learn
- **Mapbox GL**: https://docs.mapbox.com/mapbox-gl-js/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **JavaScript**: https://javascript.info/

---

## 🚢 Updating Your Data

Your iOS shortcut exports `whale_data.csv` to Dropbox. Pod Patrol automatically loads the latest version when you click "Check for updates" (refresh button).

To enable auto-refresh every hour, edit:

**File**: `src/utils/constants.js`  
**Line**: 133

```javascript
export const AUTO_REFRESH_INTERVAL = 3600000; // 1 hour (currently disabled = 0)
```

---

## ✨ What's Next?

Ideas for Phase 2:
- [ ] Time playback animation
- [ ] Pod tracking overlay showing typical ranges
- [ ] Export filtered data as CSV
- [ ] Share URL with current filters
- [ ] Statistics dashboard with charts
- [ ] Offline mode support

---

## 📄 License

Built for personal use. Whale sighting data courtesy of Orca Network.

---

## 🐋 Credits

- **Whale Data**: [Orca Network](https://www.orcanetwork.org/)
- **Maps**: [Mapbox](https://www.mapbox.com/)
- **Built by**: ebenfc
- **Inspired by**: Love of Puget Sound orcas 🖤🤍

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above!

Happy whale watching! 🐋
