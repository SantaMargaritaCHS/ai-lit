import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Search, 
  Mail, 
  Mic, 
  Check, 
  X, 
  ArrowRight, 
  Code, 
  Brain,
  Lightbulb,
  Sparkles,
  Loader
} from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const examples = [
  {
    task: "Finding Important Words",
    withoutNLP: {
      code: `// Without NLP - Basic string matching
if (text.includes("important")) {
  return "Found the word 'important'";
}`,
      result: "Can only find exact matches",
      icon: X
    },
    withNLP: {
      code: `// With NLP - Understanding context
const keywords = extractKeyPhrases(text);
// Returns: ["climate change", "global impact", "urgent action"]`,
      result: "Identifies meaningful phrases and concepts",
      icon: Check
    }
  },
  {
    task: "Understanding Questions",
    withoutNLP: {
      code: `// Without NLP - Rigid patterns
if (text.startsWith("What is")) {
  return "This is a definition question";
}`,
      result: "Only recognizes specific formats",
      icon: X
    },
    withNLP: {
      code: `// With NLP - Flexible understanding
const intent = analyzeQuestion(text);
// "Tell me about dogs" → intent: "information_request"
// "How do dogs behave?" → intent: "information_request"`,
      result: "Understands meaning regardless of phrasing",
      icon: Check
    }
  },
  {
    task: "Language Translation",
    withoutNLP: {
      code: `// Without NLP - Word-by-word
translate["hello"] = "hola";
translate["world"] = "mundo";
// Result: "hola mundo"`,
      result: "Literal, often incorrect translations",
      icon: X
    },
    withNLP: {
      code: `// With NLP - Context-aware
translateWithContext("It's raining cats and dogs");
// Result: "Está lloviendo mucho" (It's raining a lot)
// Not: "Está lloviendo gatos y perros"`,
      result: "Understands idioms and context",
      icon: Check
    }
  }
];

const applications = [
  {
    icon: MessageCircle,
    title: "Chatbots & Virtual Assistants",
    example: "Siri understanding 'Set a timer for 10 minutes'"
  },
  {
    icon: Search,
    title: "Smart Search Engines",
    example: "Google understanding 'that movie with the blue people on an alien planet' → Avatar"
  },
  {
    icon: Mail,
    title: "Email Filters",
    example: "Gmail identifying spam without just looking for specific words"
  },
  {
    icon: Mic,
    title: "Voice to Text",
    example: "Your phone converting speech to text messages"
  }
];

export default function NLPDefinition({ onComplete }: Props) {
  const [currentExample, setCurrentExample] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [nlpAnalysis, setNlpAnalysis] = useState<{
    withoutNLP: { characters: number; words: number };
    withNLP: { topic: string; sentiment: string; entities: string[] };
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const analyzeTextWithAPI = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const response = await fetch('/api/ai/nlp-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze text');
      }

      const data = await response.json();
      
      const withoutNLP = {
        characters: text.length,
        words: text.split(' ').length
      };

      const withNLP = {
        topic: data.analysis.topic || 'Unknown',
        sentiment: data.analysis.sentiment || 'Neutral 😐',
        entities: data.analysis.entities || ['none detected']
      };

      setNlpAnalysis({ withoutNLP, withNLP });
    } catch (error) {
      console.error('NLP analysis error:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
      
      // Fallback to basic analysis
      const withoutNLP = {
        characters: text.length,
        words: text.split(' ').length
      };

      const withNLP = {
        topic: 'Analysis unavailable',
        sentiment: 'Analysis unavailable',
        entities: ['API error']
      };

      setNlpAnalysis({ withoutNLP, withNLP });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    if (!userInput.trim()) return;
    
    setIsAnalyzing(true);
    
    analyzeTextWithAPI(userInput);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-12 h-12 text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">What is Natural Language Processing (NLP)?</h1>
            </div>
            
            {/* Main Definition */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 mb-8">
              <p className="text-xl text-white leading-relaxed">
                🗣️ <strong>Natural Language Processing (NLP)</strong> is how computers learn to understand and work with human language.
              </p>
              <p className="text-lg text-blue-200 mt-4">
                Think of it as teaching computers to "read" and "understand" text the way humans do - but using math and patterns instead of actual comprehension.
              </p>
            </div>
          </div>

          {/* Interactive Comparison */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              The Difference NLP Makes
            </h2>
            
            <div className="mb-4 flex justify-center">
              <div className="flex bg-white/5 rounded-lg p-1">
                {examples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentExample(index)}
                    className={`px-4 py-2 rounded transition-all ${
                      currentExample === index
                        ? 'bg-blue-500 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Example {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={currentExample}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Without NLP */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {React.createElement(examples[currentExample].withoutNLP.icon, { className: "w-6 h-6 text-red-400 mr-2" })}
                  <h3 className="text-lg font-semibold text-white">Without NLP</h3>
                </div>
                <div className="bg-gray-900/50 rounded p-4 mb-4">
                  <code className="text-sm text-gray-300 whitespace-pre-wrap">
                    {examples[currentExample].withoutNLP.code}
                  </code>
                </div>
                <p className="text-red-200">{examples[currentExample].withoutNLP.result}</p>
              </div>

              {/* With NLP */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {React.createElement(examples[currentExample].withNLP.icon, { className: "w-6 h-6 text-green-400 mr-2" })}
                  <h3 className="text-lg font-semibold text-white">With NLP</h3>
                </div>
                <div className="bg-gray-900/50 rounded p-4 mb-4">
                  <code className="text-sm text-gray-300 whitespace-pre-wrap">
                    {examples[currentExample].withNLP.code}
                  </code>
                </div>
                <p className="text-green-200">{examples[currentExample].withNLP.result}</p>
              </div>
            </motion.div>

            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold text-white mb-2">
                {examples[currentExample].task}
              </h3>
            </div>
          </div>

          {/* Real-World Applications */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              NLP in Your Daily Life
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {applications.map((app, index) => (
                <motion.div
                  key={app.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all"
                >
                  {React.createElement(app.icon, { className: "w-8 h-8 text-blue-400 mx-auto mb-3" })}
                  <h3 className="font-semibold text-white mb-2">{app.title}</h3>
                  <p className="text-sm text-blue-200">{app.example}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Connection to LLMs */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <ArrowRight className="w-6 h-6 text-purple-400 mr-2" />
                How NLP Relates to Large Language Models
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-white">
                <div className="flex items-start">
                  <Sparkles className="w-5 h-5 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                  <p>LLMs are the most advanced form of NLP</p>
                </div>
                <div className="flex items-start">
                  <Brain className="w-5 h-5 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                  <p>They use neural networks to process language at massive scale</p>
                </div>
                <div className="flex items-start">
                  <Code className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                  <p>While early NLP used rules, LLMs learn patterns from data</p>
                </div>
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                  <p>This is why ChatGPT can understand almost any question you ask!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Try it Yourself!
            </h2>
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-white mb-4">Type a sentence and press Enter or click Analyze:</p>
              
              <div className="mb-6">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Type a sentence and press Enter or click Analyze"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-white/20 focus:border-blue-400 focus:outline-none"
                  disabled={isAnalyzing}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!userInput.trim() || isAnalyzing}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg transition-all"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze with NLP'}
                </button>
                {isAnalyzing && (
                  <div className="flex items-center justify-center mt-2 text-blue-300">
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Analyzing with Gemini AI...</span>
                  </div>
                )}
                {analysisError && (
                  <div className="mt-2 text-red-300 text-sm">
                    ⚠️ {analysisError}
                  </div>
                )}
              </div>

              {nlpAnalysis && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">Without NLP:</h3>
                    <p className="text-red-200">
                      {nlpAnalysis.withoutNLP.characters} characters, {nlpAnalysis.withoutNLP.words} words
                    </p>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">With NLP (Gemini AI):</h3>
                    <div className="space-y-2 text-green-200">
                      <p><strong>Topic:</strong> {nlpAnalysis.withNLP.topic}</p>
                      <p><strong>Sentiment:</strong> {nlpAnalysis.withNLP.sentiment}</p>
                      <p><strong>Entities:</strong> {nlpAnalysis.withNLP.entities.join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center space-x-2">
                <button
                  onClick={() => {
                    setUserInput("I enjoy learning about machine learning and deep neural networks!");
                    setTimeout(() => analyzeTextWithAPI("I enjoy learning about machine learning and deep neural networks!"), 100);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  disabled={isAnalyzing}
                >
                  Try Another Example
                </button>
                <button
                  onClick={() => {
                    setUserInput("This weather is absolutely terrible and ruining my day!");
                    setTimeout(() => analyzeTextWithAPI("This weather is absolutely terrible and ruining my day!"), 100);
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  disabled={isAnalyzing}
                >
                  Try Negative Text
                </button>
                <button
                  onClick={() => {
                    setUserInput("The company reported quarterly earnings today. Sales increased by 15% compared to last year.");
                    setTimeout(() => analyzeTextWithAPI("The company reported quarterly earnings today. Sales increased by 15% compared to last year."), 100);
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  disabled={isAnalyzing}
                >
                  Try Neutral Text
                </button>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center mx-auto"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-white/60 text-sm mt-2">Estimated time: 3-4 minutes</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}