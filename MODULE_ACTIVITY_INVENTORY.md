# Module Activity Inventory

**Purpose**: Reference guide for reusable activity components across all AI Literacy modules.

**Last Updated**: 2025-11-10

---

## 📋 Table of Contents

1. [Activity Types Overview](#activity-types-overview)
2. [Video Activities](#video-activities)
3. [Quiz & Comprehension Activities](#quiz--comprehension-activities)
4. [Reflection Activities](#reflection-activities)
5. [Interactive Simulations](#interactive-simulations)
6. [Scenario-Based Activities](#scenario-based-activities)
7. [Gamified Activities](#gamified-activities)
8. [Exit Tickets](#exit-tickets)
9. [Certificates](#certificates)
10. [Module Patterns](#module-patterns)
11. [Quick Reference Table](#quick-reference-table)

---

## Activity Types Overview

### Core Categories

1. **Video Activities** - Segmented video playback with mandatory viewing
2. **Quizzes** - Multiple choice, matching, true/false comprehension checks
3. **Reflections** - AI-validated open-ended responses with 2-attempt escape hatch
4. **Interactive Simulations** - Hands-on activities (calculators, games, builders)
5. **Scenario Activities** - Ethical dilemmas, stakeholder analysis, case studies
6. **Gamified Activities** - Score-based challenges and competitive elements
7. **Exit Tickets** - Module-ending reflections with AI validation
8. **Certificates** - Completion certificates with student name

---

## Video Activities

### PremiumVideoPlayer Component

**Location**: `client/src/components/PremiumVideoPlayer.tsx`

**Purpose**: Segmented video playback with mandatory viewing, pause-and-continue pattern.

**Props**:
```typescript
interface PremiumVideoPlayerProps {
  videoUrl: string;                    // Firebase Storage URL (relative or full HTTPS)
  segments: VideoSegment[];            // Array of time-coded segments
  videoId: string;                     // Unique identifier
  onSegmentComplete?: (segmentId: string) => void;
  hideSegmentNavigator?: boolean;      // Hide segment nav UI (default: false)
  allowSeeking?: boolean;              // Allow scrubbing (respects dev mode)
  enableSubtitles?: boolean;           // Enable closed captions
}

interface VideoSegment {
  id: string;
  title: string;
  start: number;        // Start time in seconds
  end: number;          // End time in seconds
  source?: string;
  description?: string;
  mandatory?: boolean;  // Prevents skipping
}
```

**Usage Pattern**:
```tsx
<PremiumVideoPlayer
  videoUrl="Videos/Student Videos/Topic/video.mp4"  // Relative path
  segments={[{
    id: 'segment-1',
    title: 'Introduction',
    start: 0,
    end: 45,
    mandatory: true
  }]}
  videoId="what-is-ai-intro"
  onSegmentComplete={(id) => advanceToNextPhase()}
  allowSeeking={isDevModeActive}
  enableSubtitles={true}
/>
```

**Used In**:
- ✅ What Is AI Module (3 segments)
- ✅ Intro to Gen AI Module (5 segments)
- ✅ Understanding LLMs Module (7 segments)
- ✅ LLM Limitations Module (7 segments)
- ✅ Introduction to Prompting Module (4 segments)
- ✅ AI Environmental Impact Module (12 segments across 4 files)
- ✅ Ancient Compass Module (5 segments)

**Key Features**:
- Auto-pauses at segment end points
- Prevents seeking unless dev mode active
- Tracks completion per segment
- Supports time-coded chapter markers
- Works with both relative paths (`Videos/...`) and full HTTPS URLs

---

## Quiz & Comprehension Activities

### 1. Multiple Choice Quiz (Single Answer)

**Pattern**: Radio button selection with immediate feedback, hints for wrong answers.

**Structure**:
```typescript
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;  // Index of correct option
  explanation: string;    // Shown when correct
  hint?: string;         // Shown when incorrect
}
```

**Implementation Pattern**:
```tsx
const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
const [showFeedback, setShowFeedback] = useState<boolean[]>([false, false, false]);

// Never reveal correct answer - only show hints
{showFeedback[qIndex] && answers[qIndex] !== q.correctAnswer && (
  <div className="p-4 rounded-lg bg-yellow-100 border border-yellow-300">
    <p className="text-sm text-gray-900">
      <strong>Not quite!</strong> {q.hint}
    </p>
  </div>
)}

// Show explanation only when correct
{showFeedback[qIndex] && answers[qIndex] === q.correctAnswer && (
  <div className="p-4 rounded-lg bg-green-100 border border-green-300">
    <p className="text-sm text-gray-900">{q.explanation}</p>
  </div>
)}
```

**Used In**:
- ✅ Ancient Compass Module - `quiz-1-understanding-parallel` (3 questions)
- ✅ Ancient Compass Module - `comprehension-check-2-rerum-novarum` (3 questions)
- ✅ Intro to Gen AI Module - `comprehension-check-1` (1 question)
- ✅ Understanding LLMs Module - `knowledge-check-quiz` (multiple)

**Key Features**:
- ❌ Never reveals correct answer directly
- ✅ Provides contextual hints for wrong answers
- ✅ Shows explanations only when student answers correctly
- ✅ "Try Again" button resets quiz completely
- ✅ Can be used inline in module or as separate component

**File References**:
- `AncientCompassModule.tsx` lines 1000-1165 (Quiz 1)
- `AncientCompassModule.tsx` lines 832-997 (Comprehension Check 2)

---

### 2. Matching Activity

**Pattern**: Match items from left column to options on right (e.g., principle matching).

**Structure**:
```typescript
interface MatchingItem {
  example: string;
  correctPrinciple: string;
  id: number;
  hint: string;
}

const [matching, setMatching] = useState<Record<number, string>>({});
```

**Implementation**:
```tsx
<div className="flex gap-2 flex-wrap">
  {principles.map((principle) => (
    <label className={`px-4 py-2 rounded-lg border-2 ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    }`}>
      <input
        type="radio"
        name={`matching-${item.id}`}
        checked={matching[item.id] === principle}
        onChange={() => handleSelect(item.id, principle)}
        className="sr-only"
      />
      {principle}
    </label>
  ))}
</div>
```

**Used In**:
- ✅ Ancient Compass Module - `quiz-2-three-principles` (3 matching items + true/false)

**Key Features**:
- Radio-style selection with visual feedback
- Hints for incorrect matches (never reveals answer)
- Combined with other question types (e.g., true/false)

**File Reference**: `AncientCompassModule.tsx` lines 582-829

---

### 3. True/False Questions

**Pattern**: Binary choice with explanation for correct answer, hint for incorrect.

**Used In**:
- ✅ Ancient Compass Module - Combined with matching in `quiz-2-three-principles`

---

## Reflection Activities

### AI-Validated Reflection with 2-Attempt Escape Hatch

**Location**: Uses `client/src/utils/aiEducationFeedback.ts`

**Purpose**: Open-ended student responses validated by Gemini AI with educational feedback.

**Core Functions**:
```typescript
// Pre-filter check (Layer 1)
isNonsensical(response: string): boolean

// AI validation (Layer 2)
generateEducationFeedback(
  response: string,
  question: string,
  context?: string
): Promise<string>
```

**Implementation Pattern**:
```tsx
const [response, setResponse] = useState('');
const [feedback, setFeedback] = useState('');
const [showFeedback, setShowFeedback] = useState(false);
const [needsRetry, setNeedsRetry] = useState(false);
const [attemptCount, setAttemptCount] = useState(0);
const [showEscapeHatch, setShowEscapeHatch] = useState(false);
const MAX_ATTEMPTS = 2;

const handleSubmit = async () => {
  // Layer 1: Pre-filter
  const isInvalid = isNonsensical(response);

  // Layer 2: AI evaluation
  const feedback = await generateEducationFeedback(response, question);

  // Check rejection phrases
  const feedbackIndicatesRetry =
    feedback.toLowerCase().includes('does not address') ||
    feedback.toLowerCase().includes('please re-read') ||
    // ... other rejection phrases

  setNeedsRetry(isInvalid || feedbackIndicatesRetry);

  if (isInvalid || feedbackIndicatesRetry) {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    if (newAttemptCount >= MAX_ATTEMPTS) {
      setShowEscapeHatch(true);
    }
  }
};

const handleTryAgain = () => {
  setResponse('');
  setFeedback('');
  setShowFeedback(false);
  setNeedsRetry(false);
  // ⚠️ DON'T RESET: attemptCount or showEscapeHatch
};
```

**Escape Hatch UI**:
```tsx
{showEscapeHatch && needsRetry && (
  <div className="bg-orange-100 p-6 rounded-lg border-2 border-orange-300">
    <AlertTriangle className="w-6 h-6 text-orange-600" />
    <h4>Multiple Attempts Detected</h4>
    <p>You've tried {attemptCount} times. You can either:</p>
    <div className="flex gap-3">
      <Button onClick={handleTryAgain} variant="outline">
        Try One More Time
      </Button>
      <Button onClick={onComplete} className="bg-orange-600">
        Continue Anyway
      </Button>
    </div>
    <p className="text-xs italic">
      ⚠️ Continuing without a complete response may be flagged for instructor review.
    </p>
  </div>
)}
```

**Used In**:
- ✅ Understanding LLMs Module - `ExitTicketLLM.tsx`
- ✅ What Is AI Module - `VideoReflectionActivity.tsx`
- ✅ Intro to Gen AI Module - Exit ticket section
- ✅ AI Environmental Impact Module - Reflection + Exit Ticket
- ✅ Ancient Compass Module - Exit ticket (3 prompt options)

**Key Features**:
- Two-layer validation (pre-filter + AI)
- 2-attempt limit before escape hatch appears
- Attempt count persists across retries
- Minimum word/character requirements
- Rejection trigger phrases for AI feedback
- Educational, not punitive feedback

**Critical Anti-Bug Pattern**:
```tsx
// ❌ WRONG: Hides submit button forever
{!showEscapeHatch && <Button onClick={handleSubmit}>Submit</Button>}

// ✅ CORRECT: Only hides when escape hatch is actively showing
{!(showEscapeHatch && needsRetry) && <Button onClick={handleSubmit}>Submit</Button>}
```

**File References**:
- Guide: `.claude/guides/student-feedback-validation.md`
- Core logic: `client/src/utils/aiEducationFeedback.ts`
- Examples: `UnderstandingLLMModule/activities/ExitTicketLLM.tsx`

---

## Interactive Simulations

### 1. Environmental Calculator

**Location**: `client/src/components/EnvironmentalModule/EnvironmentalCalculator.tsx`

**Purpose**: Calculate carbon footprint of AI queries with visual feedback.

**Props**:
```typescript
interface EnvironmentalCalculatorProps {
  onComplete: () => void;
}
```

**Features**:
- Slider inputs for daily queries across different AI models
- Real-time carbon calculation (grams CO2e)
- Visual comparison to everyday items (miles driven, trees planted)
- Educational stats about AI energy consumption

**Used In**:
- ✅ AI Environmental Impact Module

---

### 2. Environmental Impact Matrix

**Location**: `client/src/components/EnvironmentalModule/EnvironmentalImpactMatrix.tsx`

**Purpose**: Interactive grid categorizing AI applications by environmental impact and social benefit.

**Features**:
- Drag-and-drop items into 2x2 matrix
- Categories: High/Low Impact × High/Low Benefit
- Example items: data centers, medical diagnosis AI, streaming recommendations
- Visual feedback on placement

**Used In**:
- ✅ AI Environmental Impact Module

---

### 3. Solutions Sorter

**Location**: `client/src/components/EnvironmentalModule/SimplifiedSolutionsSorter.tsx`

**Purpose**: Sort climate solutions into "Personal Actions" vs "Industry/Policy Changes."

**Features**:
- Card-based sorting interface
- Two categories with drop zones
- Items like: renewable energy, choosing efficient models, regulation
- Completion validation

**Used In**:
- ✅ AI Environmental Impact Module

---

### 4. Tokenization Demo

**Location**: `client/src/components/UnderstandingLLMModule/activities/TokenizationDemo.tsx`

**Purpose**: Visual demonstration of how text is broken into tokens.

**Features**:
- Live text input → token breakdown
- Color-coded tokens
- Token count display
- Examples showing different tokenization patterns

**Used In**:
- ✅ Understanding LLMs Module

---

### 5. Beat the Predictor Game

**Location**: `client/src/components/UnderstandingLLMModule/activities/BeatThePredictorGame.tsx`

**Purpose**: Interactive game where students try to predict next word vs AI.

**Features**:
- Sentence starter prompts
- Student prediction vs AI prediction comparison
- Score tracking
- Explanation of why AI chose its prediction

**Used In**:
- ✅ Understanding LLMs Module

---

### 6. Word Prediction Game

**Location**: `client/src/components/UnderstandingLLMModule/activities/WordPredictionGame.tsx`

**Purpose**: Simple game demonstrating basic prediction mechanics.

**Used In**:
- ✅ Understanding LLMs Module

---

### 7. Policy Comparison Table

**Location**: `client/src/components/PrivacyModule/PolicyComparisonTable.tsx`

**Purpose**: Compare privacy policies across different AI platforms.

**Features**:
- Side-by-side comparison of key privacy aspects
- Platforms: ChatGPT, Gemini, Claude, others
- Categories: data collection, retention, sharing, user rights

**Used In**:
- ✅ Privacy & Data Rights Module

---

### 8. Tools Comparison

**Location**: `client/src/components/PrivacyModule/ToolsComparison.tsx`

**Purpose**: Compare privacy features of different AI tools.

**Used In**:
- ✅ Privacy & Data Rights Module

---

### 9. TC Timer Challenge

**Location**: `client/src/components/PrivacyModule/TCTimerChallenge.tsx`

**Purpose**: Timed challenge to read Terms & Conditions, demonstrating impracticality.

**Features**:
- Real T&C text from major platforms
- Live timer tracking reading speed
- Statistics about average T&C length
- "Ain't nobody got time for that" revelation

**Used In**:
- ✅ Privacy & Data Rights Module

---

## Scenario-Based Activities

### 1. Ethical Dilemma Scenarios

**Location**: `client/src/components/AncientCompassModule/EthicalDilemmaScenarios.tsx`

**Purpose**: Present realistic AI ethics scenarios for students to analyze and respond.

**Props**:
```typescript
interface EthicalDilemmaProps {
  onComplete: () => void;
}
```

**Structure**:
```typescript
interface Scenario {
  id: string;
  title: string;
  situation: string;
  question: string;
  principles: string[];  // Relevant Catholic Social Teaching principles
}
```

**Features**:
- Multiple scenarios (e.g., facial recognition, AI hiring, content moderation)
- Open-ended response with AI validation
- 2-attempt escape hatch pattern
- Dev mode shortcuts (good/generic/complaint/gibberish responses)

**Used In**:
- ✅ Ancient Compass Module

**File Reference**: `client/src/components/AncientCompassModule/EthicalDilemmaScenarios.tsx`

---

### 2. Stakeholder Perspectives

**Location**: `client/src/components/AncientCompassModule/StakeholderPerspectives.tsx`

**Purpose**: Analyze AI issues from multiple stakeholder viewpoints.

**Structure**:
- Present an AI scenario (e.g., school surveillance, gig economy algorithms)
- 2 reflection questions per scenario
- Consider perspectives: students, workers, companies, regulators

**Features**:
- AI-validated responses for each question
- 2-attempt escape hatch per question
- Dev mode testing shortcuts
- Encourages systems thinking

**Used In**:
- ✅ Ancient Compass Module

**File Reference**: `client/src/components/AncientCompassModule/StakeholderPerspectives.tsx`

---

### 3. Revolution Comparison Chart

**Location**: `client/src/components/AncientCompassModule/RevolutionComparisonChart.tsx`

**Purpose**: Compare Industrial Revolution to AI Revolution.

**Structure**:
- Fill-in chart comparing aspects: workers affected, ethical concerns, pace of change
- Reflection question at end (AI-validated)
- 2-attempt escape hatch

**Used In**:
- ✅ Ancient Compass Module

**File Reference**: `client/src/components/AncientCompassModule/RevolutionComparisonChart.tsx`

---

### 4. Personal AI Audit

**Location**: `client/src/components/AncientCompassModule/PersonalAIAudit.tsx`

**Purpose**: Students audit their own AI tool usage through ethical lens.

**Structure**:
- List AI tools you use
- Evaluate each against ethical principles
- Commit to one change

**Used In**:
- ✅ Ancient Compass Module

---

## Gamified Activities

### 1. Hallucination Detective Game

**Location**: Inline in `LLMLimitationsModule.tsx`

**Purpose**: Identify whether AI responses contain hallucinations.

**Features**:
- Multiple rounds of questions
- AI generates responses (some true, some false)
- Student guesses if hallucination
- Score tracking
- Reveal explanation after guess

**Used In**:
- ✅ LLM Limitations Module

---

### 2. Guess the Data Size

**Location**: `client/src/components/UnderstandingLLMModule/activities/GuessDataSize.tsx`

**Purpose**: Game where students guess scale of AI training data.

**Features**:
- Multiple choice about data volumes
- Comparisons to books, libraries, internet
- Educational reveals

**Used In**:
- ✅ Understanding LLMs Module

---

### 3. Meet the LLMs

**Location**: `client/src/components/UnderstandingLLMModule/activities/MeetTheLLMs.tsx`

**Purpose**: Interactive cards introducing different LLMs (GPT, Claude, Gemini, etc.).

**Features**:
- Flip cards with LLM info
- Specs: parameters, release date, strengths
- Visual comparison

**Used In**:
- ✅ Understanding LLMs Module

---

## Exit Tickets

### Standard Exit Ticket Pattern

**Purpose**: Module-ending reflection with AI validation and 2-attempt escape hatch.

**Implementation Pattern**:
```tsx
const EXIT_PROMPTS = [
  {
    title: 'Personal Application',
    prompt: "Reflect on how you'll apply what you learned..."
  },
  {
    title: 'Critical Analysis',
    prompt: "Analyze a challenge related to the module topic..."
  },
  {
    title: 'Future Responsibility',
    prompt: "Consider your role in shaping AI's future..."
  }
];

// Multiple prompt options (student chooses one)
const [selectedPrompt, setSelectedPrompt] = useState(0);
const [response, setResponse] = useState('');
// ... AI validation logic (same as reflection pattern)
```

**Features**:
- 2-3 prompt options for student choice
- Minimum word count (typically 50-150 words)
- AI validation with educational feedback
- 2-attempt escape hatch
- Dev mode shortcuts for testing

**Used In**:
- ✅ All modules (implementation varies)

**File References**:
- `AncientCompassModule.tsx` lines 1168-1418 (3-prompt exit ticket)
- `UnderstandingLLMModule/activities/ExitTicketLLM.tsx`
- `IntroToGenAIModule.tsx` (inline exit ticket)

---

## Certificates

### Standard Certificate Component

**Location**: `client/src/components/Certificate.tsx`

**Props**:
```typescript
interface CertificateProps {
  userName: string;
  courseName: string;
  completionDate: string;
  score?: number;
  instructor?: string;
  onDownload?: () => void;  // Triggered when download button clicked
}
```

**Usage**:
```tsx
<Certificate
  userName={userName}
  courseName="AI Ethics: An Ancient Compass"
  completionDate={new Date().toLocaleDateString()}
  score={100}
  instructor="AI Literacy Platform"
  onDownload={() => {
    clearProgress(MODULE_ID);  // Clear progress on download
    if (onComplete) onComplete();
  }}
/>
```

**Features**:
- Personalized with student name
- Module/course name
- Completion date
- Optional score
- Download as image
- Triggers progress clearing

**Used In**:
- ✅ All 9 modules (final phase)

---

## Module Patterns

### Universal Developer Mode Integration

**All modules should implement**:

1. **Activation**: `Ctrl+Alt+D` → password: `752465Ledezma`
2. **Context Integration**:
   ```tsx
   import { useDevMode } from '@/context/DevModeContext';
   import { useActivityRegistry } from '@/context/ActivityRegistryContext';

   const { isDevModeActive } = useDevMode();
   const { registerActivity, clearRegistry } = useActivityRegistry();
   ```

3. **Activity Registration** (once on mount):
   ```tsx
   useEffect(() => {
     clearRegistry();
     activities.forEach((activity, index) => {
       registerActivity({
         id: activity.id,
         type: activity.type,  // 'video' | 'interactive' | 'reflection' | 'certificate'
         name: activity.title,
         completed: index < currentActivityIndex
       });
     });
   }, []);  // Empty deps - only register once
   ```

4. **Navigation Listener**:
   ```tsx
   useEffect(() => {
     const handleGoToActivity = (event: CustomEvent) => {
       const activityIndex = event.detail;
       setCurrentActivityIndex(activityIndex);
     };
     window.addEventListener('goToActivity', handleGoToActivity);
     return () => window.removeEventListener('goToActivity', handleGoToActivity);
   }, []);
   ```

5. **Dev Shortcuts for Reflections**:
   ```tsx
   {isDevModeActive && !showFeedback && (
     <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
       <h3 className="text-sm font-semibold text-red-800 mb-2">
         Developer Mode: Reflection Shortcuts
       </h3>
       <div className="flex flex-wrap gap-2">
         <Button onClick={handleAutoFill} className="bg-green-600 text-white">
           <Zap className="w-3 h-3 mr-1" />
           Auto-Fill & Complete
         </Button>
         <Button onClick={() => setResponse(getDevGoodResponse())}
                 className="bg-blue-600 text-white">
           Fill Good Response
         </Button>
         <Button onClick={() => setResponse(getDevGenericResponse())}
                 className="bg-orange-600 text-white">
           Fill Generic Response
         </Button>
         <Button onClick={() => setResponse(getDevComplaintResponse())}
                 className="bg-yellow-600 text-white">
           Fill Complaint
         </Button>
         <Button onClick={() => setResponse(getDevGibberishResponse())}
                 className="bg-red-600 text-white">
           Fill Gibberish
         </Button>
       </div>
     </div>
   )}
   ```

**File Reference**: `.claude/guides/dev-mode-integration.md`

---

### Progress Persistence Pattern

**All modules should implement**:

```tsx
import { saveProgress, loadProgress, clearProgress, getProgressSummary } from '@/lib/progressPersistence';
import ResumeProgressDialog from '../WhatIsAIModule/ResumeProgressDialog';

const MODULE_ID = 'your-module-id';  // Unique per module

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

**Implemented In**:
- ✅ What Is AI
- ✅ Intro to Gen AI
- ✅ Ancient Compass
- ✅ AI Environmental Impact
- ✅ Introduction to Prompting
- ⏳ 3 remaining modules need implementation

**File Reference**: `.claude/guides/progress-persistence.md`

---

## Quick Reference Table

| Activity Type | Component Location | Props | Used In Modules | Reusability |
|--------------|-------------------|-------|----------------|-------------|
| **Video Segments** | `PremiumVideoPlayer.tsx` | videoUrl, segments, videoId, onSegmentComplete | All 9 modules | ⭐⭐⭐⭐⭐ High |
| **Multiple Choice Quiz** | Inline pattern | questions array | Ancient Compass, Intro to Gen AI, Understanding LLMs | ⭐⭐⭐⭐⭐ High |
| **Matching Activity** | Inline pattern | matching items | Ancient Compass | ⭐⭐⭐⭐ Medium |
| **AI-Validated Reflection** | Uses `aiEducationFeedback.ts` | question, minWords | 5 modules | ⭐⭐⭐⭐⭐ High |
| **Exit Ticket** | Inline pattern | prompts array | All 9 modules | ⭐⭐⭐⭐⭐ High |
| **Certificate** | `Certificate.tsx` | userName, courseName, date | All 9 modules | ⭐⭐⭐⭐⭐ High |
| **Environmental Calculator** | `EnvironmentalModule/EnvironmentalCalculator.tsx` | onComplete | Environmental Impact | ⭐⭐⭐ Medium |
| **Impact Matrix** | `EnvironmentalModule/EnvironmentalImpactMatrix.tsx` | onComplete | Environmental Impact | ⭐⭐⭐⭐ Medium-High |
| **Solutions Sorter** | `EnvironmentalModule/SimplifiedSolutionsSorter.tsx` | onComplete | Environmental Impact | ⭐⭐⭐⭐ Medium-High |
| **Tokenization Demo** | `UnderstandingLLMModule/activities/TokenizationDemo.tsx` | onComplete | Understanding LLMs | ⭐⭐⭐ Medium |
| **Beat the Predictor** | `UnderstandingLLMModule/activities/BeatThePredictorGame.tsx` | onComplete | Understanding LLMs | ⭐⭐⭐ Medium |
| **Word Prediction Game** | `UnderstandingLLMModule/activities/WordPredictionGame.tsx` | onComplete | Understanding LLMs | ⭐⭐⭐ Medium |
| **Policy Comparison** | `PrivacyModule/PolicyComparisonTable.tsx` | onComplete | Privacy & Data Rights | ⭐⭐⭐ Medium |
| **TC Timer Challenge** | `PrivacyModule/TCTimerChallenge.tsx` | onComplete | Privacy & Data Rights | ⭐⭐⭐⭐ Medium-High |
| **Ethical Dilemma Scenarios** | `AncientCompassModule/EthicalDilemmaScenarios.tsx` | onComplete | Ancient Compass | ⭐⭐⭐⭐ Medium-High |
| **Stakeholder Perspectives** | `AncientCompassModule/StakeholderPerspectives.tsx` | onComplete | Ancient Compass | ⭐⭐⭐⭐ Medium-High |
| **Revolution Comparison** | `AncientCompassModule/RevolutionComparisonChart.tsx` | onComplete | Ancient Compass | ⭐⭐⭐ Medium |
| **Personal AI Audit** | `AncientCompassModule/PersonalAIAudit.tsx` | onComplete | Ancient Compass | ⭐⭐⭐⭐ Medium-High |
| **Hallucination Detective** | Inline in `LLMLimitationsModule.tsx` | N/A | LLM Limitations | ⭐⭐⭐ Medium |

---

## Usage Examples

### Example 1: Building a New Module with Multiple Choice Quiz

```tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const QUIZ_QUESTIONS = [
  {
    question: "What is the main purpose of AI?",
    options: [
      "Replace humans",
      "Augment human capabilities",
      "Control society",
      "Make money"
    ],
    correctAnswer: 1,
    explanation: "Correct! AI is designed to augment and enhance human capabilities, not replace them.",
    hint: "Think about AI as a tool. What do tools do for humans?"
  }
];

function MyQuizActivity({ onComplete }) {
  const [answers, setAnswers] = useState<(number | null)[]>([null]);
  const [showFeedback, setShowFeedback] = useState<boolean[]>([false]);
  const [completed, setCompleted] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    setShowFeedback([true]);
  };

  const allCorrect = answers.every((answer, i) => answer === QUIZ_QUESTIONS[i].correctAnswer);

  return (
    <Card className="p-6">
      {QUIZ_QUESTIONS.map((q, qIndex) => (
        <div key={qIndex} className="space-y-4">
          <h3 className="font-semibold text-lg">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((option, oIndex) => {
              const isSelected = answers[qIndex] === oIndex;
              const isCorrect = oIndex === q.correctAnswer;
              const showAsCorrect = showFeedback[qIndex] && isSelected && isCorrect;
              const showAsWrong = showFeedback[qIndex] && isSelected && !isCorrect;

              return (
                <label
                  key={oIndex}
                  className={`block p-4 rounded-lg border-2 cursor-pointer ${
                    showAsCorrect ? 'border-green-500 bg-green-50' :
                    showAsWrong ? 'border-red-500 bg-red-50' :
                    isSelected ? 'border-blue-500 bg-blue-50' :
                    'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(qIndex, oIndex)}
                    disabled={showFeedback[qIndex]}
                    className="sr-only"
                  />
                  {option}
                </label>
              );
            })}
          </div>

          {/* Show explanation only when correct */}
          {showFeedback[qIndex] && answers[qIndex] === q.correctAnswer && (
            <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-sm">{q.explanation}</p>
            </div>
          )}

          {/* Show hint when wrong */}
          {showFeedback[qIndex] && answers[qIndex] !== q.correctAnswer && (
            <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm"><strong>Not quite!</strong> {q.hint}</p>
            </div>
          )}
        </div>
      ))}

      {!showFeedback[0] && answers[0] !== null && (
        <Button onClick={checkAnswers} className="w-full mt-6">
          Check My Answer
        </Button>
      )}

      {allCorrect && !completed && (
        <Button onClick={() => { setCompleted(true); onComplete(); }} className="w-full mt-6 bg-green-600">
          Continue
        </Button>
      )}
    </Card>
  );
}
```

---

### Example 2: Reusing Environmental Calculator in New Module

```tsx
import EnvironmentalCalculator from '@/components/EnvironmentalModule/EnvironmentalCalculator';

function MyNewEnergyModule() {
  const [currentPhase, setCurrentPhase] = useState('intro');

  return (
    <div>
      {currentPhase === 'calculator' && (
        <EnvironmentalCalculator
          onComplete={() => setCurrentPhase('next-activity')}
        />
      )}
    </div>
  );
}
```

---

### Example 3: Adding AI-Validated Reflection to Any Module

```tsx
import { isNonsensical, generateEducationFeedback } from '@/utils/aiEducationFeedback';
import { useDevMode } from '@/context/DevModeContext';

function MyReflectionActivity({ question, onComplete }) {
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [needsRetry, setNeedsRetry] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);
  const { isDevModeActive } = useDevMode();
  const MAX_ATTEMPTS = 2;

  const handleSubmit = async () => {
    // Layer 1: Pre-filter
    const isInvalid = isNonsensical(response);

    // Layer 2: AI validation
    const feedback = await generateEducationFeedback(response, question);

    const feedbackIndicatesRetry =
      feedback.toLowerCase().includes('does not address') ||
      feedback.toLowerCase().includes('please re-read') ||
      feedback.toLowerCase().includes('inappropriate language') ||
      feedback.toLowerCase().includes('off-topic') ||
      feedback.toLowerCase().includes('must elaborate') ||
      feedback.toLowerCase().includes('insufficient') ||
      feedback.toLowerCase().includes('needs more depth');

    setFeedback(feedback);
    setShowFeedback(true);
    setNeedsRetry(isInvalid || feedbackIndicatesRetry);

    if (isInvalid || feedbackIndicatesRetry) {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      if (newAttemptCount >= MAX_ATTEMPTS) {
        setShowEscapeHatch(true);
      }
    }
  };

  const handleTryAgain = () => {
    setResponse('');
    setFeedback('');
    setShowFeedback(false);
    setNeedsRetry(false);
    // Don't reset attemptCount or showEscapeHatch
  };

  return (
    <div>
      <h3>{question}</h3>
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Write your response..."
        disabled={showFeedback && !needsRetry}
      />

      {showFeedback && (
        <div className={needsRetry ? 'bg-yellow-50' : 'bg-green-50'}>
          <p>{feedback}</p>
        </div>
      )}

      {showEscapeHatch && needsRetry && (
        <div className="bg-orange-100 p-6">
          <p>Multiple attempts detected ({attemptCount} tries)</p>
          <button onClick={handleTryAgain}>Try One More Time</button>
          <button onClick={onComplete}>Continue Anyway</button>
        </div>
      )}

      {!showFeedback && (
        <button onClick={handleSubmit}>Submit</button>
      )}

      {showFeedback && !needsRetry && (
        <button onClick={onComplete}>Continue</button>
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Activity Design
- ✅ Keep activities self-contained with clear props interface
- ✅ Use `onComplete` callback for navigation
- ✅ Implement dev mode shortcuts for all reflections
- ✅ Provide immediate feedback for interactive elements
- ✅ Never reveal correct answers directly in quizzes - use hints

### 2. Video Integration
- ✅ Use relative paths: `Videos/Student Videos/Topic/file.mp4`
- ✅ Set mandatory: true to prevent skipping
- ✅ Respect dev mode with allowSeeking prop
- ✅ Use clear segment titles and descriptions

### 3. AI Validation
- ✅ Always implement 2-attempt escape hatch
- ✅ Use pre-filter + AI validation (two layers)
- ✅ Preserve attempt count across retries
- ✅ Provide educational, not punitive feedback
- ✅ Test with dev mode shortcuts (good, generic, complaint, gibberish)

### 4. Accessibility
- ✅ Maintain 4.5:1 contrast ratio (normal text)
- ✅ Use semantic HTML (`<button>` not `<div onClick>`)
- ✅ Always specify `text-*` color when setting `bg-*` background
- ✅ Provide ARIA labels for interactive elements

### 5. Progress Tracking
- ✅ Integrate with ActivityRegistry for dev mode navigation
- ✅ Implement Progress Persistence (save/resume/clear pattern)
- ✅ Clear progress on certificate download
- ✅ Register activities once on mount (empty deps array)

---

## Module Status Summary

| Module | Video Segments | Quizzes | Reflections | Interactive Activities | Exit Ticket | Progress Persistence | Dev Mode |
|--------|----------------|---------|-------------|----------------------|-------------|---------------------|----------|
| What Is AI | 3 | ❌ | ✅ (1) | ✅ (6+) | ✅ | ✅ | ✅ |
| Intro to Gen AI | 5 | ✅ (1) | ✅ (1) | ✅ (7+) | ✅ | ✅ | ✅ |
| Responsible & Ethical AI | ? | ? | ? | ? | ? | ⏳ | ? |
| Understanding LLMs | 7 | ✅ (3) | ✅ (1) | ✅ (15+) | ✅ | ⏳ | ✅ |
| LLM Limitations | 7 | ❌ | ✅ (4) | ✅ (6+) | ✅ | ⏳ | ✅ |
| Privacy & Data Rights | ? | ? | ? | ✅ (3) | ? | ⏳ | ? |
| AI Environmental Impact | 12 | ❌ | ✅ (2) | ✅ (3) | ✅ | ✅ | ✅ |
| Introduction to Prompting | 4 | ✅ (1) | ✅ (1) | ✅ (8+) | ✅ | ✅ | ✅ |
| Ancient Compass | 5 | ✅ (3) | ✅ (4) | ✅ (4) | ✅ | ✅ | ✅ |

**Legend**: ✅ Implemented | ⏳ Pending | ❌ Not needed

---

## Future Considerations

### Potential New Activity Types
1. **Drag-and-Drop Builder** - Visual prompt construction
2. **Timeline Activity** - Historical AI development
3. **Network Graph** - Visualize AI relationships/concepts
4. **Debate Simulator** - AI ethics debates with multiple perspectives
5. **Code Playground** - Simple prompting practice with live AI
6. **Audio Analysis** - Analyze AI-generated vs human audio
7. **Image Comparison** - Real vs AI-generated images

### Refactoring Opportunities
1. Extract inline quiz patterns into reusable `QuizActivity` component
2. Create unified `ScenarioActivity` component wrapping existing scenario patterns
3. Build `GameActivity` wrapper for score-based challenges
4. Develop `SortingActivity` generic component (used in 3 modules)

---

**Maintained By**: AI Literacy Platform Team
**For Questions**: Refer to `.claude/guides/` directory for detailed implementation guides
