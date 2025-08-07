// Background script for TLDR Chrome Extension
// Handles extension lifecycle, context menus, and communication

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    const defaultSettings = {
      length: 'medium',
      style: 'paragraph',
      backendUrl: 'http://localhost:5000',
      autoSummarize: false,
      maxTextLength: 10000
    }
    
    chrome.storage.sync.set({ tldrSettings: defaultSettings })
    
    // Open options page on first install
    chrome.runtime.openOptionsPage()
  }
})

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'tldr-summarize',
    title: 'Summarize with TLDR',
    contexts: ['page', 'selection']
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'tldr-summarize' && tab?.id) {
    try {
      // Get settings
      const result = await chrome.storage.sync.get(['tldrSettings'])
      const settings = result.tldrSettings || {
        length: 'medium',
        style: 'paragraph',
        backendUrl: 'http://localhost:5000'
      }

      let textToSummarize = ''

      if (info.selectionText) {
        // Use selected text
        textToSummarize = info.selectionText
      } else {
        // Extract full page text
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extractPageText,
        })
        textToSummarize = results[0]?.result || ''
      }

      if (!textToSummarize.trim()) {
        throw new Error('No text content found')
      }

      // Send to backend for summarization
      const response = await fetch(`${settings.backendUrl}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSummarize,
          length: settings.length,
          style: settings.style,
          url: tab.url
        }),
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`)
      }

      const data = await response.json()

      // Show notification with summary
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'TLDR Summary',
        message: data.summary.substring(0, 300) + (data.summary.length > 300 ? '...' : ''),
        priority: 1
      })

    } catch (error) {
      console.error('Summarization error:', error)
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'TLDR Error',
        message: `Failed to summarize: ${error instanceof Error ? error.message : 'Unknown error'}`,
        priority: 1
      })
    }
  }
})

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'extractText') {
    // This could be used for more complex text extraction scenarios
    sendResponse({ success: true })
  }
  
  if (request.action === 'openOptions') {
    chrome.runtime.openOptionsPage()
    sendResponse({ success: true })
  }
  
  return true // Keep message channel open for async response
})

// Function to extract text from page (same as in popup)
function extractPageText(): string {
  // Remove script and style elements
  const scripts = document.querySelectorAll('script, style, nav, header, footer, aside')
  scripts.forEach(el => el.remove())

  // Try to find main content areas
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '.post-content',
    '.entry-content',
    '.article-content',
    '#content',
    '.main-content'
  ]

  let mainContent: Element | null = null
  for (const selector of contentSelectors) {
    mainContent = document.querySelector(selector)
    if (mainContent) break
  }

  // If no main content found, use body
  const targetElement = mainContent || document.body

  // Extract text content
  let text = (targetElement as HTMLElement).innerText || targetElement.textContent || ''
  
  // Clean up the text
  text = text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim()

  return text
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This is handled by the popup, but we can add fallback behavior here
  console.log('Extension icon clicked for tab:', tab.url)
})

export {}

