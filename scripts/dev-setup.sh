#!/bin/bash

# TLDR Chrome Extension Development Setup Script
# Sets up the development environment for both frontend and backend

set -e

echo "🛠️  TLDR Development Environment Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Set up backend
echo "🐍 Setting up Python backend..."
cd backend

# Check Python version
python_version=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Python 3.8+ required. Current version: $python_version"
    exit 1
fi

echo "✅ Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check spaCy model
echo "🔍 Checking spaCy model..."
if ! python -c "import spacy; spacy.load('en_core_web_sm')" 2>/dev/null; then
    echo "📥 Installing spaCy English model..."
    python -m spacy download en_core_web_sm
fi

# Check Ollama
echo "🔍 Checking Ollama installation..."
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is installed"
    
    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama is running"
        
        # Check for recommended model
        if ollama list | grep -q "llama3.1:8b"; then
            echo "✅ Recommended model llama3.1:8b is available"
        else
            echo "⚠️  Recommended model not found. To install:"
            echo "   ollama pull llama3.1:8b"
        fi
    else
        echo "⚠️  Ollama is not running. Start it with: ollama serve"
    fi
else
    echo "⚠️  Ollama not found. Install from: https://ollama.ai"
fi

cd ..

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "To start development:"
echo "1. Start the backend server:"
echo "   cd backend && python start_server.py"
echo ""
echo "2. Build the extension:"
echo "   npm run build"
echo ""
echo "3. Load the extension in Chrome:"
echo "   - Open chrome://extensions/"
echo "   - Enable Developer mode"
echo "   - Click 'Load unpacked' and select the 'dist' folder"
echo ""
echo "For development with auto-rebuild:"
echo "   npm run dev"

