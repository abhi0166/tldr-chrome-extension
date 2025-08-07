#!/usr/bin/env python3
"""
TLDR Chrome Extension Backend
Flask server with spaCy and Ollama integration for text summarization
"""

import os
import logging
import time
from typing import Dict, Any, Optional
from urllib.parse import urlparse

from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import requests
from requests.exceptions import RequestException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.1:8b')
MAX_TEXT_LENGTH = int(os.getenv('MAX_TEXT_LENGTH', '50000'))
MIN_TEXT_LENGTH = int(os.getenv('MIN_TEXT_LENGTH', '100'))

# Global variables for models
nlp = None
ollama_available = False

def initialize_spacy():
    """Initialize spaCy model"""
    global nlp
    try:
        # Try to load English model
        nlp = spacy.load("en_core_web_sm")
        logger.info("spaCy English model loaded successfully")
        return True
    except OSError:
        try:
            # Try to load larger model if available
            nlp = spacy.load("en_core_web_md")
            logger.info("spaCy English medium model loaded successfully")
            return True
        except OSError:
            logger.error("spaCy English model not found. Please install with: python -m spacy download en_core_web_sm")
            return False

def check_ollama_availability():
    """Check if Ollama is available and the model is loaded"""
    global ollama_available
    try:
        # Check if Ollama is running
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get('models', [])
            model_names = [model['name'] for model in models]
            
            if OLLAMA_MODEL in model_names:
                ollama_available = True
                logger.info(f"Ollama is available with model: {OLLAMA_MODEL}")
                return True
            else:
                logger.warning(f"Ollama model {OLLAMA_MODEL} not found. Available models: {model_names}")
                return False
        else:
            logger.warning(f"Ollama API returned status code: {response.status_code}")
            return False
    except RequestException as e:
        logger.warning(f"Ollama not available: {e}")
        return False

def preprocess_text(text: str, max_length: int = MAX_TEXT_LENGTH) -> str:
    """Preprocess text using spaCy"""
    if not nlp:
        # Fallback preprocessing without spaCy
        return text[:max_length].strip()
    
    # Truncate if too long
    if len(text) > max_length:
        text = text[:max_length]
    
    # Process with spaCy
    doc = nlp(text)
    
    # Extract sentences and clean them
    sentences = []
    for sent in doc.sents:
        sentence_text = sent.text.strip()
        if len(sentence_text) > 10:  # Filter out very short sentences
            sentences.append(sentence_text)
    
    return ' '.join(sentences)

def summarize_with_ollama(text: str, length: str = 'medium', style: str = 'paragraph') -> Optional[str]:
    """Summarize text using Ollama"""
    if not ollama_available:
        return None
    
    # Create prompt based on parameters
    length_instructions = {
        'short': 'in 1-2 sentences',
        'medium': 'in 3-5 sentences', 
        'long': 'in 6-10 sentences'
    }
    
    style_instructions = {
        'paragraph': 'as a coherent paragraph',
        'bullet': 'as bullet points',
        'key-points': 'as key points with brief explanations'
    }
    
    length_instruction = length_instructions.get(length, 'in 3-5 sentences')
    style_instruction = style_instructions.get(style, 'as a coherent paragraph')
    
    prompt = f"""Please summarize the following text {length_instruction} {style_instruction}. 
Focus on the main ideas and key information. Be concise and clear.

Text to summarize:
{text}

Summary:"""

    try:
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "top_p": 0.9,
                "max_tokens": 500
            }
        }
        
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            summary = result.get('response', '').strip()
            return summary if summary else None
        else:
            logger.error(f"Ollama API error: {response.status_code} - {response.text}")
            return None
            
    except RequestException as e:
        logger.error(f"Error calling Ollama API: {e}")
        return None

def fallback_summarize(text: str, length: str = 'medium') -> str:
    """Fallback summarization using simple text processing"""
    sentences = text.split('. ')
    
    # Determine number of sentences based on length
    target_sentences = {
        'short': 2,
        'medium': 4,
        'long': 8
    }.get(length, 4)
    
    # Take first few sentences as a simple summary
    if len(sentences) <= target_sentences:
        return text
    
    summary_sentences = sentences[:target_sentences]
    summary = '. '.join(summary_sentences)
    
    # Ensure it ends with a period
    if not summary.endswith('.'):
        summary += '.'
    
    return summary

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    status = {
        'status': 'healthy',
        'spacy_available': nlp is not None,
        'ollama_available': ollama_available,
        'ollama_model': OLLAMA_MODEL,
        'timestamp': time.time()
    }
    return jsonify(status)

@app.route('/api/summarize', methods=['POST'])
def summarize_text():
    """Main summarization endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text'].strip()
        length = data.get('length', 'medium')
        style = data.get('style', 'paragraph')
        url = data.get('url', '')
        
        # Validate input
        if len(text) < MIN_TEXT_LENGTH:
            return jsonify({'error': f'Text too short (minimum {MIN_TEXT_LENGTH} characters)'}), 400
        
        if length not in ['short', 'medium', 'long']:
            length = 'medium'
        
        if style not in ['paragraph', 'bullet', 'key-points']:
            style = 'paragraph'
        
        logger.info(f"Summarization request: length={length}, style={style}, text_length={len(text)}")
        
        # Preprocess text
        processed_text = preprocess_text(text)
        
        # Try Ollama first, fallback to simple summarization
        summary = summarize_with_ollama(processed_text, length, style)
        
        if not summary:
            logger.info("Ollama unavailable, using fallback summarization")
            summary = fallback_summarize(processed_text, length)
        
        # Calculate statistics
        original_word_count = len(text.split())
        summary_word_count = len(summary.split())
        
        response = {
            'summary': summary,
            'wordCount': summary_word_count,
            'originalLength': original_word_count,
            'compressionRatio': round(summary_word_count / original_word_count, 2) if original_word_count > 0 else 0,
            'method': 'ollama' if ollama_available else 'fallback',
            'url': url
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Summarization error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/models', methods=['GET'])
def list_models():
    """List available Ollama models"""
    if not ollama_available:
        return jsonify({'error': 'Ollama not available'}), 503
    
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch models'}), 500
    except RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

def main():
    """Initialize and run the Flask application"""
    logger.info("Starting TLDR Backend Server...")
    
    # Initialize spaCy
    if not initialize_spacy():
        logger.warning("spaCy not available, text preprocessing will be limited")
    
    # Check Ollama availability
    if not check_ollama_availability():
        logger.warning("Ollama not available, will use fallback summarization")
    
    # Run the Flask app
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Server starting on http://0.0.0.0:{port}")
    logger.info(f"spaCy available: {nlp is not None}")
    logger.info(f"Ollama available: {ollama_available}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

if __name__ == '__main__':
    main()

