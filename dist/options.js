import { c as createLucideIcon$1, a as client, j as jsxRuntimeExports, r as reactExports, S as Settings, A as AlertCircle } from './chunks/settings.62703aa5.js';

/**
 * lucide-react v0.0.1 - ISC
 */


const CheckCircle = createLucideIcon$1("CheckCircle", [
  ["path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14", key: "g774vq" }],
  ["polyline", { points: "22 4 12 14.01 9 11.01", key: "6xbx8j" }]
]);

/**
 * lucide-react v0.0.1 - ISC
 */


const RefreshCw = createLucideIcon$1("RefreshCw", [
  [
    "path",
    { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }
  ],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  [
    "path",
    { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }
  ],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);

/**
 * lucide-react v0.0.1 - ISC
 */


const Save = createLucideIcon$1("Save", [
  [
    "path",
    {
      d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",
      key: "1owoqh"
    }
  ],
  ["polyline", { points: "17 21 17 13 7 13 7 21", key: "1md35c" }],
  ["polyline", { points: "7 3 7 8 15 8", key: "8nz8an" }]
]);

const options = '';

const Options = () => {
  const [settings, setSettings] = reactExports.useState({
    length: "medium",
    style: "paragraph",
    backendUrl: "http://localhost:5000",
    autoSummarize: false,
    maxTextLength: 1e4
  });
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const [isTestingConnection, setIsTestingConnection] = reactExports.useState(false);
  const [connectionStatus, setConnectionStatus] = reactExports.useState("idle");
  reactExports.useEffect(() => {
    chrome.storage.sync.get(["tldrSettings"], (result) => {
      if (result.tldrSettings) {
        setSettings({ ...settings, ...result.tldrSettings });
      }
    });
  }, []);
  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      await chrome.storage.sync.set({ tldrSettings: settings });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3e3);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3e3);
    } finally {
      setIsSaving(false);
    }
  };
  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("idle");
    try {
      const response = await fetch(`${settings.backendUrl}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        setConnectionStatus("success");
      } else {
        setConnectionStatus("error");
      }
    } catch (error) {
      setConnectionStatus("error");
    } finally {
      setIsTestingConnection(false);
      setTimeout(() => setConnectionStatus("idle"), 5e3);
    }
  };
  const resetToDefaults = () => {
    setSettings({
      length: "medium",
      style: "paragraph",
      backendUrl: "http://localhost:5000",
      autoSummarize: false,
      maxTextLength: 1e4
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "options-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "options-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "header-icon", size: 32 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "header-title", children: "TLDR Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "header-subtitle", children: "Configure your summarization preferences" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "options-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Summarization Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "setting-label", children: "Default Summary Length" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Choose how detailed your summaries should be" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "setting-select",
              value: settings.length,
              onChange: (e) => setSettings({ ...settings, length: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "short", children: "Short (1-2 sentences)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium (3-5 sentences)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "long", children: "Long (6-10 sentences)" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "setting-label", children: "Default Summary Style" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Choose the format for your summaries" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "setting-select",
              value: settings.style,
              onChange: (e) => setSettings({ ...settings, style: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paragraph", children: "Paragraph" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bullet", children: "Bullet Points" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "key-points", children: "Key Points" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "setting-label", children: "Maximum Text Length" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Maximum number of characters to process (longer texts will be truncated)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              className: "setting-input",
              value: settings.maxTextLength,
              onChange: (e) => setSettings({ ...settings, maxTextLength: parseInt(e.target.value) || 1e4 }),
              min: "1000",
              max: "50000",
              step: "1000"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "setting-label", children: "Auto-summarize" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Automatically summarize pages when the extension is opened" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "toggle-switch", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: settings.autoSummarize,
                onChange: (e) => setSettings({ ...settings, autoSummarize: e.target.checked })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "toggle-slider" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Backend Configuration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "setting-label", children: "Backend Server URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "URL of your Python backend server running spaCy and Ollama" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "url-input-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "url",
                className: "setting-input",
                value: settings.backendUrl,
                onChange: (e) => setSettings({ ...settings, backendUrl: e.target.value }),
                placeholder: "http://localhost:5000"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "test-button",
                onClick: testConnection,
                disabled: isTestingConnection,
                children: isTestingConnection ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "spinner", size: 16 }) : "Test"
              }
            )
          ] })
        ] }),
        connectionStatus !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `connection-status ${connectionStatus}`, children: connectionStatus === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Backend connection successful!" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Failed to connect to backend. Make sure the server is running." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Installation Guide" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "guide-content", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Setting up the Backend" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Install Python 3.8+ on your system" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Install Ollama from ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://ollama.ai", target: "_blank", rel: "noopener noreferrer", children: "ollama.ai" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Run: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "ollama pull llama3.1:8b" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Navigate to the backend directory and run: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "pip install -r requirements.txt" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Start the server: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "python app.py" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Supported Websites" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Regular web pages and articles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Word documents opened in Chrome" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "PDF documents (basic support)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "News articles and blog posts" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "reset-button",
            onClick: resetToDefaults,
            children: "Reset to Defaults"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "save-button",
            onClick: saveSettings,
            disabled: isSaving,
            children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "spinner", size: 16 }),
              "Saving..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
              "Save Settings"
            ] })
          }
        )
      ] }),
      saveStatus !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `save-status ${saveStatus}`, children: saveStatus === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Settings saved successfully!" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Failed to save settings. Please try again." })
      ] }) })
    ] })
  ] });
};
const root = client.createRoot(document.getElementById("options-root"));
root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Options, {}));
