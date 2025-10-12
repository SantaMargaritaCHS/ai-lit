# Scripts Directory

This directory contains automation scripts for testing and debugging the AI Literacy platform.

## 🔐 Important: API Keys Required

All scripts require API keys. Load them before running:

```bash
source /home/runner/workspace/.secrets.local
```

Or ensure they're set in Replit Secrets (they are auto-loaded in Replit environment).

## 📜 Available Scripts

### 1. Gemini Vision Inspector
**File**: `gemini-vision-inspector.js`

**Purpose**: Takes screenshots of the app and analyzes them with Gemini Vision AI.

**Usage**:
```bash
# Load secrets
source /home/runner/workspace/.secrets.local

# Run inspector
node /home/runner/workspace/scripts/gemini-vision-inspector.js
```

**What it does**:
- Takes screenshot of https://AILitStudents.replit.app/module/what-is-ai
- Analyzes with Gemini Vision
- Identifies UI issues, bugs, testing opportunities
- Provides actionable recommendations

---

### 2. Console Log Analyzer
**File**: `analyze-console-logs.js`

**Purpose**: Analyzes browser console logs with Gemini AI to diagnose issues.

**Usage**:
```bash
# Load secrets
source /home/runner/workspace/.secrets.local

# Run analyzer
node /home/runner/workspace/scripts/analyze-console-logs.js
```

**What it does**:
- Takes console logs (currently hardcoded in script)
- Analyzes with Gemini AI
- Identifies configuration issues
- Suggests next steps

---

### 3. Gemini Feedback Tester
**File**: `test-gemini-feedback.js`

**Purpose**: Attempts to automate testing of Gemini API feedback feature (experimental).

**Status**: ⚠️ Partially functional - Browserless automation has limitations

---

### 4. Browser Inspector (Legacy)
**File**: `inspect-browser.js`

**Purpose**: Original Browserless automation attempt.

**Status**: ⚠️ Deprecated - Use Gemini Vision Inspector instead

---

### 5. Screenshot Watcher
**File**: `watch-screenshots.sh`

**Purpose**: Monitors `/home/runner/workspace/screenshots/` for new files.

**Usage**:
```bash
bash /home/runner/workspace/scripts/watch-screenshots.sh
```

**What it does**:
- Watches screenshots directory
- Announces new files
- Provides file info (size, timestamp)

---

## 🚀 Quick Start

**First time setup**:
```bash
# 1. Verify secrets file exists
cat /home/runner/workspace/.secrets.local

# 2. Load secrets
source /home/runner/workspace/.secrets.local

# 3. Verify keys are loaded
echo $GEMINI_API_KEY
echo $BROWSERLESS_API_KEY

# 4. Run a script
node /home/runner/workspace/scripts/gemini-vision-inspector.js
```

---

## 🔧 Troubleshooting

### "API key not found" errors

**Problem**: Script says `GEMINI_API_KEY not found`

**Solution**:
```bash
# Load secrets
source /home/runner/workspace/.secrets.local

# Verify loaded
env | grep API_KEY
```

### "BROWSERLESS_API_KEY not found"

**Problem**: Browserless token missing

**Solution**:
```bash
# Load secrets
source /home/runner/workspace/.secrets.local

# Verify
echo $BROWSERLESS_API_KEY
```

### Script crashes with network errors

**Problem**: API quota exceeded or network issue

**Solutions**:
- Check Browserless dashboard for quota
- Check Gemini API usage in Google Cloud Console
- Verify internet connection
- Try again in a few minutes

---

## 📝 Adding New Scripts

When creating new scripts:

1. **Always load secrets from environment**:
```javascript
const API_KEY = process.env.API_KEY_NAME;
if (!API_KEY) {
  console.error('❌ API_KEY_NAME not found');
  console.error('💡 Run: source /home/runner/workspace/.secrets.local');
  process.exit(1);
}
```

2. **Never hardcode API keys**
3. **Add to this README**
4. **Test with secrets loaded**

---

## 🔐 Security Notes

- **NEVER commit API keys** to git
- `.secrets.local` is in `.gitignore`
- Scripts will fail safely if keys not found
- Rotate keys if accidentally exposed

---

*For more information, see `/home/runner/workspace/CLAUDE.md`*
