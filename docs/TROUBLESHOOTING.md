# TLDR Chrome Extension Troubleshooting Guide

This comprehensive troubleshooting guide will help you resolve common issues with the TLDR Chrome Extension. Whether you're experiencing problems with installation, configuration, or functionality, this guide provides step-by-step solutions to get your extension working smoothly.

## Table of Contents

- [Quick Diagnostic Checklist](#quick-diagnostic-checklist)
- [Installation Issues](#installation-issues)
- [Extension Loading Problems](#extension-loading-problems)
- [Backend Connection Issues](#backend-connection-issues)
- [Ollama-Related Problems](#ollama-related-problems)
- [Text Extraction Issues](#text-extraction-issues)
- [Summarization Quality Problems](#summarization-quality-problems)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)
- [Advanced Debugging](#advanced-debugging)
- [Getting Help](#getting-help)

## Quick Diagnostic Checklist

Before diving into specific troubleshooting steps, run through this quick checklist to identify the most likely cause of your issue:

### ✅ Basic System Check

- [ ] Chrome version 88 or higher installed
- [ ] Extension loaded in Developer Mode
- [ ] Python 3.8+ installed and accessible
- [ ] Backend server running on port 5000
- [ ] Ollama installed and running (if using AI features)
- [ ] Internet connection available (for initial setup)

### ✅ Extension Status Check

1. **Open Chrome Extensions page**: `chrome://extensions/`
2. **Locate TLDR extension**: Should show as "Enabled"
3. **Check for errors**: Look for red error messages
4. **Verify permissions**: Ensure all required permissions are granted

### ✅ Backend Health Check

1. **Open browser**: Navigate to `http://localhost:5000/api/health`
2. **Expected response**: JSON with status "healthy"
3. **Check components**: Verify spaCy and Ollama availability

### ✅ Quick Test

1. **Open any webpage**: Choose a simple article or blog post
2. **Click TLDR icon**: Should open popup without errors
3. **Try summarization**: Click "Summarize Page" button
4. **Check result**: Should receive summary within 30 seconds

If any of these checks fail, proceed to the relevant troubleshooting section below.

## Installation Issues

### Issue: Extension Won't Install

**Symptoms**:
- "Package is invalid" error when loading extension
- Extension doesn't appear in Chrome toolbar
- Installation process fails silently

**Diagnostic Steps**:

1. **Verify file structure**:
   ```bash
   # Check that these files exist in your extension folder
   ls -la dist/
   # Should show: manifest.json, popup.js, background.js, etc.
   ```

2. **Validate manifest.json**:
   ```bash
   # Check manifest syntax
   python -m json.tool dist/manifest.json
   ```

3. **Check Chrome version compatibility**:
   - Open `chrome://version/`
   - Ensure version is 88 or higher
   - Manifest V3 requires modern Chrome versions

**Solutions**:

1. **Rebuild the extension**:
   ```bash
   npm run clean
   npm install
   npm run build
   ```

2. **Use correct folder**:
   - Load the `dist` folder, not the project root
   - Ensure `dist/manifest.json` exists

3. **Check file permissions**:
   ```bash
   # Make files readable
   chmod -R 755 dist/
   ```

4. **Try different Chrome profile**:
   - Create new Chrome profile
   - Test installation in clean environment

### Issue: Build Process Fails

**Symptoms**:
- TypeScript compilation errors
- Vite build failures
- Missing dependencies

**Diagnostic Steps**:

1. **Check Node.js version**:
   ```bash
   node --version  # Should be 16+
   npm --version   # Should be 8+
   ```

2. **Verify dependencies**:
   ```bash
   npm list --depth=0
   ```

3. **Check for conflicting packages**:
   ```bash
   npm audit
   ```

**Solutions**:

1. **Clean installation**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Update dependencies**:
   ```bash
   npm update
   npm audit fix
   ```

3. **Use specific Node version**:
   ```bash
   # Using nvm (Node Version Manager)
   nvm install 18
   nvm use 18
   npm install
   ```

## Extension Loading Problems

### Issue: Extension Appears Disabled

**Symptoms**:
- Extension icon is grayed out
- Popup doesn't open when clicked
- Context menu items missing

**Diagnostic Steps**:

1. **Check extension status**:
   - Go to `chrome://extensions/`
   - Look for TLDR extension
   - Check if toggle is enabled

2. **Review error messages**:
   - Look for red error text under extension
   - Click "Errors" button if present

3. **Inspect extension details**:
   - Click "Details" button
   - Review permissions and site access

**Solutions**:

1. **Enable the extension**:
   - Toggle the extension switch to "On"
   - Refresh any open web pages

2. **Grant necessary permissions**:
   - Click "Details" → "Permissions"
   - Ensure all permissions are granted
   - Check "Allow in incognito" if needed

3. **Reload the extension**:
   - Click reload button (circular arrow icon)
   - Wait for extension to restart

4. **Check site access**:
   - Set to "On all sites" for full functionality
   - Or manually add specific sites

### Issue: Popup Won't Open

**Symptoms**:
- Clicking extension icon does nothing
- Popup appears blank or shows errors
- Console errors in popup

**Diagnostic Steps**:

1. **Inspect popup**:
   - Right-click extension icon
   - Select "Inspect popup"
   - Check Console tab for errors

2. **Test popup HTML**:
   ```bash
   # Open popup HTML directly
   open dist/index.html  # macOS
   # or
   start dist/index.html  # Windows
   ```

3. **Check popup permissions**:
   - Verify activeTab permission in manifest
   - Ensure popup.js is loading correctly

**Solutions**:

1. **Clear extension data**:
   - Go to `chrome://extensions/`
   - Click "Details" → "Extension options"
   - Clear any stored settings

2. **Disable conflicting extensions**:
   - Temporarily disable other extensions
   - Test if popup works in isolation

3. **Check popup size**:
   - Popup might be too small to see
   - Inspect popup and check CSS dimensions

## Backend Connection Issues

### Issue: "Failed to connect to backend"

**Symptoms**:
- Error message in extension popup
- Summarization requests fail
- Health check returns connection error

**Diagnostic Steps**:

1. **Test backend directly**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check if backend is running**:
   ```bash
   # Check if port 5000 is in use
   netstat -an | grep 5000
   # or
   lsof -i :5000
   ```

3. **Verify backend logs**:
   ```bash
   cd backend
   python app.py
   # Look for startup messages and errors
   ```

**Solutions**:

1. **Start the backend server**:
   ```bash
   cd backend
   python start_server.py
   ```

2. **Check firewall settings**:
   - Ensure port 5000 is not blocked
   - Add exception for Python/Flask if needed

3. **Try different port**:
   ```bash
   # Start backend on different port
   PORT=5001 python app.py
   ```
   
   Then update extension settings:
   - Open extension options
   - Change backend URL to `http://localhost:5001`

4. **Check CORS configuration**:
   - Backend should allow Chrome extension origins
   - Verify CORS headers in network tab

### Issue: Backend Starts But Crashes

**Symptoms**:
- Backend starts successfully but stops after requests
- Python errors in console
- Intermittent connection failures

**Diagnostic Steps**:

1. **Check Python dependencies**:
   ```bash
   cd backend
   pip list | grep -E "(flask|spacy|requests)"
   ```

2. **Test with minimal request**:
   ```bash
   curl -X POST http://localhost:5000/api/summarize \
     -H "Content-Type: application/json" \
     -d '{"text": "Test text", "length": "short"}'
   ```

3. **Monitor resource usage**:
   ```bash
   # Monitor memory and CPU usage
   top -p $(pgrep -f "python.*app.py")
   ```

**Solutions**:

1. **Install missing dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Increase memory limits**:
   ```bash
   # For systems with limited RAM
   export OLLAMA_MAX_LOADED_MODELS=1
   export MAX_TEXT_LENGTH=25000
   ```

3. **Enable debug mode**:
   ```bash
   export FLASK_DEBUG=True
   python app.py
   ```

4. **Check disk space**:
   ```bash
   df -h  # Ensure sufficient disk space
   ```

## Ollama-Related Problems

### Issue: Ollama Not Found

**Symptoms**:
- "ollama: command not found" error
- Backend reports Ollama unavailable
- Fallback summarization always used

**Diagnostic Steps**:

1. **Check Ollama installation**:
   ```bash
   which ollama
   ollama --version
   ```

2. **Verify PATH configuration**:
   ```bash
   echo $PATH | grep ollama
   ```

3. **Test Ollama service**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

**Solutions**:

1. **Install Ollama**:
   - Follow the [Ollama Setup Guide](OLLAMA_SETUP.md)
   - Use official installer from https://ollama.ai

2. **Fix PATH issues**:
   ```bash
   # Add to your shell profile
   echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Start Ollama service**:
   ```bash
   ollama serve
   ```

4. **Check service status**:
   ```bash
   # On Linux with systemd
   systemctl status ollama
   
   # On macOS
   launchctl list | grep ollama
   ```

### Issue: Model Not Available

**Symptoms**:
- "Model not found" errors
- Backend falls back to simple summarization
- Ollama API returns 404 errors

**Diagnostic Steps**:

1. **List installed models**:
   ```bash
   ollama list
   ```

2. **Check model name in configuration**:
   ```bash
   # Check backend/.env file
   grep OLLAMA_MODEL backend/.env
   ```

3. **Test model directly**:
   ```bash
   ollama run llama3.1:8b "Hello world"
   ```

**Solutions**:

1. **Download required model**:
   ```bash
   ollama pull llama3.1:8b
   ```

2. **Update configuration**:
   ```bash
   # Edit backend/.env
   OLLAMA_MODEL=llama3.1:8b  # Match installed model name
   ```

3. **Use alternative model**:
   ```bash
   # If llama3.1:8b is too large, try smaller model
   ollama pull mistral:7b
   # Update OLLAMA_MODEL=mistral:7b in .env
   ```

### Issue: Ollama Performance Problems

**Symptoms**:
- Very slow summarization (>2 minutes)
- High CPU/memory usage
- System becomes unresponsive

**Diagnostic Steps**:

1. **Check system resources**:
   ```bash
   htop  # Monitor CPU and memory
   nvidia-smi  # Check GPU usage (if applicable)
   ```

2. **Monitor Ollama performance**:
   ```bash
   ollama ps  # Show running models
   ```

3. **Test with smaller input**:
   ```bash
   # Test with short text
   curl -X POST http://localhost:11434/api/generate \
     -d '{"model": "llama3.1:8b", "prompt": "Summarize: Hello world", "stream": false}'
   ```

**Solutions**:

1. **Use smaller model**:
   ```bash
   ollama pull mistral:7b
   # Update backend configuration
   ```

2. **Optimize Ollama settings**:
   ```bash
   export OLLAMA_NUM_PARALLEL=2  # Reduce parallel processing
   export OLLAMA_MAX_LOADED_MODELS=1  # Keep fewer models in memory
   ```

3. **Reduce text length**:
   ```bash
   # In backend/.env
   MAX_TEXT_LENGTH=10000  # Reduce from default 50000
   ```

4. **Enable GPU acceleration** (if available):
   ```bash
   # Ensure CUDA is installed for NVIDIA GPUs
   nvidia-smi
   # Ollama should automatically use GPU
   ```

## Text Extraction Issues

### Issue: No Text Extracted from Page

**Symptoms**:
- "No text content found" error
- Empty or very short extracted text
- Summarization fails due to insufficient content

**Diagnostic Steps**:

1. **Test on simple page**:
   - Try on a basic article (e.g., Wikipedia)
   - Check if issue is site-specific

2. **Inspect page structure**:
   - Right-click → "Inspect"
   - Look for main content areas
   - Check if content is dynamically loaded

3. **Test content script**:
   - Open browser console on target page
   - Run: `document.body.innerText.length`
   - Should return substantial number

**Solutions**:

1. **Wait for page to load**:
   - Ensure page is fully loaded before summarizing
   - Some sites load content dynamically

2. **Try selecting specific text**:
   - Select text manually before using extension
   - Use context menu "Summarize with TLDR"

3. **Check for blocked content scripts**:
   - Some sites block extension scripts
   - Try on different websites to confirm

4. **Update content script selectors**:
   - Edit `src/content-script.ts`
   - Add selectors for specific site structures

### Issue: Poor Quality Text Extraction

**Symptoms**:
- Extracted text includes navigation, ads, or irrelevant content
- Missing main article content
- Garbled or poorly formatted text

**Diagnostic Steps**:

1. **Compare with manual selection**:
   - Manually select article text
   - Compare with extension extraction

2. **Check page HTML structure**:
   - Look for semantic HTML tags (article, main)
   - Identify content vs. navigation areas

3. **Test extraction function**:
   ```javascript
   // In browser console
   console.log(window.tldrExtractText());
   ```

**Solutions**:

1. **Improve content selectors**:
   - Edit content script to better identify main content
   - Add site-specific selectors

2. **Filter out unwanted elements**:
   - Update content script to remove ads, navigation
   - Improve text cleaning algorithms

3. **Use reader mode**:
   - Some browsers have reader mode
   - Extract text after enabling reader mode

## Summarization Quality Problems

### Issue: Poor Quality Summaries

**Symptoms**:
- Summaries are inaccurate or irrelevant
- Missing key information
- Repetitive or nonsensical content

**Diagnostic Steps**:

1. **Check input text quality**:
   - Verify extracted text is clean and relevant
   - Test with manually selected text

2. **Test different models**:
   ```bash
   # Try different Ollama models
   ollama pull mistral:7b
   # Update backend configuration
   ```

3. **Check summarization parameters**:
   - Test different length settings
   - Try different style options

**Solutions**:

1. **Improve text preprocessing**:
   - Clean extracted text better
   - Remove irrelevant content before summarization

2. **Adjust model parameters**:
   ```python
   # In backend/app.py, modify summarization parameters
   "temperature": 0.3,  # Lower for more focused summaries
   "top_p": 0.9,        # Adjust for creativity vs. accuracy
   ```

3. **Use better prompts**:
   - Improve summarization prompts in backend
   - Add context-specific instructions

4. **Try different models**:
   - Experiment with various Ollama models
   - Some models are better for specific content types

### Issue: Summaries Too Short or Too Long

**Symptoms**:
- Summaries don't match requested length
- Inconsistent summary lengths
- Truncated or overly verbose output

**Diagnostic Steps**:

1. **Check length settings**:
   - Verify extension settings
   - Test with different length options

2. **Monitor backend processing**:
   - Check backend logs for length parameters
   - Verify prompt construction

**Solutions**:

1. **Adjust length parameters**:
   ```python
   # In backend/app.py
   length_instructions = {
       'short': 'in exactly 1-2 sentences',
       'medium': 'in exactly 3-5 sentences',
       'long': 'in exactly 6-10 sentences'
   }
   ```

2. **Improve prompt engineering**:
   - Add specific length requirements to prompts
   - Include examples of desired length

3. **Post-process summaries**:
   - Add length validation in backend
   - Truncate or expand as needed

## Performance Issues

### Issue: Slow Summarization

**Symptoms**:
- Summarization takes more than 60 seconds
- Extension appears to hang
- Timeout errors

**Diagnostic Steps**:

1. **Time each component**:
   ```bash
   # Test text extraction speed
   time curl -X POST http://localhost:5000/api/summarize \
     -H "Content-Type: application/json" \
     -d '{"text": "Short test text"}'
   ```

2. **Monitor system resources**:
   - Check CPU and memory usage
   - Monitor disk I/O

3. **Test with different text lengths**:
   - Try short, medium, and long texts
   - Identify performance bottlenecks

**Solutions**:

1. **Optimize hardware**:
   - Use SSD for model storage
   - Increase RAM if possible
   - Enable GPU acceleration

2. **Reduce processing load**:
   ```bash
   # In backend/.env
   MAX_TEXT_LENGTH=25000  # Reduce from 50000
   OLLAMA_CONTEXT_SIZE=4096  # Reduce context window
   ```

3. **Use faster model**:
   ```bash
   ollama pull mistral:7b  # Faster than llama3.1:8b
   ```

4. **Implement caching**:
   - Cache summaries for repeated content
   - Store processed text temporarily

### Issue: High Memory Usage

**Symptoms**:
- System runs out of memory
- Browser becomes slow or crashes
- Ollama process uses excessive RAM

**Diagnostic Steps**:

1. **Monitor memory usage**:
   ```bash
   # Check memory usage
   free -h  # Linux
   vm_stat  # macOS
   ```

2. **Check model memory requirements**:
   ```bash
   ollama show llama3.1:8b | grep size
   ```

**Solutions**:

1. **Use smaller models**:
   ```bash
   # Switch to memory-efficient model
   ollama pull mistral:7b
   ```

2. **Limit concurrent processing**:
   ```bash
   export OLLAMA_MAX_LOADED_MODELS=1
   export OLLAMA_NUM_PARALLEL=1
   ```

3. **Increase swap space** (Linux):
   ```bash
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

## Browser Compatibility

### Issue: Extension Doesn't Work in Incognito Mode

**Symptoms**:
- Extension icon missing in incognito windows
- Functionality disabled in private browsing

**Solutions**:

1. **Enable incognito access**:
   - Go to `chrome://extensions/`
   - Click "Details" for TLDR extension
   - Toggle "Allow in incognito"

2. **Check permissions**:
   - Ensure extension has necessary permissions
   - Some features may be limited in incognito

### Issue: Compatibility with Other Extensions

**Symptoms**:
- TLDR conflicts with other extensions
- Unexpected behavior when multiple extensions active

**Diagnostic Steps**:

1. **Test in isolation**:
   - Disable all other extensions
   - Test TLDR functionality

2. **Identify conflicts**:
   - Enable extensions one by one
   - Find which extension causes conflicts

**Solutions**:

1. **Update conflicting extensions**:
   - Ensure all extensions are up to date
   - Check for known compatibility issues

2. **Adjust extension priorities**:
   - Some extensions may override others
   - Check extension load order

## Advanced Debugging

### Enable Debug Mode

1. **Extension debugging**:
   ```javascript
   // Add to popup or options page
   localStorage.setItem('tldr-debug', 'true');
   ```

2. **Backend debugging**:
   ```bash
   export FLASK_DEBUG=True
   export LOG_LEVEL=DEBUG
   python backend/app.py
   ```

3. **Ollama debugging**:
   ```bash
   export OLLAMA_DEBUG=1
   ollama serve
   ```

### Collect Debug Information

When reporting issues, collect this information:

1. **System information**:
   ```bash
   # Operating system and version
   uname -a  # Linux/macOS
   
   # Chrome version
   # Go to chrome://version/
   
   # Python version
   python --version
   
   # Node.js version
   node --version
   ```

2. **Extension information**:
   - Extension version
   - Manifest version
   - Enabled permissions

3. **Backend information**:
   ```bash
   # Backend health check
   curl http://localhost:5000/api/health
   
   # Ollama status
   ollama list
   ollama ps
   ```

4. **Error logs**:
   - Browser console errors
   - Backend server logs
   - Ollama service logs

### Network Debugging

1. **Check network requests**:
   - Open Chrome DevTools
   - Go to Network tab
   - Monitor requests to backend

2. **Test API endpoints**:
   ```bash
   # Test health endpoint
   curl -v http://localhost:5000/api/health
   
   # Test summarization endpoint
   curl -v -X POST http://localhost:5000/api/summarize \
     -H "Content-Type: application/json" \
     -d '{"text": "Test text", "length": "short"}'
   ```

## Getting Help

### Before Asking for Help

1. **Search existing issues**:
   - Check GitHub Issues for similar problems
   - Look through closed issues for solutions

2. **Try basic troubleshooting**:
   - Restart Chrome
   - Reload the extension
   - Restart the backend server

3. **Test with minimal setup**:
   - Use default settings
   - Test on simple websites
   - Try with fallback summarization

### How to Report Issues

When reporting bugs or asking for help:

1. **Use issue templates**:
   - Follow the provided issue template
   - Include all requested information

2. **Provide detailed information**:
   - Steps to reproduce the issue
   - Expected vs. actual behavior
   - System configuration details
   - Error messages and logs

3. **Include debug information**:
   - Browser console logs
   - Backend server logs
   - Network request details

### Community Resources

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share tips
- **Documentation**: Check README and docs folder
- **Wiki**: Community-maintained troubleshooting tips

### Professional Support

For enterprise users or complex deployments:

- **Email support**: Available for critical issues
- **Custom configuration**: Help with specialized setups
- **Performance optimization**: Assistance with large-scale deployments

Remember that TLDR is an open-source project, and community contributions to troubleshooting and documentation are always welcome!

