// Content script for TLDR Chrome Extension
// Runs on all web pages to help with text extraction and special document handling

// Enhanced text extraction for different types of content
function extractEnhancedPageText(): string {
  const url = window.location.href
  const hostname = window.location.hostname

  // Handle Word documents in Office Online
  if (hostname.includes('office.com') || hostname.includes('officeapps.live.com')) {
    return extractWordDocumentText()
  }

  // Handle Google Docs
  if (hostname.includes('docs.google.com')) {
    return extractGoogleDocsText()
  }

  // Handle PDF viewers
  if (url.includes('.pdf') || document.querySelector('embed[type="application/pdf"]')) {
    return extractPDFText()
  }

  // Handle regular web pages
  return extractRegularPageText()
}

function extractWordDocumentText(): string {
  // Try different selectors for Word Online
  const wordSelectors = [
    '.DocumentTextLayer',
    '.PageContainer',
    '.Page',
    '[data-automation-id="documentCanvas"]',
    '.CanvasContainer',
    '.WACViewPanel_EditingElement'
  ]

  for (const selector of wordSelectors) {
    const element = document.querySelector(selector)
    if (element) {
      const text = (element as HTMLElement).innerText || element.textContent || ''
      if (text.trim().length > 100) {
        return cleanText(text)
      }
    }
  }

  // Fallback to body if specific selectors don't work
  return extractRegularPageText()
}

function extractGoogleDocsText(): string {
  // Google Docs specific selectors
  const docsSelectors = [
    '.kix-appview-editor',
    '.kix-page',
    '.kix-page-content-wrap'
  ]

  for (const selector of docsSelectors) {
    const element = document.querySelector(selector)
    if (element) {
      const text = (element as HTMLElement).innerText || element.textContent || ''
      if (text.trim().length > 100) {
        return cleanText(text)
      }
    }
  }

  return extractRegularPageText()
}

function extractPDFText(): string {
  // Try to extract text from PDF viewers
  const pdfSelectors = [
    '.textLayer',
    '.page .textLayer',
    '#viewer .page',
    '.pdfViewer .page'
  ]

  let allText = ''
  for (const selector of pdfSelectors) {
    const elements = document.querySelectorAll(selector)
    elements.forEach(element => {
      const text = (element as HTMLElement).innerText || element.textContent || ''
      if (text.trim()) {
        allText += text + ' '
      }
    })
  }

  if (allText.trim().length > 100) {
    return cleanText(allText)
  }

  return extractRegularPageText()
}

function extractRegularPageText(): string {
  // Remove unwanted elements
  const unwantedSelectors = [
    'script', 'style', 'nav', 'header', 'footer', 'aside',
    '.advertisement', '.ads', '.sidebar', '.menu', '.navigation',
    '.social-share', '.comments', '.related-posts'
  ]

  const unwantedElements = document.querySelectorAll(unwantedSelectors.join(', '))
  unwantedElements.forEach(el => el.remove())

  // Try to find main content areas
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.article-body',
    '#content',
    '.main-content',
    '.story-body',
    '.post-body'
  ]

  let mainContent = null
  for (const selector of contentSelectors) {
    mainContent = document.querySelector(selector)
    if (mainContent) break
  }

  // If no main content found, try to find the largest text block
  if (!mainContent) {
    const textBlocks = Array.from(document.querySelectorAll('div, section, p'))
      .filter(el => {
        const text = (el as HTMLElement).innerText || el.textContent || ''
        return text.trim().length > 200
      })
      .sort((a, b) => {
        const aText = (a as HTMLElement).innerText || a.textContent || ''
        const bText = (b as HTMLElement).innerText || b.textContent || ''
        return bText.length - aText.length
      })

    mainContent = textBlocks[0] || document.body
  }

  // Extract text content
  let text = (mainContent as HTMLElement).innerText || mainContent.textContent || ''
  return cleanText(text)
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .replace(/[\r\n]+/g, '\n') // Normalize line breaks
    .trim()
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'extractText') {
    try {
      const text = extractEnhancedPageText()
      sendResponse({ success: true, text: text })
    } catch (error) {
      sendResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }
  
  if (request.action === 'getPageInfo') {
    try {
      const pageInfo = {
        title: document.title,
        url: window.location.href,
        hostname: window.location.hostname,
        wordCount: extractEnhancedPageText().split(/\s+/).length,
        hasMainContent: !!document.querySelector('main, article, [role="main"]')
      }
      sendResponse({ success: true, pageInfo: pageInfo })
    } catch (error) {
      sendResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  return true // Keep message channel open for async response
})

// Auto-detect document type and prepare for extraction
function detectDocumentType(): string {
  const url = window.location.href
  const hostname = window.location.hostname

  if (hostname.includes('office.com') || hostname.includes('officeapps.live.com')) {
    return 'word'
  }
  if (hostname.includes('docs.google.com')) {
    return 'google-docs'
  }
  if (url.includes('.pdf') || document.querySelector('embed[type="application/pdf"]')) {
    return 'pdf'
  }
  return 'webpage'
}

// Initialize content script
(() => {
  const documentType = detectDocumentType()
  console.log(`TLDR: Detected document type: ${documentType}`)

  // Add a small indicator that TLDR is ready (optional)
  if (documentType !== 'webpage') {
    console.log('TLDR: Enhanced text extraction available for this document type')
  }
})()

// Export for use in other parts of the extension
if (typeof window !== 'undefined') {
  (window as any).tldrExtractText = extractEnhancedPageText
}

export {}

