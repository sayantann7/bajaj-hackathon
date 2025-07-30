#!/bin/bash

echo "🚀 Starting Bajaj Hackathon API Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one based on .env.example"
    exit 1
fi

# Build the project
echo "📦 Building TypeScript project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for TypeScript errors."
    exit 1
fi

# Start the server
echo "🌟 Starting the server..."
node dist/server.js
