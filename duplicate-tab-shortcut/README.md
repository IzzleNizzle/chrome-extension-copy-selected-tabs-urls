# Chrome Extension: Duplicate Tab Shortcut

Duplicate the tab you are on — or every tab you have selected — with a keyboard shortcut, instead of right-clicking the tab strip and hunting for "Duplicate".

Chrome ships the duplicate action only in the tab context menu and does not expose a keyboard shortcut for it. This extension adds one, and extends the action to work on a multi-tab selection.

## Single Purpose Statement

This extension has a single, narrow purpose: **duplicate the currently selected Chrome tab(s) from a keyboard shortcut**.

It duplicates tabs and nothing else. It does not read page content, does not read tab URLs or titles, does not modify web pages, does not track usage, and does not talk to any external service.

## Features

- ⌨️ `Alt+Shift+D` duplicates the active tab
- 🗂️ Duplicates **every selected tab** at once when several tabs are highlighted with `Shift`+click or `Ctrl`/`Cmd`+click
- 🪟 `Alt+Shift+N` duplicates the selection straight into a **new window**
- 🎛️ Fully re-mappable from `chrome://extensions/shortcuts`
- 📍 Choose where duplicates land: right after each original tab (Chrome's own behaviour) or grouped at the end of the tab strip
- 👁️ Choose whether Chrome jumps to the duplicates or keeps you on the tabs you were already using
- 📌 Pinned tabs stay pinned (or not — it's a setting)
- 🔢 A per-run safety limit so an accidental "select all tabs" cannot open hundreds of tabs
- 🔒 Requires **no access to your browsing data** — the only permission is `storage`, for your own settings

## Default shortcuts

| Action | Windows / Linux | macOS |
| --- | --- | --- |
| Duplicate the selected tab(s) | `Alt+Shift+D` | `Option+Shift+D` |
| Duplicate the selected tab(s) into a new window | `Alt+Shift+N` | `Option+Shift+N` |

Chrome silently drops a suggested shortcut if another extension already claimed it. Open `chrome://extensions/shortcuts` to check and re-assign; the extension popup shows the keys that are actually bound and flags any that are unset.

## Installation

### From the Chrome Web Store

Not published yet. Update this section with the listing URL once the item is live.

### From source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked"
5. Select the `duplicate-tab-shortcut` folder (not the repository root)
6. The extension icon appears in your Chrome toolbar and the shortcuts become active

## Usage

### One tab

Press `Alt+Shift+D`. A copy of the current tab opens next to it.

### Several tabs

1. Select the tabs you want:
   - Hold `Shift` and click another tab to select every tab in between
   - Hold `Ctrl` (Windows/Linux) or `Cmd` (Mac) and click individual tabs
2. Press `Alt+Shift+D`

Every selected tab is duplicated, in tab-strip order, and the copies are selected as a group so you can immediately drag or move them together.

### Into a new window

Press `Alt+Shift+N` to send the copies to a brand-new window while leaving your originals where they are. Handy for putting a working copy of a set of tabs on a second monitor.

### From the toolbar

Click the extension icon for a popup that shows how many tabs are selected, a button to duplicate them, the shortcuts currently bound, and all settings.

## Settings

All settings live in the popup and sync with your Chrome profile.

| Setting | Default | What it does |
| --- | --- | --- |
| Where duplicates go | Right after the original | Either next to each source tab, or collected at the end of the tab strip |
| Switch to the duplicates | On | Whether Chrome focuses the new tabs or leaves your original selection active |
| Keep duplicates of pinned tabs pinned | On | When off, copies of pinned tabs are created unpinned |
| Flash the count on the toolbar icon | On | Brief `+N` badge confirming how many tabs were created |
| Never duplicate more than N tabs at once | 20 | Safety limit; extra selected tabs are skipped and reported |

Duplicating into a new window always unpins the copies, because Chrome cannot place a pinned tab after unpinned tabs in another window.

## Chrome Web Store Privacy Information

### Permission Justification

**storage permission**: The extension stores the user's own preferences (duplicate placement, focus behaviour, pinned handling, badge feedback, per-run limit) with `chrome.storage.sync` so they persist across sessions and devices. No browsing data of any kind is stored.

**No `tabs` permission**: Duplicating, moving and selecting tabs works through the `chrome.tabs` API without the `tabs` permission. Without it, Chrome withholds the `url`, `pendingUrl`, `title` and `favIconUrl` of every tab, so the extension is technically incapable of seeing which sites you have open. It only ever handles tab IDs, positions and pinned state.

**No host permissions**: The extension never runs code in a page and never reads page content.

### Remote Code Usage

**Answer: No, I am not using Remote code**

All logic is local JavaScript packaged in the extension (`background.js`, `popup.js`, `lib/*.js`). There are no external scripts, no remotely hosted modules, and no `eval()`.

### Data Usage

This extension collects and transmits no user data whatsoever.

## Chrome Web Store Description

**Duplicate Tab Shortcut** — the keyboard shortcut Chrome forgot.

Chrome makes you right-click a tab and pick "Duplicate" every single time. This extension turns that into one keystroke, and does something Chrome's own menu can't: it duplicates *all* of your selected tabs at once.

**🚀 Key Features:**
• `Alt+Shift+D` duplicates the current tab instantly
• Select several tabs with Shift+click or Ctrl/Cmd+click and duplicate them all in one keystroke
• `Alt+Shift+N` duplicates your selection into a new window
• Re-map both shortcuts to whatever you like
• Choose where copies land: beside the original or at the end of the tab strip
• Choose whether Chrome jumps to the copies or leaves you where you were
• Pinned tabs stay pinned

**💡 Perfect For:**
• Developers keeping a "before" and "after" copy of a page
• Anyone filling out long forms who wants a spare copy of the page
• Researchers branching off from a search results page
• Power users comparing two states of the same site side by side

**🔒 Privacy Focused:**
This extension cannot see your browsing history, your tab URLs, your page titles or your page content. It does not request the "tabs" permission or any host permissions — the only thing it stores is your own settings. Nothing is ever transmitted anywhere.

Stop right-clicking. Install Duplicate Tab Shortcut and duplicate tabs the way you always wanted to.

## Development

```bash
cd duplicate-tab-shortcut

npm test        # unit tests for the pure duplication rules (node --test)
npm run package # build dist/duplicate-tab-shortcut-<version>.zip for the store
npm run icons   # re-render icons/*.png from assets/icon_svg.svg (needs ImageMagick)
```

The same scripts are available from the repository root as `npm run test:duplicate-tabs`, `npm run package:duplicate-tabs` and `npm run icons:duplicate-tabs`.

### Icon Generation

`brew install imagemagick`

```
magick -background none assets/icon_svg.svg -resize 128x128 icons/icon128.png
magick -background none assets/icon_svg.svg -resize 48x48  icons/icon48.png
magick -background none assets/icon_svg.svg -resize 32x32  icons/icon32.png
magick -background none assets/icon_svg.svg -resize 16x16  icons/icon16.png
```

`npm run icons` runs exactly these four commands.

## File Structure

```
duplicate-tab-shortcut/
├── manifest.json               # Extension configuration, commands and icons
├── background.js               # Service worker: listens for the shortcuts and duplicates tabs
├── popup.html                  # Toolbar popup: manual trigger, shortcut list, settings
├── popup.css                   # Popup styling
├── popup.js                    # Popup behaviour
├── lib/
│   ├── settings.js             # Settings contract, defaults and normalization
│   └── duplicate-plan.js       # Pure rules: what to duplicate and where copies go
├── icons/                      # Extension icons (16/32/48/128)
├── assets/
│   └── icon_svg.svg            # Icon source artwork
├── scripts/
│   ├── package-extension.sh    # Builds the Chrome Web Store zip
│   └── generate-icons.sh       # Re-renders the PNG icons from the SVG
├── tests/
│   └── duplicate-plan.test.js  # Unit tests for the pure logic
├── QUICKSTART.md               # Load it in five minutes
├── TESTING.md                  # Manual test checklist
└── README.md                   # This file
```

## Technical Details

- Manifest V3, vanilla JavaScript, no build step and no dependencies
- The service worker is an ES module so the popup, the worker and the Node tests all share `lib/`
- Tabs are duplicated sequentially so the copies keep their tab-strip order
- Placement, focus and pinned handling are applied after duplication via `chrome.tabs.move`, `chrome.tabs.highlight` and `chrome.tabs.update`
- All decision logic that does not need Chrome lives in `lib/` and is covered by `node --test`

## Browser Compatibility

- Chrome (version 88+)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers that support Manifest V3 and the `commands` API

## Known Limitations

- Chrome does not fire extension keyboard shortcuts while the focus is on `chrome://` pages, the Web Store, or other extensions' pages
- Duplicating into a new window unpins the copies
- A duplicated tab reloads its URL; unsaved form state and scroll position in the original page are not carried over (this matches Chrome's own "Duplicate" menu item)
