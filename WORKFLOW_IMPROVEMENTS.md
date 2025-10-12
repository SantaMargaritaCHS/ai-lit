# 🚀 Workflow Improvements for Claude Code + Replit

This document describes the complete workflow improvements implemented to make development with Claude Code in Replit more efficient.

## 📋 Problems Solved

1. ✅ **Automated Browser Inspection** - Claude can now browse the app and check DevTools automatically
2. ✅ **Easy Screenshot Sharing** - Drop screenshots in a folder and they're automatically available
3. ✅ **Terminal Paste Shortcut** - Ctrl+V now works for paste (no more Ctrl+Shift+V)
4. ✅ **Gemini API Debugging** - Automated tools to diagnose why AI feedback might not be working

---

## 1️⃣ Automated Browser Inspection with Browserless

### Setup

1. **Add Browserless API Key to Replit Secrets**:
   - Go to Replit → Secrets (lock icon in left sidebar)
   - Add: `BROWSERLESS_API_KEY` = your Browserless token
   - Or: `BROWSERLESS_TOKEN` = your Browserless token (either name works)

2. **Run the inspector**:
   ```bash
   node /home/runner/workspace/scripts/inspect-browser.js
   ```

### What It Does

- **Navigates** to your running app (http://localhost:5000)
- **Activates** Developer Mode automatically
- **Captures** console logs, network requests, and screenshots
- **Tests** reflection activities and Gemini API feedback
- **Reports** detailed diagnostic information

### Use Cases

- "Why isn't Gemini API working?" → Run inspector to see network requests
- "Is the API key exposed?" → Inspector checks `import.meta.env`
- "What errors are in the console?" → Captures all console logs
- "How does the UI look?" → Takes full-page screenshots

### Slash Command

```bash
/inspect-app
```

This triggers Claude to use the Browserless API and provide a detailed diagnostic report.

---

## 2️⃣ Easy Screenshot Sharing

### Setup

Screenshot directory is already created at: `/home/runner/workspace/screenshots/`

### How to Use

#### **Method 1: Direct Upload (Existing)**
1. Take a screenshot on your computer
2. In Replit file explorer, click "Upload file"
3. Upload to `/home/runner/workspace/screenshots/`
4. Tell Claude: "Look at screenshots/my-error.png"

#### **Method 2: Watch Mode (Automated)**
1. Start the screenshot watcher:
   ```bash
   bash /home/runner/workspace/scripts/watch-screenshots.sh
   ```
2. Upload screenshots to the `/screenshots/` folder
3. The watcher automatically detects and announces new files
4. Reference them in conversation: "Check the latest screenshot"

### Benefits

- **Organized**: All screenshots in one place
- **Persistent**: Screenshots stay in the workspace
- **Easy Reference**: Use simple paths like `screenshots/console-error.png`
- **Automatic Detection**: Watcher mode notifies you of new uploads

### Supported Formats

- PNG (.png, .PNG)
- JPEG (.jpg, .jpeg, .JPG, .JPEG)

---

## 3️⃣ Terminal Paste Shortcut Fix

### The Problem

Linux terminals in Replit use `Ctrl+Shift+V` for paste, not the standard `Ctrl+V`. This is annoying!

### The Solution

Custom `.inputrc` configuration that remaps paste shortcuts.

### Setup (Already Done)

```bash
# Load the custom terminal config
source /home/runner/workspace/.bashrc_custom
```

This is done automatically, but you can reload it anytime by running the command above.

### What Changed

**Before**:
- `Ctrl+V` → Does nothing (literal-next)
- `Ctrl+Shift+V` → Paste (annoying!)

**After**:
- `Ctrl+V` → Paste ✅
- `Ctrl+Shift+V` → Still works
- `Shift+Insert` → Also works (alternative)

### Additional Commands

**Copy to clipboard**:
```bash
# Copy output to clipboard
cat file.txt | clip

# Or use pbcopy (alias for clip)
echo "Hello" | pbcopy
```

**Paste from clipboard**:
```bash
# Paste from clipboard
unclip > file.txt

# Or use pbpaste (alias for unclip)
pbpaste
```

### Limitations

- The `.inputrc` changes apply to NEW terminal sessions
- Replit's web terminal has limitations (some clipboard operations may not work)
- For best results, use Replit's native "Copy" button or keyboard shortcuts

---

## 4️⃣ Gemini API Debugging System

### Context

Your console logs show that:
- ✅ `VITE_GEMINI_API_KEY` is present in the browser
- ✅ `GEMINI_API_KEY` is present in the browser
- ⚠️ But we haven't seen feedback submitted yet

### How to Test Gemini Feedback

1. **Open the app**: http://localhost:5000/module/what-is-ai
2. **Activate Dev Mode**: `Ctrl+Alt+D`, password `752465Ledezma`
3. **Jump to reflection**: Use dev panel dropdown → "Reflection: AI as a Tool"
4. **Open Browser DevTools**: Press F12
5. **Watch Console tab**: Look for Gemini-related messages
6. **Submit a reflection**: Type something substantial (20+ chars, 3+ words)
7. **Watch Network tab**: Look for requests to `generativelanguage.googleapis.com`

### Expected Console Messages

**When Gemini is working**:
```
✅ Gemini API key found - AI feedback enabled!
✅ Using AI-generated feedback
```

**When Gemini is NOT configured**:
```
⚠️ Gemini API key not configured. Using fallback responses.
💡 Add VITE_GEMINI_API_KEY to .env or GEMINI_API_KEY to Replit Secrets
```

**When Gemini call fails**:
```
❌ Error calling Gemini API: [error message]
ℹ️ Using fallback feedback (Gemini not available)
```

### Network Debugging

In DevTools → Network tab, look for:

**Success** (Status 200):
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
Status: 200 OK
```

**Authentication Error** (Status 401):
```
Status: 401 Unauthorized
→ API key is invalid or expired
```

**Quota Error** (Status 429):
```
Status: 429 Too Many Requests
→ Rate limit exceeded or billing issue
```

**CORS Error**:
```
Access to fetch at 'https://generativelanguage.googleapis.com...' has been blocked by CORS policy
→ This shouldn't happen with Gemini API, but indicates browser security issue
```

### Automated Inspection

Run the browser inspector to get a comprehensive report:

```bash
node /home/runner/workspace/scripts/inspect-browser.js
```

This will:
1. Check if API key is exposed in the browser
2. Navigate to a reflection activity
3. Submit a test reflection
4. Capture network requests to Gemini API
5. Report all console logs and errors
6. Take screenshots of the process

---

## 🎯 Quick Reference

### Daily Workflow

**Starting your session**:
```bash
# 1. Start dev server (if not already running)
npm run dev

# 2. Load custom terminal config (optional, for paste shortcuts)
source /home/runner/workspace/.bashrc_custom

# 3. Start screenshot watcher (optional, for automated detection)
bash /home/runner/workspace/scripts/watch-screenshots.sh &
```

**Testing changes**:
1. Open app in browser: http://localhost:5000
2. Open DevTools: F12
3. Activate Dev Mode: Ctrl+Alt+D
4. Test your changes
5. Check Console tab for errors

**Debugging with Claude**:
- "Run the browser inspector" → Automated DevTools analysis
- "Look at screenshots/error.png" → Easy screenshot sharing
- "Check the Gemini API" → Console log analysis

### File Locations

| Purpose | Path |
|---------|------|
| Browser inspector script | `/home/runner/workspace/scripts/inspect-browser.js` |
| Screenshot watcher | `/home/runner/workspace/scripts/watch-screenshots.sh` |
| Screenshot upload folder | `/home/runner/workspace/screenshots/` |
| Terminal paste config | `/home/runner/workspace/.inputrc` |
| Custom bash profile | `/home/runner/workspace/.bashrc_custom` |
| Slash commands | `/home/runner/workspace/.claude/commands/` |

### Slash Commands

| Command | Description |
|---------|-------------|
| `/inspect-app` | Run automated browser inspection with Browserless |
| `/screenshot` | Instructions for screenshot upload workflow |

---

## 🔧 Troubleshooting

### Browser Inspector Not Working

**Error**: "BROWSERLESS_API_KEY not found"
- **Solution**: Add your Browserless token to Replit Secrets

**Error**: "Failed to connect to Browserless"
- **Solution**: Check your Browserless subscription is active
- **Solution**: Verify the API token is correct

**Error**: "Cannot connect to localhost:5000"
- **Solution**: Make sure dev server is running: `npm run dev`
- **Solution**: Check if port 5000 is accessible

### Screenshot Watcher Not Working

**Issue**: Watcher doesn't detect new files
- **Solution**: Make sure you're uploading to `/home/runner/workspace/screenshots/`
- **Solution**: Use supported formats: PNG, JPG, JPEG
- **Solution**: Restart the watcher script

### Paste Shortcut Not Working

**Issue**: Ctrl+V still doesn't paste
- **Solution**: Open a NEW terminal session (close and reopen)
- **Solution**: Run: `source /home/runner/workspace/.bashrc_custom`
- **Solution**: Verify `.inputrc` exists: `cat ~/.inputrc`

**Issue**: Nothing happens when pressing Ctrl+V
- **Solution**: Replit's web terminal has limitations with clipboard
- **Solution**: Use Shift+Insert as alternative
- **Solution**: Use Replit's "Paste" button in terminal toolbar

### Gemini API Not Working

**Symptom**: Always getting fallback messages
1. **Check API key is set**:
   ```bash
   echo $GEMINI_API_KEY
   ```
   Should output your key (starts with "AIza...")

2. **Check browser console**:
   - Open DevTools (F12)
   - Look for: "✅ Gemini API key found - AI feedback enabled!"
   - If you see: "⚠️ Gemini API key not configured"
     → API key isn't reaching the browser

3. **Check network requests**:
   - Open DevTools → Network tab
   - Submit a reflection
   - Look for requests to `generativelanguage.googleapis.com`
   - If NO requests: API key is null or client isn't being called
   - If Status 401: API key is invalid
   - If Status 429: Rate limit exceeded

4. **Run automated inspector**:
   ```bash
   node /home/runner/workspace/scripts/inspect-browser.js
   ```
   This will give you a comprehensive diagnostic report.

5. **Check vite.config.ts**:
   ```bash
   grep -A 3 "define:" vite.config.ts
   ```
   Should show:
   ```typescript
   define: {
     'import.meta.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
     'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
   },
   ```

6. **Restart dev server** (important after .env or vite.config changes):
   ```bash
   # Kill current server
   pkill -f "vite"

   # Start fresh
   npm run dev
   ```

---

## 📚 Additional Resources

- **Browserless Documentation**: https://docs.browserless.io/
- **Gemini API Documentation**: https://ai.google.dev/docs
- **GNU Readline (inputrc)**: https://www.gnu.org/software/bash/manual/html_node/Readline-Init-File.html
- **Claude Code Documentation**: https://docs.claude.com/claude-code

---

## 🎉 Summary

You now have:

1. ✅ **Automated browser inspection** via Browserless API
2. ✅ **Easy screenshot sharing** via `/screenshots/` folder
3. ✅ **Better paste shortcuts** via custom `.inputrc`
4. ✅ **Gemini API debugging** via console logs and network inspection

These improvements make your development workflow with Claude Code significantly more efficient!

**Questions?** Just ask Claude to review this document or run any of the diagnostic tools.

---

*Last updated: 2025-10-12*
*Maintained by: Claude Code Assistant*
