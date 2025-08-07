console.log("TLDR Background script loaded");
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tldr-summarize",
    title: "Summarize with TLDR",
    contexts: ["page", "selection"]
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "tldr-summarize" && tab?.id) {
    chrome.storage.sync.get(["tldrSettings"]).then((result) => {
      const settings = result.tldrSettings || {
        length: "medium",
        style: "paragraph",
        backendUrl: "http://localhost:5000"
      };
      chrome.tabs.sendMessage(tab.id, {
        action: "summarize",
        settings,
        selectedText: info.selectionText || null
      });
    });
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, request);
    }
  }
  if (request.action === "getSettings") {
    chrome.storage.sync.get(["tldrSettings"]).then((result) => {
      sendResponse(result.tldrSettings || {
        length: "medium",
        style: "paragraph",
        backendUrl: "http://localhost:5000"
      });
    });
    return true;
  }
  if (request.action === "saveSettings") {
    chrome.storage.sync.set({ tldrSettings: request.settings }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});
