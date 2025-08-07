function extractEnhancedPageText() {
  const url = window.location.href;
  const hostname = window.location.hostname;
  if (hostname.includes("office.com") || hostname.includes("officeapps.live.com")) {
    return extractWordDocumentText();
  }
  if (hostname.includes("docs.google.com")) {
    return extractGoogleDocsText();
  }
  if (url.includes(".pdf") || document.querySelector('embed[type="application/pdf"]')) {
    return extractPDFText();
  }
  return extractRegularPageText();
}
function extractWordDocumentText() {
  const wordSelectors = [
    ".DocumentTextLayer",
    ".PageContainer",
    ".Page",
    '[data-automation-id="documentCanvas"]',
    ".CanvasContainer",
    ".WACViewPanel_EditingElement"
  ];
  for (const selector of wordSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText || element.textContent || "";
      if (text.trim().length > 100) {
        return cleanText(text);
      }
    }
  }
  return extractRegularPageText();
}
function extractGoogleDocsText() {
  const docsSelectors = [
    ".kix-appview-editor",
    ".kix-page",
    ".kix-page-content-wrap"
  ];
  for (const selector of docsSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText || element.textContent || "";
      if (text.trim().length > 100) {
        return cleanText(text);
      }
    }
  }
  return extractRegularPageText();
}
function extractPDFText() {
  const pdfSelectors = [
    ".textLayer",
    ".page .textLayer",
    "#viewer .page",
    ".pdfViewer .page"
  ];
  let allText = "";
  for (const selector of pdfSelectors) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const text = element.innerText || element.textContent || "";
      if (text.trim()) {
        allText += text + " ";
      }
    });
  }
  if (allText.trim().length > 100) {
    return cleanText(allText);
  }
  return extractRegularPageText();
}
function extractRegularPageText() {
  const unwantedSelectors = [
    "script",
    "style",
    "nav",
    "header",
    "footer",
    "aside",
    ".advertisement",
    ".ads",
    ".sidebar",
    ".menu",
    ".navigation",
    ".social-share",
    ".comments",
    ".related-posts"
  ];
  const unwantedElements = document.querySelectorAll(unwantedSelectors.join(", "));
  unwantedElements.forEach((el) => el.remove());
  const contentSelectors = [
    "main",
    "article",
    '[role="main"]',
    ".content",
    ".post-content",
    ".entry-content",
    ".article-content",
    ".article-body",
    "#content",
    ".main-content",
    ".story-body",
    ".post-body"
  ];
  let mainContent = null;
  for (const selector of contentSelectors) {
    mainContent = document.querySelector(selector);
    if (mainContent)
      break;
  }
  if (!mainContent) {
    const textBlocks = Array.from(document.querySelectorAll("div, section, p")).filter((el) => {
      const text2 = el.innerText || el.textContent || "";
      return text2.trim().length > 200;
    }).sort((a, b) => {
      const aText = a.innerText || a.textContent || "";
      const bText = b.innerText || b.textContent || "";
      return bText.length - aText.length;
    });
    mainContent = textBlocks[0] || document.body;
  }
  let text = mainContent.innerText || mainContent.textContent || "";
  return cleanText(text);
}
function cleanText(text) {
  return text.replace(/\s+/g, " ").replace(/\n\s*\n/g, "\n").replace(/[\r\n]+/g, "\n").trim();
}
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "extractText") {
    try {
      const text = extractEnhancedPageText();
      sendResponse({ success: true, text });
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
  if (request.action === "getPageInfo") {
    try {
      const pageInfo = {
        title: document.title,
        url: window.location.href,
        hostname: window.location.hostname,
        wordCount: extractEnhancedPageText().split(/\s+/).length,
        hasMainContent: !!document.querySelector('main, article, [role="main"]')
      };
      sendResponse({ success: true, pageInfo });
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
  return true;
});
function detectDocumentType() {
  const url = window.location.href;
  const hostname = window.location.hostname;
  if (hostname.includes("office.com") || hostname.includes("officeapps.live.com")) {
    return "word";
  }
  if (hostname.includes("docs.google.com")) {
    return "google-docs";
  }
  if (url.includes(".pdf") || document.querySelector('embed[type="application/pdf"]')) {
    return "pdf";
  }
  return "webpage";
}
(() => {
  const documentType = detectDocumentType();
  console.log(`TLDR: Detected document type: ${documentType}`);
  if (documentType !== "webpage") {
    console.log("TLDR: Enhanced text extraction available for this document type");
  }
})();
if (typeof window !== "undefined") {
  window.tldrExtractText = extractEnhancedPageText;
}
