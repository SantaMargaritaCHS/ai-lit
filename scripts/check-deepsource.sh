#!/bin/bash

# Helper script for checking DeepSource analysis results
# Usage: ./scripts/check-deepsource.sh [file_path] [limit]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      DeepSource Code Quality Check            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if DeepSource CLI is installed
if ! command -v deepsource &> /dev/null; then
    echo -e "${RED}❌ DeepSource CLI not installed${NC}"
    echo ""
    echo "Install with:"
    echo "  curl https://deepsource.io/cli | sh"
    echo ""
    exit 1
fi

# Check authentication status
echo -e "${BLUE}🔐 Checking authentication...${NC}"
if ! deepsource auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not authenticated${NC}"
    echo ""
    echo "Authenticate with:"
    echo "  deepsource auth login"
    echo ""
    exit 1
fi
echo -e "${GREEN}✅ Authenticated${NC}"
echo ""

# Check repository status
echo -e "${BLUE}📊 Repository Status:${NC}"
deepsource repo status
echo ""

# Get issues
FILE_PATH="${1:-.}"
LIMIT="${2:-30}"

echo -e "${BLUE}🔍 Fetching issues (limit: ${LIMIT})...${NC}"
echo ""

if [ "$FILE_PATH" = "." ]; then
    echo -e "${YELLOW}Checking all files...${NC}"
else
    echo -e "${YELLOW}Checking: ${FILE_PATH}${NC}"
fi
echo ""

# Run issues command and capture output
ISSUES_OUTPUT=$(deepsource issues list "$FILE_PATH" --limit "$LIMIT" 2>&1)

if [ -z "$ISSUES_OUTPUT" ] || echo "$ISSUES_OUTPUT" | grep -q "No issues found"; then
    echo -e "${GREEN}✅ No issues found!${NC}"
else
    echo "$ISSUES_OUTPUT"
    echo ""
    echo -e "${YELLOW}💡 Tip: View details at https://deepsource.io${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════${NC}"
