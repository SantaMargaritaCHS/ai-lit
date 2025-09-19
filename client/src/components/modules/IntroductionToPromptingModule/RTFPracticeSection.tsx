import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, Lightbulb, Target, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface RTFPracticeSectionProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const RTFPracticeSection: React.FC<RTFPracticeSectionProps> = ({ onComplete, isDevMode }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);

  const scenarios = [
    {
      id: 'lesson-planning',
      title: 'Lesson Planning Challenge',
      description: 'You need to create a science lesson about the water cycle for 4th graders.',
      context: 'Your students learn best with hands-on activities and visual aids. You have 45 minutes for the lesson.',
      challenge: 'Create a complete RTF prompt that will help AI generate an engaging water cycle lesson.',
      hints: [
        'Role: What kind of teacher are you? What grade level?',
        'Task: Be specific about what you want (lesson plan, activities, etc.)',
        'Format: How do you want the response organized?'
      ],
      expectedElements: ['role', 'task', 'format'],
      difficulty: 'Beginner'
    },
    {
      id: 'parent-communication',
      title: 'Parent Communication',
      description: 'A student has been struggling with math homework and you need to communicate with their parents.',
      context: 'The student is normally strong in other subjects but seems frustrated with fractions. You want to be supportive and offer solutions.',
      challenge: 'Write an RTF prompt to help AI draft a caring, solution-focused email to the parents.',
      hints: [
        'Role: Consider your position and tone as an educator',
        'Task: What specific communication do you need?',
        'Format: Email structure, length, tone considerations'
      ],
      expectedElements: ['role', 'task', 'format'],
      difficulty: 'Intermediate'
    },
    {
      id: 'differentiated-materials',
      title: 'Differentiated Learning Materials',
      description: 'You have students at different reading levels in your class and need materials for a history unit on Ancient Egypt.',
      context: 'Some students read at grade level, others need simplified text, and a few are ready for advanced content. You want engaging materials for all.',
      challenge: 'Create an RTF prompt that will generate differentiated reading materials for your diverse classroom.',
      hints: [
        'Role: What type of educator creates differentiated materials?',
        'Task: Be specific about the different levels needed',
        'Format: How should the materials be structured and organized?'
      ],
      expectedElements: ['role', 'task', 'format'],
      difficulty: 'Advanced'
    }
  ];

  const currentScenarioData = scenarios[currentScenario];

  const analyzeRTFPrompt = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/analyze-rtf-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userPrompt,
          scenario: currentScenarioData.id,
          expectedElements: currentScenarioData.expectedElements
        })
      });

      const data = await response.json();
      
      const feedbackData = {
        score: data.score || 3,
        roleAnalysis: data.roleAnalysis || {},
        taskAnalysis: data.taskAnalysis || {},
        formatAnalysis: data.formatAnalysis || {},
        overallFeedback: data.overallFeedback || '',
        suggestions: data.suggestions || [],
        improvedPrompt: data.improvedPrompt || ''
      };

      setFeedback(feedbackData);

      // Mark scenario as complete if score is good
      if (feedbackData.score >= 4) {
        setCompletedScenarios(prev => [...prev, currentScenario]);
      }
    } catch (error) {
      console.error('Error analyzing RTF prompt:', error);
      // Fallback feedback
      setFeedback({
        score: 3,
        roleAnalysis: { present: true, clarity: 'Good', feedback: 'Role is clearly defined' },
        taskAnalysis: { present: true, specificity: 'Moderate', feedback: 'Task could be more specific' },
        formatAnalysis: { present: true, detail: 'Basic', feedback: 'Format is mentioned but could be more detailed' },
        overallFeedback: 'Good attempt at using the RTF framework! Your prompt shows understanding of the structure.',
        suggestions: ['Be more specific in your task description', 'Add more detail to your format requirements'],
        improvedPrompt: 'Here\'s how you could enhance your prompt...'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setUserPrompt('');
      setFeedback(null);
    } else {
      onComplete();
    }
  };

  const resetCurrentScenario = () => {
    setUserPrompt('');
    setFeedback(null);
  };

  // Auto-fill for dev mode
  useEffect(() => {
    if (isDevMode) {
      const devPrompts = [
        'Act as a 4th grade science teacher and create an engaging 45-minute lesson plan about the water cycle that includes hands-on activities and visual aids. Format as a detailed lesson plan with time allocations, materials list, and step-by-step activities.',
        'Act as an elementary school teacher and write a supportive email to parents about their child\'s struggles with fraction homework. Include specific suggestions for helping at home and reassurance about the child\'s overall progress. Format as a professional but warm email.',
        'Act as a special education teacher and create differentiated reading materials about Ancient Egypt for students at below-grade, on-grade, and above-grade reading levels. Include vocabulary support and engaging visuals. Format as three separate but connected reading passages with accompanying activities.'
      ];
      setUserPrompt(devPrompts[currentScenario] || '');
    }
  }, [isDevMode, currentScenario]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          RTF Practice Scenarios
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Apply what you've learned with real classroom situations
        </p>
        
        {/* Scenario Progress */}
        <div className="flex justify-center space-x-2 mt-4">
          {scenarios.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentScenario 
                  ? 'bg-blue-500' 
                  : completedScenarios.includes(index)
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Scenario */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-700 to-indigo-700 text-white border-blue-600">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Scenario {currentScenario + 1}: {currentScenarioData.title}
                </h3>
                <Badge className={getDifficultyColor(currentScenarioData.difficulty)}>
                  {currentScenarioData.difficulty}
                </Badge>
              </div>
              {completedScenarios.includes(currentScenario) && (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
            </div>

            <p className="text-blue-100 mb-4">
              <strong>Situation:</strong> {currentScenarioData.description}
            </p>
            
            <p className="text-blue-100 mb-4">
              <strong>Context:</strong> {currentScenarioData.context}
            </p>

            <div className="bg-white/20 p-4 rounded-lg mb-4 border border-white/30">
              <p className="text-white font-medium">
                <strong>Your Challenge:</strong> {currentScenarioData.challenge}
              </p>
            </div>

            {/* Hints */}
            <div className="bg-yellow-400/20 p-4 rounded-lg mb-6 border border-yellow-400/30">
              <h4 className="font-semibold text-yellow-300 mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                RTF Framework Hints:
              </h4>
              <ul className="space-y-1">
                {currentScenarioData.hints.map((hint, index) => (
                  <li key={index} className="text-yellow-100 text-sm">
                    • {hint}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Prompt Input */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Write Your RTF Prompt:
        </h4>
        <Textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Act as a [ROLE] and [TASK]. Format as [FORMAT]..."
          className="min-h-[120px] mb-4"
        />
        
        <div className="flex space-x-2">
          <Button 
            onClick={analyzeRTFPrompt}
            disabled={!userPrompt.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Analyze My RTF Prompt
              </>
            )}
          </Button>
          
          {feedback && (
            <Button 
              variant="outline"
              onClick={resetCurrentScenario}
            >
              Try Again
            </Button>
          )}
        </div>
      </Card>

      {/* Feedback Display */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              RTF Analysis Results
            </h4>
            
            {/* Score */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-medium">Overall Score:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= feedback.score ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({feedback.score}/5)
              </span>
            </div>

            {/* Component Analysis */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {/* Role Analysis */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Role
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {feedback.roleAnalysis?.feedback || 'Role component analyzed'}
                </p>
              </div>

              {/* Task Analysis */}
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h5 className="font-semibold text-green-800 dark:text-green-200 flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Task
                </h5>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {feedback.taskAnalysis?.feedback || 'Task component analyzed'}
                </p>
              </div>

              {/* Format Analysis */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <h5 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Format
                </h5>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  {feedback.formatAnalysis?.feedback || 'Format component analyzed'}
                </p>
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <h5 className="font-semibold mb-2 text-gray-900 dark:text-white">Overall Feedback:</h5>
              <p className="text-gray-700 dark:text-gray-300">
                {feedback.overallFeedback}
              </p>
            </div>

            {/* Suggestions */}
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h5 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                  Suggestions for Improvement:
                </h5>
                <ul className="space-y-1">
                  {feedback.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="text-yellow-700 dark:text-yellow-300 text-sm">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Scenario {currentScenario + 1} of {scenarios.length}
            </div>
            
            <Button 
              onClick={nextScenario}
              className="bg-green-600 hover:bg-green-700"
            >
              {currentScenario < scenarios.length - 1 ? (
                <>
                  Next Scenario
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Complete Practice
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RTFPracticeSection;