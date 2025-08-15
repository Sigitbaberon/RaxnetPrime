#!/bin/bash

echo "🚀 Building Raxnet Prime for Cloudflare Pages..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Copy Cloudflare functions
echo "🔧 Setting up Cloudflare Functions..."
mkdir -p dist/public/functions
cp -r functions/* dist/public/functions/

# Copy _headers for CORS
echo "🌐 Setting up CORS headers..."
cp public/_headers dist/public/_headers

echo "✅ Build complete! Ready for Cloudflare Pages deployment."
echo ""
echo "Next steps:"
echo "1. Upload the 'dist/public' folder to Cloudflare Pages"
echo "2. Or use: wrangler pages deploy dist/public --project-name=raxnet-prime"
echo ""
echo "📁 Files ready in: ./dist/public/"