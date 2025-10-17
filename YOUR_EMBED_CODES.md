# Your Ready-to-Use Embed Codes for Webflow

## Your Site URL
```
https://stationprofiles.netlify.app
```

---

## 🎯 Option 1: Simple Iframe Embed (RECOMMENDED)

Copy and paste this into a Webflow **Embed** element:

```html
<iframe 
  src="https://stationprofiles.netlify.app/admin/" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

---

## 🎨 Option 2: Styled Embed with Header

This includes a nice header and better styling:

```html
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px;">
  <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0 0 5px 0; font-size: 1.8rem;">📻 Station Admin Panel</h2>
      <p style="margin: 0; opacity: 0.9;">Manage your Idaho radio station profiles</p>
    </div>
    <iframe 
      src="https://stationprofiles.netlify.app/admin/" 
      width="100%" 
      height="700px" 
      frameborder="0"
      style="border: none; display: block;">
    </iframe>
  </div>
</div>
```

---

## 📱 Option 3: Responsive Embed

This maintains aspect ratio on all devices:

```html
<div style="position: relative; width: 100%; padding-bottom: 75%; background: #f5f5f5; border-radius: 8px; overflow: hidden;">
  <iframe 
    src="https://stationprofiles.netlify.app/admin/" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    frameborder="0">
  </iframe>
</div>
```

---

## 🔗 Option 4: Button Link (Opens in New Tab)

If you prefer a button instead of embedding:

```html
<a href="https://stationprofiles.netlify.app/admin/" 
   target="_blank" 
   style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s;">
  📻 Open Station Management Tool
</a>
```

---

## 🚀 How to Use in Webflow

1. **Copy** one of the embed codes above
2. In Webflow, add an **Embed** element to your page
3. **Paste** the code into the embed element
4. **Publish** your Webflow site
5. ✅ Done! The admin panel will now work

---

## 🔧 Alternative: Use the Standalone Embed Page

For an even cleaner embed, use this URL instead:

```html
<iframe 
  src="https://stationprofiles.netlify.app/embed-admin.html" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

This uses a specially designed embed page with better styling.

---

## 📋 Direct Links

You can also link directly to these pages:

- **Admin Panel:** https://stationprofiles.netlify.app/admin/
- **Embed Code Generator:** https://stationprofiles.netlify.app/embed-codes.html
- **Standalone Embed:** https://stationprofiles.netlify.app/embed-admin.html

---

## ✅ This Will Fix Your 404 Error!

The 404 error you were seeing happened because the embed was using relative paths. These codes use your full Netlify URL, so they'll work perfectly in Webflow!