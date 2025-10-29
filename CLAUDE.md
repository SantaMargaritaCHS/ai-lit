# CLAUDE.md - AI Assistant Guidelines for AI Literacy Student Platform

## 🔐 Secrets Management

**CRITICAL**: Never commit API keys to GitHub.

**Secrets Location:**
- **Primary**: Replit Secrets (lock icon in sidebar)
- **Mirror**: `/home/runner/workspace/.secrets.local` (gitignored)

**Required Keys:**
```bash
GEMINI_API_KEY=<in Replit Secrets>
BROWSERLESS_API_KEY=<in Replit Secrets>
AI_LITERACY_BOT_API_KEY=<in Replit Secrets>
MCP_DEBUGGER_API_KEY=<in Replit Secrets>  # For automated browser testing
```

**Usage:**
```bash
source /home/runner/workspace/.secrets.local
node scripts/gemini-vision-inspector.js
```

**Rules:**
- ❌ Never commit `.secrets.local`
- ❌ Never hardcode keys in source
- ✅ Always use environment variables
- ✅ Rotate keys if exposed

---

## 🎯 Project Overview

**Production URL**: https://AILitStudents.replit.app

**Purpose**: Educational web app teaching AI literacy to high school students (ages 14-18) through 8 interactive video-based modules.

**Tech Stack:**
- React 18 + TypeScript + Vite
- Wouter (routing), Tailwind CSS, shadcn/ui components
- Firebase (video storage), Gemini API (AI feedback)
- LocalStorage (progress persistence)

**8 Learning Modules:**
1. What Is AI (`/module/what-is-ai`)
2. Intro to Gen AI (`/module/intro-to-gen-ai`)
3. Intro to LLMs (`/module/intro-to-llms`)
4. Understanding LLMs (`/module/understanding-llms`)
5. LLM Limitations (`/module/llm-limitations`)
6. Privacy & Data Rights (`/module/privacy-data-rights`)
7. AI Environmental Impact (`/module/ai-environmental-impact`)
8. Introduction to Prompting (`/module/introduction-to-prompting`)

## 📁 Key Files & Directories

```
/home/runner/workspace/
├── client/src/
│   ├── components/modules/      # 8 module components
│   ├── components/ui/           # shadcn/ui components
│   ├── context/                 # React contexts (User, DevMode, ActivityRegistry)
│   ├── lib/progressPersistence.ts  # Progress saving system
│   ├── utils/aiEducationFeedback.ts  # Validation & safety
│   └── services/geminiClient.ts    # Gemini API config
├── .claude/
│   ├── agents/                  # 7 specialized Claude Code agents (NEW: mcp-debugger)
│   └── guides/                  # Detailed implementation guides
├── scripts/
│   ├── mcp/                     # MCP automated testing scripts (NEW)
│   ├── gemini-vision-inspector.js  # AI-powered UI testing
│   └── analyze-console-logs.js     # Log analysis tool
├── test-reports/mcp/            # MCP test results (gitignored)
└── screenshots/                 # Temporary (gitignored)
```

## 🛠️ Universal Developer Mode

**Quick Reference:**
- **Activation**: `Ctrl+Alt+D` → password: `752465Ledezma`
- **Purpose**: Jump between activities for testing without watching videos
- **Implementation**: See `.claude/guides/dev-mode-integration.md` for details

**Core Components:**
- `client/src/context/DevModeContext.tsx` - Activation state
- `client/src/context/ActivityRegistryContext.tsx` - Activity tracking
- Event-based: `goToActivity` CustomEvent

**Module Integration Pattern:**
```typescript
import { useActivityRegistry } from '@/context/ActivityRegistryContext';

// Register once on mount (empty deps [])
useEffect(() => {
  clearRegistry();
  activities.forEach((activity, index) => {
    registerActivity({ id, title, type, moduleId, index });
  });
}, []); // CRITICAL: Empty deps to prevent loops

// Listen for navigation events
useEffect(() => {
  const handleGoToActivity = (event: CustomEvent) => {
    setCurrentActivityIndex(event.detail);
  };
  window.addEventListener('goToActivity', handleGoToActivity);
  return () => window.removeEventListener('goToActivity', handleGoToActivity);
}, []);
```

**Status**: 8/8 modules integrated
- ✅ What Is AI, Intro to Gen AI, Understanding LLMs, LLM Limitations, Privacy & Data Rights, AI Environmental Impact, Introduction to Prompting, Ancient Compass
- ⏹️ Responsible Ethical AI Module skipped (no activities to register)

## 🔍 Gemini Vision Testing

**MUST USE PRODUCTION URL**: `https://AILitStudents.replit.app` (Browserless can't reach localhost)

**Key Scripts:**
```bash
# Vision inspector (screenshot + AI analysis)
node /home/runner/workspace/scripts/gemini-vision-inspector.js

# Console log analyzer
node /home/runner/workspace/scripts/analyze-console-logs.js
```

**When to Use:**
- UI bugs, visual regressions, accessibility checks
- "Does this look correct?" → Take screenshot + analyze

**Files:**
- Scripts: `/home/runner/workspace/scripts/*.js` ✅ Commit
- Screenshots: `/home/runner/workspace/screenshots/` ❌ Gitignored

## 🔄 Checkpoint System

**Context**: Replit shell loses all context on restart. Checkpoints restore state.

**Protocol Before System Restart:**
1. Ask user: "Should I create a checkpoint before [risky command]?"
2. Create `/home/runner/workspace/.claude/CHECKPOINT.md`
3. Wait for approval before executing

**Checkpoint Structure:**
```markdown
# 🔄 Checkpoint - [Date/Time]

## 📋 Task Summary
[One sentence]

## ✅ Completed Work
- Specific files/features

## 🔄 Current Status
**Last Activity**: [description]
**Files Modified**: [paths with changes]

## 🎯 Next Steps
1-3 specific actions

## 🔍 Critical Info
- Branch, dependencies, server status, env vars
```

**Detecting Restart:**
- User says "I just restarted" or "we lost connection"
- Immediately: `cat /home/runner/workspace/.claude/CHECKPOINT.md`

## 🚀 Development Commands

```bash
npm install           # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npx tsc --noEmit     # Type check
```

## 🤖 Core AI Assistant Rules

### Module Development
- Self-contained modules with `userName` prop
- Include certificate generation at completion
- Use shadcn/ui components + Tailwind CSS
- Large modules (>2000 lines) should be split

### Video URL Patterns

**CRITICAL: Firebase Storage Path Format**

Always use relative paths starting with `Videos/` for PremiumVideoPlayer compatibility:

✅ **CORRECT:**
```typescript
const VIDEO_URLS = {
  part1: 'Videos/Student Videos/Topic/video.mp4',
  part2: 'Videos/Student Videos/Topic/video2.mp4'
};
```

❌ **WRONG (causes playback failures):**
```typescript
// DO NOT use gs:// protocol URLs
const videoUrl = 'gs://ai-literacy-platform-175d4.firebasestorage.app/Videos/...';
```

**Why:** PremiumVideoPlayer only converts paths starting with `Videos/` using the `getVideoUrl()` function from `videoService.ts`. The `gs://` protocol is not supported by browsers and won't be converted to HTTPS URLs.

**Pattern Usage:**
- ✅ AI Environmental Impact, Introduction to Prompting - Use relative paths
- ⚠️ Understanding LLMs, Intro to Gen AI, Ancient Compass - Use full HTTPS URLs (legacy pattern, works but verbose)

**Recommendation:** Standardize on relative paths for all new modules.

### Code Quality
- Remove all `console.log` in production
- Define interfaces for all props (no `any` type)
- Implement proper cleanup in `useEffect`
- Handle loading/error states

### Accessibility (MANDATORY)

**WCAG 2.1 AA Standards:**
- Minimum contrast: 4.5:1 for normal text
- Enhanced: 7:1 optimal
- Large text (18pt+): 3:1 minimum

**Critical Rule**: When setting `bg-*` class, ALWAYS specify `text-*` color.

❌ **NEVER:**
```tsx
<Button className="bg-blue-600 hover:bg-blue-700">Try Again</Button>
```

✅ **ALWAYS:**
```tsx
<Button className="bg-blue-600 hover:bg-blue-700 text-white">Try Again</Button>
```

**Safe Patterns:**
- Dark: `bg-blue-600 hover:bg-blue-700 text-white`
- Light: `bg-gray-100 hover:bg-gray-200 text-gray-900`
- Prefer: `<Button variant="default">` (built-in contrast)

**Checklist:**
- [ ] Custom backgrounds have explicit text colors
- [ ] Contrast ratios ≥ 4.5:1
- [ ] ARIA labels on interactive elements
- [ ] Semantic HTML (`<button>` not `<div onClick>`)

### How to Prevent Text Visibility Issues

**The Simple Rule:**
- **Dark backgrounds** → Use `text-white` or very light tints
- **Light backgrounds** → Use `text-black` or `text-gray-900`

**NEVER use:**
- ❌ `text-*-200` or `text-*-100` on dark backgrounds
- ❌ `text-gray-*` on semi-transparent backgrounds
- ❌ Any color without explicitly checking contrast

**Use Contrast Checker Tools (MANDATORY):**

Before finalizing ANY custom color combination, verify it passes WCAG standards:

**Free Tools:**
1. **WebAIM Color Contrast Checker**
   - URL: https://webaim.org/resources/contrastchecker/
   - Input your text color and background color
   - Instant pass/fail for WCAG AA and AAA standards

2. **Adobe Color Contrast Analyzer**
   - URL: https://color.adobe.com/create/color-contrast-analyzer
   - Visual interface for testing multiple combinations
   - Shows exact contrast ratios

**Workflow:**
1. Choose your background color (e.g., `bg-blue-900/40`)
2. Choose your text color (e.g., `text-white`)
3. Run both through contrast checker
4. Verify it shows "PASS" for WCAG AA (minimum 4.5:1)
5. If it fails, adjust until it passes

**This removes ALL guesswork and prevents repeated visibility mistakes.**

## 🛡️ Student Input Validation

**Philosophy**: Encourage thoughtful engagement while preventing infinite validation loops. System provides educational feedback via Gemini AI with a 2-attempt escape hatch.

**For ALL reflection/exit ticket activities:**

### Two-Layer Validation System

**Layer 1: Pre-Filter (`isNonsensical`)**
- Catches truly nonsensical input BEFORE calling Gemini API
- Rejects: keyboard mashing, repeated chars, too short (<100 chars/<15 words), no vowels
- Does NOT reject: complaints, off-topic, inappropriate (handled by Layer 2)
- Generic error: "Your response needs more depth..."

**Layer 2: Gemini AI Evaluation**
- Intelligent, context-aware feedback on response quality
- Model: `gemini-2.5-flash`, temp 0.4, maxOutputTokens 1000
- Handles complaints, off-topic responses, generic fluff
- Provides educational feedback or rejection with guidance

```typescript
import { generateEducationFeedback, isNonsensical } from '@/utils/aiEducationFeedback';

// Layer 1: Pre-filter check
const isInvalid = isNonsensical(response);

// Layer 2: AI evaluation
const feedback = await generateEducationFeedback(response, question);

// Check for strict rejection phrases
const feedbackIndicatesRetry =
  feedback.toLowerCase().includes('does not address') ||
  feedback.toLowerCase().includes('please re-read') ||
  feedback.toLowerCase().includes('inappropriate language') ||
  feedback.toLowerCase().includes('off-topic') ||
  feedback.toLowerCase().includes('must elaborate') ||
  feedback.toLowerCase().includes('insufficient') ||
  feedback.toLowerCase().includes('needs more depth') ||
  feedback.toLowerCase().includes('random text') ||
  feedback.toLowerCase().includes('answer the original question');

setNeedsRetry(isInvalid || feedbackIndicatesRetry);
```

### Escape Hatch System (2-Attempt Limit)

**Purpose**: Prevent students from getting stuck in validation loops (these are teenagers!)

**Implementation:**
```typescript
const [attemptCount, setAttemptCount] = useState(0);
const [showEscapeHatch, setShowEscapeHatch] = useState(false);
const MAX_ATTEMPTS = 2;

// Track attempts
if (feedbackIndicatesRetry) {
  const newAttemptCount = attemptCount + 1;
  setAttemptCount(newAttemptCount);
  if (newAttemptCount >= MAX_ATTEMPTS) {
    setShowEscapeHatch(true);
  }
}
```

**After 2 failed attempts, student sees:**
- ⚠️ Warning message about multiple attempts
- **Two options:**
  1. "Try One More Time" - Resets form, clears attempt count
  2. "Continue Anyway" - Proceeds to next activity/certificate
- ⚠️ **"Instructor review" warning** if they continue (harmless lie for accountability)

**Button Actions:**
- **Try Again**: Resets `attemptCount` to 0, clears form, hides escape hatch
- **Continue Anyway**: Logs bypass to console, proceeds with `onComplete()`

### Rejection Trigger Phrases

Gemini feedback containing ANY of these phrases triggers retry:
- "does not address"
- "please re-read"
- "inappropriate language"
- "off-topic"
- "must elaborate"
- "insufficient"
- "needs more depth"
- "random text"
- "answer the original question"

### Implementation Status

**Modules with Escape Hatch:**
- ✅ Understanding LLMs - `ExitTicketLLM.tsx`
- ✅ What Is AI - `VideoReflectionActivity.tsx`
- ✅ Intro to Gen AI - `IntroToGenAIModule.tsx` (exit ticket)
- ✅ AI Environmental Impact - `AIEnvironmentalImpactModule.tsx` (Reflection + Exit Ticket)
- ✅ Ancient Compass - 3 activities:
  - `RevolutionComparisonChart.tsx` (reflection question)
  - `StakeholderPerspectives.tsx` (2 reflection questions)
  - `EthicalDilemmaScenarios.tsx` (scenario responses)
- ⏳ 3 remaining modules need implementation (Intro to LLMs, LLM Limitations, Introduction to Prompting)

### Files & Documentation

**Core Files:**
- `client/src/utils/aiEducationFeedback.ts` - Validation logic, pre-filter, Gemini prompting
- `client/src/services/geminiClient.ts` - Gemini API config, safety settings
- `.claude/guides/student-feedback-validation.md` - Comprehensive 400+ line implementation guide

**Implementation Examples:**
- `client/src/components/UnderstandingLLMModule/activities/ExitTicketLLM.tsx`
- `client/src/components/WhatIsAIModule/VideoReflectionActivity.tsx`
- `client/src/components/modules/IntroToGenAIModule.tsx` (exit ticket section)

### Testing Checklist

**Must test every validation implementation:**
1. ✅ Valid response → Green feedback, proceed
2. ✅ Complaint (1st attempt) → Yellow retry feedback
3. ✅ Complaint (2nd attempt) → Escape hatch appears
4. ✅ Gibberish → Pre-filter rejection, no API call
5. ✅ Too short → Pre-filter rejection
6. ✅ "Try One More Time" → Resets everything
7. ✅ "Continue Anyway" → Proceeds to certificate

### Critical Configuration

**IMPORTANT**: Gemini 2.5 Flash uses 200-500 "thinking tokens" internally. Always set:
```typescript
maxOutputTokens: 1000 // High enough for thinking (200-500) + response (100-200) + buffer
```

If `maxOutputTokens` is too low (e.g., 200), Gemini returns empty responses with `finishReason: "MAX_TOKENS"`.

## 💾 Progress Persistence

**Purpose**: Save student progress on refresh (localStorage). Prevents losing work on accidental refresh.

**What Gets Saved:**
- ✅ `currentActivity` index, `activities[].completed`, `lastUpdated`, `moduleVersion`
- ❌ AI feedback, video timestamps, quiz answers (validation re-runs)

**Anti-Cheat Safeguards:**
1. Sequential completion (no gaps)
2. Can't jump ahead of last completed
3. Module version invalidation on structure change

**Implementation Pattern:**
```typescript
import { saveProgress, loadProgress, clearProgress, getProgressSummary } from '@/lib/progressPersistence';
import ResumeProgressDialog from './ResumeProgressDialog';

const MODULE_ID = 'what-is-ai'; // Unique per module

// Load on mount
useEffect(() => {
  const progress = loadProgress(MODULE_ID, activities);
  if (progress) {
    setSavedProgress(getProgressSummary(MODULE_ID));
    setShowResumeDialog(true);
  }
}, []);

// Auto-save on state change
useEffect(() => {
  if (!showResumeDialog && currentActivity > 0) {
    saveProgress(MODULE_ID, currentActivity, activities);
  }
}, [currentActivity, activities, showResumeDialog]);

// Clear on certificate download
onDownload={() => clearProgress(MODULE_ID)}
```

**Testing Checklist:**
1. Normal refresh → Resume dialog → Click resume
2. Tampering (skip activities) → Reset
3. Tampering (jump ahead) → Reset
4. Module structure change → Reset
5. Certificate download → Clear progress

**Status**: 5/8 modules implemented
- ✅ What Is AI
- ✅ Intro to Gen AI
- ✅ Ancient Compass
- ✅ AI Environmental Impact
- ✅ Introduction to Prompting
- ⏳ 3 remaining modules (Understanding LLMs, LLM Limitations, Intro to LLMs)

**Detailed Guide**: `.claude/guides/progress-persistence.md`

## 📝 Module Status

**Large Modules Needing Refactoring:**
1. IntroductionToPromptingModule (2672 lines)
2. LLMLimitationsModule (2078 lines)
3. IntroToGenAIModule (1730 lines)

**Recent Module Completions:**
- ✅ **AI Environmental Impact Module** - Complete rebuild (Dec 2024)
  - Old: 945-line educator-focused → New: 1,152-line student-focused
  - 12 video segments across 4 files (3 BBC parts + 1 animated with time-coded segments)
  - 3 interactive components: EnvironmentalCalculator, EnvironmentalImpactMatrix, SimplifiedSolutionsSorter
  - Full AI validation + 2-attempt escape hatch (Reflection + Exit Ticket)
  - Developer Mode + Progress Persistence integrated
  - Video management: relative Firebase Storage paths (`Videos/...`)

**Validation Status:**
- ✅ What Is AI - Full validation + escape hatch
- ✅ Understanding LLMs - 100 char minimum + escape hatch
- ✅ Intro to Gen AI - Full validation + escape hatch
- ✅ AI Environmental Impact - Full validation + escape hatch (Reflection + Exit Ticket)
- ✅ Ancient Compass - AI validation + escape hatch (3 activities: RevolutionComparisonChart, StakeholderPerspectives, EthicalDilemmaScenarios)
- ⏳ 3 modules need validation implementation (Intro to LLMs, LLM Limitations, Introduction to Prompting)

## 🚦 Quick Status Checks

```bash
# Production status
curl -I https://AILitStudents.replit.app/

# TypeScript errors count
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l

# Large files
find client/src -name "*.tsx" -exec wc -l {} \; | sort -rn | head -10

# Console logs (should be 0 in production)
grep -r "console.log" client/src --include="*.tsx" --include="*.ts" | wc -l
```

## 🤖 Specialized Agents

**Location**: `.claude/agents/` (7 agents + README)

**Available Agents:**
- **accessibility-tester** - WCAG 2.1 AA audits (contrast ratios, semantic HTML)
- **refactoring-specialist** - Break down large modules (preserves patterns)
- **code-reviewer** - Platform-specific code review (patterns, quality, accessibility)
- **frontend-developer** - Build educational modules (self-contained, Dev Mode, validation)
- **qa-expert** - Comprehensive testing (Dev Mode, Progress Persistence, AI validation)
- **documentation-engineer** - Maintain CLAUDE.md and guides
- **mcp-debugger** - Automated browser testing via Railway MCP server (all 10 suites)

**Quick Usage:**
- Simply mention agent by name or describe the task
- Example: "accessibility-tester, please audit the Privacy module"
- See `.claude/agents/README.md` for workflows and examples

## 🧪 MCP Remote Testing

**MCP Server**: https://mcp-debugger-production.up.railway.app
**GitHub**: https://github.com/maizoro87/MCP-Debugger
**Purpose**: Automated browser testing on production URL (https://AILitStudents.replit.app)
**Authentication**: Requires `MCP_DEBUGGER_API_KEY` (X-API-Key header) - Health endpoint is public
**Endpoints**: 21 available (including AI Vision via Gemini 2.5 Flash)

**⚠️ CRITICAL: DEPLOYMENT REQUIREMENT**
- MCP tests run against **production URL only** (https://AILitStudents.replit.app)
- Code changes are **NOT visible to MCP** until you deploy/republish on Replit
- **Before running MCP tests after code changes:**
  1. User must deploy the site on Replit (click "Run" or republish)
  2. Wait for deployment to complete (~30-60 seconds)
  3. Then run MCP tests to validate the deployed changes
- **MCP will test whatever is currently live**, not your local/uncommitted code

**Quick Usage:**
- "MCP debugger, run full regression tests"
- "MCP debugger, test ancient-compass module"
- "MCP debugger, check accessibility compliance"

**10 Test Suites:**
1. Platform Integrity (module loading, TypeScript, routing)
2. Developer Mode Validation (activation, navigation, persistence)
3. Progress Persistence (save/resume/clear, anti-cheat)
4. AI Validation System (pre-filter, Gemini API, escape hatch)
5. Video Playback (URL validation, controls, completion)
6. Accessibility Compliance (contrast ratios, semantic HTML, keyboard nav)
7. Module-Specific Validation (certificates, quizzes, reflections)
8. Responsive Design (4 breakpoints)
9. Cross-Browser Compatibility (Chrome, Firefox, Safari)
10. Performance & Quality (load time, bundle size, memory)

**Test Scripts:**
```bash
npm run mcp:health        # Check MCP server status
npm run mcp:smoke        # Fast smoke test (~3 min)
npm run mcp:full         # Full regression (~18 min)
npm run mcp:module       # Test specific module
npm run mcp:accessibility # Accessibility audit
```

**Auto-Collaboration**: MCP debugger automatically invokes specialized agents based on findings:
- Accessibility violations → accessibility-tester
- Code quality issues → code-reviewer
- Large files detected → refactoring-specialist (suggested)
- Complex failures → qa-expert

**See**: `.claude/agents/mcp-debugger.md` and `.claude/guides/mcp-testing.md` for comprehensive documentation

## 📚 Common Tasks

**Add New Module:**
1. Create in `client/src/components/modules/`
2. Add to `moduleMap` in `App.tsx`
3. Add metadata to `HomePage.tsx`

**Fix TypeScript Errors:**
- Check import/export syntax
- Define prop interfaces
- Verify module exports

**Add Reflection Activity:**
1. Import validation: `isNonsensical`, `generateEducationFeedback`
2. Set `minResponseLength = 100` (or 150 for deeper reflections)
3. Implement two-layer validation (pre-filter + AI feedback)
4. Add 2-attempt escape hatch (see escape hatch section)
5. Test with gibberish, inappropriate content, prompt injection
6. Consider activity-specific validation context (e.g., "revolution comparison" vs "general reflection")

**Video Management in Modules:**
- Use relative paths: `Videos/Student Videos/Topic/file.mp4`
- Use PremiumVideoPlayer for segmented content
- Document time codes in comments for time-coded segments
- Test video loading on production URL before committing
- For multiple video files, use descriptive constant names (e.g., `bbcPart1`, `bbcPart2`, `animated`)

## 🤝 Collaboration Guidelines

1. Maintain existing code style
2. Test before committing
3. Keep commits focused
4. Update documentation for major features
5. Accessibility is mandatory, not optional

---

*Condensed for performance. Detailed guides in `.claude/guides/`. Update when making architectural changes.*
