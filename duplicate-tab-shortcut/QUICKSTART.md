# Quick Start

Get Duplicate Tab Shortcut running locally in about a minute.

## 1. Load the extension

1. Open `chrome://extensions/`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `duplicate-tab-shortcut` folder — the one containing `manifest.json`, not the repository root

The icon appears in the toolbar. Pin it if you want the popup one click away.

## 2. Try it

| Do this | Expect |
| --- | --- |
| Press `Alt+Shift+D` | A copy of the current tab opens right next to it |
| `Ctrl`/`Cmd`+click two more tabs, press `Alt+Shift+D` | All three tabs are duplicated, in order |
| Press `Alt+Shift+M` | The selection is duplicated into a new window |
| Click the toolbar icon | Popup with the selection count, both shortcuts and all settings |

## 3. If the shortcut does nothing

Chrome refuses a suggested shortcut when another extension already owns it.

1. Open `chrome://extensions/shortcuts`
2. Find **Duplicate Tab Shortcut**
3. Assign the keys you want

The popup lists the keys that are actually bound and marks anything unset in red, so check there first.

Also note that Chrome does not deliver extension shortcuts while you are focused on `chrome://` pages, the Chrome Web Store, or another extension's pages. Switch to a normal web page to test.

## 4. After changing the code

Return to `chrome://extensions/` and hit the reload icon on the extension card. Changes to `manifest.json` — especially to `commands` — need that reload before they take effect.

## 5. Before shipping

```bash
cd duplicate-tab-shortcut
npm test
npm run package   # writes dist/duplicate-tab-shortcut-<version>.zip
```

Work through [TESTING.md](TESTING.md) for the manual checklist.
