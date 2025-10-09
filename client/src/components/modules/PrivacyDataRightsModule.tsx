import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, UserCheck, Lock, AlertTriangle, CheckCircle, ArrowRight, Award } from 'lucide-react';
import { useDevMode } from '@/context/DevModeContext';
import { useActivityRegistry } from '@/context/ActivityRegistryContext';

interface PrivacyScenario {
  id: string;
  title: string;
  situation: string;
  context: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  dataExample: {
    type: 'social-media' | 'health' | 'education' | 'shopping';
    collected: string[];
    used: string[];
    shared: string[];
  };
}

const privacyScenarios: PrivacyScenario[] = [
  {
    id: '1',
    title: 'Social Media Data Collection',
    situation: 'You sign up for a new social media app that promises to "connect you with like-minded people."',
    context: 'The app asks for access to your camera, microphone, location, contacts, and browsing history.',
    question: 'What should you be most concerned about?',
    options: [
      'The app might use too much battery',
      'The app could sell your personal data to third parties without clear consent',
      'The app might send too many notifications',
      'The app could take up too much storage space'
    ],
    correctAnswer: 1,
    explanation: 'Data privacy is the primary concern. Many apps collect far more data than needed and may share or sell it to advertisers, data brokers, or other companies without explicit user understanding.',
    dataExample: {
      type: 'social-media',
      collected: ['Your posts and photos', 'Location data', 'Contact list', 'Browsing habits', 'Voice recordings', 'Face recognition data'],
      used: ['Targeted advertising', 'Content recommendation', 'User profiling', 'Mood analysis', 'Social network mapping'],
      shared: ['Advertising companies', 'Data brokers', 'Government agencies', 'Partner apps', 'Research institutions']
    }
  },
  {
    id: '2',
    title: 'Healthcare AI Privacy',
    situation: 'Your doctor wants to use an AI system to help diagnose your symptoms.',
    context: 'The AI requires access to your complete medical history, including mental health records, genetic information, and lifestyle data.',
    question: 'What privacy protection should you ask about?',
    options: [
      'Whether the AI system is fast enough',
      'How your medical data will be stored, who can access it, and whether it will be anonymized',
      'If the AI can work with older computers',
      'Whether the diagnosis will be printed or digital'
    ],
    correctAnswer: 1,
    explanation: 'Medical data is extremely sensitive. You should know how it\'s stored (encrypted?), who has access (just your doctor or the AI company too?), whether it\'s anonymized, and if it will be used for research or training other AI systems.',
    dataExample: {
      type: 'health',
      collected: ['Medical records', 'Genetic data', 'Mental health history', 'Prescription history', 'Lifestyle habits', 'Insurance information'],
      used: ['Disease diagnosis', 'Treatment recommendations', 'Risk assessment', 'Drug research', 'Insurance pricing'],
      shared: ['AI company researchers', 'Pharmaceutical companies', 'Insurance providers', 'Government health agencies', 'Medical research institutions']
    }
  },
  {
    id: '3',
    title: 'Educational AI Monitoring',
    situation: 'Your school introduces an AI system that monitors student engagement during online classes.',
    context: 'The AI tracks eye movements, facial expressions, typing patterns, and how long you look at different parts of the screen.',
    question: 'What student data right is most important here?',
    options: [
      'The right to faster internet',
      'The right to know what data is collected and to opt out of unnecessary monitoring',
      'The right to use any device for class',
      'The right to take breaks during class'
    ],
    correctAnswer: 1,
    explanation: 'Students have the right to understand what behavioral and biometric data is being collected, how it\'s used, and to have unnecessary surveillance limited. Educational privacy laws like FERPA provide some protections, but AI monitoring often goes beyond traditional educational records.',
    dataExample: {
      type: 'education',
      collected: ['Eye movement patterns', 'Facial expressions', 'Typing speed and patterns', 'Screen interaction data', 'Attention metrics', 'Emotional state indicators'],
      used: ['Engagement scoring', 'Attention monitoring', 'Learning style analysis', 'Behavioral prediction', 'Performance evaluation'],
      shared: ['School administrators', 'Parents/guardians', 'AI technology vendors', 'Educational researchers', 'Third-party analytics companies']
    }
  },
  {
    id: '4',
    title: 'Smart Shopping AI Tracking',
    situation: 'An online store uses AI to customize your shopping experience.',
    context: 'The AI tracks your browsing history, purchase patterns, social media activity, and even analyzes your photos to suggest products.',
    question: 'Under privacy laws like GDPR, what right do you have?',
    options: [
      'The right to get free shipping',
      'The right to access, delete, and correct your personal data',
      'The right to return any item',
      'The right to unlimited customer service'
    ],
    correctAnswer: 1,
    explanation: 'Privacy laws like GDPR and CCPA give you rights over your personal data: the right to know what data is collected, access your data, correct inaccuracies, delete your data, and in some cases, move your data to another service.',
    dataExample: {
      type: 'shopping',
      collected: ['Purchase history', 'Browsing patterns', 'Social media photos', 'Product reviews', 'Location data', 'Device information'],
      used: ['Product recommendations', 'Price personalization', 'Inventory management', 'Marketing campaigns', 'Trend analysis'],
      shared: ['Partner retailers', 'Advertising networks', 'Market research firms', 'Social media platforms', 'Payment processors']
    }
  }
];

interface PrivacyDataRightsModuleProps {
  onComplete: () => void;
  userName?: string;
}

export function PrivacyDataRightsModule({ onComplete, userName = "AI Explorer" }: PrivacyDataRightsModuleProps) {
  // Get isDevMode from context
  const { isDevModeActive: isDevMode } = useDevMode();

  // ActivityRegistry hooks
  const { registerActivity, clearRegistry, goToActivity } = useActivityRegistry();

  const [currentStep, setCurrentStep] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Define activities for this module
  const activities = [
    { id: 'intro', title: 'Introduction', type: 'interactive' as const },
    ...privacyScenarios.map((scenario, index) => ({
      id: `scenario-${index}`,
      title: scenario.title,
      type: 'interactive' as const
    })),
    { id: 'results', title: 'Results & Certificate', type: 'certificate' as const }
  ];

  // Register activities with ActivityRegistry on mount
  useEffect(() => {
    console.log('🔧 PrivacyDataRightsModule: Registering activities...');
    clearRegistry();

    activities.forEach((activity, index) => {
      const activityRegistration = {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        completed: currentStep === 0 ? currentScenario > index - 1 : showResults && index === activities.length - 1
      };
      console.log(`📝 Registering activity: ${activityRegistration.id} (${activityRegistration.type})`);
      registerActivity(activityRegistration);
    });
  }, []); // Only register once on mount to avoid loops

  // Listen for dev panel navigation commands
  useEffect(() => {
    const handleGoToActivity = (event: CustomEvent) => {
      const activityIndex = event.detail;
      console.log(`🎯 PrivacyDataRightsModule: Received goToActivity command for index ${activityIndex}`);

      if (activityIndex === 0) {
        // Go to intro
        setCurrentStep(0);
        setCurrentScenario(0);
        setShowResults(false);
      } else if (activityIndex > 0 && activityIndex <= privacyScenarios.length) {
        // Go to specific scenario
        setCurrentStep(1);
        setCurrentScenario(activityIndex - 1);
        setShowResults(false);
        setShowExplanation(false);
        setSelectedAnswer(null);
      } else if (activityIndex === activities.length - 1) {
        // Go to results
        setShowResults(true);
      }

      console.log(`✅ Jumped to activity ${activityIndex}`);
    };

    window.addEventListener('goToActivity', handleGoToActivity as EventListener);

    return () => {
      window.removeEventListener('goToActivity', handleGoToActivity as EventListener);
    };
  }, [activities.length]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === privacyScenarios[currentScenario].correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNextScenario = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    if (currentScenario < privacyScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderDataFlowExample = (dataExample: any) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'social-media': return '📱';
        case 'health': return '🏥';
        case 'education': return '🎓';
        case 'shopping': return '🛒';
        default: return '📊';
      }
    };

    return (
      <div className="bg-gray-900 p-6 rounded-xl space-y-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{getIcon(dataExample.type)}</div>
          <h4 className="text-white font-bold">Your Data Journey</h4>
        </div>

        {/* Data Collection */}
        <div className="bg-blue-500/20 border border-blue-400/30 p-4 rounded-xl">
          <h5 className="text-blue-300 font-semibold mb-3 flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Data Collected About You</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {dataExample.collected.map((item: string, i: number) => (
              <div key={i} className="bg-white/10 p-2 rounded border border-white/20">
                <span className="text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Usage */}
        <div className="bg-yellow-500/20 border border-yellow-400/30 p-4 rounded-xl">
          <h5 className="text-yellow-300 font-semibold mb-3 flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>How Your Data Is Used</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {dataExample.used.map((item: string, i: number) => (
              <div key={i} className="bg-white/10 p-2 rounded border border-white/20">
                <span className="text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-red-500/20 border border-red-400/30 p-4 rounded-xl">
          <h5 className="text-red-300 font-semibold mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Who Gets Access to Your Data</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {dataExample.shared.map((item: string, i: number) => (
              <div key={i} className="bg-white/10 p-2 rounded border border-white/20">
                <span className="text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-red-200 text-xs text-center">
            ⚠️ Often shared without explicit user awareness
          </div>
        </div>
      </div>
    );
  };

  const renderIntroduction = () => (
    <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Shield className="w-8 h-8" />
          Privacy and Data Rights in the AI Age
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg">
          AI systems collect vast amounts of personal data. Understanding your privacy rights 
          and how to protect your data is essential in today's digital world.
        </div>
        
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="font-bold mb-3">What You'll Learn:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>What data AI systems collect about you</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Your legal rights under privacy laws</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>How to protect your personal information</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>When and how to give informed consent</span>
            </li>
          </ul>
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Your Key Privacy Rights:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-300" />
              <span className="text-sm">Right to Know</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-300" />
              <span className="text-sm">Right to Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-300" />
              <span className="text-sm">Right to Delete</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-300" />
              <span className="text-sm">Right to Opt Out</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => setCurrentStep(1)}
          className="w-full bg-white text-purple-600 hover:bg-gray-100"
        >
          Start Learning About Your Rights
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderScenario = () => {
    const scenario = privacyScenarios[currentScenario];
    
    return (
      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Scenario {currentScenario + 1}: {scenario.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Situation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Situation:</h4>
              <p className="text-blue-700 dark:text-blue-200">{scenario.situation}</p>
            </div>

            {/* Context */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">What Happens:</h4>
              <p className="text-orange-700 dark:text-orange-200">{scenario.context}</p>
            </div>

            {/* Data Flow Visualization */}
            {renderDataFlowExample(scenario.dataExample)}

            {/* Question */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-4">{scenario.question}</h4>
              <div className="space-y-3">
                {scenario.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(i)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedAnswer === i
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {selectedAnswer !== null && !showExplanation && (
                <Button onClick={handleAnswerSubmit} className="mt-4 bg-purple-600 hover:bg-purple-700">
                  Submit Answer
                </Button>
              )}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  {selectedAnswer === scenario.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <h4 className="font-bold text-green-800 dark:text-green-300">
                    {selectedAnswer === scenario.correctAnswer ? 'Correct!' : 'Not quite right'}
                  </h4>
                </div>
                <p className="text-green-700 dark:text-green-200 mb-4">{scenario.explanation}</p>
                <Button onClick={handleNextScenario} className="bg-green-600 hover:bg-green-700">
                  {currentScenario < privacyScenarios.length - 1 ? 'Next Scenario' : 'See Results'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResults = () => {
    const score = Math.round((correctAnswers / privacyScenarios.length) * 100);
    
    return (
      <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl flex items-center justify-center gap-3">
            <Award className="w-8 h-8" />
            Privacy Rights Mastery Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="text-6xl font-bold">{score}%</div>
          <div className="text-xl">
            You correctly identified {correctAnswers} out of {privacyScenarios.length} privacy scenarios
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg text-left">
            <h3 className="font-bold text-xl mb-4">Key Privacy Action Items:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 text-green-300" />
                <span><strong>Read privacy policies</strong> - Especially the data sharing sections</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 text-green-300" />
                <span><strong>Adjust privacy settings</strong> - Limit data collection when possible</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 text-green-300" />
                <span><strong>Exercise your rights</strong> - Request data access, corrections, or deletion</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 text-green-300" />
                <span><strong>Stay informed</strong> - Privacy laws and AI capabilities are constantly evolving</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 text-green-300" />
                <span><strong>Ask questions</strong> - Don't hesitate to contact companies about their data practices</span>
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={handleComplete}
            className="w-full bg-white text-blue-600 hover:bg-gray-100 text-lg py-3"
          >
            Complete Module
            <Award className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (showResults) {
    return renderResults();
  }

  if (currentStep === 0) {
    return renderIntroduction();
  }

  return renderScenario();
}