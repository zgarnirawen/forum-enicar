#!/bin/bash
# Load environment variables from .env file
# Usage: source load-env.sh

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE not found"
    echo "Please copy .env.example to .env and configure your credentials"
    exit 1
fi

echo "📖 Loading environment variables from $ENV_FILE..."

while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ ! "$key" =~ ^#.* ]] && [ -n "$key" ]; then
        # Remove leading/trailing whitespace
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        if [ -n "$key" ] && [ -n "$value" ]; then
            export "$key=$value"
            echo "  ✓ $key"
        fi
    fi
done < "$ENV_FILE"

echo ""
echo "✅ Environment variables loaded successfully!"
echo ""
