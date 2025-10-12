# CLAUDE.md - AI Assistant Guidelines for AI Literacy Student Platform

## 🔐 IMPORTANT: Secrets Management

**CRITICAL**: This project uses API keys that must NEVER be committed to GitHub.

### Secrets Location
All secrets are stored in **Replit Secrets** (NOT in `.env` or code files):
- **Primary Source**: Replit Secrets (accessible via lock icon in Replit sidebar)
- **Local Mirror**: `/home/runner/workspace/.secrets.local` (gitignored, synced from Replit Secrets)
- **Never Commit**: Any file containing actual API key values

### Required Secrets in Replit
**IMPORTANT**: All API keys below are already configured in this Replit project's Secrets:

```bash
GEMINI_API_KEY=<configured in Replit Secrets>
BROWSERLESS_API_KEY=<configured in Replit Secrets>
AI_LITERACY_BOT_API_KEY=<configured in Replit Secrets>
VITE_GOOGLE_API_KEY=<configured in Replit Secrets>
```

**How Replit Secrets Work**:
- Keys are stored securely in Replit's encrypted vault
- Automatically available as environment variables in the shell
- Not visible in the codebase or git history
- Can be accessed via the lock icon (🔒) in the Replit sidebar
- Each Replit project has its own isolated Secrets

### Accessing Secrets in Scripts
```bash
# Replit Secrets are automatically available as environment variables
echo $GEMINI_API_KEY

# The .secrets.local file mirrors Replit Secrets for convenience
source /home/runner/workspace/.secrets.local

# Then use in scripts
node scripts/gemini-vision-inspector.js
```

**NEVER**:
- ❌ Commit `.secrets.local` to git
- ❌ Hardcode API keys in source files
- ❌ Share API keys in documentation
- ❌ Push secrets to public repositories

**ALWAYS**:
- ✅ Use environment variables
- ✅ Keep secrets in `.secrets.local` (gitignored)
- ✅ Document what secrets are needed, not their values
- ✅ Rotate keys if accidentally exposed

---

## 🎯 Project Overview

### Live Application
- **Production URL**: https://AILitStudents.replit.app
- **Environment**: Replit deployment with automatic HTTPS
- **Status**: Live and publicly accessible

### Core Purpose
This is an educational web application designed to teach **AI literacy to high school students**. The platform provides comprehensive, accessible education about artificial intelligence through interactive, video-based learning modules.

### Educational Mission
- **Target Audience**: High school students (ages 14-18)
- **Learning Approach**: Video-based instruction with interactive pause activities
- **Pedagogical Goals**:
  - Develop critical thinking about AI technologies
  - Understand AI capabilities and limitations
  - Address ethical considerations and societal impacts
  - Build practical AI interaction skills (prompting, evaluation)
  - Foster responsible AI usage habits

### Platform Overview
React-based single-page application with **8 comprehensive learning modules** covering:
- AI fundamentals and core concepts
- Generative AI and Large Language Models
- Technical understanding of how LLMs work
- Limitations and failure modes
- Privacy, data rights, and ethical considerations
- Environmental impact of AI systems
- Practical prompting skills

## 🏗️ Architecture & Tech Stack

### Frontend Framework
- **React 18** with TypeScript for type safety
- **Vite** as the build tool for fast development
- **Wouter** for client-side routing
- **Tailwind CSS** for styling
- **Radix UI** primitives with shadcn/ui components
- **Framer Motion** for animations

### Backend Services
- **Firebase** for video storage and hosting
- **Gemini API** for optional AI feedback features
- **LocalStorage** for user data persistence

### Key Features
1. 8 comprehensive AI literacy modules with video lessons
2. No authentication required - direct access via shareable URLs
3. Interactive pause activities (quizzes, reflections, applications)
4. Progress tracking and certificate generation
5. Responsive design for desktop and mobile
6. AI-powered feedback system (optional)

## 📁 Project Structure

```
/home/runner/workspace/
├── client/src/
│   ├── components/
│   │   ├── modules/           # 8 main learning modules
│   │   ├── ui/                # Reusable UI components
│   │   ├── activities/        # Interactive activities
│   │   └── WhatIsAIModule/    # Module-specific components
│   ├── context/               # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   ├── services/              # API and service integrations
│   └── lib/                   # Utilities and helpers
├── .claude/                   # Claude-specific settings
├── dist/                      # Build output
└── attached_assets/           # Static assets
```

## 🔑 Key Components & Patterns

### Module System
Each module follows this pattern:
```typescript
interface ModuleProps {
  userName?: string;
  onComplete?: () => void;
}
```

### User Context
- Stores user name in localStorage
- Provides name for certificate generation
- Persists across sessions

### Direct Module Linking
URLs follow pattern: `/module/[module-id]`
- `/module/what-is-ai`
- `/module/intro-to-gen-ai`
- `/module/intro-to-llms`
- `/module/understanding-llms`
- `/module/llm-limitations`
- `/module/privacy-data-rights`
- `/module/ai-environmental-impact`
- `/module/introduction-to-prompting`

## 🛠️ Universal Developer Mode

### Overview
Universal Developer Mode is a navigation and testing system that allows developers to quickly jump between activities within any module. It's essential for:
- **Rapid Testing**: Jump directly to specific activities without watching entire videos
- **Quality Assurance**: Verify all pause activities function correctly
- **Development Workflow**: Test changes to specific activities immediately
- **Content Review**: Navigate through module content efficiently

### Activation
1. **Navigate to any module** (e.g., `/module/what-is-ai`)
2. **Press keyboard shortcut**: `Ctrl+Alt+D` (or `Cmd+Alt+D` on Mac)
3. **Enter password**: `752465Ledezma`
4. **Dev panel appears** at the bottom of the screen

### Navigation Controls
Once activated, the dev panel provides:
- **Activity Dropdown**: Select any activity from the complete list
- **Go Button**: Jump immediately to the selected activity
- **Previous Button**: Navigate to the previous activity
- **Next Button**: Navigate to the next activity
- **Arrow Keys**: Use Left/Right arrow keys for quick sequential navigation
- **Current Activity Display**: Shows which activity is currently active

### Architecture

#### Core Components
- **DevModeContext** (`client/src/context/DevModeContext.tsx`): Manages dev mode activation state
- **ActivityRegistryContext** (`client/src/context/ActivityRegistryContext.tsx`): Tracks all registered activities from modules
- **UniversalDevModeProvider**: Combines both contexts and provides the dev panel UI
- **UniversalDevPanel**: The floating UI component with navigation controls

#### Event-Based Communication
The system uses a unidirectional event flow:
```
User Action → Dev Panel → ActivityRegistry.goToActivity()
→ Dispatches 'goToActivity' CustomEvent → Module's Event Listener
→ Module Updates State
```

### Module Integration Pattern

For a module to support Universal Developer Mode, it must:

1. **Import Required Hooks**:
```typescript
import { useActivityRegistry } from '@/context/ActivityRegistryContext';
```

2. **Register Activities on Mount** (once only):
```typescript
const { registerActivity, clearRegistry } = useActivityRegistry();

useEffect(() => {
  clearRegistry(); // Clear previous registrations

  activities.forEach((activity, index) => {
    registerActivity({
      id: `${moduleId}-${index}`,
      title: activity.title,
      type: activity.type, // 'video' | 'interactive' | 'reflection' | 'certificate'
      moduleId: moduleId,
      index: index
    });
  });
}, []); // Empty dependency array - register only on mount
```

3. **Listen for Navigation Events**:
```typescript
useEffect(() => {
  const handleGoToActivity = (event: CustomEvent) => {
    const activityIndex = event.detail;

    // Update module state to jump to the specified activity
    setCurrentActivityIndex(activityIndex);
    setShowCertificate(activityIndex === activities.length);
    // ... other state updates as needed
  };

  window.addEventListener('goToActivity', handleGoToActivity as EventListener);

  return () => {
    window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
  };
}, []); // No dependencies - listener setup only
```

### Important: Preventing Registration Loops

**❌ NEVER do this** (causes infinite loops):
```typescript
useEffect(() => {
  clearRegistry();
  registerActivities();
}, [currentActivityIndex]); // Re-registers on every state change!
```

**✅ ALWAYS do this** (registers once):
```typescript
useEffect(() => {
  clearRegistry();
  registerActivities();
}, []); // Empty deps - only on component mount
```

### Implementation Status

**✅ Fully Integrated Modules (7/8)**:
- CompactWhatIsAIModule
- IntroToGenAIModule
- UnderstandingLLMsModule
- LLMLimitationsModule
- PrivacyDataRightsModule
- AIEnvironmentalImpactModule
- IntroductionToPromptingModule

**⏭️ Skipped (1/8)**:
- ResponsibleEthicalAIModule (Coming Soon placeholder - no activities)

### Testing Workflow

1. **Activate dev mode** in any module
2. **Verify activity registration** in console:
   ```
   📝 ActivityRegistry: Registered activity 0: [Activity Name]
   📝 ActivityRegistry: Registered activity 1: [Activity Name]
   ...
   ```
3. **Test navigation** using dropdown and buttons
4. **Check console logs** for successful jumps:
   ```
   🎯 ActivityRegistry: Dispatching goToActivity event for index 3
   🎯 [ModuleName]: Received goToActivity command for index 3
   ✅ Jumped to activity 3: [Activity Name]
   ```
5. **Verify state updates** - module should display the correct activity

### Troubleshooting

**Problem**: Dev panel doesn't appear
- Solution: Check password is exactly `752465Ledezma`
- Solution: Verify `VITE_DEV_MODE_SECRET_KEY` is set in `.env`

**Problem**: Navigation doesn't work
- Solution: Check module has event listener for `goToActivity`
- Solution: Verify activities are registered (check console logs)

**Problem**: Module "bounces back" to previous activity
- Solution: Remove activity registration from state-dependent useEffect
- Solution: Ensure registration only happens once on mount with empty deps `[]`

## 🔍 Gemini Vision Workflow for Automated Testing

### Overview
This project uses **Gemini Vision API** to automatically analyze the application's UI and diagnose issues. This is superior to traditional browser automation because Gemini can understand context, identify bugs, and provide actionable insights.

### Key Scripts

#### 1. Gemini Vision Inspector
**Path**: `/home/runner/workspace/scripts/gemini-vision-inspector.js`

**What it does**:
- Takes screenshots of the app using Browserless API
- Analyzes screenshots with Gemini Vision
- Identifies UI issues, bugs, and testing opportunities
- Provides detailed, actionable recommendations

**Usage**:
```bash
node /home/runner/workspace/scripts/gemini-vision-inspector.js
```

**When to use**:
- "Inspect the What Is AI module"
- "Check if the UI looks correct"
- "Analyze the current state of the app"
- "Take a screenshot and tell me what you see"

#### 2. Console Log Analyzer
**Path**: `/home/runner/workspace/scripts/analyze-console-logs.js`

**What it does**:
- Takes console logs from browser DevTools
- Uses Gemini to analyze and diagnose issues
- Identifies missing logs, errors, and configuration problems

**Usage**:
```bash
node /home/runner/workspace/scripts/analyze-console-logs.js
```

#### 3. Screenshot + Vision Workflow

**Best practice for debugging**:

1. **Take a screenshot** with Browserless:
```bash
curl -X POST 'https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_API_KEY}' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://AILitStudents.replit.app/module/what-is-ai"}' \
  --output /home/runner/workspace/screenshots/debug.png
```

2. **Analyze with Gemini Vision**:
```bash
node /home/runner/workspace/scripts/gemini-vision-inspector.js
```

3. **Follow Gemini's recommendations** for next steps

### Advantages Over Traditional Automation

**Traditional Browser Automation (Puppeteer/Playwright)**:
- ❌ Requires complex scripting
- ❌ Breaks when UI changes
- ❌ Can't understand context
- ❌ Difficult to maintain

**Gemini Vision Approach**:
- ✅ Natural language analysis
- ✅ Understands context and intent
- ✅ Identifies bugs humans might miss
- ✅ Provides actionable recommendations
- ✅ Works with any screenshot
- ✅ No complex scripting needed

### Common Use Cases

#### Testing Gemini API Feedback
```bash
# 1. Take screenshot of reflection activity
curl -X POST 'https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_API_KEY}' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://AILitStudents.replit.app/module/what-is-ai"}' \
  --output screenshots/reflection-test.png

# 2. Ask Gemini to analyze
node scripts/gemini-vision-inspector.js

# 3. Follow its guidance to test feedback
```

#### Debugging UI Issues
```bash
# Just run the inspector - it handles everything
node scripts/gemini-vision-inspector.js
```

#### Analyzing Console Logs
```bash
# Copy console logs from DevTools and paste when prompted
node scripts/analyze-console-logs.js
```

### Integration with Development Workflow

**When Claude should use Gemini Vision**:

1. **User reports UI bug**: "The button isn't showing"
   → Take screenshot, analyze with Gemini Vision

2. **Testing new features**: "Does the reflection activity look right?"
   → Screenshot + analysis

3. **Debugging errors**: "Why isn't the feedback working?"
   → Analyze console logs + screenshot

4. **Visual regression**: "Did my changes break the UI?"
   → Before/after screenshots + comparison

5. **Accessibility review**: "Is this accessible?"
   → Gemini can identify contrast issues, missing labels, etc.

### API Keys Required

- `GEMINI_API_KEY`: For vision analysis (stored in `.secrets.local`)
- `BROWSERLESS_API_KEY`: For taking screenshots (stored in `.secrets.local`)

**NEVER commit these to git!**

### Screenshot Storage

All screenshots are saved to:
```
/home/runner/workspace/screenshots/
```

**IMPORTANT**: This directory is **IN .gitignore** - screenshots are never committed to git. They are temporary debugging artifacts that are regenerated as needed.

### ⚠️ CRITICAL: Vision Debugging URL Requirements

**MUST USE PRODUCTION URL FOR VISION TESTING**

When using Gemini Vision Inspector or taking screenshots for debugging, you **MUST use the production URL**, not localhost:

✅ **Correct**: `https://AILitStudents.replit.app`
❌ **Incorrect**: `http://localhost:5000` or `http://localhost:5001`

**Why This Matters**:

1. **School Device Restrictions**: The developer is working on a school device with restricted permissions that prevent installing:
   - Local tunneling tools (ngrok, localtunnel, etc.)
   - Network proxy software
   - Any tools that would expose localhost to the internet

2. **Browserless API Requirements**: The Browserless screenshot API requires publicly accessible URLs. It cannot reach `localhost` URLs because:
   - Browserless runs on external servers
   - It needs to fetch the URL over the public internet
   - Private/local addresses are not accessible to external services

3. **Replit Production is Always Available**: The production URL `https://AILitStudents.replit.app` is:
   - Automatically deployed and always accessible
   - Has automatic HTTPS
   - Publicly accessible for testing
   - Matches the actual user experience

**What This Means for Testing**:
- All Gemini Vision testing MUST use the production URL
- Changes must be deployed/visible on production before vision testing
- Cannot test local changes with vision until they're deployed
- For local testing, use browser DevTools and manual inspection instead

### Troubleshooting

**"BROWSERLESS_API_KEY not found"**:
```bash
# Load secrets
source /home/runner/workspace/.secrets.local

# Or export manually
export BROWSERLESS_API_KEY="your_key_here"
```

**"Gemini API key not found"**:
```bash
# Check if set
echo $GEMINI_API_KEY

# Load from secrets file
source /home/runner/workspace/.secrets.local
```

**Screenshot fails**:
- Ensure Browserless account is active
- Check API quota hasn't been exceeded
- Verify the URL is publicly accessible

### Files Created

| File | Purpose | Git Status |
|------|---------|------------|
| `/home/runner/workspace/scripts/gemini-vision-inspector.js` | Main vision analyzer | ✅ Commit |
| `/home/runner/workspace/scripts/analyze-console-logs.js` | Console log analyzer | ✅ Commit |
| `/home/runner/workspace/.secrets.local` | API keys storage | ❌ **NEVER COMMIT** |
| `/home/runner/workspace/screenshots/` | Screenshot storage | ❌ **NEVER COMMIT** (gitignored) |

---

## 🔄 Checkpoint Restart System

### Critical Context
This project runs in a **Replit shell environment**. When the user runs `kill 1` or the system restarts, **ALL context is lost** and the user must reauthenticate. This system ensures work continuity across restarts.

### ⚠️ MANDATORY Protocol Before Any System Restart

**BEFORE running ANY of these commands:**
- `kill 1`
- System restart commands
- Commands that might crash or freeze the system
- Process termination commands

**YOU MUST:**

1. **ASK the user for confirmation first**
   ```
   "I need to run [command] which may require a system restart.
   Should I create a checkpoint before proceeding?"
   ```

2. **Create a checkpoint file** at `/home/runner/workspace/.claude/CHECKPOINT.md`

3. **Wait for user approval** before executing the risky command

### Checkpoint File Format

Create `/home/runner/workspace/.claude/CHECKPOINT.md` with this structure:

```markdown
# 🔄 Checkpoint - [Date/Time]

## ⚠️ RESTART DETECTED
You (Claude) just experienced a system restart. The user lost their session and had to reauthenticate.
Read this entire checkpoint to restore context.

## 📋 Task Summary
[One sentence: What was being worked on]

## ✅ Completed Work
- [Specific file or feature completed]
- [Another completed item]
- [Test results, if any]

## 🔄 Current Status
**Last Activity**: [What you were doing right before restart]
**Files Modified**:
- /path/to/file1.tsx (description of changes)
- /path/to/file2.ts (description of changes)

**Outstanding Issues**:
- [Any errors encountered]
- [Known problems to fix]

## 🎯 Next Steps
1. [First thing to do after restart]
2. [Second step]
3. [Verification step]

## 💾 Important Context
**User Goal**: [Original user request]
**Approach**: [Strategy being used]
**Technical Decisions**: [Key choices made - libraries, patterns, etc.]

## 🔍 Critical Information
- **Branch**: [git branch name]
- **Dependencies installed**: Yes/No - if No, run `npm install`
- **Server status**: Running/Stopped - if Stopped, may need `npm run dev`
- **Environment variables**: [Any relevant .env notes]

## 📝 Code Snippets for Context
[Any important code patterns or snippets needed to continue]

## ⚡ Quick Resume Commands
```bash
# Commands to verify system state
git status
npm run dev --check # or whatever verify command
```

---
*Checkpoint created: [timestamp]*
*Estimated time to resume: [X minutes]*
```

### Detecting a Restart Has Occurred

**Signs you (Claude) should check for a checkpoint:**

1. User says "I just restarted" or "I had to kill 1"
2. User mentions "we lost connection" or "session ended"
3. User refers to previous work but you have no memory of it
4. User seems frustrated you don't remember context
5. Session starts abruptly without greeting
6. User immediately asks "where were we?" or "what's the status?"

**When you detect any of these signs:**

```bash
# IMMEDIATELY check for checkpoint
cat /home/runner/workspace/.claude/CHECKPOINT.md
```

Then:
1. **Acknowledge the restart**: "I see we experienced a restart. Let me check the checkpoint..."
2. **Read and summarize**: Briefly recap what you were working on
3. **Verify state**: Check files, git status, running processes
4. **Resume work**: Continue from the documented next steps

### Creating Checkpoints

**When to create checkpoints:**

1. **Before system restarts** (mandatory)
2. **After completing major milestones** (proactive)
3. **Before risky operations** (defensive)
4. **When switching between large tasks** (organizational)
5. **At user request** (always honor this)

**Quick Checkpoint Command:**
```bash
# Create checkpoint directory if needed
mkdir -p /home/runner/workspace/.claude

# Create/update checkpoint
cat > /home/runner/workspace/.claude/CHECKPOINT.md << 'EOF'
[checkpoint content here]
EOF
```

### Checkpoint Best Practices

#### ✅ DO:
- Include specific file paths and line numbers
- Document WHY decisions were made, not just WHAT
- List exact commands to verify system state
- Note any temporary workarounds or hacks
- Include relevant error messages
- Time-stamp the checkpoint
- Keep language clear and action-oriented

#### ❌ DON'T:
- Be vague ("working on components")
- Assume you'll remember context
- Skip technical details to save space
- Forget to mention dependencies or env vars
- Leave out the "why" behind decisions
- Create checkpoint after running risky command

### Recovery Protocol

**After reading a checkpoint, follow this sequence:**

1. **Announce checkpoint found**:
   ```
   "Checkpoint located. Last session: [brief summary]"
   ```

2. **Verify system state**:
   ```bash
   pwd                    # Confirm working directory
   git status            # Check uncommitted changes
   git log -1            # See last commit
   ls -la .claude/       # Check for other context files
   ```

3. **Check running processes**:
   ```bash
   ps aux | grep node    # Check if dev server running
   netstat -tulpn | grep 5000  # Check if port in use
   ```

4. **Review recent files**:
   ```bash
   ls -lt client/src/components/ | head -10  # Recent changes
   ```

5. **Propose resume plan**:
   ```
   "Based on the checkpoint:
   - Completed: [X, Y, Z]
   - Next: [A, B, C]
   - Should I proceed with [specific next step]?"
   ```

6. **Wait for user confirmation** before continuing

### Example Checkpoint Scenarios

#### Scenario 1: Mid-Feature Development
```markdown
## Task Summary
Adding "AI in My Day" activity to What Is AI module

## Completed Work
- Created AIInMyDayActivity.tsx component
- Added to CompactWhatIsAIModule.tsx at line 247
- Tested basic rendering - works

## Current Status
About to add form validation and submission handling

## Next Steps
1. Add Zod schema for form validation
2. Implement handleSubmit function
3. Test with dev mode navigation
4. Commit changes

## Critical Information
- Using same pattern as AIPatternSpotterActivity
- Form needs 3 text inputs (Morning, Afternoon, Evening)
- Submit should store in localStorage
```

#### Scenario 2: Debugging TypeScript Errors
```markdown
## Task Summary
Fixing TypeScript compilation errors across 4 modules

## Completed Work
- Fixed IntroToGenAIModule.tsx (import errors)
- Fixed LLMLimitationsModule.tsx (prop types)

## Current Status
2 files remaining with errors:
- UnderstandingLLMsModule.tsx: Line 156 - missing 'onComplete' prop
- PrivacyDataRightsModule.tsx: Line 89 - wrong type for activities array

## Next Steps
1. Fix UnderstandingLLMsModule.tsx line 156
2. Fix PrivacyDataRightsModule.tsx line 89
3. Run `npx tsc --noEmit` to verify
4. Test in browser

## Critical Information
All modules should have `onComplete?: () => void` in props interface
```

### User Reminders

**For Users**: When you restart the system:
1. Let Claude know: "I just restarted the system"
2. Ask Claude to check for checkpoint: "Check the checkpoint file"
3. Give Claude a moment to restore context
4. Confirm the resume plan before continuing

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (if errors exist)
npx tsc --noEmit
```

## 🔧 Environment Variables

Required in `.env`:
```
VITE_GOOGLE_API_KEY=your_firebase_api_key
```

Optional:
```
GEMINI_API_KEY=for_ai_feedback_features
AI_LITERACY_BOT_API_KEY=for_chatbot_features
VITE_DEV_MODE_SECRET_KEY=752465Ledezma
```

## 🤖 AI Assistant Guidelines

### When Working on This Project:

1. **Module Development**
   - Each module should be self-contained
   - Always pass `userName` prop from ModulePage
   - Include certificate generation at completion
   - Maintain consistent styling with Tailwind classes

2. **Component Creation**
   - Use existing UI components from `components/ui/`
   - Follow the shadcn/ui pattern for new components
   - Prefer composition over inheritance
   - Keep components focused and single-purpose

3. **State Management**
   - Use React Context for global state (UserContext)
   - Local state with useState for component-specific data
   - Persist important data in localStorage

4. **Performance Considerations**
   - Large modules (>2000 lines) should be split
   - Use React.lazy() for code splitting if needed
   - Implement loading states for async operations
   - Optimize video loading with proper error handling

5. **Error Handling**
   - Always handle Firebase connection errors
   - Provide fallback UI for failed video loads
   - Show user-friendly error messages
   - Log errors appropriately (not in production)

### Common Tasks & Solutions

#### Adding a New Module
1. Create component in `client/src/components/modules/`
2. Export as default function
3. Add to moduleMap in App.tsx
4. Add module metadata to HomePage.tsx

#### Fixing TypeScript Errors
- Check imports are using correct export syntax
- Ensure props interfaces are defined
- Verify module exports match import statements

#### Working with Certificates
- Use CertificateWrapper component
- Pass userName from UserContext
- Implement html2canvas for download functionality

#### Video Integration
- Use FirebaseVideoPlayer component
- Handle loading and error states
- Implement pause activities with InteractivePauseActivity

### Code Quality Standards

1. **No Console Logs in Production**
   - Remove all console.log statements
   - Use proper error handling instead

2. **TypeScript Best Practices**
   - Define interfaces for all props
   - Avoid using 'any' type
   - Use proper type exports/imports

3. **React Best Practices**
   - Use functional components with hooks
   - Implement proper cleanup in useEffect
   - Memoize expensive computations
   - Handle loading and error states

4. **Accessibility & Color Contrast (CRITICAL)**

   **THIS IS AN EDUCATIONAL PLATFORM FOR HIGH SCHOOL STUDENTS** - Some learners may have visual impairments, color blindness, or use the platform in various lighting conditions. Accessibility is not optional.

   ### WCAG 2.1 AA Standards (MANDATORY)
   - **Minimum contrast ratio**: 4.5:1 for normal text
   - **Enhanced contrast ratio**: 7:1 for optimal readability
   - **Large text (18pt+)**: Minimum 3:1 contrast ratio

   ### Critical Rule: Background + Text Color Pairing

   **⚠️ MANDATORY RULE**: When overriding a component's background color with Tailwind utility classes, you MUST ALWAYS specify the text color as well.

   #### ❌ NEVER DO THIS:
   ```tsx
   // BAD - Missing text color specification
   <Button className="bg-blue-600 hover:bg-blue-700">
     Try Again
   </Button>

   // This creates poor contrast! The button may have black text on blue background.
   ```

   #### ✅ ALWAYS DO THIS:
   ```tsx
   // GOOD - Background AND text color specified
   <Button className="bg-blue-600 hover:bg-blue-700 text-white">
     Try Again
   </Button>

   // Perfect! White text on blue background has excellent contrast.
   ```

   ### Tailwind Color Combinations (Safe Patterns)

   **Dark backgrounds** (require light text):
   ```tsx
   // Blues
   className="bg-blue-600 hover:bg-blue-700 text-white"
   className="bg-blue-500 hover:bg-blue-600 text-white"

   // Greens
   className="bg-green-600 hover:bg-green-700 text-white"
   className="bg-green-500 hover:bg-green-600 text-white"

   // Reds
   className="bg-red-600 hover:bg-red-700 text-white"
   className="bg-red-500 hover:bg-red-600 text-white"

   // Purples
   className="bg-purple-600 hover:bg-purple-700 text-white"
   className="bg-purple-500 hover:bg-purple-600 text-white"
   ```

   **Light backgrounds** (require dark text):
   ```tsx
   className="bg-gray-100 hover:bg-gray-200 text-gray-900"
   className="bg-blue-100 hover:bg-blue-200 text-blue-900"
   className="bg-green-100 hover:bg-green-200 text-green-900"
   ```

   ### When Using shadcn/ui Button Component

   The Button component has built-in variants that handle color contrast correctly:
   - `variant="default"` - Uses theme colors with proper contrast
   - `variant="destructive"` - Red with white text
   - `variant="outline"` - Border with proper text contrast
   - `variant="secondary"` - Gray with proper text contrast
   - `variant="ghost"` - Transparent with hover states

   **Prefer using these variants** instead of custom background colors:
   ```tsx
   // PREFERRED
   <Button variant="default">Continue</Button>
   <Button variant="destructive">Delete</Button>

   // ONLY if you need custom colors
   <Button className="bg-blue-600 hover:bg-blue-700 text-white">Custom</Button>
   ```

   ### Testing Color Contrast

   Before committing any UI changes:
   1. **Visual check**: Can you read the text easily?
   2. **Browser DevTools**: Use Chrome/Firefox accessibility inspector
   3. **Online tools**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   4. **Dark mode**: Test in both light and dark themes

   ### Common Accessibility Patterns

   - **ARIA labels**: Add to interactive elements
     ```tsx
     <button aria-label="Close dialog">×</button>
     ```

   - **Keyboard navigation**: All interactive elements must be keyboard-accessible
     ```tsx
     <div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
     ```

   - **Alt text**: Provide for all meaningful images
     ```tsx
     <img src="diagram.png" alt="Neural network architecture diagram" />
     ```

   - **Semantic HTML**: Use proper element types
     ```tsx
     <button> not <div onClick>
     <nav> for navigation
     <main> for main content
     <article> for module content
     ```

   ### Red Flags to Watch For

   If you see any of these patterns in a code review, **FIX IMMEDIATELY**:
   - `bg-` without corresponding `text-` class
   - Dark colors with dark text
   - Light colors with light text
   - Colored text on colored backgrounds without checking contrast
   - Relying on color alone to convey information

   ### Enforcement Checklist

   Before marking any UI task as complete:
   - [ ] All buttons with custom backgrounds have explicit text colors
   - [ ] Contrast ratios meet WCAG AA standards (4.5:1 minimum)
   - [ ] Dark mode variations tested and accessible
   - [ ] Interactive elements have focus indicators
   - [ ] Forms have proper labels and error messages
   - [ ] Color is not the only way to convey information

   **Remember**: Accessibility failures are not minor bugs - they exclude learners from using the platform. This is unacceptable for an educational tool.

## 🔄 Workflow Improvements with Claude-Gemini Bridge

### Automatic Task Delegation
The Claude-Gemini Bridge will automatically delegate to Gemini when:
- Analyzing multiple module files simultaneously
- Reviewing the entire codebase for patterns
- Performing security audits across all components
- Generating comprehensive documentation

### Enhanced Capabilities
With the bridge installed, you can:
```bash
# Analyze all modules for consistency
"Review all 8 modules and identify inconsistent patterns"

# Security audit
"Check all components for potential security issues"

# Performance analysis
"Identify performance bottlenecks across all module components"

# Code quality review
"Review all TypeScript files for type safety issues"
```

## 📝 Module-Specific Notes

### Large Modules Requiring Refactoring
1. **IntroductionToPromptingModule** (2672 lines) - Consider splitting into smaller components
2. **LLMLimitationsModule** (2078 lines) - Extract activities into separate files
3. **IntroToGenAIModule** (1730 lines) - Modularize video segments

### Known Issues to Address
- TypeScript compilation errors in GameModule.tsx
- Missing imports for non-existent modules
- Console warnings from replit-cartographer (can be ignored)
- Some components exceed 1000 lines (refactoring recommended)

## 🛠️ Testing Strategy

### Manual Testing Checklist
- [ ] Homepage loads without errors
- [ ] All module cards display correctly
- [ ] URL copying functionality works
- [ ] Name entry appears when accessing modules
- [ ] Certificates generate with user name
- [ ] Direct module URLs work
- [ ] Videos load and play correctly
- [ ] Interactive activities function properly

### Future Improvements
1. Add Jest and React Testing Library
2. Implement unit tests for critical components
3. Add integration tests for user flows
4. Set up E2E tests with Playwright/Cypress
5. Achieve minimum 70% code coverage

## 🚦 Quick Status Checks

```bash
# Check if LOCAL dev server is running (localhost only, not for vision testing)
curl -I http://localhost:5001/

# OR check production deployment
curl -I https://AILitStudents.replit.app/

# Check TypeScript errors
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l

# Find large files needing refactoring
find client/src -name "*.tsx" -exec wc -l {} \; | sort -rn | head -10

# Check for console.log statements
grep -r "console.log" client/src --include="*.tsx" --include="*.ts" | wc -l
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Wouter Routing](https://github.com/molefrog/wouter)

## 🤝 Collaboration Guidelines

When assisting with this project:
1. Maintain the existing code style and patterns
2. Test changes before committing
3. Keep commits focused and descriptive
4. Update this documentation when adding major features
5. Consider performance and accessibility in all changes

---

*This document is maintained to help AI assistants understand the project structure and provide better assistance. Update it when making significant architectural changes.*