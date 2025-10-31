# MCP Testing Guide - AI Literacy Student Platform

## Overview

**MCP (Model Context Protocol)** provides automated browser testing via Railway-hosted Chromium. This guide covers using the MCP debugger agent for comprehensive testing of the AI Literacy Student Platform.

**MCP Server**: https://mcp-debugger-production.up.railway.app
**GitHub**: https://github.com/maizoro87/MCP-Debugger
**Production URL**: https://AILitStudents.replit.app (MUST use production for video testing)
**Authentication**: Requires `MCP_DEBUGGER_API_KEY` environment variable (X-API-Key header)
**Capabilities**: 21 endpoints including AI Vision (Gemini 2.5 Flash) - Health endpoint is public

---

## Quick Start

**⚠️ IMPORTANT: Deployment Requirement**

MCP tests run against the **production URL** (https://AILitStudents.replit.app), not your local development environment.

**Before running MCP tests after making code changes:**
1. ✅ Deploy/republish the site on Replit (click "Run" button)
2. ⏱️ Wait for deployment to complete (30-60 seconds)
3. ✅ Then run MCP tests to validate the deployed changes

**MCP will test whatever is currently live in production**, not uncommitted or undeployed code.

---

### 1. Check MCP Server Health

```bash
npm run mcp:health
# or
node scripts/mcp/mcp-client.js health
```

### 2. Run Your First Test

```bash
# Fast smoke test (~3 min)
npm run mcp:smoke

# Full regression test (~18 min)
npm run mcp:full

# Test specific module
MODULE=what-is-ai npm run mcp:module
```

### 3. Invoke MCP Debugger Agent

```
MCP debugger, run full regression tests and report any issues
```

---

## 🧹 Clearing MCP Cache Between Tests

### Why Cache Clearing Matters

The MCP Debugger maintains **stateful browser data** in memory between requests:

1. **Console Messages** - All `console.log()`, errors, and warnings from previous sites
2. **Network Requests** - HTTP request history from previous testing sessions
3. **Cookies** - May persist if same domain or shared cookie scope
4. **localStorage** - Browser storage data from previous sites
5. **Session State** - Browser context maintained between API calls

### The Problem: Mixed Test Data

If you test **AI Literacy Student Platform** immediately after testing **SM Innovation Hub**:
- ❌ Console logs include both sites' errors mixed together
- ❌ Network request analysis shows both applications' API calls
- ❌ Error counts are inflated with old data
- ❌ Hard to distinguish which issues belong to which site
- ❌ Test results are unreliable and confusing

### When to Clear Cache

✅ **Always clear before:**
- Testing a new site/application
- Switching between different projects
- Starting a fresh test session
- After detecting mixed/stale data

✅ **Good practice:**
- Clear at the start of each test day
- Clear after completing a full test suite
- Clear when debugging unexpected results

### How to Clear MCP Cache

#### Individual Clearing Methods

**Clear Console Messages:**
```bash
curl -X POST https://mcp-debugger-production.up.railway.app/mcp \
  -H "X-API-Key: 352368f9afffa3387a76561a062458d09834a26f9140f8a5e9bc88a08b571cf1" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_console_messages","params":{}}'
```

**Clear Network Requests:**
```bash
curl -X POST https://mcp-debugger-production.up.railway.app/mcp \
  -H "X-API-Key: 352368f9afffa3387a76561a062458d09834a26f9140f8a5e9bc88a08b571cf1" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_network_requests","params":{}}'
```

**Clear Cookies:**
```bash
curl -X POST https://mcp-debugger-production.up.railway.app/mcp \
  -H "X-API-Key: 352368f9afffa3387a76561a062458d09834a26f9140f8a5e9bc88a08b571cf1" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_cookies","params":{}}'
```

#### Quick Clear All Script

**Recommended: Clear everything at once**

```bash
#!/bin/bash
# clear-mcp-cache.sh - Clear all MCP browser state

MCP_URL="https://mcp-debugger-production.up.railway.app/mcp"
API_KEY="352368f9afffa3387a76561a062458d09834a26f9140f8a5e9bc88a08b571cf1"

echo "🧹 Clearing MCP cache..."

# Clear console messages
curl -X POST "$MCP_URL" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_console_messages","params":{}}' -s

# Clear network requests
curl -X POST "$MCP_URL" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_network_requests","params":{}}' -s

# Clear cookies
curl -X POST "$MCP_URL" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"method":"clear_cookies","params":{}}' -s

echo "✅ MCP cache cleared - ready for fresh testing"
```

**Usage:**
```bash
chmod +x clear-mcp-cache.sh
./clear-mcp-cache.sh
```

### Example: Testing Workflow with Cache Clearing

```bash
# Day 1: Test SM Innovation Hub
./clear-mcp-cache.sh
# ... run Innovation Hub tests ...

# Day 2: Test AI Literacy Platform
./clear-mcp-cache.sh  # ⚠️ CRITICAL: Clear before switching sites
# ... run AI Literacy tests ...

# Later: Test another module
./clear-mcp-cache.sh  # ✅ Clean state for accurate results
# ... run tests ...
```

### Visual Indicators

✅ **Clean cache** = Accurate, reliable test results
⚠️ **Stale cache** = Mixed data, confusing errors, inflated counts
❌ **No clearing** = Unreliable results, debugging nightmare

---

## 10 Test Suites

### Suite 1: Platform Integrity
**Tests**: Module loading, TypeScript compilation, routing, console.log statements
**Duration**: ~2 min
**When**: After any code change

### Suite 2: Developer Mode Validation
**Tests**: Activation (Ctrl+Alt+D), activity registration, navigation, persistence
**Duration**: ~4 min
**When**: After DevMode changes, module updates

### Suite 3: Progress Persistence
**Tests**: Save/resume/clear, anti-cheat (tampering, gaps, version changes)
**Duration**: ~3 min
**When**: After Progress Persistence implementation

### Suite 4: AI Validation System
**Tests**: Pre-filter, Gemini API, escape hatch (2 attempts), rejection triggers
**Duration**: ~5 min
**When**: After AI validation changes

### Suite 5: Video Playback
**Tests**: Video URL accessibility, playback, controls, completion triggers
**Duration**: ~2 min
**When**: After video URL changes

### Suite 6: Accessibility Compliance
**Tests**: Contrast ratios (4.5:1), semantic HTML, keyboard nav, ARIA labels
**Duration**: ~4 min
**When**: After UI changes, before deployment

### Suite 7: Module-Specific Validation
**Tests**: Certificates, quizzes, reflections, interactive activities
**Duration**: ~6 min
**When**: After module-specific changes

### Suite 8: Responsive Design
**Tests**: 4 breakpoints (desktop, laptop, tablet, mobile), touch targets
**Duration**: ~3 min
**When**: After layout changes

### Suite 9: Cross-Browser Compatibility
**Tests**: Chrome/Firefox/Safari compatibility
**Duration**: ~3 min
**When**: Before major releases

### Suite 10: Performance & Quality
**Tests**: Load time, bundle size, large files, memory leaks, network requests
**Duration**: ~2 min
**When**: Weekly, before deployment

---

## Test Execution Patterns

### Pattern 1: After Code Changes (Smoke Test)
```bash
npm run mcp:smoke
```
**Duration**: 3 minutes
**Coverage**: Platform Integrity + Sample Accessibility + Sample Video

### Pattern 2: Before Commit (Module-Specific)
```bash
MODULE=ancient-compass npm run mcp:module
```
**Duration**: 4 minutes
**Coverage**: Suites 1-7 for specific module

### Pattern 3: Before Deployment (Full Regression)
```bash
npm run mcp:full
```
**Duration**: 18 minutes
**Coverage**: All 10 suites, all 9 modules

### Pattern 4: Accessibility Focus
```bash
npm run mcp:accessibility
```
**Duration**: 6 minutes
**Coverage**: Suite 6 for all modules

---

## Platform-Specific Test Patterns

### Testing Developer Mode

```javascript
// MCP Test Pattern
{
  url: 'https://AILitStudents.replit.app/module/what-is-ai',
  steps: [
    { action: 'wait', duration: 2000 },
    // Simulate Ctrl+Alt+D
    { action: 'evaluate', script: 'window.dispatchEvent(new KeyboardEvent("keydown", {key: "d", ctrlKey: true, altKey: true}))' },
    { action: 'wait', duration: 500 },
    { action: 'is_visible', selector: 'input[type="password"]' },
    { action: 'type', selector: 'input[type="password"]', text: '752465Ledezma' },
    { action: 'click', selector: 'button:has-text("Unlock")' },
    { action: 'wait', duration: 1000 },
    { action: 'is_visible', selector: '.dev-mode-panel' },
    // Check activity count
    { action: 'evaluate', script: 'document.querySelectorAll(".activity-item").length' }
  ]
}
```

**What to Check**:
- Panel appears after correct password
- Activity count matches module's activities
- No infinite registration loops (console errors)
- Navigation jumps to clicked activity

### Testing Progress Persistence

```javascript
// Save Progress
{
  steps: [
    // Complete activity 1
    { action: 'click', selector: 'button:has-text("Next")' },
    { action: 'wait', duration: 1000 },
    // Complete activity 2
    { action: 'click', selector: 'button:has-text("Next")' },
    { action: 'wait', duration: 1000 },
    // Refresh
    { action: 'evaluate', script: 'window.location.reload()' },
    { action: 'wait', duration: 2000 },
    // Check resume dialog
    { action: 'is_visible', selector: '.resume-dialog' }
  ]
}
```

**What to Check**:
- Resume dialog appears with correct activity
- "Resume" returns to saved position
- "Start Over" clears localStorage
- Anti-cheat detects tampering (invalid activity index, gaps, version changes)

### Testing AI Validation + Escape Hatch

```javascript
// Attempt 1: Complaint
{
  steps: [
    { action: 'type', selector: 'textarea', text: 'This is stupid I hate this assignment' },
    { action: 'click', selector: 'button:has-text("Submit")' },
    { action: 'wait', duration: 5000 }, // Gemini API call
    { action: 'is_visible', selector: '.feedback-warning' }
  ]
}

// Attempt 2: Off-topic → Escape Hatch
{
  steps: [
    { action: 'click', selector: 'button:has-text("Try Again")' },
    { action: 'type', selector: 'textarea', text: 'I like pizza and video games' },
    { action: 'click', selector: 'button:has-text("Submit")' },
    { action: 'wait', duration: 5000 },
    { action: 'is_visible', selector: '.escape-hatch' },
    // Check 2 buttons present
    { action: 'evaluate', script: 'document.querySelectorAll(".escape-hatch button").length' }
  ]
}
```

**What to Check**:
- Valid response → green feedback → proceed
- Gibberish → pre-filter rejection (no API call)
- Too short → pre-filter rejection
- Complaint/off-topic → yellow warning (attempt 1)
- Second rejection → escape hatch appears
- "Try One More Time" resets form
- "Continue Anyway" proceeds

### Testing Accessibility

```bash
# Check for bg- without text- color
grep -r 'className.*bg-' client/src/components/modules/ --include="*.tsx" | grep -v 'text-'

# Run automated contrast checks
node scripts/mcp/gemini-analyzer.js contrast https://AILitStudents.replit.app/module/what-is-ai

# Check semantic HTML
node scripts/mcp/gemini-analyzer.js semantic https://AILitStudents.replit.app
```

**What to Check**:
- All `bg-*` have explicit `text-*` color
- Contrast ratios ≥ 4.5:1
- No `<div onclick>` (use `<button>`)
- Icon-only buttons have `aria-label`
- Keyboard navigation works (Tab order logical)

---

## Auto-Collaboration Triggers

### Accessibility Violations → accessibility-tester
```
Found: Button with bg-blue-500 missing text-white
Action: Invoke accessibility-tester for comprehensive WCAG audit
```

### Code Quality Issues → code-reviewer
```
Found: 3 console.log statements in production
Action: Invoke code-reviewer to verify patterns and remove debug code
```

### Large Files → refactoring-specialist (Suggested)
```
Found: IntroductionToPromptingModule.tsx (2672 lines)
Action: Suggest refactoring-specialist (user must confirm)
```

### Complex Failures → qa-expert
```
Found: Cross-browser compatibility failure
Action: Invoke qa-expert for manual verification
```

---

## Interpreting Test Results

### Success Report Example

```
✅ Platform Integrity - 15/15 passed (2m 18s)
✅ Developer Mode - 18/18 passed (3m 45s)
✅ Accessibility - 23/23 passed (4m 12s)

Summary: 147/147 passed (100% success rate)
Duration: 18m 32s
Status: PRODUCTION READY
```

### Failure Report Example

```
❌ Accessibility - 21/23 passed (4m 12s)

Failures:
1. Contrast ratio check - introduction-to-prompting
   Location: IntroductionToPromptingModule.tsx:1342
   Issue: bg-blue-500 missing text-white
   Contrast: 2.8:1 (Required: 4.5:1)
   Fix: Add text-white class

2. Console.log statements - intro-to-gen-ai
   Location: IntroToGenAIModule.tsx:234, 567
   Issue: Debug code in production
   Fix: Remove console.log statements

Auto-Collaboration:
→ Invoked accessibility-tester (2 WCAG violations)
→ Invoked code-reviewer (code quality issues)
```

---

## Troubleshooting

### Problem: MCP Server Not Responding

```bash
curl https://mcp-debugger-production.up.railway.app/health
```

**Solutions**:
- Check Railway deployment status (GitHub: https://github.com/maizoro87/MCP-Debugger)
- Verify API endpoint accessible
- Check for rate limiting
- For authenticated endpoints, ensure `MCP_DEBUGGER_API_KEY` environment variable is set
- Verify API key is correct (health endpoint is public, but /mcp requires auth)

### Problem: Tests Timing Out

**Symptoms**: Steps fail with "Timeout 5000ms exceeded"

**Solutions**:
- Increase wait durations (default: 2000ms)
- Check production URL accessible (https://AILitStudents.replit.app)
- Verify Replit deployment active
- Check if video loading is slow (Firebase)

### Problem: False Positives

**Symptoms**: Test fails but feature works manually

**Solutions**:
- Review test expectations
- Check for race conditions
- Verify selectors are stable
- Consider dynamic content loading times

### Problem: Auto-Collaboration Not Triggering

**Symptoms**: Failures found but agents not invoked

**Solutions**:
- Check pattern matching logic in mcp-debugger.md
- Verify agent files exist in `.claude/agents/`
- Review failure thresholds
- Check invocation conditions met

---

## Best Practices

### 1. Always Use Production URL
```javascript
// ✅ CORRECT
url: 'https://AILitStudents.replit.app/module/what-is-ai'

// ❌ WRONG
url: 'http://localhost:5173/module/what-is-ai'
```

**Why**: Videos stored in Firebase, only accessible via production URL

### 2. Test After Every Significant Change
- After module updates
- After pattern changes (DevMode, Progress, AI Validation)
- Before commits
- Before deployment

### 3. Run Full Regression Before Deployment
```bash
npm run mcp:full
```

Ensures no regressions across all 9 modules and 10 test suites.

### 4. Fix Accessibility Issues Immediately
WCAG violations affect all students. Always invoke accessibility-tester for deep audit.

### 5. Trust Auto-Collaboration
When MCP debugger invokes other agents, review their findings carefully. They're triggered based on detected patterns.

---

## Integration with CI/CD (Future)

### Pre-Commit Hook
```bash
# .git/hooks/pre-commit
npm run mcp:smoke || exit 1
```

### GitHub Actions
```yaml
name: MCP Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run MCP Tests
        run: npm run mcp:full
```

---

## Success Criteria

### Per Test Run
- [ ] MCP server health check passes
- [ ] All 9 modules accessible
- [ ] Test execution completes without crashes
- [ ] Report generated successfully
- [ ] Auto-collaboration triggered appropriately

### Quality Gates
- [ ] Success rate ≥ 95%
- [ ] Zero high-severity failures
- [ ] Accessibility compliance maintained
- [ ] No console.log in production
- [ ] TypeScript compilation clean
- [ ] Performance within thresholds

---

## Quick Reference

### Test Commands
```bash
npm run mcp:health              # Check server
npm run mcp:smoke              # Fast test (3 min)
npm run mcp:full               # Full regression (18 min)
MODULE=what-is-ai npm run mcp:module  # Module-specific
npm run mcp:accessibility      # Accessibility only
```

### Agent Invocations
```
"MCP debugger, run full regression tests"
"MCP debugger, test ancient-compass module"
"MCP debugger, check accessibility compliance"
"MCP debugger, run smoke test and report"
```

### Report Locations
- **JSON**: `test-reports/mcp/mcp-test-results-*.json`
- **Markdown**: `test-reports/mcp/mcp-test-report-*.md`

---

**For comprehensive MCP debugger documentation, see `.claude/agents/mcp-debugger.md`**
