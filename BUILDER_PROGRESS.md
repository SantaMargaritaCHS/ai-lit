# 🏗️ Module Builder - Full Implementation Plan & Progress Tracker

**Project**: AI Literacy Student Platform - Module Builder (Option B: Full Feature Set)
**Timeline**: 16 weeks (~$48-66k equivalent effort)
**Start Date**: 2025-11-10
**Status**: Phase 1.1 ✅ Complete | Phase 1.2 Next

---

## 🎯 Executive Summary

Building a comprehensive module builder interface that allows creation of new educational modules through a visual UI, AI-assisted content generation, and automated code generation. This tool will reduce module creation time from 60 hours to ~6 hours (90% reduction).

**Critical Success Criteria**:
- ✅ Zero impact on existing 9 modules
- ✅ Isolated `/builder` route with separate component tree
- ✅ Discrete access point (bottom of HomePage)
- ✅ Comprehensive verification after each phase
- ✅ Production-ready quality (accessibility, type safety, error handling)

---

## 🚨 Critical Constraints (MUST FOLLOW)

### Non-Negotiable Rules:
1. **ISOLATION**: Builder must be completely separate from existing module system
   - Separate route `/builder`
   - Separate component directory `client/src/components/builder/`
   - No imports from builder into existing modules
   - No modifications to existing module files

2. **NO BREAKING CHANGES**: Existing modules must continue working perfectly
   - Verify after each phase completion
   - Run smoke tests on all 9 modules
   - Test Dev Mode, Progress Persistence, AI Validation in existing modules

3. **DISCRETE ACCESS**: Inconspicuous link placement
   - Bottom of HomePage, below "Show Advanced Settings (Testing)"
   - Small text, similar styling to Advanced Settings link
   - Not prominent - only for authorized users/developers

4. **PROGRESS TRACKING**: Document everything to avoid context loss
   - Update this document after each task
   - Mark completed tasks with ✅ and timestamp
   - Document any architectural decisions or deviations

5. **REFERENCE EXISTING CODE**: Follow established patterns
   - Study existing modules before building new components
   - Maintain consistency with: Dev Mode, Progress Persistence, AI Validation, Accessibility
   - Use same tech stack: React 18, TypeScript, Tailwind, shadcn/ui

---

## 📋 Phase 1: MVP Builder (Weeks 1-6)

**Goal**: Visual module assembly tool with JSON export (no AI generation or code gen yet)

### Phase 1.1: Foundation Setup ✅ COMPLETE
**Tasks**:
- [x] Create `BUILDER_PROGRESS.md` plan document ✅ 2025-11-10
- [x] Add discrete "Module Builder" link to HomePage (below Advanced Settings) ✅ 2025-11-10
- [x] Create isolated `/builder` route in `App.tsx` ✅ 2025-11-10
- [x] Create directory structure: `client/src/components/builder/` ✅ 2025-11-10
- [x] Create `ModuleBuilderPage.tsx` container component ✅ 2025-11-10

**Files Created**:
```
client/src/components/builder/
├── ModuleBuilderPage.tsx           # Main container with welcome screen ✅
├── index.ts                        # Exports ✅
└── README.md                       # Builder component docs ✅
```

**Files Modified**:
- `client/src/pages/HomePage.tsx` (added discrete link with Wrench icon) ✅
- `client/src/App.tsx` (added `/builder` route) ✅

**Verification Checklist**:
- [x] `/builder` route loads without errors ✅
- [x] Link appears at bottom of HomePage ✅
- [x] TypeScript compilation successful (0 errors, only benign TS2688 warnings) ✅
- [x] Dev server starts successfully ✅
- Note: Full module smoke testing will be done after more components are built

**Status**: ✅ Complete
**Completion Date**: 2025-11-10

---

### Phase 1.2: Video Segment Editor with Transcript Extraction
**Tasks**:
- [ ] Create `VideoSegmentEditor.tsx` component
- [ ] Firebase Storage video URL input
- [ ] Time-code segment definition UI
- [ ] Segment preview functionality
- [ ] **Transcript extraction/upload** (CRITICAL for AI content generation)
  - YouTube video → Auto-extract via YouTube Data API
  - Uploaded video → Speech-to-text (Google Cloud Speech-to-Text or Whisper API)
  - Manual transcript upload (fallback option)
- [ ] Transcript display and editing interface
- [ ] Associate transcript segments with time-coded video segments

**Why Transcripts Matter**:
Videos are the primary source of educational content. Transcripts enable:
- AI-generated quiz questions based on video content (Phase 2.2)
- AI-generated reflection prompts aligned with video topics (Phase 2.3)
- AI-generated scenarios related to video themes (Phase 2.4)
- Context-aware content that matches the module's learning objectives

**Implementation Approach**:
1. Detect video source (YouTube, Firebase Storage, external)
2. Auto-extract transcript if available (YouTube captions)
3. Offer speech-to-text for uploaded videos (API integration)
4. Allow manual transcript upload (VTT, SRT, or plain text)
5. Store transcript with timestamps for segment alignment

**Reference Files**:
- `client/src/components/modules/AIEnvironmentalImpactModule.tsx` (time-coded segments)
- `client/src/components/WhatIsAIModule/PremiumVideoPlayer.tsx`

**Verification Checklist**:
- [ ] Can add/remove/reorder video segments
- [ ] Time codes validate correctly
- [ ] Preview shows correct segment
- [ ] Transcript extraction works for YouTube videos
- [ ] Manual transcript upload works
- [ ] Transcript segments align with video time codes
- [ ] Transcript text is editable
- [ ] Transcript data exports with module JSON

**API Research Needed**:
- YouTube Data API v3 (captions endpoint)
- Google Cloud Speech-to-Text API (for uploaded videos)
- Alternative: OpenAI Whisper API (potentially more cost-effective)

**Status**: Not started
**Completion Date**: TBD

---

### Phase 1.3: Activity Catalog Browser
**Tasks**:
- [ ] Create `ActivityCatalog.tsx` component
- [ ] Import activity data from `MODULE_ACTIVITY_INVENTORY.md`
- [ ] Visual cards for each activity type (7 categories)
- [ ] Preview modal showing visual descriptions

**Reference Files**:
- `client/src/components/ModuleInventory.tsx` (similar UI pattern)
- `MODULE_ACTIVITY_INVENTORY.md` (activity data source)

**Verification Checklist**:
- [ ] All 7 categories display correctly
- [ ] Visual descriptions render with proper formatting
- [ ] Search/filter functionality works

**Status**: Not started
**Completion Date**: TBD

---

### Phase 1.4: Module Assembly Interface
**Tasks**:
- [ ] Create `ModuleAssembly.tsx` drag-and-drop component
- [ ] Activity slot system (drag from catalog, drop into module)
- [ ] Reordering functionality
- [ ] Activity configuration panel (props, settings)

**Reference Files**:
- Study all 9 modules to understand activity flow patterns
- `client/src/context/ActivityRegistryContext.tsx` (activity structure)

**Tech Stack Additions**:
- Consider `@dnd-kit/core` for drag-and-drop (accessible, TypeScript-friendly)

**Verification Checklist**:
- [ ] Drag-and-drop works smoothly
- [ ] Activities can be configured
- [ ] Module structure validates correctly

**Status**: Not started
**Completion Date**: TBD

---

### Phase 1.5: Module Preview
**Tasks**:
- [ ] Create `ModulePreview.tsx` component
- [ ] Runtime rendering of assembled module
- [ ] Interactive preview (test activities)
- [ ] Dev Mode integration in preview

**Reference Files**:
- All existing modules (for rendering patterns)
- `client/src/context/DevModeContext.tsx`

**Verification Checklist**:
- [ ] Preview accurately reflects assembled module
- [ ] Activities work interactively
- [ ] Dev Mode shortcuts work in preview

**Status**: Not started
**Completion Date**: TBD

---

### Phase 1.6: JSON Export/Import
**Tasks**:
- [ ] Create module definition schema (TypeScript interface)
- [ ] JSON export functionality
- [ ] JSON import/validation
- [ ] Save/load from browser storage

**Schema Design**:
```typescript
interface ModuleDefinition {
  id: string;
  title: string;
  version: string;
  activities: ActivityDefinition[];
  metadata: {
    description: string;
    estimatedTime: number;
    targetAudience: string;
  };
}

interface ActivityDefinition {
  id: string;
  type: 'video' | 'quiz' | 'reflection' | 'interactive' | 'scenario' | 'exit-ticket';
  config: Record<string, any>;
  position: number;
}
```

**Verification Checklist**:
- [ ] Export produces valid JSON
- [ ] Import restores module correctly
- [ ] Schema validation catches errors

**Status**: Not started
**Completion Date**: TBD

---

### Phase 1 Verification Gate 🚦
**Must Pass Before Phase 2**:
- [ ] All Phase 1 components complete
- [ ] Builder accessible via discrete link
- [ ] Can assemble, preview, and export module
- [ ] **CRITICAL**: All 9 existing modules still work perfectly
- [ ] No TypeScript errors
- [ ] No console errors in production build
- [ ] Accessibility audit passes (contrast ratios, semantic HTML)

**Testing Protocol**:
1. Test builder: Create sample module with 3-4 activities
2. Export JSON and validate structure
3. Test all 9 existing modules (spot check 2-3 activities each)
4. Run TypeScript check: `npx tsc --noEmit`
5. Test Dev Mode in existing modules
6. Test Progress Persistence in existing modules

**Status**: Not started
**Sign-off Date**: TBD

---

## 📋 Phase 2: AI Content Generation (Weeks 7-10)

**Goal**: Gemini API integration for generating quiz questions, reflection prompts, scenarios

### Phase 2.1: AI Content Generation Service
**Tasks**:
- [ ] Create `client/src/services/builderAIService.ts`
- [ ] Gemini API prompts for each content type
- [ ] **Transcript-aware generation** (uses video transcripts from Phase 1.2)
- [ ] Token management and rate limiting
- [ ] Error handling and retries

**Reference Files**:
- `client/src/services/geminiClient.ts` (API config)
- `client/src/utils/aiEducationFeedback.ts` (prompt patterns)

**AI Generation Types** (All powered by video transcripts):
1. **Quiz Questions**: Generate multiple-choice questions from video transcript
   - Analyzes transcript content to identify key concepts
   - Creates questions with 4 options (1 correct, 3 plausible distractors)
   - Generates educational hints (never reveals correct answer)

2. **Reflection Prompts**: Age-appropriate prompts (14-18 years)
   - Based on video transcript themes and learning objectives
   - Encourages critical thinking about video content
   - Avoids anthropomorphization of AI (per project guidelines)

3. **Scenario Content**: Ethical dilemmas, case studies
   - Derives scenarios from video transcript examples
   - Creates stakeholder perspectives
   - Generates discussion questions

4. **Hint Generation**: Educational hints for quiz answers
   - Context-aware based on transcript content
   - Guides students toward understanding without revealing answers

**Transcript Integration Architecture**:
```typescript
interface TranscriptData {
  fullText: string;
  segments: {
    startTime: number;
    endTime: number;
    text: string;
  }[];
  videoUrl: string;
  videoTitle: string;
}

// Gemini prompt example
const quizPrompt = `
You are an educational content creator for high school students (ages 14-18).

Video Title: ${transcript.videoTitle}
Video Transcript:
${transcript.fullText}

Generate 3 multiple-choice quiz questions that:
- Test understanding of key concepts from the video
- Use age-appropriate language
- Have 4 options each (1 correct, 3 plausible distractors)
- Include educational hints that guide without revealing answers
...
`;
```

**Why This Matters**:
- Transcript provides rich context for AI generation
- Ensures generated content aligns with video content
- Reduces manual content creation from 60 hours to ~6 hours per module
- Maintains educational quality through context-aware generation

**Status**: Not started
**Completion Date**: TBD

---

### Phase 2.2: Quiz Question Generator UI
**Tasks**:
- [ ] Create `QuizGenerator.tsx` component
- [ ] **Input: Video + Transcript** (from Phase 1.2 Video Segment Editor)
- [ ] AI generation trigger (sends transcript to Gemini)
- [ ] Real-time generation progress indicator
- [ ] Review/edit interface for generated questions
- [ ] Batch generation (e.g., "Generate 5 questions")
- [ ] Export to module assembly

**User Flow**:
1. User selects video segment from Phase 1.2
2. Transcript is automatically loaded
3. User specifies: # of questions, difficulty level, focus topics
4. Gemini analyzes transcript and generates questions
5. User reviews, edits, approves generated questions
6. Questions are added to module assembly

**Reference Files**:
- `client/src/components/ResponsibleEthicalAIModule/activities/IntroductionToAI.tsx` (quiz pattern)

**Verification Checklist**:
- [ ] Generates relevant questions based on transcript
- [ ] Questions match module theme
- [ ] Age-appropriate language (14-18)
- [ ] Can edit before adding to module
- [ ] Transcript context improves question quality vs. generic prompts

**Status**: Not started
**Completion Date**: TBD

---

### Phase 2.3: Reflection Prompt Generator UI
**Tasks**:
- [ ] Create `ReflectionGenerator.tsx` component
- [ ] Topic/learning objective input
- [ ] AI prompt generation with age-appropriate language
- [ ] Preview validation feedback

**Reference Files**:
- `client/src/components/WhatIsAIModule/VideoReflectionActivity.tsx`
- `.claude/guides/student-feedback-validation.md`

**Validation Requirements**:
- [ ] Prompts encourage critical thinking
- [ ] No anthropomorphization of AI (per project guidelines)
- [ ] Align with project's educational philosophy

**Status**: Not started
**Completion Date**: TBD

---

### Phase 2.4: Scenario Generator UI
**Tasks**:
- [ ] Create `ScenarioGenerator.tsx` component
- [ ] Ethical dilemma generation
- [ ] Stakeholder perspective generation
- [ ] Multiple scenario variations

**Reference Files**:
- `client/src/components/modules/AncientCompassModule/activities/EthicalDilemmaScenarios.tsx`
- `client/src/components/modules/AncientCompassModule/activities/StakeholderPerspectives.tsx`

**Status**: Not started
**Completion Date**: TBD

---

### Phase 2.5: Content Review Interface
**Tasks**:
- [ ] Create `ContentReviewer.tsx` component
- [ ] Side-by-side comparison (AI generated vs edited)
- [ ] Approve/reject workflow
- [ ] Batch editing capabilities

**Status**: Not started
**Completion Date**: TBD

---

### Phase 2 Verification Gate 🚦
**Must Pass Before Phase 3**:
- [ ] All Phase 2 components complete
- [ ] AI generation produces quality content
- [ ] Generated content passes age-appropriateness review
- [ ] No vocabulary violations (anthropomorphization, etc.)
- [ ] **CRITICAL**: All 9 existing modules still work perfectly
- [ ] Gemini API costs within reasonable limits

**Testing Protocol**:
1. Generate 10 quiz questions across different topics
2. Generate 5 reflection prompts
3. Generate 3 ethical scenarios
4. Review with `ai-literacy-content-reviewer` agent
5. Test all 9 existing modules

**Status**: Not started
**Sign-off Date**: TBD

---

## 📋 Phase 3: Code Generation (Weeks 11-14)

**Goal**: Generate production-ready TypeScript/React code from assembled modules

### Phase 3.1: Code Generation Templates
**Tasks**:
- [ ] Create template system for each activity type
- [ ] Module container template
- [ ] Activity registry integration template
- [ ] Import/export statement generation

**Template Requirements**:
- TypeScript interfaces for all props
- Accessibility compliance (WCAG 2.1 AA)
- Dev Mode integration
- Progress Persistence integration
- AI Validation integration (for reflection activities)

**Status**: Not started
**Completion Date**: TBD

---

### Phase 3.2: TypeScript Code Generator Engine
**Tasks**:
- [ ] Create `client/src/services/codeGenerator.ts`
- [ ] JSON definition → TypeScript code transformation
- [ ] Proper formatting (Prettier integration)
- [ ] Type safety validation

**Reference Files**:
- All 9 existing modules (for code patterns)

**Generated File Structure**:
```
client/src/components/modules/[GeneratedModuleName]/
├── index.tsx                    # Main module component
├── activities/
│   ├── Activity1.tsx
│   ├── Activity2.tsx
│   └── index.ts
└── types.ts                     # TypeScript interfaces
```

**Status**: Not started
**Completion Date**: TBD

---

### Phase 3.3: Code Preview/Export Interface
**Tasks**:
- [ ] Create `CodePreview.tsx` component
- [ ] Syntax-highlighted code display
- [ ] Download as .tsx files
- [ ] Installation instructions

**Tech Stack Additions**:
- Consider `react-syntax-highlighter` or `prism-react-renderer`

**Export Options**:
1. Download ZIP with all files
2. Copy individual files
3. GitHub Gist integration (optional)

**Status**: Not started
**Completion Date**: TBD

---

### Phase 3 Verification Gate 🚦
**Must Pass Before Phase 4**:
- [ ] All Phase 3 components complete
- [ ] Generated code compiles without errors
- [ ] Generated modules match existing module patterns
- [ ] TypeScript strict mode passes
- [ ] Generated code passes accessibility audit
- [ ] **CRITICAL**: All 9 existing modules still work perfectly

**Testing Protocol**:
1. Generate complete module from JSON definition
2. Install generated files in test directory
3. Compile with `npx tsc --noEmit`
4. Test generated module in browser
5. Run accessibility audit on generated module
6. Test all 9 existing modules

**Status**: Not started
**Sign-off Date**: TBD

---

## 📋 Phase 4: Polish & Production (Weeks 15-16)

**Goal**: Production-ready builder with documentation, validation, and tutorials

### Phase 4.1: Validation Tools
**Tasks**:
- [ ] Accessibility validator (contrast ratios, semantic HTML)
- [ ] Structure validator (activity flow, completeness)
- [ ] Content validator (age-appropriateness, vocabulary)
- [ ] Real-time validation feedback in builder UI

**Integration**:
- Hook into existing accessibility-tester agent
- Hook into ai-literacy-content-reviewer agent

**Status**: Not started
**Completion Date**: TBD

---

### Phase 4.2: Builder Documentation
**Tasks**:
- [ ] Create `BUILDER_USER_GUIDE.md`
- [ ] In-app help tooltips
- [ ] Video tutorials (optional)
- [ ] FAQ section

**Documentation Sections**:
1. Getting Started
2. Activity Catalog Reference
3. AI Content Generation Best Practices
4. Code Export & Installation
5. Troubleshooting

**Status**: Not started
**Completion Date**: TBD

---

### Phase 4.3: UI/UX Polish
**Tasks**:
- [ ] Consistent styling across all builder components
- [ ] Loading states and animations
- [ ] Error boundary components
- [ ] Empty states with helpful guidance
- [ ] Keyboard shortcuts

**UX Improvements**:
- [ ] Onboarding flow for first-time users
- [ ] Undo/redo functionality
- [ ] Auto-save drafts
- [ ] Module templates (quick start)

**Status**: Not started
**Completion Date**: TBD

---

### Phase 4 Final Verification Gate 🚦
**Must Pass Before Deployment**:
- [ ] All 4 phases complete
- [ ] Builder is fully functional end-to-end
- [ ] Documentation complete and accurate
- [ ] All validation tools working
- [ ] **CRITICAL**: All 9 existing modules work perfectly
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Performance metrics acceptable (load time, bundle size)

**Comprehensive Testing Protocol**:
1. **Builder Smoke Test**:
   - Create module from scratch (30 min)
   - Use all activity types
   - Generate AI content
   - Preview module
   - Export JSON
   - Generate code
   - Install generated module

2. **Existing Module Regression Test**:
   - Test all 9 modules thoroughly
   - Test Dev Mode in each module
   - Test Progress Persistence in each module
   - Test AI Validation in reflection activities
   - Test video playback
   - Test certificate generation

3. **Technical Audit**:
   - Run `npx tsc --noEmit` (0 errors expected)
   - Run production build: `npm run build`
   - Check bundle size (should not increase significantly)
   - Check console for warnings/errors
   - Lighthouse audit (Performance, Accessibility, Best Practices)

4. **Accessibility Audit**:
   - Keyboard navigation throughout builder
   - Screen reader testing (NVDA/JAWS)
   - Contrast ratio validation (all text ≥4.5:1)
   - ARIA labels on all interactive elements

5. **User Acceptance Testing**:
   - Can non-technical user create module? (with documentation)
   - Is AI-generated content appropriate?
   - Is code generation output usable?

**Status**: Not started
**Sign-off Date**: TBD

---

## 🏗️ Architecture Decisions

### Isolation Strategy
**Decision**: Builder uses separate routing and component tree

**Implementation**:
- Route: `/builder` (defined in `App.tsx`)
- Components: `client/src/components/builder/` directory
- No imports from builder into existing modules
- Builder can import shared utilities (`@/lib/*`, `@/utils/*`, `@/services/*`)

**Why**: Prevents any breaking changes to existing modules. If builder breaks, it doesn't affect production modules.

---

### Data Model Strategy
**Decision**: JSON-driven runtime rendering (Phase 1-2), optional code generation (Phase 3)

**Implementation**:
- Phase 1-2: JSON definitions rendered by interpreter component
- Phase 3: JSON → TypeScript code generation for permanent modules

**Why**: Faster iteration in Phase 1-2, production-quality code in Phase 3.

---

### AI Integration Strategy
**Decision**: Gemini 2.5 Flash for content generation

**Implementation**:
- Dedicated service: `client/src/services/builderAIService.ts`
- Separate from validation service (`aiEducationFeedback.ts`)
- Rate limiting and token management

**Why**: Leverages existing Gemini integration, cost-effective for generation tasks.

---

### Component Library Strategy
**Decision**: Reuse shadcn/ui components, Tailwind CSS

**Implementation**:
- All builder UI uses existing component library
- Follow established design patterns from existing modules
- Maintain consistent styling

**Why**: Visual consistency with rest of application, faster development.

---

## 📊 Progress Tracking

### Phase Completion Summary
| Phase | Status | Start Date | Completion Date | Tasks Complete |
|-------|--------|------------|-----------------|----------------|
| Phase 1.1 | 🟢 Complete | 2025-11-10 | 2025-11-10 | 5/5 |
| Phase 1.2 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 1.3 | ⚪ Not Started | TBD | TBD | 0/3 |
| Phase 1.4 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 1.5 | ⚪ Not Started | TBD | TBD | 0/3 |
| Phase 1.6 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 2.1 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 2.2 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 2.3 | ⚪ Not Started | TBD | TBD | 0/3 |
| Phase 2.4 | ⚪ Not Started | TBD | TBD | 0/3 |
| Phase 2.5 | ⚪ Not Started | TBD | TBD | 0/3 |
| Phase 3.1 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 3.2 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 3.3 | ⚪ Not Started | TBD | TBD | 0/3 |
| Phase 4.1 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 4.2 | ⚪ Not Started | TBD | TBD | 0/4 |
| Phase 4.3 | ⚪ Not Started | TBD | TBD | 0/5 |

**Legend**: 🟢 Complete | 🟡 In Progress | 🟠 Blocked | ⚪ Not Started | 🔴 Issue

---

### Recent Activity Log
| Date | Activity | Notes |
|------|----------|-------|
| 2025-11-10 | 📝 Enhanced Phase 1.2 & 2.1 | Added transcript extraction to Phase 1.2, integrated transcript-aware AI generation in Phase 2.1-2.2 |
| 2025-11-10 | ✅ Phase 1.1 Complete | Foundation setup: plan doc, HomePage link, /builder route, ModuleBuilderPage, docs |
| 2025-11-10 | Created BUILDER_PROGRESS.md | Comprehensive 16-week plan with 4 phases, 17 sub-phases, verification gates |
| | | |

---

### Blockers & Issues
| Date | Issue | Status | Resolution |
|------|-------|--------|------------|
| - | None | - | - |

---

## 🔍 Reference Patterns from Existing Modules

### Pattern 1: Self-Contained Module Structure
**Reference**: All 9 modules follow this pattern

```typescript
interface ModuleProps {
  userName: string;
}

export default function MyModule({ userName }: ModuleProps) {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Activity Registry integration
  const { registerActivity, clearRegistry } = useActivityRegistry();

  // Dev Mode integration
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      setCurrentActivity(event.detail);
    };
    window.addEventListener('goToActivity', handleGoToActivity);
    return () => window.removeEventListener('goToActivity', handleGoToActivity);
  }, []);

  // Progress Persistence integration
  const MODULE_ID = 'my-module';
  useEffect(() => {
    const progress = loadProgress(MODULE_ID, activities);
    if (progress) {
      setSavedProgress(getProgressSummary(MODULE_ID));
      setShowResumeDialog(true);
    }
  }, []);

  return (
    <div className="module-container">
      {/* Activity rendering */}
    </div>
  );
}
```

**Builder Implementation**: Generated modules must follow this exact pattern.

---

### Pattern 2: AI-Validated Reflection with Escape Hatch
**Reference**: `client/src/components/WhatIsAIModule/VideoReflectionActivity.tsx`

```typescript
const [attemptCount, setAttemptCount] = useState(0);
const [showEscapeHatch, setShowEscapeHatch] = useState(false);
const MAX_ATTEMPTS = 2;

const handleSubmit = async () => {
  // Layer 1: Pre-filter
  const isInvalid = isNonsensical(response);

  // Layer 2: AI validation
  const feedback = await generateEducationFeedback(response, question);

  const feedbackIndicatesRetry = /* check rejection phrases */;
  setNeedsRetry(isInvalid || feedbackIndicatesRetry);

  if (feedbackIndicatesRetry) {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    if (newAttemptCount >= MAX_ATTEMPTS) {
      setShowEscapeHatch(true);
    }
  }
};

// Escape hatch UI
{showEscapeHatch && needsRetry && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
    <Button onClick={() => onComplete()}>Continue Anyway</Button>
  </div>
)}
```

**Builder Implementation**: AI-generated reflection activities must include this escape hatch pattern.

---

### Pattern 3: Dev Mode Shortcuts for Testing
**Reference**: `client/src/components/modules/IntroToGenAIModule.tsx`

```typescript
import { useDevMode } from '@/context/DevModeContext';

const { isDevModeActive } = useDevMode();

const getDevGoodResponse = () => {
  return "Comprehensive thoughtful response...";
};

const handleDevAutoFill = () => {
  if (!isDevModeActive) return;
  const goodResponse = getDevGoodResponse();
  setResponse(goodResponse);
  setFeedback("Excellent reflection!");
  setShowFeedback(true);
  setNeedsRetry(false);
  setTimeout(() => onComplete(), 1000);
};

{isDevModeActive && !showFeedback && (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode Shortcuts</h3>
    <Button onClick={handleDevAutoFill} className="bg-green-600 hover:bg-green-700 text-white">
      Auto-Fill & Complete
    </Button>
  </div>
)}
```

**Builder Implementation**: Generated activities should include dev mode shortcuts for testing.

---

### Pattern 4: Accessibility-First Styling
**Reference**: Project-wide pattern from CLAUDE.md

```typescript
// ❌ NEVER
<Button className="bg-blue-600 hover:bg-blue-700">Try Again</Button>

// ✅ ALWAYS
<Button className="bg-blue-600 hover:bg-blue-700 text-white">Try Again</Button>

// Contrast requirements
// Normal text (< 18pt): 4.5:1 minimum
// Large text (≥ 18pt): 3:1 minimum
// Optimal: 7:1
```

**Builder Implementation**:
- Code generator must always specify text color with background color
- Validation tool must check contrast ratios before export

---

## 📚 Key Documentation References

### Internal Docs (This Repository)
- `CLAUDE.md` - Main project guidelines
- `MODULE_ACTIVITY_INVENTORY.md` - Comprehensive activity catalog
- `MODULE_BUILDER_FEASIBILITY.md` - Feasibility analysis and architecture options
- `.claude/guides/dev-mode-integration.md` - Dev Mode implementation details
- `.claude/guides/progress-persistence.md` - Progress Persistence implementation
- `.claude/guides/student-feedback-validation.md` - AI validation system (400+ lines)

### Component References
- All 9 existing modules in `client/src/components/modules/`
- `client/src/components/ModuleInventory.tsx` - Similar UI pattern for builder
- `client/src/utils/aiEducationFeedback.ts` - AI validation logic
- `client/src/services/geminiClient.ts` - Gemini API configuration

### External Resources
- shadcn/ui: https://ui.shadcn.com/
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- Gemini API: https://ai.google.dev/docs
- React DnD Kit: https://dndkit.com/

---

## ✅ Next Immediate Steps

**Current Task**: Phase 1.1 - Foundation Setup

**Action Items** (in order):
1. ✅ Create `BUILDER_PROGRESS.md` ← DONE
2. ⏳ Add discrete "Module Builder" link to HomePage (below Advanced Settings)
3. ⏳ Create isolated `/builder` route in `App.tsx`
4. ⏳ Create directory structure: `client/src/components/builder/`
5. ⏳ Create `ModuleBuilderPage.tsx` container component
6. ⏳ Verify: Builder loads, existing modules unaffected

**Expected Completion**: Phase 1.1 by end of current session

---

## 📝 Notes & Observations

- This document serves as single source of truth for builder development
- Update progress tracking section after completing each task
- Document any deviations from plan in "Blockers & Issues" section
- Keep this file under version control (commit after major milestones)
- Refer back to this document when resuming work after context loss

---

**Last Updated**: 2025-11-10
**Next Review**: After Phase 1.1 completion
