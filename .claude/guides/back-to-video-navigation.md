# Back to Video Navigation Pattern

## Overview

This guide explains how to add "Review Video" navigation buttons to module activities, allowing students to go back and review the preceding video segment without losing their progress.

**First Implementation**: `IntroToGenAIModule.tsx` (January 2026)

## When to Use

Add back-to-video navigation when:
- A quiz or reflection activity follows a video segment
- Students might need to review video content to answer questions
- You want to reduce frustration from missed content

## Implementation Steps

### Step 1: Add ChevronLeft Import

Add `ChevronLeft` to the lucide-react import:

```typescript
import { /* existing icons */, ChevronLeft } from 'lucide-react';
```

### Step 2: Define the Back-to-Video Mapping

Create a mapping of which activities can go back to which video. Add this near the top of your module file (outside the component):

```typescript
// Mapping for "Back to Video" navigation
const BACK_TO_VIDEO_MAP: Partial<Record<Phase, Phase>> = {
  'activity-after-video-1': 'video-1-id',
  'activity-after-video-2': 'video-2-id',
  // ... map each activity to its preceding video
};

const VIDEO_TITLES: Record<string, string> = {
  'video-1-id': 'Video 1 Title',
  'video-2-id': 'Video 2 Title',
  // ... human-readable titles for each video
};
```

**Important**: Only include activities that should have a back button (typically quizzes, reflections, interactive activities - NOT videos or the certificate).

### Step 3: Add the Handler Function

Inside your component, add the navigation handler:

```typescript
const handleBackToVideo = useCallback((targetPhase: Phase) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setPhase(targetPhase);
}, []);
```

**Key points**:
- Uses `useCallback` for performance
- Scrolls to top for better UX
- Does NOT modify `completedPhases` (preserves progress)
- Does NOT clear any activity state (quiz answers, reflection text preserved)

### Step 4: Create the Button Component

Inside your component (after the handler):

```typescript
const BackToVideoButton = ({ videoPhase }: { videoPhase: Phase }) => {
  const videoTitle = VIDEO_TITLES[videoPhase] || 'Previous Video';
  return (
    <button
      onClick={() => handleBackToVideo(videoPhase)}
      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors mb-4"
    >
      <ChevronLeft className="w-4 h-4" />
      <span>Review Video: {videoTitle}</span>
    </button>
  );
};
```

### Step 5: Add Button to Each Activity

For each activity in your `BACK_TO_VIDEO_MAP`, add the button at the top of its render function's JSX:

```tsx
return (
  <InteractiveActivity /* or ModuleActivityWrapper */ ...>
    <BackToVideoButton videoPhase="video-X-id" />
    <motion.div ...>
      {/* existing activity content */}
    </motion.div>
  </InteractiveActivity>
);
```

**Placement**: After the opening wrapper tag, before `<motion.div>` or main content.

## Example: Mapping for a Module

```typescript
// Module with 3 videos and 6 activities
const BACK_TO_VIDEO_MAP: Partial<Record<Phase, Phase>> = {
  'comprehension-quiz-1': 'video-1-intro',
  'interactive-activity-1': 'video-1-intro',
  'comprehension-quiz-2': 'video-2-concepts',
  'reflection-activity': 'video-2-concepts',
  'final-quiz': 'video-3-summary',
  'exit-ticket': 'video-3-summary',
};
```

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| When to show | Only on quiz/reflection activities | Most helpful where students need to recall video content |
| State preservation | Preserve all progress | Don't punish students for reviewing content |
| Button placement | Top of activity | Non-intrusive, easy to find |
| Video restart | From segment start | Consistent with review purpose |

## Progress Persistence Compatibility

This pattern is **fully compatible** with progress persistence because:

1. Going backward doesn't create gaps in sequential completion
2. Activity state is preserved in React state (not localStorage)
3. `completedPhases` is not modified when going back
4. Students can still progress forward normally after reviewing

## Accessibility

The button implementation includes:
- Semantic `<button>` element
- Clear hover states
- Descriptive text with video title
- Adequate color contrast (blue on white)

## Future Enhancements

Consider these potential improvements:
- Extract `BackToVideoButton` to a shared component
- Add analytics tracking for back-navigation usage
- Optionally remember video playback position
- Add keyboard shortcut (e.g., `Ctrl+B` for back)

## Files Reference

- **Implementation example**: `client/src/components/modules/IntroToGenAIModule.tsx`
- **Related documentation**: `.claude/guides/progress-persistence.md`
