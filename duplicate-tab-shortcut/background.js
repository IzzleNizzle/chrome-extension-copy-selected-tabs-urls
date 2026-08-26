import { DEFAULT_SETTINGS, PLACEMENT_END_OF_STRIP, normalizeSettings } from './lib/settings.js';
import {
  endOfStripIndex,
  highlightOrder,
  planDuplication,
  summarizeRun
} from './lib/duplicate-plan.js';

const COMMAND_DUPLICATE = 'duplicate-selected-tabs';
const COMMAND_DUPLICATE_NEW_WINDOW = 'duplicate-selected-tabs-new-window';

const BADGE_COLOR_SUCCESS = '#17A05C';
const BADGE_COLOR_EMPTY = '#9AA0A6';
const BADGE_CLEAR_DELAY_MS = 2000;

async function readSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return normalizeSettings(stored);
}

async function getSelectedTabs() {
  return chrome.tabs.query({ currentWindow: true, highlighted: true });
}

// Duplicating one at a time keeps the copies in tab-strip order; firing the
// calls concurrently lets Chrome interleave the insertions.
async function duplicateSequentially(tabs) {
  const duplicates = [];
  let failed = 0;

  for (const tab of tabs) {
    try {
      const duplicate = await chrome.tabs.duplicate(tab.id);
      if (duplicate) {
        duplicates.push(duplicate);
      } else {
        failed += 1;
      }
    } catch (error) {
      console.error(`Could not duplicate tab ${tab.id}:`, error);
      failed += 1;
    }
  }

  return { duplicates, failed };
}

async function unpin(tabs) {
  const updated = [];

  for (const tab of tabs) {
    if (!tab.pinned) {
      updated.push(tab);
      continue;
    }
    try {
      updated.push(await chrome.tabs.update(tab.id, { pinned: false }));
    } catch (error) {
      console.error(`Could not unpin tab ${tab.id}:`, error);
      updated.push(tab);
    }
  }

  return updated;
}

async function moveToEndOfStrip(duplicates) {
  const windowId = duplicates[0].windowId;
  const tabsInWindow = await chrome.tabs.query({ windowId });
  const pinnedTabCount = tabsInWindow.filter((tab) => tab.pinned).length;

  for (const duplicate of duplicates) {
    const index = endOfStripIndex({ pinned: duplicate.pinned, pinnedTabCount });
    try {
      await chrome.tabs.move(duplicate.id, { index });
    } catch (error) {
      console.error(`Could not move tab ${duplicate.id}:`, error);
    }
  }
}

async function refresh(tabs) {
  const results = await Promise.all(
    tabs.map((tab) => chrome.tabs.get(tab.id).catch(() => null))
  );
  return results.filter(Boolean);
}

async function highlightTabs(tabs, activeTabId) {
  if (tabs.length === 0) {
    return;
  }

  const indices = highlightOrder(tabs, activeTabId);
  if (indices.length === 0) {
    return;
  }

  try {
    await chrome.tabs.highlight({ windowId: tabs[0].windowId, tabs: indices });
  } catch (error) {
    console.error('Could not restore the tab selection:', error);
  }
}

async function flashBadge(text, color, settings) {
  if (!settings.showBadgeCount) {
    return;
  }

  try {
    await chrome.action.setBadgeBackgroundColor({ color });
    await chrome.action.setBadgeText({ text });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' }).catch(() => {});
    }, BADGE_CLEAR_DELAY_MS);
  } catch (error) {
    console.error('Could not update the toolbar badge:', error);
  }
}

async function duplicateInPlace(sourceTabs, settings) {
  const activeSource = sourceTabs.find((tab) => tab.active) ?? sourceTabs[0];
  const { duplicates, failed } = await duplicateSequentially(sourceTabs);

  if (duplicates.length === 0) {
    return { created: 0, failed };
  }

  const placed = settings.keepPinnedState ? duplicates : await unpin(duplicates);

  if (settings.placement === PLACEMENT_END_OF_STRIP) {
    await moveToEndOfStrip(placed);
  }

  // chrome.tabs.duplicate activates the copy of the active tab, so the
  // selection always has to be re-applied to match the user's preference.
  if (settings.focusDuplicates) {
    const fresh = await refresh(placed);
    const activeDuplicate = fresh.find((tab) => tab.openerTabId === activeSource.id) ?? fresh[0];
    await highlightTabs(fresh, activeDuplicate?.id);
  } else {
    const fresh = await refresh(sourceTabs);
    await highlightTabs(fresh, activeSource.id);
  }

  return { created: duplicates.length, failed };
}

async function duplicateIntoNewWindow(sourceTabs, settings) {
  const { duplicates, failed } = await duplicateSequentially(sourceTabs);

  if (duplicates.length === 0) {
    return { created: 0, failed };
  }

  // A pinned tab cannot be appended after unpinned tabs in the new window,
  // so pinned state is intentionally dropped on this path.
  const [first, ...rest] = await unpin(duplicates);

  const createdWindow = await chrome.windows.create({
    tabId: first.id,
    focused: settings.focusDuplicates
  });

  if (rest.length > 0) {
    try {
      await chrome.tabs.move(
        rest.map((tab) => tab.id),
        { windowId: createdWindow.id, index: -1 }
      );
    } catch (error) {
      console.error('Could not move duplicates into the new window:', error);
    }
  }

  if (settings.focusDuplicates) {
    const fresh = await refresh([first, ...rest]);
    await highlightTabs(fresh, first.id);
  }

  return { created: duplicates.length, failed };
}

async function run({ newWindow = false } = {}) {
  const settings = await readSettings();
  const selectedTabs = await getSelectedTabs();
  const plan = planDuplication(selectedTabs, settings);

  if (plan.tabs.length === 0) {
    await flashBadge('0', BADGE_COLOR_EMPTY, settings);
    return { created: 0, failed: 0, skippedForLimit: 0, newWindow };
  }

  const { created, failed } = newWindow
    ? await duplicateIntoNewWindow(plan.tabs, settings)
    : await duplicateInPlace(plan.tabs, settings);

  await flashBadge(
    created > 0 ? `+${created}` : '0',
    created > 0 ? BADGE_COLOR_SUCCESS : BADGE_COLOR_EMPTY,
    settings
  );

  return { created, failed, skippedForLimit: plan.skippedForLimit, newWindow };
}

chrome.commands.onCommand.addListener((command) => {
  if (command === COMMAND_DUPLICATE) {
    run({ newWindow: false }).catch((error) => console.error(error));
  } else if (command === COMMAND_DUPLICATE_NEW_WINDOW) {
    run({ newWindow: true }).catch((error) => console.error(error));
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'duplicate') {
    return false;
  }

  run({ newWindow: Boolean(message.newWindow) })
    .then((result) => sendResponse({ ok: true, result, message: summarizeRun(result) }))
    .catch((error) => {
      console.error(error);
      sendResponse({ ok: false, message: 'Something went wrong while duplicating' });
    });

  // Keeps the message channel open for the async response above.
  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await readSettings();
  await chrome.storage.sync.set(settings);
  await chrome.action.setBadgeTextColor({ color: '#FFFFFF' }).catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  // A badge left over from a run that ended when the worker was torn down.
  chrome.action.setBadgeText({ text: '' }).catch(() => {});
});
