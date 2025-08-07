#!/usr/bin/env python3
"""
TLDR Backend Server Startup Script
Handles initialization, dependency checking, and server startup
"""

import os
import sys
import subprocess
import importlib.util
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_ollama():
    """Check if Ollama is installed and running"""
    try:
        result = subprocess.run(['ollama', '--version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print(f"✅ Ollama installed: {result.stdout.strip()}")
            
            # Check if Ollama is running
            try:
                import requests
                response = requests.get('http://localhost:11434/api/tags', timeout=5)
                if response.status_code == 200:
                    models = response.json().get('models', [])
                    model_names = [model['name'] for model in models]
                    print(f"✅ Ollama is running with {len(models)} models")
                    
                    if 'llama3.1:8b' in model_names:
                        print("✅ Recommended model llama3.1:8b is available")
                    else:
                        print("⚠️  Recommended model llama3.1:8b not found")
                        print("   Run: ollama pull llama3.1:8b")
                    return True
                else:
                    print("⚠️  Ollama is installed but not running")
                    print("   Start Ollama and try again")
                    return False
            except:
                print("⚠️  Ollama is installed but not running")
                print("   Start Ollama and try again")
                return False
        else:
            print("❌ Ollama not found")
            print("   Install from: https://ollama.ai")
            return False
    except FileNotFoundError:
        print("❌ Ollama not found")
        print("   Install from: https://ollama.ai")
        return False
    except subprocess.TimeoutExpired:
        print("⚠️  Ollama command timed out")
        return False

def install_dependencies():
    """Install Python dependencies"""
    print("\n📦 Installing Python dependencies...")
    
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_spacy_model():
    """Check if spaCy English model is available"""
    try:
        import spacy
        try:
            nlp = spacy.load("en_core_web_sm")
            print("✅ spaCy English model (small) is available")
            return True
        except OSError:
            try:
                nlp = spacy.load("en_core_web_md")
                print("✅ spaCy English model (medium) is available")
                return True
            except OSError:
                print("⚠️  spaCy English model not found")
                print("   Installing en_core_web_sm...")
                try:
                    subprocess.run([sys.executable, '-m', 'spacy', 'download', 'en_core_web_sm'], 
                                  check=True)
                    print("✅ spaCy English model installed")
                    return True
                except subprocess.CalledProcessError:
                    print("❌ Failed to install spaCy model")
                    return False
    except ImportError:
        print("❌ spaCy not installed")
        return False

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_file = Path('.env')
    env_example = Path('.env.example')
    
    if not env_file.exists() and env_example.exists():
        print("📝 Creating .env file from template...")
        env_file.write_text(env_example.read_text())
        print("✅ .env file created")

def main():
    """Main startup function"""
    print("🚀 TLDR Backend Server Startup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create .env file
    create_env_file()
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Failed to install dependencies")
        sys.exit(1)
    
    # Check spaCy model
    if not check_spacy_model():
        print("\n⚠️  spaCy model issues detected, but server can still run with limited functionality")
    
    # Check Ollama
    ollama_ok = check_ollama()
    if not ollama_ok:
        print("\n⚠️  Ollama issues detected, but server can still run with fallback summarization")
    
    print("\n" + "=" * 40)
    print("🎯 Starting TLDR Backend Server...")
    print("   Server will be available at: http://localhost:5000")
    print("   Health check: http://localhost:5000/api/health")
    print("   Press Ctrl+C to stop the server")
    print("=" * 40)
    
    # Start the server
    try:
        from app import main as run_app
        run_app()
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

