# Webflow Embed Guide for Station Admin Panel

## The Problem You're Experiencing

The 404 error you're seeing in Webflow happens because the embed codes need your **actual deployed site URL**. The widgets can't work with relative paths like `/admin/` when embedded in Webflow - they need the full URL.

## Solution: 3 Easy Steps

### Step 1: Find Your Netlify URL

1. Go to your Netlify dashboard
2. Find your StationProfiles site
3. Copy the site URL (it looks like: `https://your-site-name.netlify.app`)

### Step 2: Generate Your Embed Codes

Once your site is deployed, visit this page on your deployed site:

```
https://your-site-name.netlify.app/embed-codes.html
```

This page will:
- ✅ Let you enter your site URL
- ✅ Automatically generate working embed codes
- ✅ Give you multiple embed options to choose from
- ✅ Provide copy-paste ready code for Webflow

### Step 3: Add to Webflow

1. In Webflow, add an **Embed** element where you want the admin panel
2. Paste one of the generated embed codes
3. Publish your Webflow site
4. The admin panel will now work!

## Quick Fix: Use These URLs Directly

If you want to link to the admin panel instead of embedding it, use these URLs:

**Admin Panel:**
```
https://your-site-name.netlify.app/admin/
```

**Embed Code Generator:**
```
https://your-site-name.netlify.app/embed-codes.html
```

**Standalone Embed Page:**
```
https://your-site-name.netlify.app/embed-admin.html
```

## Example Embed Code (Replace YOUR-SITE-URL)

Here's what a working embed code looks like:

```html
<iframe 
  src="https://YOUR-SITE-URL.netlify.app/admin/" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

**Important:** Replace `YOUR-SITE-URL.netlify.app` with your actual Netlify URL!

## Why This Happens

When you embed in Webflow:
- ❌ Relative paths like `/admin/` don't work (they look for the page on Webflow's domain)
- ✅ Full URLs like `https://your-site.netlify.app/admin/` work perfectly

## Alternative: Button Link Instead of Embed

If you prefer, you can add a button that opens the admin panel in a new tab:

```html
<a href="https://YOUR-SITE-URL.netlify.app/admin/" 
   target="_blank" 
   style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem;">
  📻 Open Station Management Tool
</a>
```

## Troubleshooting

### Still seeing 404?
- Make sure you're using your actual Netlify URL
- Check that your site is deployed and live
- Verify the URL works when you visit it directly in a browser

### Embed not loading?
- Check browser console for errors
- Make sure you're using `https://` not `http://`
- Try the standalone embed page first: `/embed-admin.html`

### Need help?
1. Visit `/embed-codes.html` on your deployed site
2. Enter your site URL
3. Copy the generated code
4. Paste into Webflow embed element

## Files Created

I've created these helpful files for you:

1. **`/embed-codes.html`** - Interactive embed code generator
2. **`/embed-admin.html`** - Standalone admin panel page (easier to embed)
3. **`/admin/`** - The actual admin panel

All of these are now in your repository and will be available once you deploy to Netlify!