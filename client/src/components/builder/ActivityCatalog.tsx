import React, { useState } from 'react';
import { Search, X, Copy, Eye, Filter, Check, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * ActivityCatalog - Browse and select reusable activity components
 *
 * Phase 1.3 of Module Builder
 *
 * Data source: MODULE_ACTIVITY_INVENTORY.md
 * Features:
 * - 7 categories of activities (Videos, Quizzes, Reflections, Interactive, Scenarios, Exit Tickets, Certificates)
 * - Search/filter functionality
 * - Visual descriptions of what students see
 * - Code examples with copy functionality
 * - Reusability ratings
 * - Usage statistics from existing modules
 */

interface Activity {
  name: string;
  location: string;
  description: string;
  visualDescription: string;
  usedIn: string[];
  reusability: 'high' | 'medium' | 'low';
  example?: string;
  props?: string[];
  category: string;
}

// Comprehensive activity catalog from MODULE_ACTIVITY_INVENTORY.md
const ACTIVITY_CATALOG: Record<string, Activity[]> = {
  'Videos': [
    {
      name: 'PremiumVideoPlayer',
      location: 'client/src/components/WhatIsAIModule/PremiumVideoPlayer.tsx',
      description: 'Segmented video player with time-coded chapters, progress tracking, and completion detection.',
      visualDescription: '🎥 Professional video player with chapter navigation on the left (clickable segment list with timestamps). Main video area in center with standard controls (play/pause, volume, fullscreen). Progress bar shows watched segments in green. Students must watch all mandatory segments before proceeding.',
      usedIn: ['What Is AI', 'AI Environmental Impact', 'Introduction to Prompting'],
      reusability: 'high',
      category: 'Videos',
      props: ['videoUrl', 'videoId', 'segments', 'onAllSegmentsComplete'],
      example: `<PremiumVideoPlayer
  videoUrl="Videos/Student Videos/Topic/video.mp4"
  videoId="unique-id"
  segments={[
    {
      id: 'intro',
      title: 'Introduction',
      start: 0,
      end: 45.5,
      source: 'Videos/...',
      description: 'Overview of key concepts',
      mandatory: true
    }
  ]}
  onAllSegmentsComplete={() => setVideoComplete(true)}
/>`
    }
  ],
  'Quizzes': [
    {
      name: 'Multiple Choice Quiz',
      location: 'client/src/components/ResponsibleEthicalAIModule/activities/IntroductionToAI.tsx',
      description: 'Quiz with educational hints that guide students without revealing correct answers.',
      visualDescription: '📝 Clean quiz card with question text at top (large, bold font). Four radio button options below as clickable cards with hover effects (light blue on hover). After selecting and clicking "Check Answer": GREEN border + checkmark icon for CORRECT answer with explanation text. YELLOW border + lightbulb icon for WRONG answer with educational hint (never reveals correct answer). Submit button becomes "Next Question" after answer.',
      usedIn: ['Responsible & Ethical AI', 'Understanding LLMs', 'Privacy & Data Rights'],
      reusability: 'high',
      category: 'Quizzes',
      props: ['question', 'options', 'correctAnswer', 'explanation', 'hint'],
      example: `const quiz = {
  question: "What is the primary purpose of...",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 1, // Index 1 = Option B
  explanation: "Correct! This is because...",
  hint: "Think about the relationship between..."
};`
    }
  ],
  'Reflections': [
    {
      name: 'AI-Validated Reflection',
      location: 'client/src/components/WhatIsAIModule/VideoReflectionActivity.tsx',
      description: 'Text area for student reflections with 2-layer AI validation (pre-filter + Gemini) and 2-attempt escape hatch.',
      visualDescription: '💭 Large text area (8-10 rows) with character counter at bottom right. Placeholder text guides students: "Share your thoughts about..." Submit button below. After submit: YELLOW box appears with AI feedback (constructive guidance). If rejected: "Try One More Time" button clears form. After 2 failed attempts: ORANGE warning box appears with TWO options: "Try One More Time" or "Continue Anyway" (with instructor review warning). GREEN success shows checkmark + praise + "Continue" button.',
      usedIn: ['What Is AI', 'Understanding LLMs', 'Intro to Gen AI', 'AI Environmental Impact'],
      reusability: 'high',
      category: 'Reflections',
      props: ['question', 'minResponseLength', 'onComplete'],
      example: `import { generateEducationFeedback, isNonsensical } from '@/utils/aiEducationFeedback';

const [attemptCount, setAttemptCount] = useState(0);
const [showEscapeHatch, setShowEscapeHatch] = useState(false);
const MAX_ATTEMPTS = 2;

// Layer 1: Pre-filter
const isInvalid = isNonsensical(response);

// Layer 2: AI validation
const feedback = await generateEducationFeedback(response, question);

// Check for rejection
const needsRetry = isInvalid || feedback.toLowerCase().includes('does not address');

if (needsRetry && attemptCount + 1 >= MAX_ATTEMPTS) {
  setShowEscapeHatch(true);
}`
    }
  ],
  'Interactive': [
    {
      name: 'Environmental Calculator',
      location: 'client/src/components/modules/AIEnvironmentalImpactModule.tsx',
      description: 'Interactive calculator with sliders for AI model usage, showing real-time carbon footprint.',
      visualDescription: '⚡ Interactive calculator with sliders for different AI models (ChatGPT, Gemini, etc.). Move sliders to set daily query counts. Real-time carbon footprint display in grams CO2e updates as you slide. Visual comparisons show equivalents: "Like driving X miles" or "Takes X trees to offset". Results displayed in purple gradient card with tree/car icons.',
      usedIn: ['AI Environmental Impact'],
      reusability: 'medium',
      category: 'Interactive',
      props: ['onCalculationComplete'],
      example: `const [chatGPTQueries, setChatGPTQueries] = useState(0);
const [geminiQueries, setGeminiQueries] = useState(0);

// Calculate total CO2e
const totalCO2e = (
  chatGPTQueries * 4.32 +
  geminiQueries * 2.9
).toFixed(2);

// Visual comparisons
const milesEquivalent = (totalCO2e / 404 * 1000).toFixed(1);
const treesNeeded = (totalCO2e / 21.77).toFixed(1);`
    },
    {
      name: 'Impact Matrix',
      location: 'client/src/components/modules/AIEnvironmentalImpactModule.tsx',
      description: 'Drag-and-drop matrix for categorizing environmental impacts by severity and likelihood.',
      visualDescription: '📊 4-quadrant grid (2x2) with labels: High/Low Severity (vertical) and High/Low Likelihood (horizontal). Draggable cards with environmental impacts (e.g., "Water depletion", "E-waste"). Drag cards into appropriate quadrants. Cards snap into place with subtle animation. Color-coded quadrants: Red (High/High - Critical), Orange (High/Low or Low/High - Monitor), Yellow (Low/Low - Minor). Submit button validates placement.',
      usedIn: ['AI Environmental Impact'],
      reusability: 'medium',
      category: 'Interactive',
      props: ['items', 'onComplete'],
      example: `// Using @dnd-kit/core for drag-and-drop
import { DndContext, closestCenter } from '@dnd-kit/core';

const items = [
  { id: 'water', text: 'Water depletion from data centers', correctQuadrant: 'high-severity-high-likelihood' },
  { id: 'ewaste', text: 'Electronic waste from hardware', correctQuadrant: 'high-severity-low-likelihood' }
];`
    }
  ],
  'Scenarios': [
    {
      name: 'Ethical Dilemma Scenarios',
      location: 'client/src/components/modules/AncientCompassModule/activities/EthicalDilemmaScenarios.tsx',
      description: 'Present real-world ethical scenarios with AI-validated student responses.',
      visualDescription: '⚖️ Card-based layout with scenario title at top in bold. Story/context in gray box (2-3 paragraphs). Below: "Your Response" section with large text area. Guiding questions in bullet points above text area. After submitting: AI feedback appears in colored box (GREEN for good analysis, YELLOW for needs improvement). Option to revise or continue. 2-attempt escape hatch included.',
      usedIn: ['Ancient Compass AI Ethics'],
      reusability: 'high',
      category: 'Scenarios',
      props: ['scenario', 'guidingQuestions', 'onComplete'],
      example: `const scenario = {
  title: "AI Hiring Algorithm Bias",
  context: "A company uses an AI system to screen job applications...",
  guidingQuestions: [
    "What ethical principles are at stake?",
    "Who could be harmed by this decision?",
    "What alternative approaches exist?"
  ]
};`
    },
    {
      name: 'Stakeholder Perspectives',
      location: 'client/src/components/modules/AncientCompassModule/activities/StakeholderPerspectives.tsx',
      description: 'Multiple perspective cards where students analyze different viewpoints.',
      visualDescription: '👥 Grid of stakeholder cards (2-3 columns). Each card shows: stakeholder icon + name (e.g., "Student", "Teacher", "Parent"). Click card to expand: shows their perspective/concerns in italic quote. Below: reflection question specific to that stakeholder. Text area for student response. Cards have different colored borders (blue for students, green for teachers, purple for parents). Submit validates all stakeholder reflections.',
      usedIn: ['Ancient Compass AI Ethics'],
      reusability: 'medium',
      category: 'Scenarios',
      props: ['stakeholders', 'onAllComplete'],
      example: `const stakeholders = [
  {
    name: 'Student',
    icon: '🎓',
    perspective: 'I worry about AI making decisions about my future...',
    question: 'How would you address the student\\'s concerns?',
    color: 'blue'
  }
];`
    }
  ],
  'Exit Tickets': [
    {
      name: 'Exit Ticket with Choices',
      location: 'client/src/components/modules/IntroToGenAIModule.tsx',
      description: 'End-of-module reflection with multiple prompt choices and AI validation.',
      visualDescription: '🎫 Choice interface at top: 2-3 prompt cards displayed horizontally (like game show panels). Each card has: Title (e.g., "Personal Application", "Critical Analysis"), Icon, and Preview text. Click to select (card highlights in blue). Below selected card: large text area appears (8 rows) with full prompt question. Character counter (minimum 100 chars). Submit triggers AI validation. 2-attempt escape hatch for validation failures. Success shows green checkmark + certificate option.',
      usedIn: ['Intro to Gen AI', 'AI Environmental Impact'],
      reusability: 'high',
      category: 'Exit Tickets',
      props: ['prompts', 'minLength', 'onComplete'],
      example: `const exitTicketPrompts = [
  {
    id: 'personal',
    title: 'Personal Application',
    icon: '🎯',
    preview: 'How will you apply what you learned?',
    fullPrompt: 'Reflect on one specific way you plan to apply...'
  },
  {
    id: 'critical',
    title: 'Critical Analysis',
    icon: '🔍',
    preview: 'What questions do you still have?',
    fullPrompt: 'What aspect of this topic requires further exploration...'
  }
];`
    }
  ],
  'Certificates': [
    {
      name: 'Module Certificate',
      location: 'client/src/components/WhatIsAIModule/Certificate.tsx',
      description: 'Printable/downloadable certificate of completion with student name and date.',
      visualDescription: '🏆 Professional certificate with decorative border (purple/blue gradient). Center: "Certificate of Completion" in elegant serif font. Student name in large script font. Module title below name. Completion date at bottom. Two buttons: "Download PDF" (purple, primary) and "Start Next Module" (white, secondary). Certificate includes subtle watermark/logo. Optimized for 8.5x11" printing.',
      usedIn: ['All 9 modules'],
      reusability: 'high',
      category: 'Certificates',
      props: ['userName', 'moduleName', 'completionDate', 'onDownload', 'onNext'],
      example: `<Certificate
  userName="Jane Smith"
  moduleName="Introduction to AI Ethics"
  completionDate={new Date()}
  onDownload={() => {
    // Generate PDF or trigger print dialog
    window.print();
    clearProgress(MODULE_ID);
  }}
  onNext={() => navigate('/next-module')}
/>`
    }
  ]
};

export default function ActivityCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [copiedExample, setCopiedExample] = useState(false);

  const categories = ['All', ...Object.keys(ACTIVITY_CATALOG)];

  const filterActivities = (): Activity[] => {
    let allActivities: Activity[] = [];

    // Get activities from selected category or all categories
    if (selectedCategory === 'All') {
      Object.values(ACTIVITY_CATALOG).forEach((categoryActivities) => {
        allActivities = [...allActivities, ...categoryActivities];
      });
    } else {
      allActivities = ACTIVITY_CATALOG[selectedCategory] || [];
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allActivities = allActivities.filter(
        (activity) =>
          activity.name.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.visualDescription.toLowerCase().includes(query) ||
          activity.category.toLowerCase().includes(query)
      );
    }

    return allActivities;
  };

  const copyExample = (example: string) => {
    navigator.clipboard.writeText(example);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const getReusabilityColor = (reusability: string) => {
    switch (reusability) {
      case 'high':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredActivities = filterActivities();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Activity Catalog</h2>
        <p className="text-sm text-gray-600 mt-1">
          Browse {Object.values(ACTIVITY_CATALOG).flat().length} reusable activities from existing modules
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredActivities.length} activities
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
        </CardContent>
      </Card>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((activity, index) => (
          <Card
            key={`${activity.name}-${index}`}
            className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-purple-500"
            onClick={() => setSelectedActivity(activity)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{activity.name}</CardTitle>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded border ${getReusabilityColor(
                    activity.reusability
                  )}`}
                >
                  {activity.reusability === 'high' && <Star className="w-3 h-3 inline mr-1" />}
                  {activity.reusability.toUpperCase()}
                </span>
              </div>
              <CardDescription className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-2">
                {activity.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">{activity.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold">Used in:</span>
                <span>{activity.usedIn.length} modules</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-sm text-gray-600 max-w-md">
              Try adjusting your search query or filter to find activities
            </p>
          </CardContent>
        </Card>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedActivity.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedActivity.category}</p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700">{selectedActivity.description}</p>
              </div>

              {/* Visual Description */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-purple-900">What Students See:</h3>
                </div>
                <p className="text-sm text-purple-900 leading-relaxed">
                  {selectedActivity.visualDescription}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Reusability</h3>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded border ${getReusabilityColor(
                      selectedActivity.reusability
                    )}`}
                  >
                    {selectedActivity.reusability.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Used In</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedActivity.usedIn.map((module) => (
                      <span
                        key={module}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* File Location */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">File Location</h3>
                <code className="block px-3 py-2 bg-gray-100 text-gray-800 text-xs rounded font-mono">
                  {selectedActivity.location}
                </code>
              </div>

              {/* Props */}
              {selectedActivity.props && selectedActivity.props.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Props</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.props.map((prop) => (
                      <code
                        key={prop}
                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded font-mono"
                      >
                        {prop}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Example */}
              {selectedActivity.example && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Code Example</h3>
                    <Button
                      onClick={() => copyExample(selectedActivity.example!)}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      {copiedExample ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="px-4 py-3 bg-gray-900 text-gray-100 text-xs rounded overflow-x-auto">
                    <code>{selectedActivity.example}</code>
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled
                  title="Coming in Phase 1.4 - Module Assembly"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Add to Module
                  <span className="ml-2 text-xs">(Phase 1.4)</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedActivity(null)}
                  className="text-gray-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
