# Progress Persistence Implementation Guide

## Overview
This system saves student progress to localStorage and allows graceful recovery after browser refresh.

## Complete Implementation Steps

### Step 1: Module Setup
```typescript
const MODULE_ID = 'what-is-ai'; // Unique identifier per module

import { saveProgress, loadProgress, clearProgress, getProgressSummary } from '@/lib/progressPersistence';
import ResumeProgressDialog from './ResumeProgressDialog';
```

### Step 2: State Setup
```typescript
const [showResumeDialog, setShowResumeDialog] = useState(false);
const [savedProgress, setSavedProgress] = useState<ReturnType<typeof getProgressSummary>>(null);
```

### Step 3: Load Progress on Mount
```typescript
useEffect(() => {
  const progress = loadProgress(MODULE_ID, activities);

  if (progress) {
    const summary = getProgressSummary(MODULE_ID);
    setSavedProgress(summary);
    setShowResumeDialog(true);
    console.log('✅ Progress found - showing resume dialog');
  } else {
    console.log('ℹ️ No valid progress found - starting fresh');
  }
}, []); // Only on mount
```

### Step 4: Auto-save Progress
```typescript
useEffect(() => {
  // Don't save on initial mount
  if (currentActivity === 0 && activities[0]?.completed === false) {
    return;
  }

  // Don't save while showing resume dialog
  if (showResumeDialog) {
    return;
  }

  saveProgress(MODULE_ID, currentActivity, activities);
}, [currentActivity, activities, showResumeDialog]);
```

### Step 5: Resume/Restart Handlers
```typescript
const handleResumeProgress = () => {
  const progress = loadProgress(MODULE_ID, activities);

  if (progress) {
    setCurrentActivity(progress.currentActivity);
    setActivities(progress.activities);
    setShowResumeDialog(false);
    console.log(`✅ Resumed at activity ${progress.currentActivity + 1}`);
  } else {
    console.warn('⚠️ Could not resume - starting over');
    handleStartOver();
  }
};

const handleStartOver = () => {
  clearProgress(MODULE_ID);
  setShowResumeDialog(false);
  setCurrentActivity(0);
  setActivities(prev => prev.map(a => ({ ...a, completed: false })));
  console.log('🔄 Starting over - progress cleared');
};
```

### Step 6: Clear on Certificate Download
```typescript
case 'certificate':
  return (
    <Certificate
      onDownload={() => {
        clearProgress(MODULE_ID);
        console.log('🎓 Certificate downloaded - progress cleared');
        onComplete();
      }}
    />
  );
```

### Step 7: Render Resume Dialog
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
  </>
);
```

## Anti-Cheat Safeguards

### 1. Sequential Completion Enforcement
```typescript
// Can't have gaps in completion
// If activity 5 is complete but 3 is not → TAMPERING DETECTED → reset
for (let i = 0; i < activities.length; i++) {
  if (foundIncomplete && activity.completed) {
    console.warn('TAMPERING DETECTED: Gap in completion');
    return false;
  }
}
```

### 2. Current Activity Boundary Check
```typescript
const lastCompletedIndex = activities.findLastIndex(a => a.completed);
const maxAllowedIndex = lastCompletedIndex + 1;

if (currentActivity > maxAllowedIndex) {
  console.warn('TAMPERING DETECTED: Jumped ahead');
  return false;
}
```

### 3. Module Version Invalidation
```typescript
const currentVersion = generateModuleVersion(activities);
if (progress.moduleVersion !== currentVersion) {
  console.warn('Module version mismatch - resetting progress');
  return false;
}
```

## Testing Checklist

### 1. Normal Refresh
- Complete 3-4 activities
- Refresh browser
- Resume dialog appears
- Click "Resume" → continues from correct activity

### 2. Refresh During Reflection (Not Submitted)
- Navigate to reflection activity
- Type response but DON'T submit
- Refresh browser
- Resume → reflection is empty (validation not persisted)
- Must re-submit to continue

### 3. Tampering Attempt - Skip Activities
- Complete activities 1-3
- Open DevTools → localStorage
- Edit progress: mark activities 7-9 complete (but 4-6 false)
- Refresh browser
- Expected: Console warning "TAMPERING DETECTED"
- Progress reset → starts from beginning

### 4. Tampering Attempt - Jump Ahead
- Complete activities 1-3
- Edit localStorage: `currentActivity: 8`
- Refresh browser
- Expected: Console warning "TAMPERING DETECTED"
- Progress reset → starts from beginning

### 5. Module Structure Change
- Complete activities 1-5
- Developer changes module (adds/removes activities)
- Refresh browser
- Expected: Console warning "Module version mismatch"
- Progress reset → starts fresh with new structure

### 6. Complete Module
- Complete all activities
- Download certificate
- Expected: Console log "Certificate downloaded - progress cleared"
- Refresh browser
- Expected: No resume dialog → starts from beginning

## localStorage Key Convention

Pattern: `ai-literacy-module-${moduleId}-progress`

Examples:
- `ai-literacy-module-what-is-ai-progress`
- `ai-literacy-module-intro-to-gen-ai-progress`

## Troubleshooting

### Progress not saving
- Check console for "💾 Progress saved" logs
- Verify `currentActivity` is updating correctly
- Ensure not saving during initial mount

### Resume dialog not appearing
- Check console for "✅ Progress found" vs "ℹ️ No valid progress found"
- Open DevTools → Application → Local Storage → verify key exists
- Check if progress passed integrity validation

### Progress resets unexpectedly
- Check console for "⚠️ TAMPERING DETECTED" or "Module version mismatch"
- If module structure changed, version mismatch is expected (intentional reset)
- Verify activities array hasn't been reordered/modified
