import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * BuilderTips - Contextual help and tips component
 *
 * Phase 4.2 Enhancement
 *
 * Provides helpful guidance throughout the builder experience.
 * Different tips for each tab to guide users through the workflow.
 */

interface BuilderTipsProps {
  context: 'video-editor' | 'activity-catalog' | 'module-assembly' | 'preview' | 'quiz-generator' | 'reflection-generator' | 'scenario-generator' | 'code-exporter';
}

const tips = {
  'video-editor': {
    icon: Lightbulb,
    color: 'blue',
    title: '💡 Video Editor Tips',
    items: [
      'Start by adding your video URL (Firebase Storage paths like "Videos/..." or YouTube URLs)',
      'Define time-coded segments to break long videos into digestible chunks',
      'Placeholder: Transcript extraction APIs (YouTube Data API, Speech-to-Text) documented for future implementation',
      'For now, manually paste transcripts - they\'re crucial for AI content generation',
      'Export your video definitions as JSON to use in Module Assembly',
    ],
  },
  'activity-catalog': {
    icon: Info,
    color: 'purple',
    title: '📚 Activity Catalog Guide',
    items: [
      'Browse 50+ pre-built activities from existing modules',
      'Use the search bar to find specific activity types (quiz, reflection, video, etc.)',
      'Filter by category: Videos, Quizzes, Reflections, Interactive, Scenarios',
      'Check "Reusability" ratings: High = easily adaptable, Low = module-specific',
      'Click any activity to see code examples and visual descriptions',
      'Copy patterns to implement in your custom activities',
    ],
  },
  'module-assembly': {
    icon: CheckCircle,
    color: 'green',
    title: '✅ Assembly Best Practices',
    items: [
      'Start with module metadata: title, description, target audience, estimated time',
      'Add activities in the order students will experience them',
      'Use ↑/↓ arrows to reorder activities as needed',
      'Always include a video activity first to introduce the topic',
      'Add comprehension checks (quizzes) after major concepts',
      'End with reflection or exit ticket for consolidation',
      'Export JSON frequently to save your work',
      'Import JSON to resume work or share with others',
    ],
  },
  'preview': {
    icon: Info,
    color: 'blue',
    title: '👁️ Preview Mode Tips',
    items: [
      'Test the student experience before generating code',
      'Use device preview modes (Desktop/Tablet/Mobile) to check responsiveness',
      'Navigate through activities using Previous/Next buttons',
      'Timeline on the left shows progress and allows quick navigation',
      'Complete activities to test the full flow',
      'Note: This is a simulation - actual activities need implementation',
    ],
  },
  'quiz-generator': {
    icon: Lightbulb,
    color: 'purple',
    title: '🎯 Quiz Generator Pro Tips',
    items: [
      'Paste the video transcript for best results - AI analyzes content',
      'Start with 3-5 questions per video segment',
      'Medium difficulty works best for high school students',
      'Use focus topics to target specific concepts (e.g., "bias, privacy")',
      'Review AI-generated questions carefully - edit as needed',
      'Ensure explanations teach, not just reveal answers',
      'Good distractors are plausible but clearly incorrect',
      'Export as JSON or copy questions to Module Assembly',
    ],
  },
  'reflection-generator': {
    icon: Lightbulb,
    color: 'purple',
    title: '💭 Reflection Prompt Tips',
    items: [
      'Personal: Connect to student\'s life experiences',
      'Critical: Analyze concepts and implications',
      'Application: Apply to real-world situations',
      'Mixed: Variety of prompt types for depth',
      'Longer transcripts = more contextual prompts',
      'AI enforces project guidelines (no anthropomorphization)',
      'Set minimum word count (100-150 recommended)',
      'Add guiding questions to scaffold thinking',
    ],
  },
  'scenario-generator': {
    icon: Lightbulb,
    color: 'purple',
    title: '⚖️ Scenario Generator Tips',
    items: [
      'Choose ethical framework: General, Technology, or Catholic Social Teaching',
      'Start with 1-2 scenarios - they\'re detailed and take time to complete',
      'Best scenarios have genuine dilemmas (no easy right answer)',
      'Multiple stakeholders create rich discussion opportunities',
      'Guiding questions help students analyze systematically',
      'Review context for accuracy and age-appropriateness',
      'Ethical principles should map to the chosen framework',
    ],
  },
  'code-exporter': {
    icon: CheckCircle,
    color: 'green',
    title: '🚀 Code Export Guide',
    items: [
      'Generate code only after module assembly is complete',
      'Review the generated code before downloading',
      'Copy to clipboard for quick access or download as .tsx file',
      'Follow the 4-step installation instructions carefully',
      'Manual steps required: video URLs, interactive components, testing',
      'Generated code includes: Dev Mode, Progress Persistence, AI Validation',
      'Test TypeScript compilation: npx tsc --noEmit',
      'Verify all 9 existing modules still work after installation',
    ],
  },
};

export default function BuilderTips({ context }: BuilderTipsProps) {
  const tip = tips[context];
  const Icon = tip.icon;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      text: 'text-blue-800',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      title: 'text-purple-900',
      text: 'text-purple-800',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      text: 'text-green-800',
    },
  };

  const colors = colorClasses[tip.color as keyof typeof colorClasses];

  return (
    <Card className={`${colors.bg} ${colors.border} mb-6`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h3 className={`text-sm font-semibold ${colors.title} mb-2`}>
              {tip.title}
            </h3>
            <ul className={`text-xs ${colors.text} space-y-1.5`}>
              {tip.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
