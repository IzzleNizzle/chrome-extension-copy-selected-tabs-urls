# Contributing Guide

## Development Setup

This extension is built with vanilla JavaScript and requires no build step or dependencies.

### Prerequisites
- Google Chrome (version 88+) or Chromium-based browser
- Text editor or IDE

### Local Development

1. Clone the repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder
5. Make changes to the code
6. Click the reload icon on the extension card to test changes

### File Structure

```
├── manifest.json       # Extension configuration (permissions, metadata)
├── popup.html         # Extension popup UI structure
├── popup.css          # Popup styling
├── popup.js           # Main extension logic
├── icons/             # Extension icons (various sizes)
├── README.md          # User documentation
├── TESTING.md         # Testing guide
└── CONTRIBUTING.md    # This file
```

## Making Changes

### Adding New Features

1. **Modify the manifest.json** if you need new permissions
2. **Update popup.html** for UI changes
3. **Update popup.css** for styling changes
4. **Update popup.js** for functionality changes
5. **Update README.md** to document new features
6. **Test thoroughly** using the guide in TESTING.md

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (except in HTML)
- Add comments for complex logic
- Use async/await for asynchronous operations
- Handle errors gracefully with try/catch

### Best Practices

1. **Security**: Never use `eval()` or inject untrusted content
2. **Privacy**: Don't send tab data to external servers
3. **Performance**: Keep popup.js lightweight
4. **Compatibility**: Test on latest Chrome/Edge versions
5. **Accessibility**: Ensure UI is keyboard navigable

## Testing

Before submitting changes:

1. Load the extension in Chrome
2. Test all scenarios in TESTING.md
3. Verify no console errors
4. Test on multiple URLs and tab configurations
5. Ensure manifest.json is valid JSON

## Debugging

### View Console Logs
- Right-click the extension icon → "Inspect popup"
- Console will show any errors or console.log() statements

### Common Issues

**Extension doesn't load:**
- Check manifest.json syntax
- Ensure all referenced files exist
- Check Chrome console for errors

**Popup doesn't appear:**
- Check popup.html syntax
- Verify popup.js has no syntax errors

**Copy doesn't work:**
- Ensure clipboard API is available (HTTPS or extension context)
- Check browser permissions

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with:
   - Clear description of changes
   - Test results
   - Screenshots if UI changed

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
