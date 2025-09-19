import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Play, RotateCcw, CheckCircle, Brain, Film, Star, Code, MessageCircle, Lightbulb, ArrowRight, Trophy, Timer } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface AlgorithmsModuleProps {
  onComplete: () => void;
}

interface MovieExample {
  title: string;
  emoji: string;
  genres: string[];
  rating: number;
  description: string;
}

interface ReflectionQuestion {
  id: string;
  question: string;
  placeholder: string;
  aiPrompt: string;
}

interface SortingStep {
  step: number;
  unsorted: number[];
  sorted: number[];
  foundSmallest: number | null;
  description: string;
}

export function AlgorithmsModule({ onComplete }: AlgorithmsModuleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userMovieAlgorithm, setUserMovieAlgorithm] = useState('');
  const [userReflections, setUserReflections] = useState<Record<string, string>>({});
  const [aiFeedback, setAiFeedback] = useState<Record<string, string>>({});
  const [isGettingFeedback, setIsGettingFeedback] = useState<Record<string, boolean>>({});
  const [sortingStep, setSortingStep] = useState(0);
  const [sortingSteps, setSortingSteps] = useState<SortingStep[]>([]);
  const [isRunningSort, setIsRunningSort] = useState(false);
  const [userSortCode, setUserSortCode] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const movieExamples: MovieExample[] = [
    { title: "John Wick", emoji: "🔫", genres: ["Action", "Thriller"], rating: 8.5, description: "Intense action with gunfights" },
    { title: "Mission: Impossible", emoji: "🎬", genres: ["Action", "Adventure"], rating: 8.2, description: "High-stakes spy thriller" },
    { title: "The Dark Knight", emoji: "🦇", genres: ["Action", "Crime", "Drama"], rating: 9.0, description: "Gritty superhero drama" },
    { title: "Superbad", emoji: "😂", genres: ["Comedy"], rating: 7.6, description: "Teen comedy about friendship" },
    { title: "The Hangover", emoji: "🍻", genres: ["Comedy"], rating: 7.7, description: "Wild comedy adventure" },
    { title: "Inception", emoji: "🌀", genres: ["Sci-Fi", "Action"], rating: 8.8, description: "Mind-bending sci-fi thriller" }
  ];

  const reflectionQuestions: ReflectionQuestion[] = [
    {
      id: 'personal-algorithm',
      question: 'Describe your personal movie recommendation algorithm. What steps do you take when someone asks for a movie suggestion?',
      placeholder: 'I would first ask them about...',
      aiPrompt: 'Analyze this student\'s movie recommendation approach. Provide constructive feedback on their algorithmic thinking, highlighting good steps and suggesting improvements to make their algorithm more effective and personalized.'
    },
    {
      id: 'data-importance',
      question: 'Why is collecting data about your friend\'s preferences important for making a good recommendation?',
      placeholder: 'Data is important because...',
      aiPrompt: 'Evaluate this student\'s understanding of data\'s role in algorithms. Provide feedback on their grasp of how data improves algorithmic decisions and suggest ways to think more deeply about data-driven recommendations.'
    },
    {
      id: 'netflix-comparison',
      question: 'How is Netflix\'s recommendation algorithm different from your personal approach? What advantages does Netflix have?',
      placeholder: 'Netflix is different because...',
      aiPrompt: 'Assess this student\'s comparison between personal and AI algorithms. Provide feedback on their understanding of scale, automation, and pattern recognition in machine learning systems.'
    },
    {
      id: 'algorithm-definition',
      question: 'In your own words, what is an algorithm? Use the sorting example to explain.',
      placeholder: 'An algorithm is...',
      aiPrompt: 'Evaluate this student\'s definition of algorithms. Provide feedback on their conceptual understanding and help them connect the definition to the practical sorting example they just experienced.'
    }
  ];

  const steps = [
    {
      title: "What is an Algorithm?",
      subtitle: "Start with the Big Picture",
      content: "movie-analogy"
    },
    {
      title: "Your Movie Recommendation Algorithm",
      subtitle: "Reflection & Analysis",
      content: "reflection-1"
    },
    {
      title: "Understanding Data in Algorithms",
      subtitle: "The Role of Information",
      content: "reflection-2"
    },
    {
      title: "From Human to AI Algorithms",
      subtitle: "Netflix's Approach",
      content: "netflix-explanation"
    },
    {
      title: "Netflix vs. Your Approach",
      subtitle: "Reflection & Comparison",
      content: "reflection-3"
    },
    {
      title: "Hands-On: Sorting Algorithm",
      subtitle: "Build Your First Algorithm",
      content: "sorting-demo"
    },
    {
      title: "Code Your Algorithm",
      subtitle: "From Steps to Code",
      content: "coding-challenge"
    },
    {
      title: "What Did We Learn?",
      subtitle: "Final Reflection",
      content: "reflection-4"
    },
    {
      title: "Congratulations!",
      subtitle: "Algorithm Master",
      content: "completion"
    }
  ];

  const generateSortingSteps = (initialArray: number[]) => {
    const steps: SortingStep[] = [];
    let unsorted = [...initialArray];
    let sorted: number[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      unsorted: [...unsorted],
      sorted: [...sorted],
      foundSmallest: null,
      description: `Starting with unsorted list: [${unsorted.join(', ')}]`
    });

    while (unsorted.length > 0) {
      const smallest = Math.min(...unsorted);
      
      steps.push({
        step: stepNum++,
        unsorted: [...unsorted],
        sorted: [...sorted],
        foundSmallest: smallest,
        description: `Found smallest number: ${smallest}`
      });

      sorted.push(smallest);
      unsorted = unsorted.filter(n => n !== smallest);

      steps.push({
        step: stepNum++,
        unsorted: [...unsorted],
        sorted: [...sorted],
        foundSmallest: null,
        description: `Moved ${smallest} to sorted list`
      });
    }

    return steps;
  };

  const getAIFeedback = async (questionId: string, userResponse: string) => {
    if (!userResponse.trim()) return;

    const question = reflectionQuestions.find(q => q.id === questionId);
    if (!question) return;

    setIsGettingFeedback(prev => ({ ...prev, [questionId]: true }));

    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: question.aiPrompt,
          userResponse: userResponse
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiFeedback(prev => ({ ...prev, [questionId]: data.feedback }));
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
    } finally {
      setIsGettingFeedback(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const runSortingAnimation = async () => {
    if (sortingSteps.length === 0) {
      const steps = generateSortingSteps([5, 2, 8, 1, 9, 4]);
      setSortingSteps(steps);
      setIsRunningSort(true);
      setSortingStep(0);
      
      // Animate through steps
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSortingStep(i);
      }
      setIsRunningSort(false);
    }
  };

  const resetSorting = () => {
    setSortingSteps([]);
    setSortingStep(0);
    setIsRunningSort(false);
  };

  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
  };

  const renderMovieAnalogy = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Film className="w-5 h-5" />
          The Movie Recommendation Challenge
        </h3>
        <p className="text-gray-700 mb-4">
          Imagine a friend asks you: "What movie should I watch tonight?" 
          How do you decide what to suggest?
        </p>
        
        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="font-medium mb-2">🤔 Simple Approach:</p>
          <p className="text-sm text-gray-600 mb-3">"Watch my favorite movie!"</p>
          <p className="text-xs text-gray-500">This is simple, but not very personalized...</p>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <p className="font-medium mb-2">🎯 Better Approach:</p>
          <p className="text-sm text-gray-600 mb-3">"Tell me about the last 3 movies you really enjoyed..."</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {movieExamples.slice(0, 3).map((movie, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded">
                <span>{movie.emoji}</span>
                <span>{movie.title}</span>
                <Badge variant="secondary" className="text-xs">{movie.genres[0]}</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Pattern detected: Action, Thriller, High-rated → Recommend similar movies!
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Key Insight
        </h4>
        <p className="text-sm text-gray-700">
          A good algorithm uses <strong>specific inputs (data)</strong> to produce a <strong>relevant output</strong>. 
          The more relevant data you have, the better your recommendation!
        </p>
      </div>
    </div>
  );

  const renderReflectionQuestion = (questionId: string) => {
    const question = reflectionQuestions.find(q => q.id === questionId);
    if (!question) return null;

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Reflection Question
          </h3>
          <p className="text-gray-700 mb-4">{question.question}</p>
          
          <Textarea
            value={userReflections[questionId] || ''}
            onChange={(e) => setUserReflections(prev => ({ ...prev, [questionId]: e.target.value }))}
            placeholder={question.placeholder}
            className="min-h-[100px] mb-4"
          />
          
          <Button 
            onClick={() => getAIFeedback(questionId, userReflections[questionId] || '')}
            disabled={!userReflections[questionId]?.trim() || isGettingFeedback[questionId]}
            className="w-full"
          >
            {isGettingFeedback[questionId] ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Getting AI Feedback...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Get AI Feedback
              </>
            )}
          </Button>
        </div>

        {aiFeedback[questionId] && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Feedback
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiFeedback[questionId]}</p>
          </div>
        )}
      </div>
    );
  };

  const renderNetflixExplanation = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Netflix's Recommendation Algorithm
        </h3>
        <p className="text-gray-700 mb-4">
          How would you create recommendations for millions of users?
        </p>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium mb-2">📊 The Data Netflix Has:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Movies you've watched and rated</li>
              <li>• How much of each movie you watched</li>
              <li>• When you typically watch</li>
              <li>• What genres you prefer</li>
              <li>• This data for millions of other users!</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium mb-2">🤖 Two Main Strategies:</p>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-medium text-blue-700">Collaborative Filtering</p>
                <p className="text-xs text-gray-600">Find users with similar tastes and recommend what they liked</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <p className="font-medium text-green-700">Content-Based Filtering</p>
                <p className="text-xs text-gray-600">Analyze movie attributes and find similar content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-2">🎯 The Result</h4>
        <p className="text-sm text-gray-700">
          Personalized rows like "Top Picks for You" that combine both strategies 
          to show you movies you're most likely to enjoy!
        </p>
      </div>
    </div>
  );

  const renderSortingDemo = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" />
          Build a Sorting Algorithm
        </h3>
        <p className="text-gray-700 mb-4">
          Let's create an algorithm to sort movie ratings from smallest to largest!
        </p>
        
        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="font-medium mb-2">📝 The Algorithm Steps:</p>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Start with unsorted list: [5, 2, 8, 1, 9, 4]</li>
            <li>2. Find the smallest number</li>
            <li>3. Move it to the sorted list</li>
            <li>4. Repeat until unsorted list is empty</li>
          </ol>
        </div>

        <div className="flex gap-2 mb-4">
          <Button onClick={runSortingAnimation} disabled={isRunningSort}>
            <Play className="w-4 h-4 mr-2" />
            {isRunningSort ? 'Running...' : 'Run Algorithm'}
          </Button>
          <Button variant="outline" onClick={resetSorting}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {sortingSteps.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Step {sortingStep + 1} of {sortingSteps.length}</span>
                <Badge variant="outline">{Math.round(((sortingStep + 1) / sortingSteps.length) * 100)}%</Badge>
              </div>
              <Progress value={((sortingStep + 1) / sortingSteps.length) * 100} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium">{sortingSteps[sortingStep]?.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Unsorted:</p>
                  <div className="flex gap-1 flex-wrap">
                    {sortingSteps[sortingStep]?.unsorted.map((num, idx) => (
                      <Badge 
                        key={idx} 
                        variant={num === sortingSteps[sortingStep]?.foundSmallest ? "default" : "secondary"}
                        className={num === sortingSteps[sortingStep]?.foundSmallest ? "bg-yellow-500" : ""}
                      >
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Sorted:</p>
                  <div className="flex gap-1 flex-wrap">
                    {sortingSteps[sortingStep]?.sorted.map((num, idx) => (
                      <Badge key={idx} variant="default" className="bg-green-500">
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCodingChallenge = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" />
          From Steps to Code
        </h3>
        <p className="text-gray-700 mb-4">
          Now let's translate our algorithm into actual code!
        </p>
        
        <Button 
          onClick={() => setShowCodeEditor(!showCodeEditor)}
          variant="outline"
          className="mb-4"
        >
          {showCodeEditor ? 'Hide' : 'Show'} Code Example
        </Button>

        {showCodeEditor && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <pre>{`# Our starting list of movie ratings
unsorted_list = [5, 2, 8, 1, 9, 4]
sorted_list = []

print(f"Starting: {unsorted_list}")

# Keep going until unsorted list is empty
while len(unsorted_list) > 0:
    # Find the smallest number
    smallest = min(unsorted_list)
    
    # Add it to sorted list
    sorted_list.append(smallest)
    
    # Remove it from unsorted list
    unsorted_list.remove(smallest)
    
    print(f"Found {smallest}, sorted: {sorted_list}")

print(f"Final result: {sorted_list}")
`}</pre>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Connection to AI
        </h4>
        <p className="text-sm text-gray-700">
          Netflix's AI calculates a "match score" for thousands of movies, then uses 
          sorting algorithms like this to show you your "Top 10 Picks"!
        </p>
      </div>
    </div>
  );

  const renderCompletion = () => (
    <div className="space-y-6 text-center">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-2xl font-bold mb-4">Algorithm Master!</h3>
        <p className="text-gray-700 mb-6">
          You've learned the fundamental language of computers and AI!
        </p>
        
        <div className="bg-white p-6 rounded-lg mb-6">
          <h4 className="font-semibold mb-4">🎯 What You've Mastered:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>What algorithms are</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>How to design step-by-step solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>The role of data in algorithms</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>How AI uses algorithms</span>
            </div>
          </div>
        </div>

        <Button onClick={onComplete} size="lg" className="w-full">
          <Trophy className="w-5 h-5 mr-2" />
          Complete Module
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.content) {
      case 'movie-analogy':
        return renderMovieAnalogy();
      case 'reflection-1':
        return renderReflectionQuestion('personal-algorithm');
      case 'reflection-2':
        return renderReflectionQuestion('data-importance');
      case 'netflix-explanation':
        return renderNetflixExplanation();
      case 'reflection-3':
        return renderReflectionQuestion('netflix-comparison');
      case 'sorting-demo':
        return renderSortingDemo();
      case 'coding-challenge':
        return renderCodingChallenge();
      case 'reflection-4':
        return renderReflectionQuestion('algorithm-definition');
      case 'completion':
        return renderCompletion();
      default:
        return <div>Step content not found</div>;
    }
  };

  const canProceed = () => {
    const step = steps[currentStep];
    if (step.content.startsWith('reflection-')) {
      const questionId = step.content.replace('reflection-', '');
      const questionMap = {
        '1': 'personal-algorithm',
        '2': 'data-importance', 
        '3': 'netflix-comparison',
        '4': 'algorithm-definition'
      };
      const actualQuestionId = questionMap[questionId as keyof typeof questionMap];
      return actualQuestionId && userReflections[actualQuestionId]?.trim().length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      markStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">From Movie Picks to AI Algorithms</h1>
              <p className="text-gray-600">Learn what algorithms are and how they power AI</p>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">25 min</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <Badge variant="outline">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{completedSteps.size} completed</span>
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mt-4" />
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-blue-100">{steps[currentStep].subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow-lg p-4">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentStep 
                    ? 'bg-blue-500' 
                    : completedSteps.has(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={currentStep === steps.length - 1 || !canProceed()}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}