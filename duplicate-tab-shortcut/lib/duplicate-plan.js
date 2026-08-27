// Pure helpers that decide *what* to duplicate and *where* the copies go.
// No `chrome.*` access lives here so the rules can be unit tested in Node.

export function planDuplication(selectedTabs, settings) {
  const ordered = (Array.isArray(selectedTabs) ? selectedTabs : [])
    .filter((tab) => tab && Number.isInteger(tab.id) && tab.id >= 0)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  const limit = Math.max(1, settings.maxTabsPerRun);

  return {
    tabs: ordered.slice(0, limit),
    skippedForLimit: Math.max(0, ordered.length - limit)
  };
}

// Chrome refuses to move a pinned tab past the unpinned ones, so "end of the
// tab strip" means the end of the pinned section for a pinned duplicate.
export function endOfStripIndex({ pinned, pinnedTabCount }) {
  if (!pinned) {
    return -1;
  }
  return Math.max(0, pinnedTabCount - 1);
}

// chrome.tabs.highlight activates whichever tab is listed first, so the tab
// that was active before the run keeps focus when the user opts out of
// following the duplicates.
export function highlightOrder(tabs, activeTabId) {
  const indices = tabs
    .filter((tab) => tab && Number.isInteger(tab.index))
    .map((tab) => ({ id: tab.id, index: tab.index }));

  const active = indices.find((tab) => tab.id === activeTabId);
  const rest = indices.filter((tab) => tab.id !== activeTabId).map((tab) => tab.index);

  return active ? [active.index, ...rest] : indices.map((tab) => tab.index);
}

export function formatTabCount(count) {
  return `${count} tab${count === 1 ? '' : 's'}`;
}

export function summarizeRun({ created, failed, skippedForLimit, newWindow }) {
  if (created === 0) {
    return failed > 0 ? 'Chrome refused to duplicate those tabs' : 'Nothing to duplicate';
  }

  const destination = newWindow ? ' into a new window' : '';
  const parts = [`Duplicated ${formatTabCount(created)}${destination}`];

  if (skippedForLimit > 0) {
    parts.push(`${skippedForLimit} skipped by the per-run limit`);
  }
  if (failed > 0) {
    parts.push(`${formatTabCount(failed)} could not be duplicated`);
  }

  return parts.join(' · ');
}
