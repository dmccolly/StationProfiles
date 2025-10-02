# 🎯 Admin Panel Setup Guide

## What I've Built For You

A complete admin panel at `/admin` where you can:
- ✏️ Edit all station information
- ➕ Add new stations
- 🗑️ Delete stations
- 🖼️ Upload logos and images
- 🔗 Add website and social media links
- 💾 Download updated JSON files

**No login required** - security is handled by your parent page when embedded.

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd admin-panel
npm install
```

### Step 2: Build the Admin Panel

```bash
npm run build
```

This creates the admin interface in `/public/admin/`

### Step 3: Commit and Push to GitHub

```bash
cd ..
git add .
git commit -m "Add admin panel"
git push origin main
```

### Step 4: Access Your Admin Panel

Once deployed, visit:
**https://stationprofiles.netlify.app/admin**

## 📝 How to Use

### Editing a Station

1. Go to `/admin`
2. Click **"Edit"** on any station card
3. Update any fields (name, frequency, logo, links, etc.)
4. Click **"Save Station"**
5. A JSON file will automatically download
6. Upload this file to `/public/data/stations/` in your GitHub repo
7. Commit and push - Netlify auto-deploys!

### Adding a New Station

1. Click **"Add New Station"**
2. Fill in all the information
3. Upload a logo or paste an image URL
4. Click **"Save Station"**
5. Two files download:
   - `{station-id}.json` - The station data
   - `index.json` - Updated station list
6. Upload both to `/public/data/stations/` in GitHub
7. Commit and push!

### Deleting a Station

1. Click **"Delete"** on a station card
2. Confirm deletion
3. `index.json` downloads automatically
4. In GitHub:
   - Delete the station's JSON file
   - Replace `index.json` with the downloaded one
5. Commit and push!

### Bulk Download

Click **"Download All Data"** to download all station files at once. Useful for backups!

## 🖼️ Adding Images

You have two options:

**Option 1: Upload Image (Recommended for small logos)**
- Click the upload area
- Select an image file
- Image is embedded as base64 in the JSON

**Option 2: Image URL**
- Paste a URL to an image hosted elsewhere
- Recommended for larger images
- Example: `https://example.com/logo.png`

## 🔗 Social Media Links

Add links to:
- Website
- Facebook
- Twitter/X
- Instagram

These will be displayed on the station cards (you'll need to update the main site to show them).

## 🎨 Customization

### Change Colors

Edit `/admin-panel/src/index.css` and modify the gradient:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Fields

1. Edit `StationEditor.jsx` - add form fields
2. Edit `StationList.jsx` - display new fields
3. Rebuild: `npm run build`

## 🔄 Development Mode

To work on the admin panel:

```bash
cd admin-panel
npm run dev
```

Visit `http://localhost:5173` to see changes live.

When done:
```bash
npm run build
```

## 📁 File Structure

```
admin-panel/
├── src/
│   ├── components/
│   │   ├── StationList.jsx      # Station grid display
│   │   └── StationEditor.jsx    # Edit/Add form
│   ├── App.jsx                   # Main app
│   └── index.css                 # Styles
└── public/admin/                 # Built files (deployed)
```

## ⚠️ Important Notes

1. **Manual Deployment**: Changes are downloaded as JSON files. You must manually upload them to GitHub.

2. **No Auto-Save**: This is intentional for safety. You review changes before deploying.

3. **Image Size**: Base64 images increase JSON file size. For large images, use URLs instead.

4. **Backup**: Use "Download All Data" regularly to backup your station information.

## 🆘 Troubleshooting

**Admin panel not loading?**
- Make sure you ran `npm run build`
- Check that files are in `/public/admin/`
- Clear browser cache

**Changes not showing on live site?**
- Did you upload the JSON files to GitHub?
- Did you commit and push?
- Check Netlify deploy logs

**Image not displaying?**
- Check the image URL is accessible
- For uploaded images, check file size (keep under 100KB)

## 🎉 You're All Set!

Your admin panel is ready to use. Access it at `/admin` and start managing your stations!