# Chrome Extension: Copy Selected Tabs URLs

A simple Chrome extension that allows you to copy URLs from multiple selected tabs to your clipboard.

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

## License

MIT License - Feel free to use and modify as needed!