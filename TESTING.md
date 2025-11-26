# Testing Guide

## Manual Testing Instructions

### Installation Test
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this extension folder
5. ✓ Extension should load without errors
6. ✓ Extension icon should appear in toolbar

### Single Tab Test
1. Open a single tab
2. Click the extension icon
3. ✓ Should show "1 tab selected"
4. ✓ Should display the current tab's title and URL
5. Click "Copy URLs to Clipboard"
6. ✓ Should show success message
7. Paste into a text editor
8. ✓ Should paste the single URL

### Multiple Tabs Test (Shift+Click)
1. Open 3-5 different tabs (e.g., google.com, github.com, stackoverflow.com)
2. Click on the first tab
3. Hold Shift and click on the third tab
4. ✓ All tabs in between should be highlighted/selected
5. Click the extension icon
6. ✓ Should show correct count (e.g., "3 tabs selected")
7. ✓ Should display all selected tab titles and URLs
8. Click "Copy URLs to Clipboard"
9. ✓ Should show success message
10. Paste into a text editor
11. ✓ Should paste all URLs, one per line

### Multiple Tabs Test (Ctrl/Cmd+Click)
1. Open 5 different tabs
2. Hold Ctrl (Windows/Linux) or Cmd (Mac)
3. Click on the 1st, 3rd, and 5th tabs
4. ✓ Only those specific tabs should be highlighted
5. Click the extension icon
6. ✓ Should show "3 tabs selected"
7. ✓ Should display only the 3 selected tab titles and URLs
8. Click "Copy URLs to Clipboard"
9. Paste into a text editor
10. ✓ Should paste exactly 3 URLs, one per line

### Edge Cases
1. **No selection**: Open popup when only one tab is open (it's auto-selected)
   - ✓ Should show "1 tab selected" and work normally

2. **All tabs**: Select all tabs (Ctrl+A or Cmd+A in tab strip won't work, but you can Shift+Click from first to last)
   - ✓ Should show all tabs and copy all URLs

3. **Special characters in URLs**: Test with URLs containing special characters
   - ✓ URLs should be copied exactly as they appear

### UI Tests
1. ✓ Popup should be 450px wide and display cleanly
2. ✓ URLs container should scroll if many tabs are selected
3. ✓ Success message should appear and disappear after 3 seconds
4. ✓ Button should be disabled if no tabs are selected (edge case, unlikely)
5. ✓ Tab titles and URLs should be properly escaped (no HTML injection)

## Automated Testing

Currently, this extension uses manual testing. To add automated tests in the future:

1. Consider using Puppeteer for E2E tests
2. Add Jest for unit testing utility functions
3. Test the clipboard API with mock objects

## Known Limitations

1. The clipboard permission is implicit through the Clipboard API (no need to declare it in manifest.json)
2. Extension must be interacted with (icon clicked) to access clipboard
3. Works only with tabs in the current window (not across all windows)

## Success Criteria

All manual tests should pass with ✓ marks. The extension should:
- Correctly identify selected tabs
- Display accurate information
- Successfully copy URLs to clipboard
- Handle edge cases gracefully
- Show appropriate feedback messages
