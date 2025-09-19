import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Sparkles, Target, Users, 
  Lightbulb, CheckCircle, XCircle, Play, Send, 
  FileText, List, Mail, Globe, MessageSquare, ArrowRight
} from 'lucide-react';
import { PremiumVideoPlayer } from '@/components/PremiumVideoPlayer';


const IntroductionToPrompting = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({});

  const sections = [
    'welcome',
    'first-video',
    'prompt-rating',
    'recipe-bridge',
    'frameworks',
    'rtf-video',
    'role-practice',
    'task-practice',
    'format-demo',
    'build-prompt',
    'reflection'
  ];

  // Emergency fixes for theme and navigation issues
  useEffect(() => {
    // Force light theme
    document.body.style.background = '#f9fafb';
    document.body.style.color = '#1f2937';
    
    // Prevent infinite loops
    if (currentSection > sections.length) {
      setCurrentSection(sections.length - 1);
    }
  }, [currentSection, sections.length]);

  // Section 1: Welcome
  const WelcomeSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Welcome to AI Prompting for Educators! 🚀
        </h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Imagine having a teaching assistant that never gets tired, creates endless practice materials, 
            and helps you save hours on planning. That's AI - <strong>when you know how to ask!</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">What You'll Learn:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>✅ Writing clear AI instructions</li>
              <li>✅ 4 powerful frameworks</li>
              <li>✅ Choosing the right format</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">You'll Be Able To:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>🎯 Create lesson plans in minutes</li>
              <li>🎯 Generate custom worksheets</li>
              <li>🎯 Write parent communications</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentSection(1)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700"
          >
            Let's Get Started! →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Section 2: First Video - The Recipe for Success
  const FirstVideoSection = () => {
    const [hasWatched, setHasWatched] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Crafting Effective Prompts: The Recipe for Success
            </h2>
            <p className="text-lg text-gray-600 text-center mb-6">
              Let's start by understanding what makes a good AI prompt. Think of it like training a puppy!
            </p>
          </div>

          {/* Premium Video Player */}
          <div className="relative">
            <PremiumVideoPlayer
              videoUrl="https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2F6%20Introduction%20to%20Basic%20Prompting.mp4?alt=media&token=e7b4b3d0-4c8e-4b9a-8a2d-1c5f8e9b2a3d"
              videoId="introduction-to-prompting-video-1"
              segments={[
                {
                  id: "intro-segment-1",
                  source: "prompting-intro",
                  title: "What is AI Prompting?",
                  start: 0,
                  end: 120,
                  description: "Understanding the basics of AI communication",
                  mandatory: true
                },
                {
                  id: "intro-segment-2", 
                  source: "prompting-intro",
                  title: "The Recipe Approach",
                  start: 120,
                  end: 240,
                  description: "Learning the 4-step prompting formula",
                  mandatory: true
                },
                {
                  id: "intro-segment-3",
                  source: "prompting-intro",
                  title: "Examples and Practice",
                  start: 240,
                  end: 360,
                  description: "Seeing good and bad prompts in action",
                  mandatory: true
                }
              ]}
              onSegmentComplete={(segmentId) => {
                console.log(`Completed segment: ${segmentId}`);
                setHasWatched(true);
              }}
              onModuleComplete={() => {
                setCurrentSection(2);
              }}
              enableSubtitles={true}
              allowSeeking={false}
              className="rounded-lg overflow-hidden"
            />
          </div>

          {/* Key Takeaways */}
          <div className="p-8 bg-gradient-to-r from-teal-50 to-blue-50">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              🧑‍🍳 The Perfect Prompt Recipe:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <h4 className="font-semibold">1. Define Your Goal</h4>
                    <p className="text-sm text-gray-600">Know exactly what you want to create</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📝</span>
                  <div>
                    <h4 className="font-semibold">2. Provide Context</h4>
                    <p className="text-sm text-gray-600">Give background information</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📋</span>
                  <div>
                    <h4 className="font-semibold">3. Specify Format</h4>
                    <p className="text-sm text-gray-600">Tell AI how to present the answer</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🔑</span>
                  <div>
                    <h4 className="font-semibold">4. Use Keywords</h4>
                    <p className="text-sm text-gray-600">Include specific terms for clarity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Section 3: Prompt Rating Activity
  const PromptRatingActivity = () => {
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [showFeedback, setShowFeedback] = useState(false);

    const prompts = [
      {
        id: 1,
        prompt: "Write something about dogs.",
        score: 2,
        strengths: ["You specified the topic (dogs)"],
        weaknesses: [
          "No clear goal - what type of content?",
          "No format specified",
          "No context or purpose",
          "Too vague to produce useful results"
        ],
        improved: "Write a 300-word informative article about dog training techniques for first-time owners. Include 3 specific tips with examples. Use a friendly, encouraging tone."
      },
      {
        id: 2,
        prompt: "Act as a science teacher. Explain photosynthesis to 5th graders. Use simple language and include a fun analogy.",
        score: 8,
        strengths: [
          "Clear role defined",
          "Specific audience identified",
          "Language level specified",
          "Creative element requested"
        ],
        weaknesses: [
          "Could specify desired length",
          "Format could be clearer (paragraph, list, etc.)"
        ],
        improved: "Act as a science teacher. Explain photosynthesis to 5th graders in 2-3 paragraphs. Use simple language and include a fun analogy comparing it to something they know from daily life."
      },
      {
        id: 3,
        prompt: "Help me",
        score: 1,
        strengths: ["You asked for assistance"],
        weaknesses: [
          "No context provided",
          "No specific request",
          "No goal or outcome specified",
          "AI cannot determine what kind of help you need"
        ],
        improved: "Help me create a study guide for my high school biology test on cell structure. Include key terms, definitions, and 5 practice questions with answers."
      }
    ];

    const currentPrompt = prompts[currentPromptIndex];

    const handleRating = (rating: number) => {
      setRatings({ ...ratings, [currentPrompt.id]: rating });
      setShowFeedback(true);
    };

    const nextPrompt = () => {
      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
        setShowFeedback(false);
      } else {
        setCurrentSection(currentSection + 1);
      }
    };

    const getRatingColor = (rating: number) => {
      if (rating >= 8) return 'text-green-600';
      if (rating >= 5) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getRatingMessage = (rating: number, actualScore: number) => {
      const diff = Math.abs(rating - actualScore);
      if (diff <= 1) return "Great judgment! You're getting the hang of this.";
      if (diff <= 3) return "You're on the right track. Consider all the recipe ingredients!";
      return "Let's review what makes a good prompt. Remember the recipe!";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Rate the Prompt! 🎯
          </h2>
          <p className="text-center text-gray-600 mb-6">
            How effective is this prompt? Rate it from 1-10 based on the recipe we just learned.
          </p>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Prompt {currentPromptIndex + 1} of {prompts.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentPromptIndex + 1) / prompts.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Prompt Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <p className="text-lg font-mono text-gray-800">"{currentPrompt.prompt}"</p>
          </div>

          {/* Rating Slider */}
          {!showFeedback && (
            <div className="mb-6">
              <label className="block text-center mb-4">
                <span className="text-lg font-semibold">Your Rating:</span>
                <span className={`ml-2 text-2xl font-bold ${getRatingColor(ratings[currentPrompt.id] || 5)}`}>
                  {ratings[currentPrompt.id] || 5}/10
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={ratings[currentPrompt.id] || 5}
                onChange={(e) => setRatings({ ...ratings, [currentPrompt.id]: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Poor</span>
                <span>Average</span>
                <span>Excellent</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!showFeedback && (
            <button
              onClick={() => handleRating(ratings[currentPrompt.id] || 5)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Submit Rating
            </button>
          )}

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Score Comparison */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-around items-center mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Your Rating</p>
                    <p className={`text-3xl font-bold ${getRatingColor(ratings[currentPrompt.id])}`}>
                      {ratings[currentPrompt.id]}/10
                    </p>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Actual Score</p>
                    <p className={`text-3xl font-bold ${getRatingColor(currentPrompt.score)}`}>
                      {currentPrompt.score}/10
                    </p>
                  </div>
                </div>
                <p className="text-center text-gray-700 font-medium">
                  {getRatingMessage(ratings[currentPrompt.id], currentPrompt.score)}
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
                  <ul className="space-y-1">
                    {currentPrompt.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-green-700">• {strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">❌ Areas to Improve</h4>
                  <ul className="space-y-1">
                    {currentPrompt.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-red-700">• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Improved Version */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">✨ Improved Version</h4>
                <p className="text-sm text-blue-700 font-mono">"{currentPrompt.improved}"</p>
              </div>

              <button
                onClick={nextPrompt}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                {currentPromptIndex < prompts.length - 1 ? 'Next Prompt' : 'Continue to Frameworks'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // Section 4: Recipe to Frameworks Bridge
  const RecipeBridgeSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            From Recipe to Framework 🔄
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-700 text-center">
              Great job rating those prompts! You're starting to see what works and what doesn't. 
              Now let's organize that knowledge into <strong>frameworks</strong> - tested formulas 
              that consistently produce great results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                🧑‍🍳 What You've Learned (Recipe)
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Define your goal clearly</li>
                <li>• Provide context and background</li>
                <li>• Specify the format you want</li>
                <li>• Use specific keywords</li>
                <li>• Be detailed but focused</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                📋 What's Coming (Frameworks)
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>RTF</strong>: Role, Task, Format</li>
                <li>• <strong>STAR</strong>: Situation, Task, Action, Result</li>
                <li>• <strong>CARE</strong>: Context, Action, Result, Example</li>
                <li>• <strong>RISE</strong>: Role, Input, Steps, Expectation</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">💡 Think of it this way:</h3>
            <p className="text-gray-700">
              If cooking recipes tell you <em>what ingredients</em> to use, frameworks tell you 
              <em>how to organize those ingredients</em> for different types of meals. You'll 
              pick different frameworks for different educational situations!
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700"
            >
              Ready to Learn Frameworks! →
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Section 5: Frameworks Overview
  const FrameworksSection = () => {
    const [expandedFramework, setExpandedFramework] = useState('RTF');

    const frameworks = [
      {
        id: 'RTF',
        name: 'RTF Framework',
        fullName: 'Role, Task, Format',
        icon: '🎯',
        color: 'blue',
        description: 'The simplest and most effective framework for beginners',
        components: [
          { letter: 'R', word: 'Role', example: 'Act as a 5th grade teacher' },
          { letter: 'T', word: 'Task', example: 'Create a lesson on fractions' },
          { letter: 'F', word: 'Format', example: 'As bullet points with examples' }
        ],
        fullExample: '"Act as a 5th grade teacher. Create a lesson on fractions. Format as bullet points with examples."'
      },
      {
        id: 'STAR',
        name: 'STAR Method',
        fullName: 'Situation, Task, Action, Result',
        icon: '⭐',
        color: 'purple',
        description: 'Best for complex scenarios needing context',
        components: [
          { letter: 'S', word: 'Situation', example: 'Students struggling with math' },
          { letter: 'T', word: 'Task', example: 'Build their confidence' },
          { letter: 'A', word: 'Action', example: 'Create engaging activities' },
          { letter: 'R', word: 'Result', example: 'Students enjoy math' }
        ],
        fullExample: '"Situation: Students fear math. Task: Build confidence. Action: Create fun activities. Result: Students enjoying learning."'
      },
      {
        id: 'CARE',
        name: 'CARE Framework',
        fullName: 'Context, Action, Result, Example',
        icon: '❤️',
        color: 'green',
        description: 'Great when you have examples to share',
        components: [
          { letter: 'C', word: 'Context', example: 'Teaching photosynthesis' },
          { letter: 'A', word: 'Action', example: 'Design an experiment' },
          { letter: 'R', word: 'Result', example: 'Students understand the process' },
          { letter: 'E', word: 'Example', example: 'Like our plant growth lab' }
        ],
        fullExample: '"Context: Teaching photosynthesis. Action: Design experiment. Result: Understanding. Example: Like our plant lab."'
      },
      {
        id: 'RISE',
        name: 'RISE Method',
        fullName: 'Role, Input, Steps, Expectation',
        icon: '📈',
        color: 'orange',
        description: 'Perfect for step-by-step processes',
        components: [
          { letter: 'R', word: 'Role', example: 'Curriculum designer' },
          { letter: 'I', word: 'Input', example: 'State standards' },
          { letter: 'S', word: 'Steps', example: '1) Analyze 2) Plan 3) Create' },
          { letter: 'E', word: 'Expectation', example: 'Complete unit plan' }
        ],
        fullExample: '"Role: Curriculum designer. Input: State standards. Steps: Analyze, plan, create. Expectation: Full unit plan."'
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Prompting Frameworks: Your AI Communication Toolkit
        </h2>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700">
            <strong>What's a framework?</strong> Think of it like a recipe for talking to AI. 
            Just like recipes have ingredients and steps, frameworks help you organize your thoughts 
            for better AI responses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {frameworks.map((framework) => (
            <motion.div
              key={framework.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer
                ${expandedFramework === framework.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setExpandedFramework(framework.id)}
            >
              {/* Header */}
              <div className={`p-4 bg-${framework.color}-50`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{framework.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{framework.name}</h3>
                      <p className="text-sm text-gray-600">{framework.fullName}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform
                    ${expandedFramework === framework.id ? 'rotate-90' : ''}`} />
                </div>
                <p className="mt-2 text-sm text-gray-700">{framework.description}</p>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedFramework === framework.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-3 bg-gray-50">
                      {/* Components */}
                      {framework.components.map((comp, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <span className={`
                            w-8 h-8 rounded-full bg-${framework.color}-500 text-white 
                            font-bold flex items-center justify-center flex-shrink-0
                          `}>
                            {comp.letter}
                          </span>
                          <div>
                            <span className="font-semibold">{comp.word}:</span>
                            <span className="text-gray-600 ml-2">{comp.example}</span>
                          </div>
                        </div>
                      ))}
                      
                      {/* Full Example */}
                      <div className={`mt-4 p-3 bg-${framework.color}-100 rounded-lg`}>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Complete Example:</p>
                        <p className="text-sm text-gray-800 italic">{framework.fullExample}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentSection(2)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700"
          >
            Continue to Video Learning →
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Section 3: RTF Video
  const RTFVideoSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Deep Dive: Mastering the RTF Framework
        </h2>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative aspect-video bg-gray-900">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isPlaying ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(true)}
                  className="bg-blue-600 text-white p-6 rounded-full"
                >
                  <Play className="w-12 h-12" />
                </motion.button>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <p className="text-lg mb-4">Video content would load here</p>
                    <button
                      onClick={() => setCurrentSection(3)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                      Continue to Practice →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">Key Takeaways:</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Role</h4>
                <p className="text-sm">Define who the AI should be - teacher, tutor, expert, etc.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Task</h4>
                <p className="text-sm">Be specific about what you want created or explained</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-2">Format</h4>
                <p className="text-sm">Specify how you want the output structured</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Section 4: Role Practice (Fixed)
  const RolePracticeSection = () => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const scenarios = [
      {
        context: "You need help understanding a difficult math concept",
        task: "explain how to solve quadratic equations",
        roles: [
          { id: 'tutor', text: 'Act as a patient math tutor', correct: true },
          { id: 'comedian', text: 'Act as a professional comedian', correct: false },
          { id: 'chef', text: 'Act as a chef', correct: false },
          { id: 'agent', text: 'Act as a travel agent', correct: false }
        ],
        feedback: {
          correct: "Perfect! A math tutor is the ideal role for explaining math concepts clearly.",
          incorrect: "Think about who would be best at explaining math. What expertise is needed?"
        }
      },
      {
        context: "You need to write a parent communication email",
        task: "write a back-to-school welcome letter",
        roles: [
          { id: 'teenager', text: 'Act as a teenager', correct: false },
          { id: 'teacher', text: 'Act as an experienced elementary teacher', correct: true },
          { id: 'coach', text: 'Act as a sports coach', correct: false },
          { id: 'scientist', text: 'Act as a scientist', correct: false }
        ],
        feedback: {
          correct: "Excellent! An experienced teacher knows how to communicate professionally with parents.",
          incorrect: "Consider who regularly communicates with parents about school matters."
        }
      },
      {
        context: "You want to create a fun science experiment",
        task: "design a safe chemistry experiment for middle schoolers",
        roles: [
          { id: 'chef', text: 'Act as a professional chef', correct: false },
          { id: 'novelist', text: 'Act as a novelist', correct: false },
          { id: 'science-teacher', text: 'Act as a middle school science teacher', correct: true },
          { id: 'musician', text: 'Act as a musician', correct: false }
        ],
        feedback: {
          correct: "Great choice! A science teacher understands both the content and safety requirements.",
          incorrect: "Who would know both science content AND classroom safety requirements?"
        }
      }
    ];

    const scenario = scenarios[currentScenario];

    const handleRoleSelect = (roleId: string) => {
      setSelectedRole(roleId);
      setShowFeedback(true);
    };

    const nextScenario = () => {
      // Prevent infinite loops by enforcing max scenarios
      const MAX_SCENARIOS = 3;
      if (currentScenario >= MAX_SCENARIOS - 1) {
        // Move to next section instead of looping
        setCurrentSection(currentSection + 1);
        return;
      }
      setCurrentScenario(currentScenario + 1);
      setSelectedRole(null);
      setShowFeedback(false);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Practice: Match the Right Role
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Scenario {currentScenario + 1} of {scenarios.length}
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Context */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-lg text-gray-800">{scenario.context}</p>
          </div>

          {/* Task */}
          <p className="text-lg mb-6">
            Complete the prompt: <strong>"_____ and {scenario.task}"</strong>
          </p>

          {/* Role Options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {scenario.roles.map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !showFeedback && handleRoleSelect(role.id)}
                disabled={showFeedback}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${showFeedback && selectedRole === role.id
                    ? role.correct
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                  }
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{role.text}</span>
                  {showFeedback && selectedRole === role.id && (
                    role.correct ? 
                      <CheckCircle className="w-5 h-5 text-green-600" /> :
                      <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`
                p-4 rounded-lg mb-4
                ${scenario.roles.find(r => r.id === selectedRole)?.correct
                  ? 'bg-green-50 border border-green-300'
                  : 'bg-orange-50 border border-orange-300'
                }
              `}>
                <p>
                  {scenario.roles.find(r => r.id === selectedRole)?.correct
                    ? scenario.feedback.correct
                    : scenario.feedback.incorrect
                  }
                </p>
              </div>

              <button
                onClick={nextScenario}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Continue to Next Section'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // Section 5: Task Practice
  const TaskPracticeSection = () => {
    const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    const tasks = [
      { id: 1, text: 'Create a detailed lesson plan with objectives', good: true },
      { id: 2, text: 'Help me', good: false },
      { id: 3, text: 'Generate 10 quiz questions about photosynthesis', good: true },
      { id: 4, text: 'Do something educational', good: false },
      { id: 5, text: 'Write a parent email about field trip permission', good: true },
      { id: 6, text: 'Make it better', good: false }
    ];

    const toggleTask = (taskId: number) => {
      if (!showResults) {
        setSelectedTasks(prev =>
          prev.includes(taskId) 
            ? prev.filter(id => id !== taskId)
            : [...prev, taskId]
        );
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          What Makes a Good Task?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Select all the GOOD task examples (specific and actionable)
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-3 mb-6">
            {tasks.map((task) => (
              <motion.button
                key={task.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => toggleTask(task.id)}
                disabled={showResults}
                className={`
                  w-full p-4 rounded-lg border-2 text-left transition-all
                  ${showResults
                    ? task.good === selectedTasks.includes(task.id)
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : selectedTasks.includes(task.id)
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{task.text}</span>
                  {showResults && (
                    task.good === selectedTasks.includes(task.id) ?
                      <CheckCircle className="w-5 h-5 text-green-600" /> :
                      <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={selectedTasks.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Check My Answers
            </button>
          ) : (
            <div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="font-semibold">Remember:</p>
                <p>Good tasks are <strong>specific</strong> (not vague) and <strong>actionable</strong> (AI can do them)!</p>
              </div>
              <button
                onClick={() => setCurrentSection(currentSection + 1)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Section 6: Format Transformation Demo
  const FormatDemoSection = () => {
    const [selectedFormat, setSelectedFormat] = useState<'original' | 'bullets' | 'email' | 'dialogue'>('original');

    const content: Record<'original' | 'bullets' | 'email' | 'dialogue', { title: string; text: string }> = {
      original: {
        title: 'AI in Education',
        text: 'Artificial Intelligence is transforming education by personalizing learning experiences. AI tools can adapt to individual student needs, provide instant feedback, and help teachers save time on administrative tasks. This technology makes quality education more accessible to learners worldwide.'
      },
      bullets: {
        title: 'AI in Education: Key Points',
        text: `• Personalizes learning for each student
• Provides instant feedback on work
• Saves teachers time on admin tasks
• Makes education more accessible globally
• Adapts content to learning styles
• Identifies students needing help early`
      },
      email: {
        title: 'Subject: Exciting AI Tools for Our Classroom',
        text: `Dear Parents,

I'm excited to share how we're using AI to enhance your child's learning experience!

We're implementing tools that:
- Provide personalized practice problems
- Give instant feedback on assignments
- Help identify areas where students need support

These tools complement, not replace, our teaching. They give us more time for meaningful interactions with students.

Questions? Let's discuss at our next parent meeting!

Best regards,
Ms. Johnson`
      },
      dialogue: {
        title: 'A Classroom Conversation',
        text: `Student: "Ms. Smith, how does the AI know what I need to learn?"

Teacher: "Great question! It watches your progress and sees where you're doing well and where you might need more practice."

Student: "So it's like a smart tutor?"

Teacher: "Exactly! And the best part is, I can see your progress too and help you even better."

Student: "That's cool! Technology and teachers working together!"`
      }
    };

    const formats = [
      { id: 'original', name: 'Original Text', icon: <FileText /> },
      { id: 'bullets', name: 'Bullet Points', icon: <List /> },
      { id: 'email', name: 'Email Format', icon: <Mail /> },
      { id: 'dialogue', name: 'Dialogue', icon: <MessageSquare /> }
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Format Transformation Magic ✨
        </h2>
        <p className="text-center text-gray-600 mb-6">
          See how the same content transforms with different formats!
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Format Selector */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {formats.map((format) => (
              <motion.button
                key={format.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFormat(format.id as 'original' | 'bullets' | 'email' | 'dialogue')}
                className={`
                  p-3 rounded-lg flex flex-col items-center space-y-2
                  ${selectedFormat === format.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {format.icon}
                <span className="text-sm">{format.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Content Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFormat}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold mb-4">{content[selectedFormat].title}</h3>
              <div className="whitespace-pre-wrap text-gray-700">
                {content[selectedFormat].text}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-sm">
              <strong>Pro Tip:</strong> Choose your format based on your audience and purpose. 
              Bullets for quick scanning, emails for formal communication, dialogue for engagement!
            </p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue to Prompt Builder →
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Section 7: Build Your Prompt
  const BuildPromptSection = () => {
    const [role, setRole] = useState('');
    const [task, setTask] = useState('');
    const [format, setFormat] = useState('');
    const [showAnalysis, setShowAnalysis] = useState(false);

    const analyze = () => {
      setShowAnalysis(true);
    };

    const getScore = () => {
      let score = 0;
      if (role.length > 10) score++;
      if (task.length > 20) score++;
      if (format.length > 10) score++;
      if (role.includes('teacher') || role.includes('educator')) score++;
      if (task.includes('create') || task.includes('explain')) score++;
      return Math.min(5, score);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Build Your Own RTF Prompt
        </h2>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="font-semibold">Scenario:</p>
            <p>You need to create a science lesson about the water cycle for 4th graders.</p>
          </div>

          <div className="space-y-4">
            {/* Role Input */}
            <div>
              <label className="flex items-center text-lg font-semibold mb-2">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">R</span>
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Act as a..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Task Input */}
            <div>
              <label className="flex items-center text-lg font-semibold mb-2">
                <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">T</span>
                Task
              </label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Create/Explain/Design..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                rows={2}
              />
            </div>

            {/* Format Input */}
            <div>
              <label className="flex items-center text-lg font-semibold mb-2">
                <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">F</span>
                Format
              </label>
              <input
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="Format as..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Complete Prompt */}
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <p className="font-semibold mb-2">Your Complete Prompt:</p>
            <p className="italic text-gray-700">
              {role || '[Add role]'} {task || '[Add task]'} {format || '[Add format]'}
            </p>
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyze}
            disabled={!role || !task || !format}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Analyze My Prompt
          </button>

          {/* Analysis */}
          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Your Score:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles 
                        key={i} 
                        className={`w-5 h-5 ${i < getScore() ? 'text-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm">Great work! Your prompt has all the essential RTF components.</p>
              </div>
              <button
                onClick={() => setCurrentSection(currentSection + 1)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Continue to Reflection →
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // Section 8: Reflection
  const ReflectionSection = () => {
    const [reflection, setReflection] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = () => {
      setIsComplete(true);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Congratulations! 🎉
        </h2>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {!isComplete ? (
            <>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">You've mastered the basics of AI prompting!</h3>
                <p className="text-gray-700">
                  You now know how to use the RTF framework to create clear, effective prompts that get better results from AI tools.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">
                  How will you use AI prompting in your classroom?
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Share your ideas for using AI in your teaching..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none h-32"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={reflection.length < 10}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold text-lg"
              >
                Complete Module
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Module Complete!</h3>
                <p className="text-gray-600">
                  You're ready to start using AI effectively in your educational practice.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold mb-3">What's Next?</h4>
                <ul className="text-left space-y-2 text-gray-700">
                  <li>• Try the RTF framework with real AI tools</li>
                  <li>• Experiment with different roles and formats</li>
                  <li>• Share your prompting knowledge with colleagues</li>
                  <li>• Continue exploring advanced AI for education</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Navigation
  const NavigationBar = () => (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4 mb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">AI Prompting for Educators</h1>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {currentSection + 1} of {sections.length}
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            {currentSection > 0 && (
              <button
                onClick={() => setCurrentSection(currentSection - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render current section
  const renderSection = () => {
    switch(sections[currentSection]) {
      case 'welcome': return <WelcomeSection />;
      case 'first-video': return <FirstVideoSection />;
      case 'prompt-rating': return <PromptRatingActivity />;
      case 'recipe-bridge': return <RecipeBridgeSection />;
      case 'frameworks': return <FrameworksSection />;
      case 'rtf-video': return <RTFVideoSection />;
      case 'role-practice': return <RolePracticeSection />;
      case 'task-practice': return <TaskPracticeSection />;
      case 'format-demo': return <FormatDemoSection />;
      case 'build-prompt': return <BuildPromptSection />;
      case 'reflection': return <ReflectionSection />;
      default: return <WelcomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <NavigationBar />
      <div className="container mx-auto px-4 pb-8">
        {renderSection()}
      </div>
    </div>
  );
};

export default IntroductionToPrompting;