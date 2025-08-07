# TLDR Chrome Extension

**AI-Powered Webpage Summarization for Chrome**

TLDR is a powerful Chrome extension that uses advanced AI technology to summarize web pages, articles, and documents instantly. Built with React for the frontend and Python with spaCy and Ollama for the backend, it provides intelligent text summarization with customizable length and style options.

![TLDR Extension Demo](https://via.placeholder.com/800x400/4285f4/ffffff?text=TLDR+Chrome+Extension)

## ✨ Features

### 🚀 **AI-Powered Summarization**
- **Ollama Integration**: Uses Llama 3.1 8B model for high-quality, context-aware summaries
- **Fallback System**: Intelligent extractive summarization when AI is unavailable
- **Multiple Styles**: Choose between paragraph, bullet points, or key points format
- **Customizable Length**: Short (1-2 sentences), Medium (3-5 sentences), or Long (6-10 sentences)

### 🌐 **Universal Compatibility**
- **Regular Web Pages**: Articles, blogs, news sites, and documentation
- **Office Documents**: Word documents opened in Chrome/Office Online
- **Google Docs**: Native support for Google Workspace documents
- **PDF Files**: Basic text extraction from PDF viewers
- **Academic Papers**: Optimized for research articles and technical content

### 🎨 **Modern Interface**
- **React-Based UI**: Clean, responsive design with modern styling
- **Quick Settings**: Adjust summary preferences directly from the popup
- **Options Page**: Comprehensive settings and configuration
- **Context Menu**: Right-click to summarize selected text or entire pages
- **Keyboard Shortcuts**: Fast access to summarization features

### 🔧 **Advanced Features**
- **Smart Text Extraction**: Intelligent content detection and cleaning
- **Backend Health Monitoring**: Real-time status of AI services
- **Cross-Origin Support**: Works with any website through CORS configuration
- **Local Processing**: Privacy-focused with local AI model execution
- **Extensible Architecture**: Easy to add new summarization models

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation Guide](#installation-guide)
- [Backend Setup](#backend-setup)
- [Usage Instructions](#usage-instructions)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites

Before installing TLDR, ensure you have:

1. **Google Chrome** (version 88 or higher)
2. **Python 3.8+** installed on your system
3. **Node.js 16+** (for development only)
4. **Ollama** (recommended for best results)

### One-Command Setup

For the fastest setup experience, run our automated installation script:

```bash
git clone https://github.com/your-username/tldr-chrome-extension.git
cd tldr-chrome-extension
./scripts/dev-setup.sh
```

This script will:
- Install all dependencies
- Set up the Python backend
- Download required AI models
- Build the extension
- Provide installation instructions

## 📦 Installation Guide

### Step 1: Download and Extract

1. **Download the latest release** from the [GitHub Releases page](https://github.com/your-username/tldr-chrome-extension/releases)
2. **Extract the ZIP file** to a folder on your computer
3. **Navigate to the extracted folder** in your terminal or command prompt

### Step 2: Install Chrome Extension

1. **Open Google Chrome** and navigate to `chrome://extensions/`
2. **Enable Developer Mode** by toggling the switch in the top-right corner
3. **Click "Load unpacked"** and select the `dist` folder from the extracted files
4. **Verify installation** by looking for the TLDR icon in your Chrome toolbar

### Step 3: Set Up Backend Server

The TLDR extension requires a local Python server to process and summarize text. Follow these steps to set it up:

#### Automatic Setup (Recommended)

```bash
cd backend
python start_server.py
```

The startup script will automatically:
- Check system requirements
- Install Python dependencies
- Download spaCy language models
- Verify Ollama installation
- Start the backend server

#### Manual Setup

If you prefer manual installation:

```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Install spaCy English model
python -m spacy download en_core_web_sm

# Start the server
python app.py
```

### Step 4: Install Ollama (Optional but Recommended)

For the best summarization quality, install Ollama:

1. **Download Ollama** from [https://ollama.ai](https://ollama.ai)
2. **Install following the platform-specific instructions**
3. **Pull the recommended model**:
   ```bash
   ollama pull llama3.1:8b
   ```
4. **Start Ollama** (usually starts automatically):
   ```bash
   ollama serve
   ```

## 🔧 Backend Setup

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Python | 3.8+ | 3.10+ |
| RAM | 4GB | 8GB+ |
| Storage | 2GB free | 10GB+ (for models) |
| CPU | Dual-core | Quad-core+ |
| GPU | None | NVIDIA GPU (for acceleration) |

### Environment Configuration

Create a `.env` file in the backend directory to customize settings:

```env
# Flask Configuration
FLASK_DEBUG=False
PORT=5000

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Text Processing Configuration
MAX_TEXT_LENGTH=50000
MIN_TEXT_LENGTH=100

# Logging Configuration
LOG_LEVEL=INFO
```

### Ollama Model Options

TLDR supports various Ollama models. Here are the recommended options:

| Model | Size | Quality | Speed | RAM Required |
|-------|------|---------|-------|--------------|
| llama3.1:8b | 4.7GB | Excellent | Medium | 8GB |
| llama3.1:70b | 40GB | Outstanding | Slow | 64GB+ |
| mistral:7b | 4.1GB | Very Good | Fast | 6GB |
| codellama:7b | 3.8GB | Good | Fast | 6GB |

To switch models, update your `.env` file and restart the backend:

```bash
ollama pull mistral:7b
# Update OLLAMA_MODEL=mistral:7b in .env
python app.py
```

## 📖 Usage Instructions

### Basic Usage

1. **Navigate to any webpage** you want to summarize
2. **Click the TLDR icon** in your Chrome toolbar
3. **Adjust settings** if needed (length, style)
4. **Click "Summarize Page"** and wait for the result
5. **Copy or save** the generated summary

### Advanced Features

#### Context Menu Summarization

1. **Right-click on any webpage** or selected text
2. **Choose "Summarize with TLDR"** from the context menu
3. **View the summary** in a notification popup

#### Keyboard Shortcuts

- `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac): Quick summarize
- `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac): Open options

#### Batch Processing

For processing multiple pages:

1. **Open the Options page** from the extension popup
2. **Enable "Auto-summarize"** for automatic processing
3. **Set your preferred defaults** for length and style
4. **Browse normally** - summaries will be generated automatically

### Supported Content Types

#### Web Articles and Blogs

TLDR excels at summarizing:
- News articles from major publications
- Blog posts and opinion pieces
- Technical documentation
- Wikipedia articles
- Academic papers and research

#### Office Documents

Special handling for:
- **Microsoft Word** documents in Office Online
- **Google Docs** with native text extraction
- **PDF files** with basic text layer support
- **PowerPoint presentations** (text content only)

#### Specialized Content

Advanced processing for:
- **Code documentation** with syntax awareness
- **Scientific papers** with abstract and conclusion focus
- **Legal documents** with key points extraction
- **Financial reports** with summary statistics

## ⚙️ Configuration

### Extension Settings

Access the Options page by clicking the settings icon in the extension popup or navigating to `chrome://extensions/` and clicking "Options" for TLDR.

#### Summarization Settings

| Setting | Options | Description |
|---------|---------|-------------|
| **Default Length** | Short, Medium, Long | Controls summary verbosity |
| **Default Style** | Paragraph, Bullet Points, Key Points | Output format preference |
| **Max Text Length** | 1000-50000 characters | Processing limit for large documents |
| **Auto-summarize** | On/Off | Automatic processing when extension opens |

#### Backend Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| **Server URL** | http://localhost:5000 | Backend server address |
| **Connection Timeout** | 60 seconds | Request timeout duration |
| **Retry Attempts** | 3 | Number of retry attempts for failed requests |

### Backend Configuration

#### Performance Tuning

For optimal performance, adjust these settings in your `.env` file:

```env
# For faster processing (lower quality)
OLLAMA_MODEL=mistral:7b
MAX_TEXT_LENGTH=25000

# For better quality (slower processing)
OLLAMA_MODEL=llama3.1:70b
MAX_TEXT_LENGTH=50000

# For development (fastest)
OLLAMA_MODEL=tinyllama:1.1b
MAX_TEXT_LENGTH=10000
```

#### Security Settings

```env
# Restrict CORS origins (production)
CORS_ORIGINS=chrome-extension://your-extension-id

# Enable debug mode (development only)
FLASK_DEBUG=True
LOG_LEVEL=DEBUG
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Extension Not Loading

**Problem**: Extension doesn't appear in Chrome toolbar

**Solutions**:
1. Verify Developer Mode is enabled in `chrome://extensions/`
2. Check that you selected the `dist` folder, not the project root
3. Look for error messages in the Extensions page
4. Try reloading the extension

#### Backend Connection Failed

**Problem**: "Failed to connect to backend" error

**Solutions**:
1. Ensure the backend server is running: `python backend/app.py`
2. Check the server URL in extension options (default: http://localhost:5000)
3. Verify firewall isn't blocking port 5000
4. Test the health endpoint: `curl http://localhost:5000/api/health`

#### Ollama Model Issues

**Problem**: Summaries are low quality or fail

**Solutions**:
1. Verify Ollama is running: `ollama serve`
2. Check available models: `ollama list`
3. Pull the recommended model: `ollama pull llama3.1:8b`
4. Monitor Ollama logs for errors
5. Try a smaller model if RAM is limited: `ollama pull mistral:7b`

#### Text Extraction Problems

**Problem**: No text extracted from certain websites

**Solutions**:
1. Check if the site uses dynamic content loading
2. Wait for the page to fully load before summarizing
3. Try selecting specific text instead of the full page
4. Some sites may block content scripts - this is expected

#### Performance Issues

**Problem**: Slow summarization or high CPU usage

**Solutions**:
1. Use a smaller Ollama model (mistral:7b instead of llama3.1:70b)
2. Reduce MAX_TEXT_LENGTH in backend configuration
3. Close other resource-intensive applications
4. Consider using GPU acceleration if available

### Debug Mode

Enable debug mode for detailed logging:

1. **Backend debugging**:
   ```bash
   export FLASK_DEBUG=True
   python backend/app.py
   ```

2. **Extension debugging**:
   - Open Chrome DevTools (F12)
   - Go to Extensions tab
   - Click "Inspect views: popup" for the TLDR extension
   - Check Console for error messages

### Log Files

Check these locations for detailed error information:

- **Backend logs**: Console output when running `python app.py`
- **Extension logs**: Chrome DevTools Console
- **Ollama logs**: Check Ollama service logs
- **System logs**: OS-specific application logs

## 🛠️ Development

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/tldr-chrome-extension.git
   cd tldr-chrome-extension
   ```

2. **Run the setup script**:
   ```bash
   ./scripts/dev-setup.sh
   ```

3. **Start development servers**:
   ```bash
   # Terminal 1: Frontend development
   npm run dev
   
   # Terminal 2: Backend server
   npm run start:backend
   ```

### Project Structure

```
tldr-chrome-extension/
├── src/                    # Frontend source code
│   ├── popup.tsx          # Main popup component
│   ├── options.tsx        # Options page component
│   ├── background.ts      # Extension background script
│   ├── content-script.ts  # Content script for text extraction
│   └── *.css             # Styling files
├── backend/               # Python backend
│   ├── app.py            # Main Flask application
│   ├── start_server.py   # Server startup script
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend documentation
├── public/               # Static assets
│   ├── manifest.json     # Extension manifest
│   └── icons/           # Extension icons
├── scripts/              # Build and setup scripts
├── dist/                # Built extension (generated)
└── docs/                # Additional documentation
```

### Building for Production

```bash
# Build the extension
npm run build

# Create distribution package
npm run package

# The built extension will be in the dist/ folder
# The packaged extension will be tldr-extension.zip
```

### Testing

#### Unit Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend
python -m pytest
```

#### Integration Tests

```bash
# Test the full pipeline
./scripts/test-integration.sh
```

#### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup opens and displays correctly
- [ ] Options page saves settings
- [ ] Text extraction works on various sites
- [ ] Summarization produces reasonable results
- [ ] Context menu functions properly
- [ ] Backend health check passes

### Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code style and standards
- Pull request process
- Issue reporting guidelines
- Development workflow

## 📚 API Documentation

### Backend Endpoints

#### Health Check

```http
GET /api/health
```

**Response**:
```json
{
  "status": "healthy",
  "spacy_available": true,
  "ollama_available": true,
  "ollama_model": "llama3.1:8b",
  "timestamp": 1699123456.789
}
```

#### Summarize Text

```http
POST /api/summarize
Content-Type: application/json

{
  "text": "Text to summarize...",
  "length": "medium",
  "style": "paragraph",
  "url": "https://example.com"
}
```

**Parameters**:
- `text` (required): Text content to summarize
- `length` (optional): "short", "medium", or "long"
- `style` (optional): "paragraph", "bullet", or "key-points"
- `url` (optional): Source URL for context

**Response**:
```json
{
  "summary": "Generated summary text...",
  "wordCount": 45,
  "originalLength": 200,
  "compressionRatio": 0.23,
  "method": "ollama",
  "url": "https://example.com"
}
```

#### List Models

```http
GET /api/models
```

**Response**:
```json
{
  "models": [
    {
      "name": "llama3.1:8b",
      "size": 4661224448,
      "modified_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Extension API

#### Message Passing

The extension uses Chrome's message passing API for communication between components:

```javascript
// Send message to background script
chrome.runtime.sendMessage({
  action: 'extractText',
  data: { url: 'https://example.com' }
}, (response) => {
  console.log('Response:', response);
});

// Listen for messages in content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractText') {
    const text = extractPageText();
    sendResponse({ success: true, text: text });
  }
});
```

#### Storage API

Settings are stored using Chrome's storage API:

```javascript
// Save settings
chrome.storage.sync.set({
  tldrSettings: {
    length: 'medium',
    style: 'paragraph',
    backendUrl: 'http://localhost:5000'
  }
});

// Load settings
chrome.storage.sync.get(['tldrSettings'], (result) => {
  const settings = result.tldrSettings || defaultSettings;
  // Use settings...
});
```

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** for your changes
4. **Make your changes** and test thoroughly
5. **Submit a pull request** with a clear description

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting
- Use meaningful commit messages

### Reporting Issues

When reporting bugs or requesting features:

1. **Search existing issues** to avoid duplicates
2. **Use the issue templates** provided
3. **Include detailed information** about your environment
4. **Provide steps to reproduce** for bugs
5. **Attach logs or screenshots** when helpful

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama Team** for providing excellent local LLM infrastructure
- **spaCy Team** for advanced natural language processing capabilities
- **React Team** for the powerful frontend framework
- **Chrome Extensions Team** for comprehensive extension APIs
- **Open Source Community** for inspiration and contributions

## 📞 Support

Need help? Here are your options:

- **Documentation**: Check this README and the [Wiki](https://github.com/your-username/tldr-chrome-extension/wiki)
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/your-username/tldr-chrome-extension/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/your-username/tldr-chrome-extension/discussions)
- **Email**: Contact the maintainers at support@tldr-extension.com

---

**Made with ❤️ by the TLDR Team**

*Simplifying information consumption, one summary at a time.*

