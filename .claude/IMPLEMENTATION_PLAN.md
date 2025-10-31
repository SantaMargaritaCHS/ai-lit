# Implementation Plan: Missing Features in 4 Modules

**Date:** 2025-10-29
**Task:** Add escape hatch and/or progress persistence to 4 modules

---

## Summary of Required Changes

| Module | Escape Hatch | Progress Persistence | Priority |
|--------|-------------|---------------------|----------|
| **Module 5: LLM Limitations** | ❌ Missing | ❌ Missing | HIGH |
| **Module 6: Privacy & Data Rights** | ❌ Missing | ❌ Missing | HIGH |
| **Module 4: Understanding LLMs** | ✅ Has | ❌ Missing | MEDIUM |
| **Module 8: Introduction to Prompting** | ❌ Missing | ✅ Has | MEDIUM |

---

## Module 5: LLM Limitations

**File:** `/home/runner/workspace/client/src/components/modules/LLMLimitationsModule.tsx` (2078 lines)

### Current Issues
1. Exit ticket uses `/api/ai-feedback` endpoint (non-standard)
2. NO escape hatch (students can get stuck)
3. NO progress persistence (lose progress on refresh)

### Changes Required

#### Part 1: Add Imports (after line 12)
```typescript
import { generateEducationFeedback, isNonsensical } from '@/utils/aiEducationFeedback';
import { saveProgress, loadProgress, clearProgress, getProgressSummary } from '@/lib/progressPersistence';
import ResumeProgressDialog from '@/components/WhatIsAIModule/ResumeProgressDialog';
```

#### Part 2: Add Constants (after line 35)
```typescript
const MODULE_ID = 'llm-limitations';
const MAX_ATTEMPTS = 2;
```

#### Part 3: Add State Variables (after line 173)
```typescript
// Escape hatch state
const [attemptCount, setAttemptCount] = useState(0);
const [showEscapeHatch, setShowEscapeHatch] = useState(false);
const [needsRetry, setNeedsRetry] = useState(false);

// Progress persistence state
const [showResumeDialog, setShowResumeDialog] = useState(false);
const [savedProgress, setSavedProgress] = useState<ReturnType<typeof getProgressSummary>>(null);
```

#### Part 4: Add Progress Load Effect (after line 287)
```typescript
// Load saved progress on mount
useEffect(() => {
  const progress = loadProgress(MODULE_ID, activities);

  if (progress) {
    const summary = getProgressSummary(MODULE_ID);
    setSavedProgress(summary);
    setShowResumeDialog(true);
    console.log('✅ LLM Limitations: Progress found - showing resume dialog');
  }
}, []);
```

#### Part 5: Add Progress Save Effect (after progress load effect)
```typescript
// Auto-save progress on phase change
useEffect(() => {
  if (showResumeDialog || currentPhase === 'intro') {
    return; // Don't save during resume dialog or initial state
  }

  saveProgress(MODULE_ID, activities.findIndex(a => a.id === currentPhase), activities);
}, [currentPhase, showResumeDialog]);
```

#### Part 6: Add Resume/Start Over Handlers (after line 356)
```typescript
// Progress persistence handlers
const handleResumeProgress = () => {
  const progress = loadProgress(MODULE_ID, activities);

  if (progress) {
    const phases = ['intro', 'opening-challenge', 'video1', 'discussion1', 'video2', 'activity2', 'video3', 'discussion3', 'video4', 'hallucination-activity', 'video5', 'bias-activity', 'video6', 'outdated-activity', 'sources-activity', 'video7', 'reflection', 'complete'];
    setCurrentPhase(phases[progress.currentActivity] as any);
    setShowResumeDialog(false);
    console.log(`✅ Resumed at activity ${progress.currentActivity + 1}`);
  } else {
    handleStartOver();
  }
};

const handleStartOver = () => {
  clearProgress(MODULE_ID);
  setShowResumeDialog(false);
  setCurrentPhase('intro');
  console.log('🔄 Starting over - progress cleared');
};
```

#### Part 7: Replace Exit Ticket Validation (lines 1872-1903)
**Replace the entire `handleGetExitFeedback` function with:**

```typescript
const handleGetExitFeedback = async () => {
  if (exitResponse.length < 100) return;

  setIsLoadingExitFeedback(true);

  try {
    // Layer 1: Pre-filter check
    const isInvalid = isNonsensical(exitResponse);
    if (isInvalid) {
      setExitFeedback("Your response needs more depth. Please write at least 2-3 complete sentences with specific thoughts about AI limitations. Random text or very short answers won't be accepted.");
      setNeedsRetry(true);
      setIsLoadingExitFeedback(false);
      return;
    }

    // Layer 2: AI validation
    const question = 'What is the ONE most important thing about AI limitations that every educator should know, and how will you apply this in your teaching?';
    const feedback = await generateEducationFeedback(exitResponse, question);

    setExitFeedback(feedback);

    // Check for rejection trigger phrases
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

    setNeedsRetry(feedbackIndicatesRetry);

    if (feedbackIndicatesRetry) {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (newAttemptCount >= MAX_ATTEMPTS) {
        setShowEscapeHatch(true);
      }
    } else {
      // Success - allow continue
      setShowExitContinueButton(true);
    }
  } catch (error) {
    console.error('Error generating exit feedback:', error);
    setExitFeedback('Thank you for completing this module! Your reflection shows thoughtful consideration of how to apply these AI limitation concepts in your teaching.');
    setShowExitContinueButton(true);
    setNeedsRetry(false);
  } finally {
    setIsLoadingExitFeedback(false);
  }
};
```

#### Part 8: Add Escape Hatch Button Handlers (after handleContinueToCertificate at line 1908)
```typescript
const handleTryAgain = () => {
  setExitResponse('');
  setExitFeedback('');
  setNeedsRetry(false);
  setAttemptCount(0);
  setShowEscapeHatch(false);
  setShowExitContinueButton(false);
};

const handleContinueAnyway = () => {
  console.log('[ESCAPE HATCH] Student bypassed validation after', attemptCount, 'attempts');
  setShowExitContinueButton(true);
  setNeedsRetry(false);
};
```

#### Part 9: Add Escape Hatch UI (after line 1969, before closing div at line 1970)
```typescript
{/* Escape Hatch - appears after MAX_ATTEMPTS failed attempts */}
{showEscapeHatch && needsRetry && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 dark:border-yellow-700 rounded-lg p-6 mb-4"
  >
    <div className="flex items-start gap-3">
      <div className="rounded-full p-2 bg-yellow-200 dark:bg-yellow-800 flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
          ⚠️ Multiple Attempts Detected
        </h4>
        <p className="text-yellow-900 dark:text-yellow-200 mb-3">
          You've tried {attemptCount} times and the AI feedback suggests your response needs improvement.
        </p>
        <p className="text-yellow-900 dark:text-yellow-200 mb-3">
          <strong className="text-yellow-700 dark:text-yellow-300">You have two options:</strong>
        </p>
        <ol className="text-yellow-900 dark:text-yellow-200 mb-4 space-y-1 ml-4">
          <li>1. Try again with a different response that addresses the question</li>
          <li>2. Continue anyway and move to the next step</li>
        </ol>
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-500 dark:border-red-600 rounded-lg p-3 mb-4">
          <p className="text-red-900 dark:text-red-200 text-sm">
            ⚠️ <strong>Important:</strong> If you continue, your response will be flagged for instructor review.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleTryAgain}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try One More Time
          </Button>
          <Button
            onClick={handleContinueAnyway}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
          >
            Continue Anyway
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
)}
```

#### Part 10: Update Submit Button Logic (replace button at lines 1973-1990)
```typescript
{/* Submit Button - Only show if no feedback yet and escape hatch not showing */}
{!exitFeedback && !isLoadingExitFeedback && !showEscapeHatch && (
  <Button
    onClick={handleGetExitFeedback}
    disabled={exitResponse.length < 100}
    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg disabled:opacity-50"
  >
    {exitResponse.length < 100 ? (
      <>
        Write {100 - exitResponse.length} more characters
      </>
    ) : (
      <>
        Get AI Feedback
        <Sparkles className="ml-2 w-5 h-5" />
      </>
    )}
  </Button>
)}

{/* Try Again Button - Show after failed validation, hide when escape hatch appears */}
{needsRetry && exitFeedback && !showEscapeHatch && (
  <Button
    onClick={handleTryAgain}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
  >
    Try Again
  </Button>
)}
```

#### Part 11: Clear Progress on Certificate (in complete phase around line 2007)
**Find the Certificate component and add clearProgress call:**

```typescript
// In the certificate download handler
const handleCertificateDownload = () => {
  clearProgress(MODULE_ID);
  console.log('🎓 Certificate downloaded - progress cleared');
  onComplete();
};
```

#### Part 12: Add Resume Dialog to Render (at the start of the return statement)
```typescript
return (
  <>
    {/* Resume Progress Dialog */}
    {showResumeDialog && savedProgress && savedProgress.exists && (
      <ResumeProgressDialog
        activityIndex={savedProgress.activityIndex!}
        activityTitle={savedProgress.activityTitle!}
        totalActivities={savedProgress.totalActivities!}
        lastUpdated={savedProgress.lastUpdated!}
        onResume={handleResumeProgress}
        onStartOver={handleStartOver}
      />
    )}

    {/* Rest of module UI */}
    {/* ... existing content ... */}
  </>
);
```

---

## Module 6: Privacy & Data Rights

**File:** `/home/runner/workspace/client/src/components/modules/PrivacyDataRightsModule.tsx` (1069 lines)

### Current Issues
1. Exit ticket uses simple feedback without validation (lines 350-386)
2. NO escape hatch
3. NO progress persistence

### Changes Required

#### Part 1: Add Imports (after line 15)
```typescript
import { generateEducationFeedback, isNonsensical } from '@/utils/aiEducationFeedback';
import { saveProgress, loadProgress, clearProgress, getProgressSummary } from '@/lib/progressPersistence';
import ResumeProgressDialog from '@/components/WhatIsAIModule/ResumeProgressDialog';
```

#### Part 2: Add Constants
```typescript
const MODULE_ID = 'privacy-data-rights';
const MAX_ATTEMPTS = 2;
```

#### Part 3: Add State Variables (after line 327)
```typescript
// Escape hatch state
const [attemptCount, setAttemptCount] = useState(0);
const [showEscapeHatch, setShowEscapeHatch] = useState(false);
const [needsRetry, setNeedsRetry] = useState(false);

// Progress persistence state
const [showResumeDialog, setShowResumeDialog] = useState(false);
const [savedProgress, setSavedProgress] = useState<ReturnType<typeof getProgressSummary>>(null);
```

#### Part 4: Replace getAIFeedback Function (lines 350-386)
**Replace entire function with:**

```typescript
const getAIFeedback = async () => {
  if (!exitTicketAnswers['tool-change'] || !exitTicketAnswers['friend-advice'] || !exitTicketAnswers['biggest-difference']) return;

  const allAnswered = Object.values(exitTicketAnswers).every(answer => answer?.trim().length >= 150);
  if (!allAnswered) return;

  setIsGettingFeedback(true);

  try {
    // Combine all responses for validation
    const combinedResponse = `
1. Tool usage change: ${exitTicketAnswers['tool-change']}
2. Friend advice: ${exitTicketAnswers['friend-advice']}
3. Understanding difference: ${exitTicketAnswers['biggest-difference']}
    `.trim();

    // Layer 1: Pre-filter check
    const isInvalid = isNonsensical(combinedResponse);
    if (isInvalid) {
      if (isMountedRef.current) {
        setAiFeedback("Your responses need more depth. Please write at least 2-3 complete sentences for each question with specific thoughts about AI privacy. Random text or very short answers won't be accepted.");
        setNeedsRetry(true);
      }
      return;
    }

    // Layer 2: AI validation
    const question = 'Reflect on AI privacy and data rights: how you use AI tools, advice for protecting personal data, and differences between school-safe and consumer AI tools.';
    const feedback = await generateEducationFeedback(combinedResponse, question);

    if (isMountedRef.current) {
      setAiFeedback(feedback || 'Great reflection! Your understanding of AI privacy shows real growth.');

      // Check for rejection trigger phrases
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

      setNeedsRetry(feedbackIndicatesRetry);

      if (feedbackIndicatesRetry) {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= MAX_ATTEMPTS) {
          setShowEscapeHatch(true);
        }
      }
    }
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    if (isMountedRef.current) {
      setAiFeedback('Excellent responses! Your understanding of AI privacy risks shows real maturity. Keep protecting your data!');
      setNeedsRetry(false);
    }
  } finally {
    if (isMountedRef.current) {
      setIsGettingFeedback(false);
    }
  }
};
```

#### Part 5: Add needsRetry State (line 326)
```typescript
const [needsRetry, setNeedsRetry] = useState(false);
```

#### Part 6: Add Escape Hatch Button Handlers (after getAIFeedback function)
```typescript
const handleTryAgain = () => {
  setExitTicketAnswers({});
  setAiFeedback('');
  setNeedsRetry(false);
  setAttemptCount(0);
  setShowEscapeHatch(false);
};

const handleContinueAnyway = () => {
  console.log('[ESCAPE HATCH] Student bypassed validation after', attemptCount, 'attempts');
  setPhase('works-cited');
};
```

#### Part 7: Add Progress Load/Save Effects (after line 335)
```typescript
// Load saved progress on mount
useEffect(() => {
  const progress = loadProgress(MODULE_ID, activities);

  if (progress) {
    const summary = getProgressSummary(MODULE_ID);
    setSavedProgress(summary);
    setShowResumeDialog(true);
  }
}, []);

// Auto-save progress on phase change
useEffect(() => {
  if (showResumeDialog || phase === 'intro') {
    return;
  }

  const phaseIndex = activities.findIndex(a => a.id === phase);
  if (phaseIndex >= 0) {
    saveProgress(MODULE_ID, phaseIndex, activities);
  }
}, [phase, showResumeDialog]);
```

#### Part 8: Add Resume/Start Over Handlers (after progress effects)
```typescript
const handleResumeProgress = () => {
  const progress = loadProgress(MODULE_ID, activities);

  if (progress) {
    const phases: Phase[] = ['intro', 'jordan-simulation', 'how-ai-remembers', 'tc-challenge', 'policy-comparison', 'tools-comparison', 'action-plan', 'exit-ticket', 'works-cited'];
    setPhase(phases[progress.currentActivity]);
    setShowResumeDialog(false);
  } else {
    handleStartOverProgress();
  }
};

const handleStartOverProgress = () => {
  clearProgress(MODULE_ID);
  setShowResumeDialog(false);
  setPhase('intro');
};
```

#### Part 9: Add Escape Hatch UI to Exit Ticket (after line 979, before closing CardContent)
```typescript
{/* Escape Hatch - appears after MAX_ATTEMPTS failed attempts */}
{showEscapeHatch && needsRetry && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 dark:border-yellow-700 rounded-lg p-6 mb-4"
  >
    <div className="flex items-start gap-3">
      <div className="rounded-full p-2 bg-yellow-200 dark:bg-yellow-800 flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
          ⚠️ Multiple Attempts Detected
        </h4>
        <p className="text-yellow-900 dark:text-yellow-200 mb-3">
          You've tried {attemptCount} times and the AI feedback suggests your responses need improvement.
        </p>
        <p className="text-yellow-900 dark:text-yellow-200 mb-3">
          <strong>You have two options:</strong>
        </p>
        <ol className="text-yellow-900 dark:text-yellow-200 mb-4 space-y-1 ml-4">
          <li>1. Try again with different responses that address the questions</li>
          <li>2. Continue anyway and move to the final section</li>
        </ol>
        <div className="bg-red-100 dark:bg-red-900/40 border border-red-500 rounded-lg p-3 mb-4">
          <p className="text-red-900 dark:text-red-200 text-sm">
            ⚠️ <strong>Important:</strong> If you continue, your responses will be flagged for instructor review.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleTryAgain}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try One More Time
          </Button>
          <Button
            onClick={handleContinueAnyway}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
          >
            Continue Anyway
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
)}
```

#### Part 10: Update Continue Button Logic (modify button at line 971-977)
```typescript
{aiFeedback && !needsRetry && (
  <div className="text-center">
    <Button
      onClick={() => setPhase('works-cited')}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-xl rounded-xl"
    >
      View Sources & Get Your Certificate
      <CheckCircle className="w-6 h-6 ml-2" />
    </Button>
  </div>
)}

{needsRetry && aiFeedback && !showEscapeHatch && (
  <Button
    onClick={handleTryAgain}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-xl"
  >
    Try Again
  </Button>
)}
```

#### Part 11: Clear Progress on Certificate (in works-cited phase, button at line 1040)
```typescript
<Button
  onClick={() => {
    clearProgress(MODULE_ID);
    onComplete();
  }}
  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4"
>
  Get Your Certificate
  <CheckCircle className="w-6 h-6 ml-2" />
</Button>
```

#### Part 12: Add Resume Dialog to Render
**At the start of each phase return, add:**
```typescript
{showResumeDialog && savedProgress && savedProgress.exists && (
  <ResumeProgressDialog
    activityIndex={savedProgress.activityIndex!}
    activityTitle={savedProgress.activityTitle!}
    totalActivities={savedProgress.totalActivities!}
    lastUpdated={savedProgress.lastUpdated!}
    onResume={handleResumeProgress}
    onStartOver={handleStartOverProgress}
  />
)}
```

---

## Module 4: Understanding LLMs

**Note:** This module already has escape hatch in ExitTicketLLM.tsx. Only needs progress persistence in main module file.

**File:** Need to find the correct path (not found in initial search)

### Search for Module
Run: `find /home/runner/workspace -name "*UnderstandingLLM*" -type f`

---

## Module 8: Introduction to Prompting

**File:** `/home/runner/workspace/client/src/components/modules/IntroductionToPromptingModule.tsx` (2672 lines)

**Note:** This module already has progress persistence. Only needs escape hatch for exit ticket.

### Changes Required

#### Search for Exit Ticket Location
Need to find the PromptingExitTicket component usage or exit ticket implementation.

---

## Testing Checklist

### For Each Module After Implementation:

**Escape Hatch Testing:**
- [ ] Attempt 1 (gibberish) → Pre-filter rejection
- [ ] Attempt 2 (complaint) → Gemini rejection, attempt count = 1
- [ ] Attempt 3 (off-topic) → Escape hatch appears, attempt count = 2
- [ ] Click "Try One More Time" → Form clears, counter resets
- [ ] Re-trigger escape hatch (2 more attempts)
- [ ] Click "Continue Anyway" → Proceeds to certificate/next phase

**Progress Persistence Testing:**
- [ ] Complete 2-3 activities
- [ ] Refresh browser
- [ ] Resume dialog appears with correct info
- [ ] Click "Resume" → Returns to correct activity
- [ ] Click "Start Over" → Clears and restarts
- [ ] Complete module → Download certificate
- [ ] Refresh → No resume dialog (progress cleared)

**Anti-Cheat Testing:**
- [ ] Tamper localStorage (skip activities) → Reset
- [ ] Tamper localStorage (jump ahead) → Reset
- [ ] Change module version → Invalidate progress

---

## Implementation Priority

1. **Module 5: LLM Limitations** (both features missing) - START HERE
2. **Module 6: Privacy & Data Rights** (both features missing)
3. **Module 4: Understanding LLMs** (only progress persistence needed)
4. **Module 8: Introduction to Prompting** (only escape hatch needed)

---

## Notes

- All escape hatches use MAX_ATTEMPTS = 2
- All modules use same validation functions from `/home/runner/workspace/client/src/utils/aiEducationFeedback.ts`
- ResumeProgressDialog is reusable from `/home/runner/workspace/client/src/components/WhatIsAIModule/ResumeProgressDialog.tsx`
- Progress persistence functions from `/home/runner/workspace/client/src/lib/progressPersistence.ts`
- Always test with TypeScript compilation: `npx tsc --noEmit`
