# 🚀 Deployment Guide for Pod Patrol
## For Complete Beginners - No Coding Experience Required!

---

## ⏱️ Estimated Time: 30-45 minutes

---

## 📋 Before You Start - Checklist

Make sure you have:
- ✅ GitHub account (username: ebenfc)
- ✅ Vercel account (connected to GitHub)
- ✅ Mapbox token (copied somewhere safe)
- ✅ Dropbox link to whale_data.csv (ending in ?dl=1)

---

## 🎯 Step 1: Download Your Code

All the files I created are in `/home/claude/pod-patrol/`. You need to download them to your Mac.

### Option A: Download as ZIP (Easiest)

1. I'll create a ZIP file for you at the end
2. Download it to your Desktop
3. Unzip it (double-click the ZIP file)
4. You now have a folder called `pod-patrol`

---

## 🎯 Step 2: Upload to GitHub

### Method 1: Using GitHub Website (No Terminal Required!)

1. **Go to GitHub**:
   - Open https://github.com/ebenfc
   - Click the green "New" button (top left)

2. **Create Repository**:
   - Repository name: `pod-patrol`
   - Description: `Whale sightings tracker for Puget Sound`
   - Keep it **Public**
   - ❌ **Do NOT** check "Add a README file"
   - Click "Create repository"

3. **Upload Files**:
   - You'll see a page with setup instructions
   - Look for "uploading an existing file" (it's a link)
   - Click that link
   - Drag the entire `pod-patrol` folder contents into the upload box
   - Or click "choose your files" and select all files
   - **IMPORTANT**: Upload ALL files, including hidden ones
   - Scroll down, click "Commit changes"

4. **Verify**:
   - You should see all your files listed
   - Look for: `package.json`, `README.md`, `src/` folder, etc.
   - ✅ If you see them, you're good!

---

## 🎯 Step 3: Deploy to Vercel

1. **Go to Vercel**:
   - Open https://vercel.com/new
   - Make sure you're logged in

2. **Import Project**:
   - You'll see a list of your GitHub repositories
   - Find `ebenfc/pod-patrol`
   - Click "Import"

3. **Configure Project**:
   - **Project Name**: Leave as `pod-patrol` (or change it)
   - **Framework Preset**: Should auto-detect "Vite"
   - **Root Directory**: Leave as `./`
   - **Build Command**: Leave as default
   - **Output Directory**: Leave as default

4. **Add Environment Variables**:
   - Click "Environment Variables" section to expand it
   - Add **Variable 1**:
     ```
     Name:  VITE_MAPBOX_TOKEN
     Value: pk.eyJ... (paste your Mapbox token here)
     ```
   - Click "Add" button
   
   - Add **Variable 2**:
     ```
     Name:  VITE_DATA_URL
     Value: https://www.dropbox.com/.../whale_data.csv?dl=1
     ```
   - Click "Add" button

5. **Deploy**:
   - Click the blue "Deploy" button
   - ☕ Wait 2-3 minutes (watch the build log if you're curious!)
   - You'll see a confetti animation when it's done 🎉

6. **View Your App**:
   - Click "Visit" or "Go to Dashboard"
   - Your app is live at: `https://pod-patrol-xxx.vercel.app`
   - Bookmark this URL!

---

## 🎯 Step 4: Test Your App

1. **Open the URL** Vercel gave you
2. **You should see**:
   - Pod Patrol header with whale emoji
   - Map of Puget Sound
   - Filters on the left
   - Whale sighting markers on the map

3. **Try clicking**:
   - A whale marker → Should show popup
   - A filter checkbox → Map should update
   - Dark mode toggle → Should switch themes
   - "Jump to Location" → Should zoom to that spot

4. **If something's wrong**:
   - Check Step 5 (Troubleshooting)

---

## 🎯 Step 5: Troubleshooting

### ❌ "Map is gray / not loading"

**Problem**: Mapbox token issue

**Fix**:
1. Go to Vercel dashboard
2. Click your `pod-patrol` project
3. Go to "Settings" tab
4. Click "Environment Variables"
5. Check `VITE_MAPBOX_TOKEN` value
6. Make sure it starts with `pk.`
7. If wrong, click "Edit", fix it, save
8. Go to "Deployments" tab
9. Click "..." on latest deployment
10. Click "Redeploy"

### ❌ "No whale sightings showing"

**Problem**: Dropbox link issue

**Fix**:
1. Test your Dropbox link in a browser
2. It should download the CSV file immediately
3. If it shows a preview page, change `dl=0` to `dl=1`
4. Go to Vercel → Settings → Environment Variables
5. Update `VITE_DATA_URL` with correct link
6. Redeploy (Deployments → Redeploy)

### ❌ "Build failed" error

**Problem**: Missing files or wrong configuration

**Fix**:
1. Check GitHub - are ALL files uploaded?
2. Look for `package.json`, `vite.config.js`, `index.html`
3. If missing, re-upload them
4. Vercel will auto-redeploy when you push to GitHub

### ❌ "App works but changes don't appear"

**Problem**: Need to redeploy

**Fix**:
1. Changes to code need a new deployment
2. Push changes to GitHub
3. Vercel auto-deploys
4. Or manually redeploy in Vercel dashboard

---

## 🎯 Step 6: Making Your First Change

Let's change the app title to prove you can customize it!

### Using GitHub Web Editor (No Downloads Needed!)

1. **Go to your GitHub repo**:
   - https://github.com/ebenfc/pod-patrol

2. **Navigate to file**:
   - Click `src` folder
   - Click `utils` folder
   - Click `constants.js`

3. **Edit file**:
   - Click the pencil icon (top right) "Edit this file"
   - Find line 138 (or search for `appName`)
   - Change:
     ```javascript
     appName: 'Pod Patrol',
     ```
     To:
     ```javascript
     appName: 'My Whale Tracker',
     ```

4. **Save**:
   - Scroll down
   - Click "Commit changes"
   - Add message: "Changed app title"
   - Click "Commit changes"

5. **Wait for deploy**:
   - Vercel will auto-deploy in ~2 minutes
   - Refresh your app URL
   - Title should be changed!

### Using VS Code (More Powerful)

1. **Open VS Code**
2. **Open folder**: File → Open → Select `pod-patrol` folder
3. **Find file**: Click `src` → `utils` → `constants.js`
4. **Edit**: Change line 138 as above
5. **Save**: Cmd+S
6. **Upload to GitHub**: (You'll need to learn Git or use GitHub Desktop)

---

## 🎯 Step 7: Ongoing Updates

### When Your Whale Data Updates

Your iOS shortcut exports new data to Dropbox automatically. To see updates in Pod Patrol:

**Option 1: Manual Refresh**
- Click the refresh button (↻) in Pod Patrol header
- New data loads immediately

**Option 2: Enable Auto-Refresh**
- Edit `src/utils/constants.js` line 133
- Change `0` to `3600000` (1 hour auto-refresh)
- Commit and deploy

### When You Want to Change Features

1. Edit the appropriate file (see README.md)
2. Commit to GitHub
3. Vercel auto-deploys
4. Check your app in 2-3 minutes

---

## 🎯 Common Tasks Reference

### Update Mapbox Token
1. Vercel → Settings → Environment Variables
2. Edit `VITE_MAPBOX_TOKEN`
3. Save → Redeploy

### Update Dropbox Link
1. Vercel → Settings → Environment Variables
2. Edit `VITE_DATA_URL`
3. Save → Redeploy

### Change Colors
1. Edit `src/utils/constants.js` lines 8-25
2. Commit to GitHub

### Change App Name
1. Edit `src/utils/constants.js` line 138
2. Commit to GitHub

### Add New Location to Search
1. Edit `src/utils/constants.js` lines 115-128
2. Add: `{ name: 'My Spot', lat: 47.xxx, lon: -122.xxx }`
3. Commit to GitHub

---

## 🎓 What You've Learned

Congratulations! You've:
- ✅ Created a GitHub repository
- ✅ Deployed a web application
- ✅ Configured environment variables
- ✅ Made code changes
- ✅ Understood basic project structure

**Next steps**:
- Experiment with colors
- Add your favorite locations
- Learn more React from react.dev
- Explore Mapbox examples

---

## 📞 Getting Help

**Stuck?**
1. Check the Troubleshooting section above
2. Read error messages carefully (they often tell you what's wrong)
3. Search the error on Google
4. Ask me for help with specific error messages

**Common Beginner Mistakes**:
- ❌ Forgetting to save files before committing
- ❌ Not waiting for deployment to finish
- ❌ Editing the wrong file
- ❌ Missing the `?dl=1` on Dropbox link

---

## 🎉 You Did It!

Your Pod Patrol app is live! Share the URL with friends and family.

**Your App**: `https://pod-patrol-xxx.vercel.app` (replace with your actual URL)

Happy whale watching! 🐋
