# 📻 Enhanced Station Profile Editor

A powerful visual editor for creating and editing radio station profiles with rich text formatting, advanced image controls, and live preview.

## Features

### 🎨 Rich Text Editing
- **Full formatting toolbar**: Headers, fonts, sizes, colors, backgrounds
- **Text styling**: Bold, italic, underline, strikethrough
- **Lists**: Ordered and unordered lists with indentation
- **Alignment**: Left, center, right, justify
- **Advanced**: Blockquotes, code blocks, links, embedded media
- **Clean interface**: Easy-to-use Quill.js editor

### 📸 Advanced Image Management
- **Multiple upload options**: Upload files or use URLs
- **Image positioning**: Center, float left, float right, inline
- **Text wrapping**: Wrap, no-wrap, tight, loose
- **Sizing controls**: Adjustable width with live preview
- **Styling options**:
  - Border radius (rounded corners)
  - Drop shadows (none, small, medium, large)
  - Custom borders (width and color)
- **Live preview**: See changes in real-time
- **Insert anywhere**: Add images at any point in your content

### 📝 Dual Content Areas
- **Full Profile**: Medium-length station description
- **Full Content**: Complete station history and details
- **Tab switching**: Easy navigation between content areas
- **Independent editing**: Each area has its own rich text editor

### 👁️ Live Preview
- **Real-time updates**: See changes as you type
- **Formatted display**: Preview exactly how content will appear
- **Toggle visibility**: Show/hide preview panel as needed
- **Responsive layout**: Adapts to different screen sizes

### 💾 Station Management
- **Load existing stations**: Browse and edit any station
- **Create new stations**: Start from scratch
- **Complete metadata**: All station fields supported
- **Social media links**: Website, Facebook, Twitter, Instagram
- **JSON export**: Download formatted station data

## How to Use

### 1. Starting the Editor

Open `index.html` in a web browser. The editor will load with a clean interface ready for editing.

### 2. Loading an Existing Station

1. Click **"Load Station"** button in the header
2. Select a station from the list
3. Station data will populate all fields
4. Edit as needed

### 3. Creating a New Station

1. Fill in the **Station Information** fields in the left sidebar:
   - Station ID (required, e.g., "krvb-fm")
   - Station Name (required, e.g., "KRVB - The River")
   - Frequency, Location, Format, Established
   - Synopsis (short description)
   - Social media links

2. Switch between **Full Profile** and **Full Content** tabs to add detailed information

3. Use the rich text toolbar to format your content

### 4. Adding Images

1. **Upload Method**:
   - Click "Choose File" under "Upload Image"
   - Select an image (max 10MB)
   - Image preview appears below

2. **URL Method**:
   - Enter image URL in the "Image URL" field
   - Click "Add from URL"
   - Image preview appears below

3. **Style the Image**:
   - **Position**: Choose where the image appears
   - **Text Wrap**: Control how text flows around the image
   - **Width**: Adjust image size (50-800px)
   - **Border Radius**: Add rounded corners (0-50px)
   - **Shadow**: Add depth (none, small, medium, large)
   - **Border**: Add custom border with color

4. **Insert into Editor**:
   - Click "Insert into Editor" to add the styled image
   - Image appears at cursor position with all styling applied

### 5. Formatting Text

Use the toolbar above each editor:
- **Headers**: H1-H6 for different heading levels
- **Font**: Change font family
- **Size**: Adjust text size
- **Bold/Italic/Underline**: Basic text styling
- **Colors**: Text and background colors
- **Lists**: Bullet points or numbered lists
- **Alignment**: Left, center, right, justify
- **Links**: Add hyperlinks
- **Blockquotes**: Highlight important text
- **Code blocks**: Format code snippets

### 6. Using Live Preview

- Preview panel shows formatted content in real-time
- Toggle preview on/off with "Toggle Preview" button
- Preview updates automatically as you type
- Shows exactly how content will appear on the site

### 7. Saving Your Work

1. Click **"Save Station"** button in the header
2. A JSON file will download automatically
3. Upload the file to GitHub:
   - Go to: `https://github.com/dmccolly/StationProfiles`
   - Navigate to: `public/data/stations/`
   - Upload the downloaded JSON file
   - Commit changes
4. Netlify will automatically deploy your changes

## Tips & Best Practices

### Image Optimization
- Use web-optimized images (JPEG for photos, PNG for logos)
- Keep file sizes under 1MB for faster loading
- Use appropriate dimensions (300-600px width is usually ideal)

### Content Structure
- Use headers to organize content into sections
- Keep paragraphs concise and readable
- Use lists for multiple related items
- Add images to break up long text blocks

### Text Wrapping
- **Float Left/Right**: Great for magazine-style layouts
- **Center**: Best for featured images or logos
- **Inline**: For small icons or inline graphics

### Styling Consistency
- Use similar image styling across all stations
- Maintain consistent header hierarchy
- Keep color schemes professional
- Use shadows sparingly for emphasis

### Mobile Considerations
- Test how images look at different sizes
- Avoid very wide images (max 600px recommended)
- Use responsive text sizes
- Keep layouts simple and clean

## Technical Details

### Technologies Used
- **Quill.js**: Rich text editor
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid**: Responsive layout
- **Local Storage**: Session persistence (future feature)

### File Structure
```
enhanced-editor/
├── index.html          # Main editor interface
├── styles.css          # All styling
├── editor.js           # Editor functionality
└── README.md          # This file
```

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design

### Data Format
Station data is saved as JSON with the following structure:
```json
{
  "id": "station-id",
  "stationName": "CALL - Station Name",
  "frequency": "97.7 FM",
  "location": "City, State",
  "format": "Format Type",
  "established": "Year",
  "synopsis": "Short description",
  "fullProfile": "<p>Rich HTML content</p>",
  "fullContent": "<p>Complete HTML content</p>",
  "logo": "image-url-or-base64",
  "website": "https://...",
  "facebook": "https://...",
  "twitter": "https://...",
  "instagram": "https://..."
}
```

## Deployment

### Local Testing
1. Place the `enhanced-editor` folder in your project
2. Serve via HTTP (required for loading station data)
3. Open `index.html` in browser

### Production Deployment
1. Copy `enhanced-editor` folder to your web server
2. Ensure `/data/stations/` is accessible
3. Update paths if needed in `editor.js`

## Future Enhancements

Potential features for future versions:
- Auto-save to prevent data loss
- Undo/redo functionality
- Template library for common layouts
- Bulk image upload
- Direct GitHub integration (no manual upload)
- Collaborative editing
- Version history
- Export to PDF
- Custom CSS themes

## Support

For issues or questions:
1. Check this README for guidance
2. Review the code comments in `editor.js`
3. Test in different browsers
4. Verify file paths are correct

## License

Part of the Station Profiles project.