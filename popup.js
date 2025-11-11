// Get all selected tabs and display their URLs
async function getSelectedTabs() {
  try {
    // Query for highlighted tabs in the current window
    const tabs = await chrome.tabs.query({ 
      currentWindow: true, 
      highlighted: true 
    });
    
    return tabs;
  } catch (error) {
    console.error('Error getting selected tabs:', error);
    throw error;
  }
}

// Display the selected tabs in the UI
function displayTabs(tabs) {
  const tabsInfo = document.getElementById('tabs-info');
  const urlsContainer = document.getElementById('urls-container');
  
  if (tabs.length === 0) {
    tabsInfo.textContent = 'No tabs selected';
    urlsContainer.innerHTML = '<div class="empty-state">No selected tabs found</div>';
    return;
  }
  
  tabsInfo.textContent = `${tabs.length} tab${tabs.length > 1 ? 's' : ''} selected`;
  
  // Display each tab's URL
  urlsContainer.innerHTML = tabs.map(tab => `
    <div class="url-item">
      <div class="url-title">${escapeHtml(tab.title)}</div>
      <div class="url-link">${escapeHtml(tab.url)}</div>
    </div>
  `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Copy URLs to clipboard
async function copyUrlsToClipboard(tabs) {
  if (tabs.length === 0) {
    showStatus('No tabs to copy', 'error');
    return;
  }
  
  // Format URLs - one per line
  const urlsText = tabs.map(tab => tab.url).join('\n');
  
  try {
    // Use the Clipboard API to copy text
    await navigator.clipboard.writeText(urlsText);
    showStatus(`✓ Copied ${tabs.length} URL${tabs.length > 1 ? 's' : ''} to clipboard!`, 'success');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    showStatus('Failed to copy to clipboard', 'error');
  }
}

// Show status message
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  
  // Hide success message after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      status.className = 'status';
    }, 3000);
  }
}

// Initialize the popup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const tabs = await getSelectedTabs();
    displayTabs(tabs);
    
    // Set up copy button
    const copyButton = document.getElementById('copyButton');
    copyButton.addEventListener('click', () => copyUrlsToClipboard(tabs));
    
    // Disable button if no tabs selected
    if (tabs.length === 0) {
      copyButton.disabled = true;
    }
  } catch (error) {
    showStatus('Error loading tabs', 'error');
    console.error(error);
  }
});
