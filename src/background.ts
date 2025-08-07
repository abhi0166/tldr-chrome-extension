// Background script for TLDR Chrome Extension
console.log('TLDR Background script loaded');

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tldr-summarize",
    title: "Summarize with TLDR",
    contexts: ["page", "selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "tldr-summarize" && tab?.id) {
    chrome.storage.sync.get(["tldrSettings"]).then(result => {
      const settings = result.tldrSettings || {
        length: "medium",
        style: "paragraph",
        backendUrl: "http://localhost:5000"
      };

      // Send message to content script to extract and summarize text
      chrome.tabs.sendMessage(tab.id!, {
        action: "summarize",
        settings: settings,
        selectedText: info.selectionText || null
      } );
    });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    // Forward to content script
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, request);
    }
  }
  
  if (request.action === "getSettings") {
    chrome.storage.sync.get(["tldrSettings"]).then(result => {
      sendResponse(result.tldrSettings || {
        length: "medium",
        style: "paragraph", 
        backendUrl: "http://localhost:5000"
      } );
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === "saveSettings") {
    chrome.storage.sync.set({ tldrSettings: request.settings }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// // Handle extension icon click
// chrome.action.onClicked.addListener((_tab) => {
//   // This will open the popup automatically
//   console.log('Extension icon clicked');
// });
