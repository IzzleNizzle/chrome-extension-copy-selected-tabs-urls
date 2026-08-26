# Testing Guide

## Automated

```bash
cd duplicate-tab-shortcut
npm test
```

`node --test` covers everything in `lib/`: selection ordering, the per-run limit, pinned-aware move indices, highlight ordering, status wording, and settings normalization. Anything that needs a live `chrome.*` API is covered by the manual checklist below.

## Manual checklist

Load the unpacked extension first (see [QUICKSTART.md](QUICKSTART.md)) and run these on ordinary web pages — Chrome does not deliver extension shortcuts on `chrome://` pages or the Web Store.

### Single tab

- [ ] `Alt+Shift+D` on a normal page creates one copy directly to the right of the original
- [ ] The copy loads the same URL
- [ ] The toolbar icon briefly shows a green `+1` badge
- [ ] Pressing the shortcut repeatedly creates one copy per press

### Multiple tabs

- [ ] Select three adjacent tabs with `Shift`+click, press `Alt+Shift+D` — three copies appear, in the same left-to-right order
- [ ] Select three non-adjacent tabs with `Ctrl`/`Cmd`+click, press `Alt+Shift+D` — each copy appears next to its own original
- [ ] The copies end up selected as a group (they can be dragged together)
- [ ] The badge shows `+3`

### New window

- [ ] `Alt+Shift+N` with one tab selected opens a new window containing one copy
- [ ] `Alt+Shift+N` with three tabs selected opens one new window containing all three copies, in order
- [ ] The original window keeps its tabs untouched

### Placement setting

- [ ] With **Right after the original tab**, copies appear beside their source
- [ ] With **At the end of the tab strip**, copies are collected at the far right in selection order
- [ ] With **At the end of the tab strip** and a pinned tab selected, the pinned copy stays inside the pinned section rather than erroring

### Focus setting

- [ ] With **Switch to the duplicates** on, focus lands on the copy of the tab that was active
- [ ] With it off, the tab you were on stays active and the original selection stays highlighted
- [ ] With it off, `Alt+Shift+N` opens the new window in the background

### Pinned tabs

- [ ] With **Keep duplicates of pinned tabs pinned** on, duplicating a pinned tab produces a pinned copy
- [ ] With it off, the copy is unpinned and sits with the normal tabs
- [ ] Duplicating a mix of pinned and unpinned tabs works and does not throw in the service worker console

### Per-run limit

- [ ] Set the limit to 2, select 5 tabs, press the shortcut — only 2 copies are created
- [ ] The popup reports how many were skipped when duplication is triggered from the popup button
- [ ] Values below 1 or above 100 are clamped when typed into the popup

### Popup

- [ ] The header reports the correct selection count and pluralization ("1 tab selected" / "3 tabs selected")
- [ ] Pinned tabs in the selection are mentioned
- [ ] Both buttons are disabled when no tab is selected
- [ ] The shortcut list shows the keys actually bound, and marks unbound commands in red
- [ ] **Change shortcuts in Chrome** opens `chrome://extensions/shortcuts`
- [ ] Changing any setting persists after closing and reopening the popup
- [ ] Settings survive a browser restart

### Badge

- [ ] With the badge setting off, no badge appears
- [ ] The badge clears on its own after a couple of seconds
- [ ] Triggering the shortcut with no eligible tab shows a grey `0`

### Edge cases

- [ ] Duplicating a tab that is playing audio works
- [ ] Duplicating a discarded/sleeping tab either works or fails quietly without breaking the rest of the run
- [ ] Duplicating a `chrome://` tab from the popup (where the shortcut is unavailable) behaves sensibly
- [ ] With two Chrome windows open, only tabs in the focused window are duplicated
- [ ] The service worker console (`chrome://extensions/` → **service worker**) is free of errors after all of the above

## Known limitations

- Chrome does not deliver extension keyboard shortcuts while `chrome://` pages, the Chrome Web Store, or other extensions' pages have focus
- Duplicating into a new window unpins the copies, because Chrome cannot place a pinned tab after unpinned tabs
- A duplicate reloads the URL; unsaved form input and scroll position are not carried across, exactly as with Chrome's built-in "Duplicate"
- Chrome allows at most four suggested-key commands per extension; this extension uses two
