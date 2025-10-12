/**
 * Progress Persistence Utility
 *
 * Handles saving and restoring module progress across browser refreshes
 * with anti-cheating safeguards.
 *
 * CRITICAL ANTI-CHEAT MEASURES:
 * - Only stores completion status, NOT validation data
 * - Validates progress integrity on load
 * - Detects tampering attempts and resets progress
 * - Enforces sequential activity completion
 */

export interface ActivityState {
  id: string;
  title: string;
  completed: boolean;
}

export interface ModuleProgress {
  currentActivity: number;
  activities: ActivityState[];
  lastUpdated: string; // ISO timestamp
  moduleVersion: string; // Used to invalidate old progress if module changes
  moduleId: string;
}

/**
 * Generate a version hash for the module structure
 * Changes if activities are added, removed, or reordered
 */
function generateModuleVersion(activities: ActivityState[]): string {
  const structure = activities.map(a => a.id).join(',');
  // Simple hash - in production, could use crypto.subtle.digest
  return btoa(structure).substring(0, 16);
}

/**
 * Validate progress integrity to prevent cheating
 *
 * ANTI-CHEAT CHECKS:
 * 1. Current activity cannot exceed completed activities
 * 2. No gaps in completion (can't skip activities)
 * 3. Module version must match (structure hasn't changed)
 */
function validateProgressIntegrity(
  progress: ModuleProgress,
  currentModuleActivities: ActivityState[]
): boolean {
  // Check 1: Module version match
  const currentVersion = generateModuleVersion(currentModuleActivities);
  if (progress.moduleVersion !== currentVersion) {
    console.warn('⚠️ Module version mismatch - structure has changed. Resetting progress.');
    return false;
  }

  // Check 2: Activity count match
  if (progress.activities.length !== currentModuleActivities.length) {
    console.warn('⚠️ Activity count mismatch. Resetting progress.');
    return false;
  }

  // Check 3: No gaps in completion (sequential completion enforced)
  let foundIncomplete = false;
  for (let i = 0; i < progress.activities.length; i++) {
    const activity = progress.activities[i];

    if (foundIncomplete && activity.completed) {
      console.warn(`⚠️ TAMPERING DETECTED: Activity ${activity.id} marked complete but earlier activities incomplete. Resetting progress.`);
      return false;
    }

    if (!activity.completed) {
      foundIncomplete = true;
    }
  }

  // Check 4: Current activity cannot exceed last completed activity
  const lastCompletedIndex = progress.activities.findLastIndex(a => a.completed);
  const maxAllowedIndex = lastCompletedIndex + 1; // Can be on next activity after last completed

  if (progress.currentActivity > maxAllowedIndex) {
    console.warn(`⚠️ TAMPERING DETECTED: Current activity (${progress.currentActivity}) exceeds max allowed (${maxAllowedIndex}). Resetting progress.`);
    return false;
  }

  console.log('✅ Progress integrity validated');
  return true;
}

/**
 * Save module progress to localStorage
 */
export function saveProgress(
  moduleId: string,
  currentActivity: number,
  activities: ActivityState[]
): void {
  const progress: ModuleProgress = {
    currentActivity,
    activities: activities.map(a => ({
      id: a.id,
      title: a.title,
      completed: a.completed
    })),
    lastUpdated: new Date().toISOString(),
    moduleVersion: generateModuleVersion(activities),
    moduleId
  };

  const key = `ai-literacy-module-${moduleId}-progress`;
  localStorage.setItem(key, JSON.stringify(progress));

  console.log(`💾 Progress saved: Activity ${currentActivity + 1}/${activities.length}`);
}

/**
 * Load module progress from localStorage with integrity validation
 *
 * Returns null if:
 * - No saved progress exists
 * - Progress fails integrity checks (tampering detected)
 * - Module structure has changed (version mismatch)
 */
export function loadProgress(
  moduleId: string,
  currentModuleActivities: ActivityState[]
): ModuleProgress | null {
  const key = `ai-literacy-module-${moduleId}-progress`;
  const saved = localStorage.getItem(key);

  if (!saved) {
    console.log('ℹ️ No saved progress found');
    return null;
  }

  try {
    const progress: ModuleProgress = JSON.parse(saved);

    // Validate integrity (anti-cheat)
    if (!validateProgressIntegrity(progress, currentModuleActivities)) {
      // Tampering detected or version mismatch - clear invalid progress
      clearProgress(moduleId);
      return null;
    }

    console.log(`📂 Loaded valid progress: Activity ${progress.currentActivity + 1}/${progress.activities.length}`);
    console.log(`   Last updated: ${new Date(progress.lastUpdated).toLocaleString()}`);

    return progress;

  } catch (error) {
    console.error('❌ Failed to parse saved progress:', error);
    clearProgress(moduleId);
    return null;
  }
}

/**
 * Clear saved progress for a module
 */
export function clearProgress(moduleId: string): void {
  const key = `ai-literacy-module-${moduleId}-progress`;
  localStorage.removeItem(key);
  console.log('🗑️ Progress cleared');
}

/**
 * Check if saved progress exists
 */
export function hasProgress(moduleId: string): boolean {
  const key = `ai-literacy-module-${moduleId}-progress`;
  return localStorage.getItem(key) !== null;
}

/**
 * Get progress summary for display
 */
export function getProgressSummary(moduleId: string): {
  exists: boolean;
  activityIndex?: number;
  activityTitle?: string;
  totalActivities?: number;
  lastUpdated?: string;
} | null {
  const key = `ai-literacy-module-${moduleId}-progress`;
  const saved = localStorage.getItem(key);

  if (!saved) {
    return { exists: false };
  }

  try {
    const progress: ModuleProgress = JSON.parse(saved);
    const currentActivityData = progress.activities[progress.currentActivity];

    return {
      exists: true,
      activityIndex: progress.currentActivity,
      activityTitle: currentActivityData?.title || 'Unknown Activity',
      totalActivities: progress.activities.length,
      lastUpdated: new Date(progress.lastUpdated).toLocaleString()
    };
  } catch (error) {
    console.error('Failed to get progress summary:', error);
    return { exists: false };
  }
}
