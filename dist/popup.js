import { c as createLucideIcon$1, a as client, j as jsxRuntimeExports, r as reactExports, S as Settings, A as AlertCircle } from './chunks/settings.62703aa5.js';

/**
 * lucide-react v0.0.1 - ISC
 */


const FileText = createLucideIcon$1("FileText", [
  [
    "path",
    {
      d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
      key: "1nnpy2"
    }
  ],
  ["polyline", { points: "14 2 14 8 20 8", key: "1ew0cm" }],
  ["line", { x1: "16", x2: "8", y1: "13", y2: "13", key: "14keom" }],
  ["line", { x1: "16", x2: "8", y1: "17", y2: "17", key: "17nazh" }],
  ["line", { x1: "10", x2: "8", y1: "9", y2: "9", key: "1a5vjj" }]
]);

/**
 * lucide-react v0.0.1 - ISC
 */


const Loader2 = createLucideIcon$1("Loader2", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);

const popup = '';

const Popup = () => {
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [summary, setSummary] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [settings, setSettings] = reactExports.useState({
    length: "medium",
    style: "paragraph",
    backendUrl: "http://localhost:5000"
  });
  const [currentUrl, setCurrentUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    chrome.storage.sync.get(["tldrSettings"], (result) => {
      if (result.tldrSettings) {
        setSettings({ ...settings, ...result.tldrSettings });
      }
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);
  const extractAndSummarize = async () => {
    setIsLoading(true);
    setError("");
    setSummary("");
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id)
        throw new Error("No active tab found");
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractPageText
      });
      const pageText = results[0]?.result;
      if (!pageText || pageText.trim().length === 0) {
        throw new Error("No text content found on this page");
      }
      const response = await fetch(`${settings.backendUrl}/api/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: pageText,
          length: settings.length,
          style: settings.style,
          url: currentUrl
        })
      });
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "popup-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-content", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "header-icon", size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "header-title", children: "TLDR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "settings-button",
          onClick: openOptions,
          title: "Settings",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 18 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-content", children: [
      currentUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "current-page", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "page-url", children: new URL(currentUrl).hostname }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quick-settings", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Length:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: settings.length,
                onChange: (e) => setSettings({ ...settings, length: e.target.value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "short", children: "Short" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "long", children: "Long" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Style:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: settings.style,
                onChange: (e) => setSettings({ ...settings, style: e.target.value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paragraph", children: "Paragraph" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bullet", children: "Bullet Points" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "key-points", children: "Key Points" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "summarize-button",
            onClick: extractAndSummarize,
            disabled: isLoading,
            children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "spinner", size: 16 }),
              "Summarizing..."
            ] }) : "Summarize Page"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "error-message", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
      ] }),
      summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "copy-button",
              onClick: copyToClipboard,
              title: "Copy to clipboard",
              children: "Copy"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "summary-content", children: settings.style === "bullet" ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: summary.split("\n").filter((line) => line.trim()).map((line, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: line.replace(/^[•\-\*]\s*/, "") }, index)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: summary }) })
      ] })
    ] })
  ] });
};
function extractPageText() {
  const scripts = document.querySelectorAll("script, style, nav, header, footer, aside");
  scripts.forEach((el) => el.remove());
  const contentSelectors = [
    "main",
    "article",
    '[role="main"]',
    ".content",
    ".post-content",
    ".entry-content",
    ".article-content",
    "#content",
    ".main-content"
  ];
  let mainContent = null;
  for (const selector of contentSelectors) {
    mainContent = document.querySelector(selector);
    if (mainContent)
      break;
  }
  const targetElement = mainContent || document.body;
  let text = targetElement.innerText || targetElement.textContent || "";
  text = text.replace(/\s+/g, " ").replace(/\n\s*\n/g, "\n").trim();
  return text;
}
const root = client.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Popup, {}));
