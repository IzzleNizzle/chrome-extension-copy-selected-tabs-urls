// Shared settings contract for the popup and the service worker.
// Kept free of `chrome.*` calls so it can also run under plain Node for tests.

// Duplicates land immediately to the right of the tab they came from,
// which is what Chrome's own "Duplicate" menu item does.
export const PLACEMENT_AFTER_SOURCE = 'after-source';

// Duplicates are collected at the far right of the tab strip, in selection order.
export const PLACEMENT_END_OF_STRIP = 'end-of-strip';

export const PLACEMENT_VALUES = [PLACEMENT_AFTER_SOURCE, PLACEMENT_END_OF_STRIP];

// Chrome starts to feel unresponsive well before this, and an accidental
// "select all tabs" followed by the shortcut should not open 300 tabs.
export const MIN_TABS_PER_RUN = 1;
export const MAX_TABS_PER_RUN = 100;

export const DEFAULT_SETTINGS = {
  placement: PLACEMENT_AFTER_SOURCE,
  focusDuplicates: true,
  keepPinnedState: true,
  showBadgeCount: true,
  maxTabsPerRun: 20
};

function toBoolean(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

// Storage can hold values written by an older version, by sync from another
// machine, or by a user poking at chrome.storage in the console.
export function normalizeSettings(stored) {
  const source = stored && typeof stored === 'object' ? stored : {};
  const maxTabsPerRun = Number.parseInt(source.maxTabsPerRun, 10);

  return {
    placement: PLACEMENT_VALUES.includes(source.placement)
      ? source.placement
      : DEFAULT_SETTINGS.placement,
    focusDuplicates: toBoolean(source.focusDuplicates, DEFAULT_SETTINGS.focusDuplicates),
    keepPinnedState: toBoolean(source.keepPinnedState, DEFAULT_SETTINGS.keepPinnedState),
    showBadgeCount: toBoolean(source.showBadgeCount, DEFAULT_SETTINGS.showBadgeCount),
    maxTabsPerRun: Number.isNaN(maxTabsPerRun)
      ? DEFAULT_SETTINGS.maxTabsPerRun
      : Math.min(MAX_TABS_PER_RUN, Math.max(MIN_TABS_PER_RUN, maxTabsPerRun))
  };
}
