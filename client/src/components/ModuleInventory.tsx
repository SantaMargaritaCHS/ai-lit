import React, { useState } from 'react';
import { X, Copy, Check, Search, ChevronDown, ChevronRight, FileCode, BookOpen, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModuleInventoryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Activity {
  name: string;
  location: string;
  description: string;
  visualDescription: string;  // What the activity looks like to students
  usedIn: string[];
  reusability: 'high' | 'medium' | 'low';
  example?: string;
  screenshot?: string;  // Optional screenshot path
}

const ACTIVITY_CATALOG: Record<string, Activity[]> = {
  'Videos': [
    {
      name: 'PremiumVideoPlayer',
      location: 'client/src/components/PremiumVideoPlayer.tsx',
      description: 'Segmented video playback with mandatory viewing, time-coded chapters',
      visualDescription: '📺 Video player with chapter navigation sidebar on the right. Shows current segment title, progress bar, play/pause controls, and volume slider. Auto-advances to next activity when segment ends. Cannot skip ahead (unless dev mode active). Clean, modern interface with optional closed captions.',
      usedIn: ['All 9 modules'],
      reusability: 'high',
      example: `<PremiumVideoPlayer
  videoUrl="Videos/Student Videos/Topic/video.mp4"
  segments={[{
    id: 'segment-1',
    title: 'Introduction',
    start: 0,
    end: 45,
    mandatory: true
  }]}
  videoId="unique-id"
  onSegmentComplete={(id) => handleComplete()}
  allowSeeking={isDevModeActive}
  enableSubtitles={true}
/>`
    }
  ],
  'Quizzes': [
    {
      name: 'Multiple Choice Quiz',
      location: 'Inline pattern (see Ancient Compass lines 1000-1165)',
      description: 'Radio button selection with hints for wrong answers, never reveals correct answer',
      visualDescription: '📝 Clean quiz card with question text at top (large, bold font). Four radio button options below as clickable cards with hover effects (light blue on hover). After selecting and clicking "Check Answer": GREEN border + checkmark icon for CORRECT answer with explanation text. YELLOW border + lightbulb icon for WRONG answer with educational hint (never reveals correct answer). "Try Again" button for wrong answers, "Continue" button for correct.',
      usedIn: ['Ancient Compass', 'Intro to Gen AI', 'Understanding LLMs'],
      reusability: 'high',
      example: `const QUIZ_QUESTIONS = [{
  question: "What is AI?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correctAnswer: 1,
  explanation: "Shown when correct",
  hint: "Hint for wrong answer (never reveals correct)"
}];`
    },
    {
      name: 'Matching Activity',
      location: 'Inline pattern (see Ancient Compass lines 582-829)',
      description: 'Match items from left column to options on right',
      visualDescription: '🔗 Left column shows scenario cards (gray backgrounds). Right side has colorful pill-shaped buttons for each principle/category. Click a pill to select it for that row - selected pills highlight in BLUE with white text. After submitting: GREEN checkmarks appear next to correct matches. ORANGE hints appear for incorrect matches (never shows correct answer). All scenarios must be matched before submitting.',
      usedIn: ['Ancient Compass'],
      reusability: 'high',
      example: `const [matching, setMatching] = useState<Record<number, string>>({});
// Match items to principles/categories`
    }
  ],
  'Reflections': [
    {
      name: 'AI-Validated Reflection',
      location: 'Uses client/src/utils/aiEducationFeedback.ts',
      description: 'Open-ended responses with Gemini AI validation + 2-attempt escape hatch',
      visualDescription: '✍️ Large text area with question prompt at top. Character/word count display. Submit button triggers AI validation. GREEN feedback box appears for good responses with encouraging message + Continue button. YELLOW feedback box for responses needing improvement with specific guidance + "Try Again" button. After 2 failed attempts: ORANGE escape hatch box appears with 2 options: "Try One More Time" or "Continue Anyway" (warns may be flagged for instructor review).',
      usedIn: ['Understanding LLMs', 'What Is AI', 'Intro to Gen AI', 'AI Environmental Impact', 'Ancient Compass'],
      reusability: 'high',
      example: `import { isNonsensical, generateEducationFeedback } from '@/utils/aiEducationFeedback';

const handleSubmit = async () => {
  const isInvalid = isNonsensical(response);
  const feedback = await generateEducationFeedback(response, question);
  // ... handle retry logic + 2-attempt escape hatch
};`
    }
  ],
  'Interactive': [
    {
      name: 'Environmental Calculator',
      location: 'client/src/components/EnvironmentalModule/EnvironmentalCalculator.tsx',
      description: 'Calculate carbon footprint of AI queries with visual feedback',
      visualDescription: '⚡ Interactive calculator with sliders for different AI models (ChatGPT, Gemini, etc.). Move sliders to set daily query counts. Real-time carbon footprint display in grams CO2e updates as you slide. Visual comparisons show equivalents: "Like driving X miles" or "Takes X trees to offset". Colorful gradient background changes based on total impact. Educational stats sidebar explains AI energy consumption.',
      usedIn: ['AI Environmental Impact'],
      reusability: 'medium',
      example: `<EnvironmentalCalculator onComplete={() => next()} />`
    },
    {
      name: 'Environmental Impact Matrix',
      location: 'client/src/components/EnvironmentalModule/EnvironmentalImpactMatrix.tsx',
      description: 'Drag-and-drop 2x2 matrix for categorizing AI applications',
      visualDescription: '📊 2x2 grid with colored quadrants: High Impact/High Benefit (top-right, green), High Impact/Low Benefit (top-left, red), Low Impact/High Benefit (bottom-right, blue), Low Impact/Low Benefit (bottom-left, gray). Draggable cards with AI application names (e.g., "Medical Diagnosis AI", "Streaming Recommendations"). Drag cards into appropriate quadrant. Visual feedback when hovering over drop zones. Summary shows count in each quadrant.',
      usedIn: ['AI Environmental Impact'],
      reusability: 'medium',
      example: `<EnvironmentalImpactMatrix onComplete={() => next()} />`
    },
    {
      name: 'Solutions Sorter',
      location: 'client/src/components/EnvironmentalModule/SimplifiedSolutionsSorter.tsx',
      description: 'Sort items into categories with visual feedback',
      visualDescription: '🗂️ Two-column layout: "Personal Actions" (left, blue header) and "Industry/Policy Changes" (right, purple header). Draggable solution cards start in neutral area at top (gray). Drag cards into appropriate column. Cards snap into place with animation. Check marks appear when correctly sorted. Can rearrange by dragging between columns. Progress bar shows completion percentage.',
      usedIn: ['AI Environmental Impact'],
      reusability: 'medium',
      example: `<SimplifiedSolutionsSorter onComplete={() => next()} />`
    },
    {
      name: 'Tokenization Demo',
      location: 'client/src/components/UnderstandingLLMModule/activities/TokenizationDemo.tsx',
      description: 'Live text → token breakdown with color-coding',
      visualDescription: '🎨 Text input box at top where students type sentences. Below, live visualization shows text broken into tokens with each token in a colored pill/badge (rotating rainbow colors). Token count display updates in real-time. Example sentences provided as buttons to quick-test. Shows how words split differently (e.g., "running" → "run" + "ning"). Educational notes explain tokenization.',
      usedIn: ['Understanding LLMs'],
      reusability: 'medium',
      example: `<TokenizationDemo onComplete={() => next()} />`
    },
    {
      name: 'Beat the Predictor Game',
      location: 'client/src/components/UnderstandingLLMModule/activities/BeatThePredictorGame.tsx',
      description: 'Interactive word prediction game (student vs AI)',
      visualDescription: '🎮 Game-style interface showing incomplete sentence at top. Two prediction boxes side-by-side: "Your Prediction" (input field) and "AI Prediction" (revealed after submitting). Score tracker shows "You: X | AI: X". After submitting: reveals AI prediction + explanation of why AI chose it. Green highlight if you matched AI, neutral if different. Multiple rounds build cumulative score. Leaderboard-style final score display.',
      usedIn: ['Understanding LLMs'],
      reusability: 'medium',
      example: `<BeatThePredictorGame onComplete={() => next()} />`
    },
    {
      name: 'Policy Comparison Table',
      location: 'client/src/components/PrivacyModule/PolicyComparisonTable.tsx',
      description: 'Side-by-side comparison of privacy policies across platforms',
      visualDescription: '📋 Multi-column table with platform logos at top (ChatGPT, Gemini, Claude, etc.). Rows compare: Data Collection, Data Retention, Third-Party Sharing, User Rights, Account Deletion. Each cell has colored icons: ✓ (green) for user-friendly, ⚠️ (orange) for concerning, ✗ (red) for problematic. Expandable rows show detailed explanations. Sticky header for scrolling. Summary highlights at bottom.',
      usedIn: ['Privacy & Data Rights'],
      reusability: 'medium',
      example: `<PolicyComparisonTable onComplete={() => next()} />`
    },
    {
      name: 'TC Timer Challenge',
      location: 'client/src/components/PrivacyModule/TCTimerChallenge.tsx',
      description: 'Timed challenge to read Terms & Conditions',
      visualDescription: '⏱️ Split screen: Left side shows real Terms & Conditions text in scrollable box (small font, legal jargon). Right side has LARGE timer counting up (minutes:seconds). "Start Reading" button begins timer. Stats below timer: "Average T&C length: 15,000 words", "Average reading time: 45 minutes". As timer climbs, color changes yellow → orange → red. Humorous reveal at end: "Ain\'t nobody got time for that!" with cartoon image. Educational message about importance of understanding AI terms.',
      usedIn: ['Privacy & Data Rights'],
      reusability: 'medium',
      example: `<TCTimerChallenge onComplete={() => next()} />`
    }
  ],
  'Scenarios': [
    {
      name: 'Ethical Dilemma Scenarios',
      location: 'client/src/components/AncientCompassModule/EthicalDilemmaScenarios.tsx',
      description: 'Present ethical scenarios with AI-validated responses',
      visualDescription: '⚖️ Card-based interface: Scenario title at top (e.g., "Facial Recognition at School"). Story/situation text in narrative format (2-3 paragraphs). Purple badges showing relevant ethical principles (e.g., "Human Dignity", "Common Good"). Question prompt: "What would you do and why?" Large text area for response. AI validation provides feedback on ethical reasoning (not right/wrong, but depth of analysis). 2-attempt escape hatch if needed.',
      usedIn: ['Ancient Compass'],
      reusability: 'medium',
      example: `<EthicalDilemmaScenarios onComplete={() => next()} />`
    },
    {
      name: 'Stakeholder Perspectives',
      location: 'client/src/components/AncientCompassModule/StakeholderPerspectives.tsx',
      description: 'Analyze issues from multiple stakeholder viewpoints',
      visualDescription: '👥 Scenario card shows AI issue at top (e.g., "AI in Gig Economy"). Four stakeholder icons/avatars: Workers, Companies, Regulators, Consumers. Two reflection questions below with text areas. Question 1: "Whose interests conflict?" Question 2: "How might Catholic Social Teaching principles guide solutions?" Responses get AI validation for systems thinking and empathy. Each question has its own 2-attempt escape hatch.',
      usedIn: ['Ancient Compass'],
      reusability: 'medium',
      example: `<StakeholderPerspectives onComplete={() => next()} />`
    },
    {
      name: 'Revolution Comparison Chart',
      location: 'client/src/components/AncientCompassModule/RevolutionComparisonChart.tsx',
      description: 'Compare Industrial Revolution to AI Revolution',
      visualDescription: '🏭 Two-column comparison table. Left column: "Industrial Revolution" (brown header with factory icon). Right column: "AI Revolution" (blue header with robot icon). Rows to fill in: Workers Affected, Ethical Concerns, Pace of Change, Environmental Impact. Text inputs in each cell. Visual timeline graphics at top show 1760-1840 vs 2010-present. After filling chart, reflection question at bottom with AI validation and escape hatch.',
      usedIn: ['Ancient Compass'],
      reusability: 'medium',
      example: `<RevolutionComparisonChart onComplete={() => next()} />`
    },
    {
      name: 'Personal AI Audit',
      location: 'client/src/components/AncientCompassModule/PersonalAIAudit.tsx',
      description: 'Students audit their own AI tool usage',
      visualDescription: '🔍 Three-step personal audit interface. Step 1: "List Your AI Tools" - Add button creates new entry fields (tool name, frequency of use). Step 2: "Evaluate Each Tool" - For each tool, rate against ethical principles using 1-5 star system (Human Dignity, Common Good, Solidarity). Color codes: Red (1-2 stars) = concerning, Yellow (3 stars) = neutral, Green (4-5 stars) = aligned. Step 3: "Commit to Change" - Checkbox list of commitments with "Sign Your Name" input. Certificate-style completion.',
      usedIn: ['Ancient Compass'],
      reusability: 'medium',
      example: `<PersonalAIAudit onComplete={() => next()} />`
    }
  ],
  'Exit Tickets': [
    {
      name: 'Exit Ticket Pattern',
      location: 'Inline in modules (see Ancient Compass lines 1168-1418)',
      description: 'Module-ending reflection with 2-3 prompt options, AI validation, escape hatch',
      visualDescription: '🎫 Choice interface at top: 2-3 prompt cards displayed horizontally (like game show panels). Each card has: Title (e.g., "Personal Application", "Critical Analysis"), Icon, and Preview text. Click to select (card highlights in blue). Selected prompt expands below with full question. Large text area for response. AI validation provides personalized feedback on reflection depth. 2-attempt escape hatch if needed. Minimum word count displayed (typically 50-150 words).',
      usedIn: ['All 9 modules'],
      reusability: 'high',
      example: `const EXIT_PROMPTS = [
  { title: 'Personal', prompt: "How will you apply..." },
  { title: 'Critical', prompt: "Analyze the challenge..." },
  { title: 'Future', prompt: "Your role in shaping..." }
];
// AI validation with 2-attempt escape hatch`
    }
  ],
  'Certificates': [
    {
      name: 'Certificate Component',
      location: 'client/src/components/Certificate.tsx',
      description: 'Completion certificate with download functionality',
      visualDescription: '🏆 Formal certificate design with decorative border. Top: "Certificate of Completion" in elegant serif font. Center: Student name in large text. Below: Module title, completion date, score (if applicable). Bottom: Instructor signature line with "AI Literacy Platform" title. Blue and gold color scheme. "Download Certificate" button at bottom (downloads as image). Confetti animation plays on first appearance.',
      usedIn: ['All 9 modules'],
      reusability: 'high',
      example: `<Certificate
  userName={userName}
  courseName="Module Name"
  completionDate={new Date().toLocaleDateString()}
  score={100}
  instructor="AI Literacy Platform"
  onDownload={() => clearProgress(MODULE_ID)}
/>`
    }
  ]
};

export function ModuleInventory({ isOpen, onClose }: ModuleInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Videos');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const filteredCategories = Object.entries(ACTIVITY_CATALOG).reduce((acc, [category, activities]) => {
    const filtered = activities.filter(activity =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.visualDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.usedIn.some(module => module.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, Activity[]>);

  const getReusabilityColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Module Activity Inventory
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Browse and copy reusable components from all 9 modules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close inventory"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search activities, components, or modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.keys(filteredCategories).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No activities found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(filteredCategories).map(([category, activities]) => (
                <Card key={category}>
                  <CardHeader>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                      className="w-full flex items-center justify-between hover:bg-gray-50 -m-4 p-4 rounded-lg transition-colors"
                    >
                      <CardTitle className="text-lg flex items-center gap-2">
                        {expandedCategory === category ? (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        )}
                        {category} ({activities.length})
                      </CardTitle>
                    </button>
                  </CardHeader>
                  {expandedCategory === category && (
                    <CardContent className="space-y-4">
                      {activities.map((activity, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded border ${getReusabilityColor(activity.reusability)}`}>
                                  {activity.reusability} reusability
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

                              {/* Visual Description Section */}
                              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Eye className="w-4 h-4 text-purple-600" />
                                  <span className="text-xs font-semibold text-purple-900">What Students See:</span>
                                </div>
                                <p className="text-sm text-purple-900 leading-relaxed">{activity.visualDescription}</p>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                                <span className="flex items-center gap-1">
                                  <FileCode className="w-3 h-3" />
                                  {activity.location}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {activity.usedIn.map((module, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200"
                                  >
                                    {module}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {activity.example && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-gray-700">Usage Example:</label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCopy(activity.example!, `${category}-${activity.name}`)}
                                  className="h-7 text-xs"
                                >
                                  {copiedItem === `${category}-${activity.name}` ? (
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
                              <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                                <code>{activity.example}</code>
                              </pre>
                            </div>
                          )}

                          {/* Copy file location button */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(activity.location, `location-${category}-${activity.name}`)}
                              className="h-7 text-xs w-full justify-start"
                            >
                              {copiedItem === `location-${category}-${activity.name}` ? (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  File path copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy file location
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            💡 Tip: Each activity now shows what students actually see! Use the purple "What Students See" boxes to understand the visual experience.
          </p>
        </div>
      </div>
    </div>
  );
}
