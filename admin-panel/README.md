# Station Admin Panel

A simple, no-authentication admin interface for managing radio station data.

## Features

- ✏️ Edit existing stations
- ➕ Add new stations
- 🗑️ Delete stations
- 🖼️ Upload logos/images
- 🔗 Add website and social media links
- 💾 Download JSON files for GitHub deployment

## How It Works

Since this admin panel is embedded in a protected parent page, **no authentication is needed**. The parent page handles security.

### Workflow

1. **Edit/Add/Delete stations** in the admin interface
2. **Download the JSON files** (automatically triggered after save)
3. **Upload to GitHub:**
   - Place station files in `/public/data/stations/`
   - Update `index.json` with the list of station IDs
4. **Netlify auto-deploys** the changes

## Development

```bash
cd admin-panel
npm install
npm run dev
```

Visit `http://localhost:5173`

## Build for Production

```bash
npm run build
```

This builds to `../public/admin/` which will be accessible at `/admin` on your live site.

## Deployment

The admin panel is built as part of your main site and deployed to `/admin`.

Access it at: `https://stationprofiles.netlify.app/admin`

## File Structure

```
admin-panel/
├── src/
│   ├── components/
│   │   ├── StationList.jsx      # Grid view of all stations
│   │   └── StationEditor.jsx    # Edit/Add form modal
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Styles
├── index.html
├── vite.config.js
└── package.json
```

## Adding New Fields

To add new fields to stations:

1. Update the initial state in `StationEditor.jsx`
2. Add form fields in the editor
3. Update the station card display in `StationList.jsx`
4. Update the main site to display the new fields

## Notes

- Images can be uploaded (base64) or linked via URL
- All changes download as JSON files
- You manually commit/push to GitHub
- No backend needed - pure frontend solution