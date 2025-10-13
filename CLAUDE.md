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
VITE_GOOGLE_API_KEY=<in Replit Secrets>
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
│   └── guides/                  # Detailed implementation guides
├── scripts/
│   ├── gemini-vision-inspector.js  # AI-powered UI testing
│   └── analyze-console-logs.js     # Log analysis tool
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

**Status**: 7/8 modules integrated (ResponsibleEthicalAIModule skipped - no activities)

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

## 🛡️ Student Input Validation

**For ALL reflection/exit ticket activities:**

**Validation Rules:**
- 100 characters minimum (2-3 sentences)
- 15 words minimum
- Detect gibberish (keyboard mashing, repeated chars)
- NO bypass option - mandatory retry

**Two-Layer Validation:**
```typescript
import { generateEducationFeedback, isNonsensical } from '@/utils/aiEducationFeedback';

// Layer 1: Pre-filter (gibberish, too short)
const isInvalid = isNonsensical(response);

// Layer 2: AI feedback quality check (strict rejection only)
const feedback = await generateEducationFeedback(response, question);
const feedbackIndicatesRetry =
  feedback.toLowerCase().includes('does not address') ||
  feedback.toLowerCase().includes('please re-read') ||
  feedback.toLowerCase().includes('inappropriate language') ||
  feedback.toLowerCase().includes('off-topic') ||
  feedback.toLowerCase().includes('must elaborate') ||
  feedback.toLowerCase().includes('insufficient') ||
  feedback.toLowerCase().includes('monitored for inappropriate') ||
  feedback.toLowerCase().includes('answer the original question');

setNeedsRetry(isInvalid || feedbackIndicatesRetry);
```

**Key Validation Phrases:**
- ✅ **Strict Rejection** (triggers retry): "does not address", "must elaborate", "insufficient", "off-topic"
- ❌ **Encouragement** (no retry): "please elaborate on...", "could you elaborate", "consider adding"
- 🎯 **Philosophy**: Only block truly inadequate responses, not ones that could use minor improvement

**Content Safety:**
- Gemini API safety settings in `client/src/services/geminiClient.ts:68-87`
- Blocked content → Show warning, force retry
- Prompt injection protection built-in

**Files:**
- `client/src/utils/aiEducationFeedback.ts` - Validation logic
- `client/src/services/geminiClient.ts` - Safety config
- Examples: `VideoReflectionActivity.tsx`, `ExitTicket.tsx`

**Testing Required:**
1. Keyboard mashing → Reject
2. Too short → Elaborate
3. Gibberish → Reject
4. Inappropriate → Block + warning
5. Prompt injection → Ignore + evaluate normally
6. Valid response → Honest feedback

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

**Status**: 1/8 modules (What Is AI implemented)

**Detailed Guide**: `.claude/guides/progress-persistence.md`

## 📝 Module Status

**Large Modules Needing Refactoring:**
1. IntroductionToPromptingModule (2672 lines)
2. LLMLimitationsModule (2078 lines)
3. IntroToGenAIModule (1730 lines)

**Validation Status:**
- ✅ What Is AI - Full validation
- ✅ Understanding LLMs - 100 char minimum
- ⚠️ 6 modules need validation review

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
2. Set `minResponseLength = 100`
3. Implement two-layer validation
4. NO bypass button
5. Test with gibberish, inappropriate content, prompt injection

## 🤝 Collaboration Guidelines

1. Maintain existing code style
2. Test before committing
3. Keep commits focused
4. Update documentation for major features
5. Accessibility is mandatory, not optional

---

*Condensed for performance. Detailed guides in `.claude/guides/`. Update when making architectural changes.*
