#!/bin/bash

# TLDR Chrome Extension Build Script
# Builds the extension and creates a distributable package

set -e

echo "🚀 Building TLDR Chrome Extension..."

# Clean previous build
if [ -d "dist" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf dist
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the extension
echo "🔨 Building extension..."
npm run build

# Check if build was successful
if [ ! -f "dist/manifest.json" ]; then
    echo "❌ Build failed - manifest.json not found"
    exit 1
fi

echo "✅ Extension built successfully!"
echo "📁 Build output: ./dist/"
echo ""
echo "To install in Chrome:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo ""

# Optional: Create a zip file for distribution
if command -v zip &> /dev/null; then
    echo "📦 Creating distribution package..."
    cd dist
    zip -r ../tldr-extension.zip .
    cd ..
    echo "✅ Distribution package created: tldr-extension.zip"
fi

echo "🎉 Build complete!"

