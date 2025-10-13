# Reflection Activity Standard

## Purpose
Standardized validation and feedback behavior for all student reflection activities across modules.

## Core Principles
1. **No bypass** - Students must provide quality responses to continue
2. **Two-layer validation** - Pre-check for gibberish, then evaluate content depth
3. **Clear visual feedback** - Distinct states for retry vs. success
4. **Preserve student work** - Never clear their response on validation failure

---

## Implementation Requirements

### Required Imports
```typescript
import { isNonsensical, generateEducationFeedback } from '@/utils/aiEducationFeedback';
```

### State Variables
```typescript
const [response, setResponse] = useState('');
const [aiFeedback, setAiFeedback] = useState('');
const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
const [showFeedback, setShowFeedback] = useState(false);
const [needsRetry, setNeedsRetry] = useState(false);
```

### Constants
```typescript
const minResponseLength = 100; // 100 characters = roughly 2-3 sentences
const isResponseValid = response.trim().length >= minResponseLength;
```

---

## Validation Logic

### handleSubmit Function
```typescript
const handleSubmit = async () => {
  if (!showFeedback) {
    // Layer 1: Pre-validation for gibberish/nonsense
    const isInvalid = isNonsensical(response);

    // Layer 2: Get AI feedback
    setIsLoadingFeedback(true);
    try {
      const feedback = await generateEducationFeedback(response, question);
      setAiFeedback(feedback);
      setShowFeedback(true);
      setIsLoadingFeedback(false);

      // Check if AI feedback indicates response needs improvement
      const feedbackIndicatesRetry =
        feedback.toLowerCase().includes('does not address') ||
        feedback.toLowerCase().includes('please re-read') ||
        feedback.toLowerCase().includes('inappropriate language') ||
        feedback.toLowerCase().includes('off-topic') ||
        feedback.toLowerCase().includes('lacks depth') ||
        feedback.toLowerCase().includes('could you elaborate') ||
        feedback.toLowerCase().includes('needs more depth') ||
        feedback.toLowerCase().includes('lacks specificity') ||
        feedback.toLowerCase().includes('elaborate') ||
        feedback.toLowerCase().includes('monitored for inappropriate') ||
        feedback.toLowerCase().includes('answer the original question');

      // Require retry if EITHER validation failed
      setNeedsRetry(isInvalid || feedbackIndicatesRetry);
    } catch (error) {
      console.error('Failed to get AI feedback:', error);
      setAiFeedback('Thank you for your reflection. Please continue with the next activity.');
      setShowFeedback(true);
      setIsLoadingFeedback(false);
      setNeedsRetry(false); // Don't block on API errors
    }
  } else {
    // Feedback already shown - continue to next activity
    onComplete();
  }
};
```

### handleTryAgain Function
```typescript
const handleTryAgain = () => {
  setShowFeedback(false);
  setAiFeedback('');
  setNeedsRetry(false);
  // IMPORTANT: Keep the response so student can edit it
};
```

---

## UI Components

### Textarea Input
```tsx
<Textarea
  value={response}
  onChange={(e) => setResponse(e.target.value)}
  placeholder="Share your thoughts and insights... Be specific and thoughtful."
  className="w-full min-h-[150px] text-base"
  disabled={showFeedback} // Lock after submission
/>

<div className="flex justify-between items-center">
  <div className="text-sm text-gray-500">
    {response.length} characters
    {minResponseLength && ` (minimum: ${minResponseLength})`}
  </div>
  {isResponseValid && (
    <div className="text-green-600 text-sm font-medium flex items-center gap-1">
      <span className="text-green-500">✓</span>
      Ready to submit
    </div>
  )}
</div>
```

### AI Feedback Display (Retry State)
```tsx
{showFeedback && aiFeedback && (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`border-2 rounded-lg p-6 ${
      needsRetry
        ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-300 dark:border-blue-700'
        : 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-300 dark:border-purple-700'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`rounded-full p-2 flex-shrink-0 ${
        needsRetry
          ? 'bg-blue-200 dark:bg-blue-800'
          : 'bg-purple-200 dark:bg-purple-800'
      }`}>
        <Sparkles className={`w-5 h-5 ${
          needsRetry
            ? 'text-blue-700 dark:text-blue-300'
            : 'text-purple-700 dark:text-purple-300'
        }`} />
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold mb-3 ${
          needsRetry
            ? 'text-blue-900 dark:text-blue-100'
            : 'text-purple-900 dark:text-purple-100'
        }`}>
          AI Feedback
        </h4>
        <p className={`leading-relaxed ${
          needsRetry
            ? 'text-blue-900 dark:text-blue-200'
            : 'text-purple-900 dark:text-purple-200'
        }`}>
          {aiFeedback}
        </p>
      </div>
    </div>
  </motion.div>
)}
```

### Button Logic
```tsx
{needsRetry ? (
  <Button
    onClick={handleTryAgain}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    size="lg"
  >
    Try Again
  </Button>
) : (
  <Button
    onClick={handleSubmit}
    disabled={isLoadingFeedback || !isResponseValid}
    className="w-full"
    size="lg"
  >
    {isLoadingFeedback ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Getting AI Feedback...
      </>
    ) : showFeedback ? (
      'Continue Learning'
    ) : (
      'Submit Reflection'
    )}
  </Button>
)}
```

---

## Visual States

### State 1: Input Mode (No submission yet)
- White/card background
- Textarea enabled
- Character counter visible
- "Submit Reflection" button enabled when ≥ 100 chars

### State 2: Loading
- "Getting AI Feedback..." with spinner
- Button disabled

### State 3: Retry Required (Blue theme)
- Blue gradient background on feedback card
- Blue sparkle icon
- "Try Again" button (blue)
- Textarea cleared for re-entry OR preserved (configurable)
- Clear message about what needs improvement

### State 4: Success (Purple theme)
- Purple gradient background on feedback card
- Purple sparkle icon
- "Continue Learning" button
- Positive, specific feedback about student's response

---

## Testing Checklist

### Validation Tests
- [ ] Gibberish input (e.g., "asdfasdfasdf") → Immediate retry required
- [ ] Too short (< 100 chars) → Cannot submit
- [ ] Keyboard mashing → Detected and rejected
- [ ] Repeated characters (e.g., "aaaaaaa") → Rejected
- [ ] Shallow response → AI detects and requires retry
- [ ] Off-topic response → AI detects and redirects
- [ ] Inappropriate content → Safety filters block
- [ ] Thoughtful response → Success state, can continue

### UX Tests
- [ ] Character counter updates live
- [ ] Green checkmark appears at 100+ chars
- [ ] Loading state shows during AI processing
- [ ] Blue feedback + "Try Again" for retry
- [ ] Purple feedback + "Continue Learning" for success
- [ ] Student's text preserved on retry
- [ ] No bypass possible with poor responses

### Edge Cases
- [ ] API failure → Fallback feedback, allow continue (don't block on errors)
- [ ] Network timeout → Graceful handling
- [ ] Multiple retries → System remains stable
- [ ] Empty response → Submit button disabled

---

## School-Appropriate Tool Recommendations

When providing feedback that suggests AI tools, prioritize:

1. **Microsoft Copilot** (ages 13-17) - Available through school
2. **School-provided AI tools** - Whatever the institution offers
3. **Educational AI platforms** - Age-appropriate, vetted tools

### Example Feedback Language
```
"Great question! You might explore this further using Microsoft Copilot
(available for ages 13+ through your school) or other AI tools your
teacher has approved."
```

---

## Implementation Modules

### ✅ Implemented
- `WhatIsAIModule/VideoReflectionActivity.tsx` - Reference implementation

### 🔧 Needs Upgrade
- `IntroToGenAIModule.tsx` - renderReflection() function
- Other modules with reflection activities (audit needed)

---

## Developer Mode Support

```typescript
const handleDevSkip = () => {
  const devResponse = getContextualDevResponse(); // Module-specific
  setResponse(devResponse);
  setAiFeedback("Developer mode: Auto-filled with quality response.");
  setShowFeedback(true);
  setNeedsRetry(false);
  setTimeout(() => onComplete(), 1000);
};
```

Developer controls should:
- Auto-fill with high-quality, contextual responses
- Bypass validation (for testing only)
- Be clearly marked with red/warning styling
- Only appear when `isDevModeActive === true`

---

## Notes

- This standard ensures consistent student experience across all modules
- All reflection activities should enforce quality without being punitive
- AI feedback should be honest, not sycophantic
- The goal is critical thinking, not compliance
- Students learn that quality matters, not just completion
