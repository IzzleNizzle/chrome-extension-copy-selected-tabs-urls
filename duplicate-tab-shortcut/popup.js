import { DEFAULT_SETTINGS, normalizeSettings } from './lib/settings.js';
import { formatTabCount } from './lib/duplicate-plan.js';

const SHORTCUTS_PAGE = 'chrome://extensions/shortcuts';

const elements = {
  selectionSummary: document.getElementById('selection-summary'),
  status: document.getElementById('status'),
  duplicateButton: document.getElementById('duplicateButton'),
  duplicateWindowButton: document.getElementById('duplicateWindowButton'),
  shortcutList: document.getElementById('shortcut-list'),
  shortcutsLink: document.getElementById('shortcutsLink'),
  focusDuplicates: document.getElementById('focusDuplicates'),
  keepPinnedState: document.getElementById('keepPinnedState'),
  showBadgeCount: document.getElementById('showBadgeCount'),
  maxTabsPerRun: document.getElementById('maxTabsPerRun')
};

function showStatus(message, type) {
  elements.status.textContent = message;
  elements.status.className = `status ${type}`;
}

async function loadSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return normalizeSettings(stored);
}

function applySettingsToForm(settings) {
  const placement = document.querySelector(`input[name="placement"][value="${settings.placement}"]`);
  if (placement) {
    placement.checked = true;
  }
  elements.focusDuplicates.checked = settings.focusDuplicates;
  elements.keepPinnedState.checked = settings.keepPinnedState;
  elements.showBadgeCount.checked = settings.showBadgeCount;
  elements.maxTabsPerRun.value = String(settings.maxTabsPerRun);
}

function readSettingsFromForm() {
  return normalizeSettings({
    placement: document.querySelector('input[name="placement"]:checked')?.value,
    focusDuplicates: elements.focusDuplicates.checked,
    keepPinnedState: elements.keepPinnedState.checked,
    showBadgeCount: elements.showBadgeCount.checked,
    maxTabsPerRun: elements.maxTabsPerRun.value
  });
}

async function saveSettings() {
  const settings = readSettingsFromForm();
  await chrome.storage.sync.set(settings);
  // The number input accepts anything until it is normalized, so mirror the
  // stored value back into the form.
  applySettingsToForm(settings);
}

async function describeSelection(settings) {
  const tabs = await chrome.tabs.query({ currentWindow: true, highlighted: true });
  const count = tabs.length;
  const pinned = tabs.filter((tab) => tab.pinned).length;

  const details = [];
  if (pinned > 0) {
    details.push(`${pinned} pinned`);
  }
  if (count > settings.maxTabsPerRun) {
    details.push(`only the first ${settings.maxTabsPerRun} will be duplicated`);
  }

  elements.selectionSummary.textContent = details.length
    ? `${formatTabCount(count)} selected (${details.join(', ')})`
    : `${formatTabCount(count)} selected`;

  const label = count === 1 ? 'Duplicate this tab' : `Duplicate ${formatTabCount(count)}`;
  elements.duplicateButton.textContent = label;
  elements.duplicateWindowButton.textContent =
    count === 1 ? 'Duplicate into a new window' : 'Duplicate all into a new window';

  const disabled = count === 0;
  elements.duplicateButton.disabled = disabled;
  elements.duplicateWindowButton.disabled = disabled;
}

async function renderShortcuts() {
  const commands = await chrome.commands.getAll();
  const relevant = commands.filter((command) => command.name !== '_execute_action');

  elements.shortcutList.replaceChildren(
    ...relevant.map((command) => {
      const item = document.createElement('li');
      item.className = 'shortcut-item';

      const description = document.createElement('span');
      description.textContent = command.description || command.name;

      const keys = document.createElement('span');
      keys.className = command.shortcut ? 'shortcut-keys' : 'shortcut-keys unset';
      keys.textContent = command.shortcut || 'Not set';

      item.append(description, keys);
      return item;
    })
  );
}

async function duplicate(newWindow) {
  elements.duplicateButton.disabled = true;
  elements.duplicateWindowButton.disabled = true;

  try {
    const response = await chrome.runtime.sendMessage({ type: 'duplicate', newWindow });
    if (response?.ok) {
      showStatus(response.message, response.result.created > 0 ? 'success' : 'error');
    } else {
      showStatus(response?.message ?? 'Something went wrong while duplicating', 'error');
    }
  } catch (error) {
    console.error(error);
    showStatus('Could not reach the extension service worker', 'error');
  } finally {
    const settings = await loadSettings();
    await describeSelection(settings);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const settings = await loadSettings();
    applySettingsToForm(settings);
    await Promise.all([describeSelection(settings), renderShortcuts()]);
  } catch (error) {
    console.error(error);
    showStatus('Could not load the extension state', 'error');
  }

  elements.duplicateButton.addEventListener('click', () => duplicate(false));
  elements.duplicateWindowButton.addEventListener('click', () => duplicate(true));

  elements.shortcutsLink.addEventListener('click', () => {
    // chrome:// URLs cannot be opened from an anchor inside an extension page.
    chrome.tabs.create({ url: SHORTCUTS_PAGE });
    window.close();
  });

  for (const input of document.querySelectorAll('input')) {
    input.addEventListener('change', () => {
      saveSettings()
        .then(() => loadSettings())
        .then((settings) => describeSelection(settings))
        .catch((error) => {
          console.error(error);
          showStatus('Could not save your settings', 'error');
        });
    });
  }
});
