# CLAUDE.md - AI Assistant Guidelines for AI Literacy Student Platform

## 🎯 Project Overview

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

4. **Accessibility**
   - Add ARIA labels to interactive elements
   - Ensure keyboard navigation works
   - Provide alt text for images
   - Use semantic HTML elements

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
# Check if app is running
curl -I http://localhost:5001/

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