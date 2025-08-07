import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { FileText, Settings, Loader2, AlertCircle } from 'lucide-react'
import './popup.css'

interface SummarySettings {
  length: 'short' | 'medium' | 'long'
  style: 'bullet' | 'paragraph' | 'key-points'
  backendUrl: string
}

interface SummaryResponse {
  summary: string
  wordCount: number
  originalLength: number
}

const Popup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [settings, setSettings] = useState<SummarySettings>({
    length: 'medium',
    style: 'paragraph',
    backendUrl: 'http://localhost:5000'
  })
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    // Load settings from Chrome storage
    chrome.storage.sync.get(['tldrSettings'], (result) => {
      if (result.tldrSettings) {
        setSettings({ ...settings, ...result.tldrSettings })
      }
    })

    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url)
      }
    })
  }, [])

  const extractAndSummarize = async () => {
    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab.id) throw new Error('No active tab found')

      // Extract text from the page
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractPageText,
      })

      const pageText = results[0]?.result
      if (!pageText || pageText.trim().length === 0) {
        throw new Error('No text content found on this page')
      }

      // Send text to backend for summarization
      const response = await fetch(`${settings.backendUrl}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: pageText,
          length: settings.length,
          style: settings.style,
          url: currentUrl
        }),
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`)
      }

      const data: SummaryResponse = await response.json()
      setSummary(data.summary)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="header-content">
          <FileText className="header-icon" size={24} />
          <h1 className="header-title">TLDR</h1>
        </div>
        <button 
          className="settings-button"
          onClick={openOptions}
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </header>

      <div className="popup-content">
        {currentUrl && (
          <div className="current-page">
            <p className="page-url">{new URL(currentUrl).hostname}</p>
          </div>
        )}

        <div className="controls">
          <div className="quick-settings">
            <div className="setting-group">
              <label>Length:</label>
              <select 
                value={settings.length} 
                onChange={(e) => setSettings({...settings, length: e.target.value as any})}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Style:</label>
              <select 
                value={settings.style} 
                onChange={(e) => setSettings({...settings, style: e.target.value as any})}
              >
                <option value="paragraph">Paragraph</option>
                <option value="bullet">Bullet Points</option>
                <option value="key-points">Key Points</option>
              </select>
            </div>
          </div>

          <button 
            className="summarize-button"
            onClick={extractAndSummarize}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="spinner" size={16} />
                Summarizing...
              </>
            ) : (
              'Summarize Page'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {summary && (
          <div className="summary-container">
            <div className="summary-header">
              <h3>Summary</h3>
              <button 
                className="copy-button"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
            <div className="summary-content">
              {settings.style === 'bullet' ? (
                <ul>
                  {summary.split('\n').filter(line => line.trim()).map((line, index) => (
                    <li key={index}>{line.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              ) : (
                <p>{summary}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Function to extract text from the current page
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

  let mainContent = null
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

// Initialize the popup
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<Popup />)

