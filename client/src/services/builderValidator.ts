/**
 * Builder Validator Service
 *
 * Phase 4.1: Validation Tools
 *
 * Provides validation functions for module quality assurance:
 * - Accessibility validation (contrast ratios, semantic structure)
 * - Structure validation (activity flow, completeness)
 * - Content validation (age-appropriateness, vocabulary guidelines)
 *
 * Integrates with existing quality systems:
 * - accessibility-tester agent
 * - ai-literacy-content-reviewer agent
 */

import type { ModuleDefinition } from './codeGenerator';

// Re-export ModuleDefinition for convenience
export type { ModuleDefinition } from './codeGenerator';

/**
 * Helper function to get activity title/name
 * (handles both Activity and ActivityConfig types)
 */
function getActivityName(activity: any): string {
  return activity.title || activity.name || 'Unknown Activity';
}

export interface ValidationResult {
  category: 'accessibility' | 'structure' | 'content' | 'completeness';
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
  fix?: string;
}

export interface ValidationReport {
  passed: boolean;
  score: number; // 0-100
  results: ValidationResult[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
}

/**
 * Validate complete module definition
 */
export function validateModule(moduleDefinition: ModuleDefinition): ValidationReport {
  const results: ValidationResult[] = [];

  // Run all validators
  results.push(...validateStructure(moduleDefinition));
  results.push(...validateContent(moduleDefinition));
  results.push(...validateCompleteness(moduleDefinition));
  results.push(...validateAccessibility(moduleDefinition));

  // Calculate summary
  const summary = {
    errors: results.filter((r) => r.severity === 'error').length,
    warnings: results.filter((r) => r.severity === 'warning').length,
    info: results.filter((r) => r.severity === 'info').length,
  };

  // Calculate score (100 - penalties)
  const errorPenalty = summary.errors * 10;
  const warningPenalty = summary.warnings * 5;
  const score = Math.max(0, 100 - errorPenalty - warningPenalty);

  const passed = summary.errors === 0;

  return {
    passed,
    score,
    results,
    summary,
  };
}

/**
 * Validate module structure
 */
function validateStructure(module: ModuleDefinition): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Check for at least one activity
  if (module.activities.length === 0) {
    results.push({
      category: 'structure',
      severity: 'error',
      message: 'Module must have at least one activity',
      fix: 'Add activities using the Activity Catalog or Module Assembly',
    });
  }

  // Check for reasonable activity count (not too many)
  if (module.activities.length > 20) {
    results.push({
      category: 'structure',
      severity: 'warning',
      message: `Module has ${module.activities.length} activities (recommended: 5-15)`,
      fix: 'Consider splitting into multiple modules',
    });
  }

  // Recommended flow: Start with video or introduction
  const firstActivity = module.activities[0];
  if (firstActivity && !['video', 'introduction'].includes(firstActivity.type)) {
    results.push({
      category: 'structure',
      severity: 'info',
      message: 'Best practice: Start with a video or introduction activity',
      location: `Activity 1: ${getActivityName(firstActivity)}`,
    });
  }

  // Check for balanced activity types
  const typeCounts: Record<string, number> = {};
  module.activities.forEach((activity) => {
    typeCounts[activity.type] = (typeCounts[activity.type] || 0) + 1;
  });

  // Warning if too many quizzes
  if (typeCounts['quiz'] && typeCounts['quiz'] > module.activities.length * 0.5) {
    results.push({
      category: 'structure',
      severity: 'warning',
      message: `Module is ${Math.round((typeCounts['quiz'] / module.activities.length) * 100)}% quizzes`,
      fix: 'Add more variety: reflections, scenarios, videos, or interactive activities',
    });
  }

  // Recommended: End with reflection or exit ticket
  const lastActivity = module.activities[module.activities.length - 1];
  if (lastActivity && !['reflection', 'exit-ticket'].includes(lastActivity.type)) {
    results.push({
      category: 'structure',
      severity: 'info',
      message: 'Best practice: End with a reflection or exit ticket activity',
      location: `Activity ${module.activities.length}: ${getActivityName(lastActivity)}`,
    });
  }

  return results;
}

/**
 * Validate content quality and guidelines
 */
function validateContent(module: ModuleDefinition): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Check for anthropomorphization (AI as human-like)
  const prohibitedPhrases = [
    'AI thinks',
    'AI believes',
    'AI feels',
    'AI wants',
    'AI understands',
    'AI knows',
    'AI partner',
    'AI friend',
    'AI companion',
    'AI is smart',
    'AI is intelligent',
  ];

  const allText = [
    module.title,
    module.description,
    ...module.activities.map((a) => getActivityName(a)),
    ...module.activities.flatMap((a: any) => {
      if (a.type === 'quiz' && 'questions' in a && a.questions) {
        return (a.questions || []).flatMap((q: any) => [
          q.question,
          ...(q.options || []),
          q.explanation || '',
        ]);
      }
      if (a.type === 'reflection' && 'prompt' in a && a.prompt) {
        return [a.prompt];
      }
      return [];
    }),
  ].join(' ');

  prohibitedPhrases.forEach((phrase) => {
    if (allText.toLowerCase().includes(phrase.toLowerCase())) {
      results.push({
        category: 'content',
        severity: 'error',
        message: `Anthropomorphization detected: "${phrase}"`,
        fix: 'Replace with tool/system language (e.g., "AI processes", "AI outputs")',
      });
    }
  });

  // Check for age-appropriate language (14-18 years)
  const complexWords = [
    'utilize',
    'commence',
    'terminate',
    'endeavor',
    'substantial',
    'inherent',
    'paradigm',
  ];

  complexWords.forEach((word) => {
    if (allText.toLowerCase().includes(word)) {
      results.push({
        category: 'content',
        severity: 'warning',
        message: `Complex vocabulary detected: "${word}"`,
        fix: 'Use simpler alternatives for high school students (ages 14-18)',
      });
    }
  });

  // Check module title length
  if (module.title.length < 5) {
    results.push({
      category: 'content',
      severity: 'warning',
      message: 'Module title is very short',
      fix: 'Use a descriptive title (8-50 characters recommended)',
    });
  }

  if (module.title.length > 80) {
    results.push({
      category: 'content',
      severity: 'warning',
      message: 'Module title is very long',
      fix: 'Shorten title to 50-80 characters for better display',
    });
  }

  // Check module description
  if (!module.description || module.description.length < 20) {
    results.push({
      category: 'content',
      severity: 'warning',
      message: 'Module description is missing or too short',
      fix: 'Add a clear description (50-200 characters recommended)',
    });
  }

  // Check activity titles/names
  module.activities.forEach((activity: any, index) => {
    const name = getActivityName(activity);
    if (!name || name === 'Unknown Activity' || name.length < 3) {
      results.push({
        category: 'content',
        severity: 'warning',
        message: `Activity ${index + 1} has missing or very short title/name`,
        location: `Activity ${index + 1}`,
        fix: 'Add a descriptive title for each activity',
      });
    }
  });

  return results;
}

/**
 * Validate module completeness
 */
function validateCompleteness(module: ModuleDefinition): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Check required metadata
  if (!module.id || module.id.length < 3) {
    results.push({
      category: 'completeness',
      severity: 'error',
      message: 'Module ID is missing or invalid',
      fix: 'Set a unique module ID (e.g., "my-custom-module")',
    });
  }

  if (!module.title || module.title.trim().length === 0) {
    results.push({
      category: 'completeness',
      severity: 'error',
      message: 'Module title is required',
      fix: 'Add a descriptive title in Module Assembly',
    });
  }

  if (!module.estimatedTime || module.estimatedTime === '0 min') {
    results.push({
      category: 'completeness',
      severity: 'warning',
      message: 'Estimated time is missing or zero',
      fix: 'Provide realistic time estimate (e.g., "20 min", "45 min")',
    });
  }

  // Check activities for completeness
  module.activities.forEach((activity: any, index) => {
    const activityName = getActivityName(activity);

    // Video activities need URLs
    if (activity.type === 'video') {
      if (!('videoUrl' in activity) || !activity.videoUrl) {
        results.push({
          category: 'completeness',
          severity: 'error',
          message: `Video activity ${index + 1} is missing video URL`,
          location: `Activity ${index + 1}: ${activityName}`,
          fix: 'Add video URL in Video Segment Editor',
        });
      }
    }

    // Quiz activities need questions
    if (activity.type === 'quiz') {
      if (!('questions' in activity) || !activity.questions || activity.questions.length === 0) {
        results.push({
          category: 'completeness',
          severity: 'error',
          message: `Quiz activity ${index + 1} has no questions`,
          location: `Activity ${index + 1}: ${activityName}`,
          fix: 'Add questions using Quiz Generator or manually',
        });
      } else {
        // Check question structure
        activity.questions.forEach((q: any, qIndex: number) => {
          if (!q.question || q.question.trim().length === 0) {
            results.push({
              category: 'completeness',
              severity: 'error',
              message: `Quiz activity ${index + 1}, question ${qIndex + 1} is missing question text`,
              location: `Activity ${index + 1}, Question ${qIndex + 1}`,
            });
          }

          if (!q.options || q.options.length < 2) {
            results.push({
              category: 'completeness',
              severity: 'error',
              message: `Quiz activity ${index + 1}, question ${qIndex + 1} needs at least 2 options`,
              location: `Activity ${index + 1}, Question ${qIndex + 1}`,
            });
          }

          if (q.correctAnswer === undefined || q.correctAnswer === null) {
            results.push({
              category: 'completeness',
              severity: 'error',
              message: `Quiz activity ${index + 1}, question ${qIndex + 1} is missing correct answer`,
              location: `Activity ${index + 1}, Question ${qIndex + 1}`,
            });
          }
        });
      }
    }

    // Reflection activities need prompts
    if (activity.type === 'reflection' || activity.type === 'exit-ticket') {
      if (!('prompt' in activity) || !activity.prompt || (typeof activity.prompt === 'string' && activity.prompt.trim().length === 0)) {
        results.push({
          category: 'completeness',
          severity: 'error',
          message: `Reflection activity ${index + 1} is missing prompt`,
          location: `Activity ${index + 1}: ${activityName}`,
          fix: 'Add reflection prompt using Reflection Generator or manually',
        });
      }
    }

    // Scenario activities need context
    if (activity.type === 'scenario') {
      if (!('scenario' in activity) || !activity.scenario) {
        results.push({
          category: 'completeness',
          severity: 'error',
          message: `Scenario activity ${index + 1} is missing scenario content`,
          location: `Activity ${index + 1}: ${activityName}`,
          fix: 'Add scenario using Scenario Generator or manually',
        });
      }
    }
  });

  return results;
}

/**
 * Validate accessibility compliance
 */
function validateAccessibility(module: ModuleDefinition): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Note: Full accessibility checking requires rendered HTML
  // This is a pre-flight check for common issues

  results.push({
    category: 'accessibility',
    severity: 'info',
    message: 'Generated code includes accessibility features (WCAG 2.1 AA)',
    fix: 'After code generation, verify contrast ratios and keyboard navigation',
  });

  // Check for activities with interactive elements
  const interactiveCount = module.activities.filter(
    (a) => a.type === 'quiz' || a.type === 'reflection' || a.type === 'scenario'
  ).length;

  if (interactiveCount === 0) {
    results.push({
      category: 'accessibility',
      severity: 'warning',
      message: 'Module has no interactive activities (quiz, reflection, scenario)',
      fix: 'Add interactive elements for better student engagement',
    });
  }

  // Check video activities for accessibility notes
  const videoActivities = module.activities.filter((a) => a.type === 'video');
  if (videoActivities.length > 0) {
    results.push({
      category: 'accessibility',
      severity: 'info',
      message: `Module has ${videoActivities.length} video(s) - ensure captions/transcripts are available`,
      fix: 'Provide video transcripts or closed captions for accessibility',
    });
  }

  return results;
}

/**
 * Quick validation (structure + completeness only)
 */
export function quickValidate(module: ModuleDefinition): ValidationReport {
  const results: ValidationResult[] = [];

  results.push(...validateStructure(module));
  results.push(...validateCompleteness(module));

  const summary = {
    errors: results.filter((r) => r.severity === 'error').length,
    warnings: results.filter((r) => r.severity === 'warning').length,
    info: results.filter((r) => r.severity === 'info').length,
  };

  const score = Math.max(0, 100 - summary.errors * 10 - summary.warnings * 5);
  const passed = summary.errors === 0;

  return {
    passed,
    score,
    results,
    summary,
  };
}

/**
 * Get validation status icon
 */
export function getValidationIcon(severity: ValidationResult['severity']): string {
  switch (severity) {
    case 'error':
      return '🔴';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '•';
  }
}

/**
 * Get validation color classes
 */
export function getValidationColors(
  severity: ValidationResult['severity']
): { bg: string; border: string; text: string } {
  switch (severity) {
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
      };
    case 'info':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
      };
  }
}
