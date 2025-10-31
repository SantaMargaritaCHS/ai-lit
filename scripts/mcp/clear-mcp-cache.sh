#!/bin/bash
# clear-mcp-cache.sh - Clear all MCP browser state

MCP_URL="https://mcp-debugger-production.up.railway.app/mcp"
API_KEY="352368f9afffa3387a76561a062458d09834a26f9140f8a5e9bc88a08b571cf1"

echo "🧹 Clearing MCP cache..."

# Clear console messages
curl -X POST "$MCP_URL" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_console_messages","params":{}}' -s > /dev/null

# Clear network requests
curl -X POST "$MCP_URL" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_network_requests","params":{}}' -s > /dev/null

# Clear cookies
curl -X POST "$MCP_URL" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_cookies","params":{}}' -s > /dev/null

echo "✅ MCP cache cleared - ready for fresh testing"
