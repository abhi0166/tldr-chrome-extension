import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Settings, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import './options.css'

interface SummarySettings {
  length: 'short' | 'medium' | 'long'
  style: 'bullet' | 'paragraph' | 'key-points'
  backendUrl: string
  autoSummarize: boolean
  maxTextLength: number
}

const Options: React.FC = () => {
  const [settings, setSettings] = useState<SummarySettings>({
    length: 'medium',
    style: 'paragraph',
    backendUrl: 'http://localhost:5000',
    autoSummarize: false,
    maxTextLength: 10000
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Load settings from Chrome storage
    chrome.storage.sync.get(['tldrSettings'], (result) => {
      if (result.tldrSettings) {
        setSettings({ ...settings, ...result.tldrSettings })
      }
    })
  }, [])

  const saveSettings = async () => {
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      await chrome.storage.sync.set({ tldrSettings: settings })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus('idle')

    try {
      const response = await fetch(`${settings.backendUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      setConnectionStatus('error')
    } finally {
      setIsTestingConnection(false)
      setTimeout(() => setConnectionStatus('idle'), 5000)
    }
  }

  const resetToDefaults = () => {
    setSettings({
      length: 'medium',
      style: 'paragraph',
      backendUrl: 'http://localhost:5000',
      autoSummarize: false,
      maxTextLength: 10000
    })
  }

  return (
    <div className="options-container">
      <header className="options-header">
        <div className="header-content">
          <Settings className="header-icon" size={32} />
          <div>
            <h1 className="header-title">TLDR Settings</h1>
            <p className="header-subtitle">Configure your summarization preferences</p>
          </div>
        </div>
      </header>

      <div className="options-content">
        <div className="settings-section">
          <h2 className="section-title">Summarization Settings</h2>
          
          <div className="setting-row">
            <div className="setting-info">
              <label className="setting-label">Default Summary Length</label>
              <p className="setting-description">Choose how detailed your summaries should be</p>
            </div>
            <select 
              className="setting-select"
              value={settings.length} 
              onChange={(e) => setSettings({...settings, length: e.target.value as any})}
            >
              <option value="short">Short (1-2 sentences)</option>
              <option value="medium">Medium (3-5 sentences)</option>
              <option value="long">Long (6-10 sentences)</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <label className="setting-label">Default Summary Style</label>
              <p className="setting-description">Choose the format for your summaries</p>
            </div>
            <select 
              className="setting-select"
              value={settings.style} 
              onChange={(e) => setSettings({...settings, style: e.target.value as any})}
            >
              <option value="paragraph">Paragraph</option>
              <option value="bullet">Bullet Points</option>
              <option value="key-points">Key Points</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <label className="setting-label">Maximum Text Length</label>
              <p className="setting-description">Maximum number of characters to process (longer texts will be truncated)</p>
            </div>
            <input
              type="number"
              className="setting-input"
              value={settings.maxTextLength}
              onChange={(e) => setSettings({...settings, maxTextLength: parseInt(e.target.value) || 10000})}
              min="1000"
              max="50000"
              step="1000"
            />
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <label className="setting-label">Auto-summarize</label>
              <p className="setting-description">Automatically summarize pages when the extension is opened</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoSummarize}
                onChange={(e) => setSettings({...settings, autoSummarize: e.target.checked})}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Backend Configuration</h2>
          
          <div className="setting-row">
            <div className="setting-info">
              <label className="setting-label">Backend Server URL</label>
              <p className="setting-description">URL of your Python backend server running spaCy and Ollama</p>
            </div>
            <div className="url-input-group">
              <input
                type="url"
                className="setting-input"
                value={settings.backendUrl}
                onChange={(e) => setSettings({...settings, backendUrl: e.target.value})}
                placeholder="http://localhost:5000"
              />
              <button 
                className="test-button"
                onClick={testConnection}
                disabled={isTestingConnection}
              >
                {isTestingConnection ? (
                  <RefreshCw className="spinner" size={16} />
                ) : (
                  'Test'
                )}
              </button>
            </div>
          </div>

          {connectionStatus !== 'idle' && (
            <div className={`connection-status ${connectionStatus}`}>
              {connectionStatus === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  <span>Backend connection successful!</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Failed to connect to backend. Make sure the server is running.</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="settings-section">
          <h2 className="section-title">Installation Guide</h2>
          <div className="guide-content">
            <h3>Setting up the Backend</h3>
            <ol>
              <li>Install Python 3.8+ on your system</li>
              <li>Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer">ollama.ai</a></li>
              <li>Run: <code>ollama pull llama3.1:8b</code></li>
              <li>Navigate to the backend directory and run: <code>pip install -r requirements.txt</code></li>
              <li>Start the server: <code>python app.py</code></li>
            </ol>
            
            <h3>Supported Websites</h3>
            <ul>
              <li>Regular web pages and articles</li>
              <li>Word documents opened in Chrome</li>
              <li>PDF documents (basic support)</li>
              <li>News articles and blog posts</li>
            </ul>
          </div>
        </div>

        <div className="actions-section">
          <button 
            className="reset-button"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </button>
          
          <button 
            className="save-button"
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="spinner" size={16} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Settings
              </>
            )}
          </button>
        </div>

        {saveStatus !== 'idle' && (
          <div className={`save-status ${saveStatus}`}>
            {saveStatus === 'success' ? (
              <>
                <CheckCircle size={16} />
                <span>Settings saved successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                <span>Failed to save settings. Please try again.</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Initialize the options page
const root = ReactDOM.createRoot(document.getElementById('options-root')!)
root.render(<Options />)

