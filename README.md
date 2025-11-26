# Chrome Extension: Copy Selected Tabs URLs

A simple Chrome extension that allows you to copy URLs from multiple selected tabs to your clipboard.

## Chrome Web Store Description

**Copy Selected Tabs URLs** - Instantly copy multiple tab URLs to your clipboard with one click!

Save time and boost your productivity with this simple yet powerful Chrome extension. Whether you're researching, sharing resources, or organizing your workflow, copying multiple tab URLs has never been easier.

**🚀 Key Features:**
• One-click copying of all selected tab URLs
• Works seamlessly with Chrome's native tab selection (Ctrl+Click or Shift+Click)
• Clean, intuitive interface showing tab count and previews
• URLs copied as plain text, one per line - perfect for pasting into documents, emails, or notes
• Lightweight and fast - no permissions needed beyond tab access

**💡 Perfect For:**
• Researchers collecting sources and references
• Students gathering study materials
• Developers sharing multiple documentation links
• Content creators organizing resources
• Anyone who frequently shares multiple links

**📋 How It Works:**
1. Select multiple tabs using Ctrl+Click (Windows/Linux) or Cmd+Click (Mac)
2. Click the extension icon in your toolbar
3. Hit "Copy URLs to Clipboard" button
4. Paste your URLs anywhere you need them!

**🔒 Privacy Focused:**
This extension only accesses tab information when you explicitly use it. No data is stored or transmitted - everything stays local to your browser.

Transform your browsing workflow and stop manually copying URLs one by one. Install Copy Selected Tabs URLs today and experience the convenience of bulk URL copying!


## Icon Generation: 

`brew install imagemagick`

```
magick -background none icon_svg.svg -resize 128x128 icons/icon128.png
magick -background none icon_svg.svg -resize 48x48  icons/icon48.png
magick -background none icon_svg.svg -resize 32x32  icons/icon32.png
magick -background none icon_svg.svg -resize 16x16  icons/icon16.png
```

## Features

- 📋 Copy URLs from all selected tabs with one click
- 🎯 Works with Chrome's native tab selection (Shift+Click or Ctrl/Cmd+Click)
- 📊 Shows the number of selected tabs
- ✨ Clean and intuitive user interface
- 📝 Displays both tab titles and URLs

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked"
5. Select the folder containing this extension
6. The extension icon should now appear in your Chrome toolbar

## Usage

1. **Select multiple tabs** in Chrome using one of these methods:
   - Hold `Shift` and click another tab to select all tabs in between
   - Hold `Ctrl` (Windows/Linux) or `Cmd` (Mac) and click individual tabs to select specific tabs
   
2. **Click the extension icon** in your Chrome toolbar

3. The popup will show:
   - The number of selected tabs
   - A preview of all selected tab titles and URLs
   
4. **Click "Copy URLs to Clipboard"** button

5. The URLs are now copied to your clipboard (one URL per line) and ready to paste anywhere!

## Permissions

This extension requires the following permissions:
- `tabs`: To access information about selected tabs (titles and URLs)

## File Structure

```
chrome-extension-copy-selected-tabs-urls/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Main functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Technical Details

- Built with vanilla JavaScript (no frameworks required)
- Uses Chrome Extension Manifest V3
- Utilizes the Clipboard API for copying text
- Uses Chrome Tabs API to query selected tabs

## Browser Compatibility

- Chrome (version 88+)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers that support Manifest V3
