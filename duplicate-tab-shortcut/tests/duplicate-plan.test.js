import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  endOfStripIndex,
  formatTabCount,
  highlightOrder,
  planDuplication,
  summarizeRun
} from '../lib/duplicate-plan.js';
import {
  DEFAULT_SETTINGS,
  MAX_TABS_PER_RUN,
  PLACEMENT_AFTER_SOURCE,
  PLACEMENT_END_OF_STRIP,
  normalizeSettings
} from '../lib/settings.js';

const tab = (id, index, extra = {}) => ({ id, index, pinned: false, ...extra });

describe('planDuplication', () => {
  it('orders tabs by their position in the tab strip', () => {
    const plan = planDuplication([tab(3, 2), tab(1, 0), tab(2, 1)], DEFAULT_SETTINGS);
    assert.deepEqual(
      plan.tabs.map((entry) => entry.id),
      [1, 2, 3]
    );
    assert.equal(plan.skippedForLimit, 0);
  });

  it('caps a run at the configured limit and reports the remainder', () => {
    const tabs = Array.from({ length: 25 }, (_, index) => tab(index + 1, index));
    const plan = planDuplication(tabs, { ...DEFAULT_SETTINGS, maxTabsPerRun: 20 });

    assert.equal(plan.tabs.length, 20);
    assert.equal(plan.skippedForLimit, 5);
  });

  it('ignores entries without a usable tab id', () => {
    const plan = planDuplication([null, { index: 0 }, tab(-1, 1), tab(7, 2)], DEFAULT_SETTINGS);
    assert.deepEqual(
      plan.tabs.map((entry) => entry.id),
      [7]
    );
  });

  it('returns an empty plan when nothing is selected', () => {
    assert.deepEqual(planDuplication([], DEFAULT_SETTINGS), { tabs: [], skippedForLimit: 0 });
    assert.deepEqual(planDuplication(undefined, DEFAULT_SETTINGS), {
      tabs: [],
      skippedForLimit: 0
    });
  });
});

describe('endOfStripIndex', () => {
  it('sends unpinned duplicates to the far right', () => {
    assert.equal(endOfStripIndex({ pinned: false, pinnedTabCount: 3 }), -1);
  });

  it('keeps pinned duplicates inside the pinned section', () => {
    assert.equal(endOfStripIndex({ pinned: true, pinnedTabCount: 3 }), 2);
  });

  it('never returns a negative index for a pinned tab', () => {
    assert.equal(endOfStripIndex({ pinned: true, pinnedTabCount: 0 }), 0);
  });
});

describe('highlightOrder', () => {
  it('lists the tab that should end up active first', () => {
    const tabs = [tab(1, 0), tab(2, 1), tab(3, 2)];
    assert.deepEqual(highlightOrder(tabs, 2), [1, 0, 2]);
  });

  it('falls back to strip order when the active tab is gone', () => {
    const tabs = [tab(1, 0), tab(2, 1)];
    assert.deepEqual(highlightOrder(tabs, 99), [0, 1]);
  });
});

describe('summarizeRun', () => {
  it('describes a plain run', () => {
    assert.equal(
      summarizeRun({ created: 1, failed: 0, skippedForLimit: 0, newWindow: false }),
      'Duplicated 1 tab'
    );
  });

  it('mentions the new window', () => {
    assert.equal(
      summarizeRun({ created: 3, failed: 0, skippedForLimit: 0, newWindow: true }),
      'Duplicated 3 tabs into a new window'
    );
  });

  it('reports skipped and failed tabs', () => {
    assert.equal(
      summarizeRun({ created: 20, failed: 1, skippedForLimit: 4, newWindow: false }),
      'Duplicated 20 tabs · 4 skipped by the per-run limit · 1 tab could not be duplicated'
    );
  });

  it('explains an empty run', () => {
    assert.equal(
      summarizeRun({ created: 0, failed: 0, skippedForLimit: 0, newWindow: false }),
      'Nothing to duplicate'
    );
    assert.equal(
      summarizeRun({ created: 0, failed: 2, skippedForLimit: 0, newWindow: false }),
      'Chrome refused to duplicate those tabs'
    );
  });
});

describe('formatTabCount', () => {
  it('pluralizes', () => {
    assert.equal(formatTabCount(1), '1 tab');
    assert.equal(formatTabCount(0), '0 tabs');
    assert.equal(formatTabCount(4), '4 tabs');
  });
});

describe('normalizeSettings', () => {
  it('falls back to defaults for missing or junk values', () => {
    assert.deepEqual(normalizeSettings(undefined), DEFAULT_SETTINGS);
    assert.deepEqual(normalizeSettings({ placement: 'somewhere-else' }), DEFAULT_SETTINGS);
  });

  it('keeps valid values', () => {
    const settings = normalizeSettings({
      placement: PLACEMENT_END_OF_STRIP,
      focusDuplicates: false,
      keepPinnedState: false,
      showBadgeCount: false,
      maxTabsPerRun: 5
    });

    assert.deepEqual(settings, {
      placement: PLACEMENT_END_OF_STRIP,
      focusDuplicates: false,
      keepPinnedState: false,
      showBadgeCount: false,
      maxTabsPerRun: 5
    });
  });

  it('clamps the per-run limit', () => {
    assert.equal(normalizeSettings({ maxTabsPerRun: 0 }).maxTabsPerRun, 1);
    assert.equal(normalizeSettings({ maxTabsPerRun: -12 }).maxTabsPerRun, 1);
    assert.equal(normalizeSettings({ maxTabsPerRun: 9999 }).maxTabsPerRun, MAX_TABS_PER_RUN);
    assert.equal(normalizeSettings({ maxTabsPerRun: '7' }).maxTabsPerRun, 7);
    assert.equal(
      normalizeSettings({ maxTabsPerRun: '' }).maxTabsPerRun,
      DEFAULT_SETTINGS.maxTabsPerRun
    );
  });

  it('defaults placement to Chrome\u2019s own behaviour', () => {
    assert.equal(DEFAULT_SETTINGS.placement, PLACEMENT_AFTER_SOURCE);
  });
});
