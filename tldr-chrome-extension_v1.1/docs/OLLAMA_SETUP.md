# Ollama Installation and Setup Guide

This comprehensive guide will walk you through installing and configuring Ollama for use with the TLDR Chrome Extension. Ollama is a powerful tool that allows you to run large language models locally on your machine, providing privacy-focused AI capabilities for text summarization.

## Table of Contents

- [What is Ollama?](#what-is-ollama)
- [System Requirements](#system-requirements)
- [Installation by Platform](#installation-by-platform)
- [Model Management](#model-management)
- [Configuration](#configuration)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## What is Ollama?

Ollama is an open-source application that makes it easy to run large language models locally on your computer. It provides a simple API for interacting with various AI models, including Llama, Mistral, and CodeLlama. For the TLDR extension, Ollama serves as the AI backend that generates high-quality summaries of web content.

### Key Benefits

- **Privacy**: All processing happens locally on your machine
- **Performance**: No internet dependency for AI operations
- **Flexibility**: Support for multiple model types and sizes
- **Cost-effective**: No API fees or usage limits
- **Offline capability**: Works without internet connection

## System Requirements

### Minimum Requirements

| Component | Specification |
|-----------|---------------|
| **Operating System** | Windows 10+, macOS 10.15+, or Linux |
| **RAM** | 8GB (for 7B models) |
| **Storage** | 10GB free space |
| **CPU** | 64-bit processor with AVX support |
| **Internet** | Required for initial model downloads |

### Recommended Requirements

| Component | Specification |
|-----------|---------------|
| **RAM** | 16GB+ (for better performance) |
| **Storage** | 50GB+ SSD (for multiple models) |
| **GPU** | NVIDIA GPU with 8GB+ VRAM (optional) |
| **CPU** | Modern multi-core processor |

### GPU Acceleration Support

Ollama supports GPU acceleration on:
- **NVIDIA GPUs**: CUDA-compatible cards (GTX 1060+, RTX series)
- **Apple Silicon**: M1, M2, M3 chips with Metal acceleration
- **AMD GPUs**: Limited support on Linux with ROCm

## Installation by Platform

### Windows Installation

#### Method 1: Official Installer (Recommended)

1. **Download the installer**:
   - Visit [https://ollama.ai](https://ollama.ai)
   - Click "Download for Windows"
   - Save the installer file (typically `OllamaSetup.exe`)

2. **Run the installer**:
   - Double-click the downloaded installer
   - Follow the installation wizard
   - Choose installation directory (default is recommended)
   - Allow the installer to add Ollama to your PATH

3. **Verify installation**:
   ```cmd
   ollama --version
   ```

#### Method 2: Manual Installation

1. **Download the binary**:
   - Go to [GitHub Releases](https://github.com/ollama/ollama/releases)
   - Download the Windows binary
   - Extract to a folder (e.g., `C:\Program Files\Ollama`)

2. **Add to PATH**:
   - Open System Properties → Advanced → Environment Variables
   - Add the Ollama folder to your PATH variable
   - Restart your command prompt

### macOS Installation

#### Method 1: Official Installer (Recommended)

1. **Download the installer**:
   - Visit [https://ollama.ai](https://ollama.ai)
   - Click "Download for Mac"
   - Save the `.dmg` file

2. **Install the application**:
   - Double-click the downloaded `.dmg` file
   - Drag Ollama to your Applications folder
   - Launch Ollama from Applications

3. **Verify installation**:
   ```bash
   ollama --version
   ```

#### Method 2: Homebrew Installation

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Ollama
brew install ollama

# Start the service
brew services start ollama
```

### Linux Installation

#### Method 1: Curl Script (Recommended)

```bash
# Download and install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Verify installation
ollama --version
```

#### Method 2: Package Managers

**Ubuntu/Debian**:
```bash
# Add Ollama repository
curl -fsSL https://ollama.ai/gpg | sudo gpg --dearmor -o /usr/share/keyrings/ollama-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/ollama-keyring.gpg] https://ollama.ai/repo ubuntu main" | sudo tee /etc/apt/sources.list.d/ollama.list

# Install Ollama
sudo apt update
sudo apt install ollama
```

**Fedora/RHEL**:
```bash
# Add Ollama repository
sudo dnf config-manager --add-repo https://ollama.ai/repo/fedora/ollama.repo

# Install Ollama
sudo dnf install ollama
```

**Arch Linux**:
```bash
# Install from AUR
yay -S ollama
# or
paru -S ollama
```

#### Method 3: Docker Installation

```bash
# Pull the Ollama Docker image
docker pull ollama/ollama

# Run Ollama in a container
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# For GPU support (NVIDIA)
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

## Model Management

### Downloading Models

After installing Ollama, you need to download AI models. For TLDR, we recommend starting with these models:

#### Recommended Models for TLDR

1. **Llama 3.1 8B** (Recommended for most users):
   ```bash
   ollama pull llama3.1:8b
   ```
   - Size: ~4.7GB
   - Quality: Excellent
   - Speed: Good
   - RAM: 8GB required

2. **Mistral 7B** (Faster alternative):
   ```bash
   ollama pull mistral:7b
   ```
   - Size: ~4.1GB
   - Quality: Very Good
   - Speed: Fast
   - RAM: 6GB required

3. **Llama 3.1 70B** (Best quality, requires powerful hardware):
   ```bash
   ollama pull llama3.1:70b
   ```
   - Size: ~40GB
   - Quality: Outstanding
   - Speed: Slow
   - RAM: 64GB+ required

### Model Management Commands

```bash
# List installed models
ollama list

# Remove a model
ollama rm llama3.1:8b

# Update a model
ollama pull llama3.1:8b

# Show model information
ollama show llama3.1:8b

# Copy a model with a new name
ollama cp llama3.1:8b my-custom-model
```

### Model Storage Locations

Models are stored in these default locations:

- **Windows**: `%USERPROFILE%\.ollama\models`
- **macOS**: `~/.ollama/models`
- **Linux**: `~/.ollama/models`

You can change the storage location by setting the `OLLAMA_MODELS` environment variable:

```bash
export OLLAMA_MODELS=/path/to/your/models
```

## Configuration

### Basic Configuration

Ollama can be configured through environment variables:

#### Common Environment Variables

```bash
# Model storage location
export OLLAMA_MODELS=/path/to/models

# Server host and port
export OLLAMA_HOST=0.0.0.0:11434

# GPU settings
export OLLAMA_GPU_LAYERS=35  # Number of layers to run on GPU

# Memory settings
export OLLAMA_MAX_LOADED_MODELS=2  # Maximum models in memory
export OLLAMA_MAX_QUEUE=512        # Maximum request queue size

# Logging
export OLLAMA_DEBUG=1  # Enable debug logging
```

#### Platform-Specific Configuration

**Windows** (PowerShell):
```powershell
$env:OLLAMA_MODELS = "C:\OllamaModels"
$env:OLLAMA_HOST = "0.0.0.0:11434"
```

**macOS/Linux** (Bash):
```bash
echo 'export OLLAMA_MODELS="$HOME/ollama-models"' >> ~/.bashrc
echo 'export OLLAMA_HOST="0.0.0.0:11434"' >> ~/.bashrc
source ~/.bashrc
```

### Service Configuration

#### Running as a Service

**Linux (systemd)**:
```bash
# Create service file
sudo tee /etc/systemd/system/ollama.service > /dev/null <<EOF
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="OLLAMA_HOST=0.0.0.0:11434"

[Install]
WantedBy=default.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama
```

**macOS (launchd)**:
```bash
# Create launch agent
mkdir -p ~/Library/LaunchAgents
tee ~/Library/LaunchAgents/com.ollama.ollama.plist > /dev/null <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.ollama</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load and start service
launchctl load ~/Library/LaunchAgents/com.ollama.ollama.plist
launchctl start com.ollama.ollama
```

## Performance Optimization

### Hardware Optimization

#### CPU Optimization

1. **Enable all CPU cores**:
   ```bash
   export OLLAMA_NUM_PARALLEL=4  # Match your CPU core count
   ```

2. **Optimize for your CPU architecture**:
   - Intel CPUs: Ensure AVX2 support is enabled
   - AMD CPUs: Use latest BIOS for best performance
   - Apple Silicon: No additional configuration needed

#### Memory Optimization

1. **Adjust context window**:
   ```bash
   # Reduce context for faster processing
   export OLLAMA_CONTEXT_SIZE=2048  # Default is 4096
   ```

2. **Model loading strategy**:
   ```bash
   # Keep models in memory longer
   export OLLAMA_KEEP_ALIVE=10m  # Keep loaded for 10 minutes
   ```

#### GPU Optimization

1. **NVIDIA GPU setup**:
   ```bash
   # Install CUDA toolkit
   # Ubuntu/Debian
   sudo apt install nvidia-cuda-toolkit
   
   # Verify GPU detection
   ollama run llama3.1:8b "Hello" --verbose
   ```

2. **Optimize GPU memory usage**:
   ```bash
   # Adjust GPU layers based on VRAM
   export OLLAMA_GPU_LAYERS=35  # Reduce if you have less VRAM
   ```

### Network Optimization

#### For TLDR Extension

Configure Ollama to work optimally with the TLDR backend:

1. **Increase timeout values**:
   ```bash
   export OLLAMA_REQUEST_TIMEOUT=120  # 2 minutes for large texts
   ```

2. **Optimize for summarization**:
   ```bash
   export OLLAMA_CONTEXT_SIZE=8192   # Larger context for better summaries
   export OLLAMA_BATCH_SIZE=512      # Optimize batch processing
   ```

## Troubleshooting

### Common Issues and Solutions

#### Issue: "ollama: command not found"

**Cause**: Ollama is not in your system PATH

**Solutions**:
1. **Restart your terminal** after installation
2. **Manually add to PATH**:
   - Windows: Add installation directory to PATH environment variable
   - macOS/Linux: Add `export PATH=$PATH:/usr/local/bin` to your shell profile

#### Issue: "Failed to connect to Ollama"

**Cause**: Ollama service is not running

**Solutions**:
1. **Start Ollama manually**:
   ```bash
   ollama serve
   ```

2. **Check if port is in use**:
   ```bash
   # Check port 11434
   netstat -an | grep 11434
   ```

3. **Try different port**:
   ```bash
   OLLAMA_HOST=0.0.0.0:11435 ollama serve
   ```

#### Issue: "Model not found"

**Cause**: Requested model is not downloaded

**Solutions**:
1. **List available models**:
   ```bash
   ollama list
   ```

2. **Download the model**:
   ```bash
   ollama pull llama3.1:8b
   ```

3. **Check model name spelling** in TLDR backend configuration

#### Issue: "Out of memory" errors

**Cause**: Insufficient RAM for the model

**Solutions**:
1. **Use a smaller model**:
   ```bash
   ollama pull mistral:7b  # Instead of llama3.1:70b
   ```

2. **Reduce context size**:
   ```bash
   export OLLAMA_CONTEXT_SIZE=2048
   ```

3. **Close other applications** to free up RAM

#### Issue: Slow performance

**Cause**: Various optimization issues

**Solutions**:
1. **Enable GPU acceleration** (if available)
2. **Use SSD storage** for model files
3. **Increase RAM** if possible
4. **Use smaller models** for faster processing
5. **Optimize environment variables** as described above

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
# Enable debug mode
export OLLAMA_DEBUG=1
ollama serve

# Check logs
tail -f ~/.ollama/logs/server.log
```

### Health Checks

Verify Ollama is working correctly:

```bash
# Basic health check
curl http://localhost:11434/api/tags

# Test model inference
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:8b",
  "prompt": "Hello, world!",
  "stream": false
}'

# Check system resources
ollama ps  # Show running models
```

## Advanced Usage

### Custom Model Configuration

#### Creating Custom Models

You can create custom models optimized for summarization:

```bash
# Create a Modelfile
cat > Modelfile <<EOF
FROM llama3.1:8b

# Set custom parameters for summarization
PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER top_k 40

# Custom system prompt for summarization
SYSTEM """
You are an expert at creating concise, accurate summaries of text content. 
Focus on the main ideas and key information while maintaining clarity and coherence.
"""
EOF

# Build the custom model
ollama create tldr-summarizer -f Modelfile

# Use the custom model in TLDR backend
# Update OLLAMA_MODEL=tldr-summarizer in your .env file
```

#### Model Quantization

For better performance on limited hardware:

```bash
# Create a quantized version (smaller, faster)
ollama create llama3.1:8b-q4 -f - <<EOF
FROM llama3.1:8b
PARAMETER quantization q4_0
EOF
```

### API Integration

#### Direct API Usage

You can interact with Ollama directly for testing:

```python
import requests
import json

def test_ollama_summarization():
    url = "http://localhost:11434/api/generate"
    
    payload = {
        "model": "llama3.1:8b",
        "prompt": "Summarize this text in 3 sentences: [Your text here]",
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9,
            "max_tokens": 200
        }
    }
    
    response = requests.post(url, json=payload)
    result = response.json()
    
    print("Summary:", result["response"])

# Run the test
test_ollama_summarization()
```

### Performance Monitoring

#### Resource Monitoring

Monitor Ollama performance:

```bash
# Monitor GPU usage (NVIDIA)
nvidia-smi -l 1

# Monitor CPU and memory
htop

# Monitor Ollama processes
ollama ps

# Check model loading times
time ollama run llama3.1:8b "Test prompt"
```

#### Benchmarking

Create benchmarks for your setup:

```python
import time
import requests

def benchmark_summarization():
    test_texts = [
        "Short text for testing...",
        "Medium length text for testing..." * 10,
        "Long text for testing..." * 100
    ]
    
    for i, text in enumerate(test_texts):
        start_time = time.time()
        
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3.1:8b",
            "prompt": f"Summarize: {text}",
            "stream": False
        })
        
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"Test {i+1}: {duration:.2f} seconds")

benchmark_summarization()
```

## Integration with TLDR

### Backend Configuration

Configure the TLDR backend to use your Ollama setup:

1. **Update environment variables**:
   ```bash
   # In backend/.env
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.1:8b
   ```

2. **Test the connection**:
   ```bash
   cd backend
   python -c "
   import requests
   response = requests.get('http://localhost:11434/api/tags')
   print('Ollama status:', response.status_code)
   print('Available models:', [m['name'] for m in response.json()['models']])
   "
   ```

### Optimization for TLDR

Specific optimizations for the TLDR use case:

```bash
# Optimize for summarization workload
export OLLAMA_CONTEXT_SIZE=8192      # Handle longer articles
export OLLAMA_BATCH_SIZE=1           # Process one request at a time
export OLLAMA_KEEP_ALIVE=30m         # Keep model loaded longer
export OLLAMA_REQUEST_TIMEOUT=180    # Allow time for long articles
```

## Conclusion

With Ollama properly installed and configured, your TLDR Chrome Extension will have access to powerful local AI capabilities for generating high-quality summaries. The combination of privacy, performance, and flexibility makes Ollama an excellent choice for local AI processing.

Remember to:
- Choose models appropriate for your hardware
- Monitor resource usage and optimize as needed
- Keep Ollama updated for the latest features and improvements
- Experiment with different models to find the best balance of quality and speed for your needs

For additional support and advanced configurations, refer to the [official Ollama documentation](https://github.com/ollama/ollama) and the TLDR extension's GitHub repository.

