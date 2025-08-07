# TLDR Backend Server

This is the Python backend server for the TLDR Chrome Extension. It provides text summarization using spaCy for text processing and Ollama for AI-powered summarization.

## Features

- **AI-Powered Summarization**: Uses Ollama with Llama 3.1 8B model for high-quality summaries
- **Fallback Summarization**: Simple extractive summarization when Ollama is unavailable
- **Text Preprocessing**: Advanced text cleaning and processing with spaCy
- **Flexible Configuration**: Customizable summary length and style
- **Health Monitoring**: Built-in health check and status endpoints
- **CORS Support**: Ready for Chrome extension integration

## Quick Start

### Prerequisites

1. **Python 3.8+** - [Download Python](https://python.org)
2. **Ollama** - [Install Ollama](https://ollama.ai)

### Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Run the startup script** (recommended):
   ```bash
   python start_server.py
   ```
   
   This script will:
   - Check system requirements
   - Install Python dependencies
   - Download spaCy language model
   - Check Ollama installation
   - Start the server

### Manual Installation

If you prefer manual setup:

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Install spaCy English model**:
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **Install and setup Ollama**:
   ```bash
   # Install Ollama (visit https://ollama.ai for instructions)
   # Then pull the recommended model:
   ollama pull llama3.1:8b
   ```

4. **Start the server**:
   ```bash
   python app.py
   ```

## Configuration

Create a `.env` file (copy from `.env.example`) to customize settings:

```env
# Flask Configuration
FLASK_DEBUG=False
PORT=5000

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Text Processing
MAX_TEXT_LENGTH=50000
MIN_TEXT_LENGTH=100
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and component availability.

### Summarize Text
```
POST /api/summarize
Content-Type: application/json

{
  "text": "Text to summarize...",
  "length": "medium",     // "short", "medium", "long"
  "style": "paragraph",   // "paragraph", "bullet", "key-points"
  "url": "https://example.com"  // optional
}
```

Response:
```json
{
  "summary": "Generated summary...",
  "wordCount": 45,
  "originalLength": 200,
  "compressionRatio": 0.23,
  "method": "ollama",
  "url": "https://example.com"
}
```

### List Models
```
GET /api/models
```
Returns available Ollama models.

## Troubleshooting

### Common Issues

1. **Ollama not found**:
   - Install Ollama from https://ollama.ai
   - Make sure it's running: `ollama serve`

2. **Model not available**:
   - Pull the model: `ollama pull llama3.1:8b`
   - Check available models: `ollama list`

3. **spaCy model missing**:
   - Install manually: `python -m spacy download en_core_web_sm`

4. **CORS errors**:
   - Server automatically allows all origins
   - Check if server is running on correct port

### Performance Tips

1. **Use SSD storage** for better model loading performance
2. **Allocate sufficient RAM** (8GB+ recommended for Llama 3.1 8B)
3. **Use GPU acceleration** if available (configure in Ollama)

## Development

### Running in Development Mode

```bash
export FLASK_DEBUG=True
python app.py
```

### Testing

```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

### API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Test summarization
curl -X POST http://localhost:5000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here...", "length": "medium", "style": "paragraph"}'
```

## Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│ Chrome Extension│───▶│ Flask Server │───▶│   Ollama    │
│                 │    │              │    │ (Llama 3.1) │
└─────────────────┘    └──────────────┘    └─────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │    spaCy     │
                       │ (Text Proc.) │
                       └──────────────┘
```

## License

MIT License - see LICENSE file for details.

