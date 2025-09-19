// Create: /client/src/components/UnderstandingLLMModule/activities/ExitTicketLLM.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Loader, AlertCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function ExitTicketLLM({ onComplete }: Props) {
  const [responses, setResponses] = useState(['', '']);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(true);

  const questions = [
    {
      id: 'perspective',
      question: "How does understanding how LLMs work (pattern matching, not true understanding) change your perspective on using AI tools like ChatGPT?",
      placeholder: "Think about how this knowledge affects your expectations and usage...",
      minLength: 50,
      focusArea: "LLM understanding and perspective"
    },
    {
      id: 'students',
      question: "Why do you think it's important for students to understand how LLMs actually work, not just how to use them?",
      placeholder: "Consider digital literacy, critical thinking, and responsible AI use...",
      minLength: 50,
      focusArea: "Educational importance and digital literacy"
    }
  ];

  // Improved fallback function with more varied responses
  const getEducationFallback = (response: string, focusArea: string): string => {
    const responseLength = response.trim().split(/\s+/).length;
    const lowercaseResponse = response.toLowerCase();
    
    // Check for quality indicators
    const hasExample = lowercaseResponse.includes('example') || 
                       lowercaseResponse.includes('for instance');
    const hasClassroom = lowercaseResponse.includes('classroom') || 
                         lowercaseResponse.includes('student') ||
                         lowercaseResponse.includes('teach');
    const hasAI = lowercaseResponse.includes('ai') || 
                  lowercaseResponse.includes('llm') ||
                  lowercaseResponse.includes('chatgpt') ||
                  lowercaseResponse.includes('pattern');
    
    // Generate contextual fallback based on focus area
    if (focusArea.includes('perspective')) {
      if (responseLength < 10) {
        return "I notice your response is quite brief. To get the most from this reflection, try expanding on how understanding LLM mechanics might change your teaching approach or AI tool usage.";
      }
      
      if (hasExample && hasAI) {
        return "Excellent job connecting LLM mechanics to real-world applications! Your understanding of pattern matching vs. true comprehension will help you set appropriate expectations when using AI tools in your teaching.";
      }
      
      if (hasClassroom) {
        return "Great connection to classroom applications! Your awareness of how LLMs actually work will help you guide students in using these tools more effectively and critically.";
      }
      
      return "Your perspective on AI limitations will help you guide students effectively in understanding both the capabilities and boundaries of these tools.";
    }
    
    if (focusArea.includes('Educational') || focusArea.includes('digital literacy')) {
      if (responseLength < 10) {
        return "Consider expanding on your thoughts about why technical understanding matters for students. What specific benefits do you see from students knowing how LLMs work?";
      }
      
      if (hasExample && hasClassroom) {
        return "Excellent reasoning about student education! Your examples show deep understanding of how technical knowledge empowers critical thinking and responsible AI use.";
      }
      
      if (lowercaseResponse.includes('critical') || lowercaseResponse.includes('think')) {
        return "Perfect focus on critical thinking! You're absolutely right that understanding LLM mechanics helps students become more discerning users rather than passive consumers of AI output.";
      }
      
      return "Understanding the 'why' behind AI is crucial for developing critical digital citizens who can navigate an AI-powered world responsibly.";
    }
    
    // Generic encouraging fallback
    return "Thank you for your thoughtful reflection! Your insights about LLM mechanics will help you guide students in using AI tools more effectively and responsibly.";
  };

  const generateFeedback = async (response: string, focusArea: string): Promise<string> => {
    console.log('[Exit Ticket] Generating feedback for:', response.substring(0, 50) + '...');
    console.log('[Exit Ticket] Focus area:', focusArea);
    
    try {
      // Log the API endpoint being used
      console.log('[Exit Ticket] API Endpoint:', '/api/gemini/feedback');
      
      const apiResponse = await fetch('/api/gemini/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: response,
          context: `Understanding Large Language Models module exit ticket feedback for focus area: ${focusArea}. 
          
          Provide encouraging, specific feedback (2-3 sentences) that:
          1. Acknowledges their specific insights about LLM mechanics and pattern recognition
          2. Connects their understanding to practical classroom or AI tool usage implications
          3. Reinforces the educational value of understanding how LLMs actually work
          4. Uses a warm, professional teacher-to-teacher tone
          
          Focus on their actual response content and avoid generic praise. Reference their specific examples or reasoning when possible.`
        })
      });
      
      console.log('[Exit Ticket] API Response status:', apiResponse.status);
      
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('[Exit Ticket] API request failed:', apiResponse.status, errorText);
        
        // Check if it's a network error, auth error, or rate limit
        if (apiResponse.status === 429) {
          console.warn('[Exit Ticket] Rate limit reached, using fallback');
        } else if (apiResponse.status === 401 || apiResponse.status === 403) {
          console.error('[Exit Ticket] Authentication error, API key may be invalid');
          setApiHealthy(false);
        }
        
        throw new Error(`API error: ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      console.log('[Exit Ticket] API Response received successfully');
      
      if (data.feedback) {
        return data.feedback;
      } else {
        console.warn('[Exit Ticket] Empty API response, using fallback');
        return getEducationFallback(response, focusArea);
      }
    } catch (error) {
      console.error('[Exit Ticket] API Error:', error);
      if (error instanceof Error && error.message) {
        console.error('[Exit Ticket] Error details:', error.message);
      }
      return getEducationFallback(response, focusArea);
    }
  };

  const handleSubmit = async () => {
    if (responses.every(r => r.trim().length >= questions[0].minLength)) {
      setIsSubmitting(true);
      setIsGeneratingFeedback(true);
      setFeedbackError(false);
      
      try {
        console.log('[Exit Ticket] Starting feedback generation for', responses.length, 'responses');
        
        // Generate feedback for both responses
        const feedback = await Promise.all(
          responses.map((response, index) => 
            generateFeedback(response, questions[index].focusArea)
          )
        );
        
        console.log('[Exit Ticket] All feedback generated successfully');
        setAiFeedback(feedback);
        setShowFeedback(true);
      } catch (error) {
        console.error('[Exit Ticket] Error in handleSubmit:', error);
        setFeedbackError(true);
        
        // Use improved fallback responses
        const fallbackFeedback = responses.map((response, index) => 
          getEducationFallback(response, questions[index].focusArea)
        );
        
        setAiFeedback(fallbackFeedback);
        setShowFeedback(true);
      } finally {
        setIsSubmitting(false);
        setIsGeneratingFeedback(false);
      }
    }
  };

  // API Health Check
  useEffect(() => {
    // Development check for API availability
    if (process.env.NODE_ENV === 'development') {
      fetch('/api/ai/gemini/health')
        .then(res => res.json())
        .then(data => {
          if (data.status !== 'healthy') {
            console.warn('[Exit Ticket] Gemini API not healthy. Status:', data.status);
            setApiHealthy(false);
          } else {
            console.log('[Exit Ticket] Gemini API health check passed');
          }
        })
        .catch(() => {
          console.warn('[Exit Ticket] Cannot reach API health endpoint');
          setApiHealthy(false);
        });
    }
  }, []);

  // Developer Mode: Auto-fill functionality
  useEffect(() => {
    const handleDevAutoComplete = (event: any) => {
      if (event.detail?.moduleId === 'understanding-llms') {
        console.log('🔧 Developer mode: Auto-filling exit ticket responses');
        
        const devResponses = [
          "Understanding that LLMs work through pattern matching rather than true comprehension has fundamentally changed how I view AI tools. I now see them as sophisticated prediction systems that can be incredibly useful but require critical evaluation. This knowledge makes me more cautious about accepting AI outputs without verification, especially for factual claims or complex reasoning tasks.",
          "Students need to understand how LLMs actually work because it develops critical thinking skills essential for the AI age. When students know that AI is predicting likely next words based on training patterns, they become better at evaluating outputs, asking better questions, and understanding limitations. This technical literacy prevents over-reliance on AI and helps them become more discerning digital citizens."
        ];
        
        setResponses(devResponses);
        
        // Auto-submit after a brief delay
        setTimeout(() => {
          handleSubmit();
        }, 1000);
      }
    };

    window.addEventListener('dev-auto-complete-activity', handleDevAutoComplete);
    return () => window.removeEventListener('dev-auto-complete-activity', handleDevAutoComplete);
  }, []);

  if (showFeedback) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Excellent Reflections!
            </h2>
            <p className="text-blue-200">Your insights will shape how you teach AI literacy</p>
          </div>

          <div className="space-y-6 mb-8">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-blue-400 font-medium mb-3">{question.question}</h3>
                <p className="text-gray-200 italic mb-4">"{responses[index]}"</p>
                
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-400/30">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white">{aiFeedback[index]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Get Your Certificate
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
        <div className="text-center mb-8">
          <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">
            Exit Ticket: Your Reflections
          </h2>
          <p className="text-blue-200">Share your thoughts to complete this learning experience</p>
        </div>

        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                {index + 1}. {question.question}
              </h3>
              
              <textarea
                value={responses[index]}
                onChange={(e) => {
                  const newResponses = [...responses];
                  newResponses[index] = e.target.value;
                  setResponses(newResponses);
                }}
                placeholder={question.placeholder}
                className="w-full h-32 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              
              <div className="flex justify-between text-sm">
                <span className={`${
                  responses[index].length >= question.minLength 
                    ? 'text-green-400' 
                    : 'text-gray-400'
                }`}>
                  {responses[index].length >= question.minLength ? '✓' : '•'} 
                  Minimum {question.minLength} characters
                </span>
                <span className="text-gray-400">
                  {responses[index].length}/{question.minLength}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {/* Loading and Error States */}
          {isGeneratingFeedback && (
            <div className="flex items-center justify-center gap-3 text-blue-300 bg-blue-900/20 rounded-lg p-4">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating personalized feedback...</span>
            </div>
          )}
          
          {feedbackError && (
            <div className="flex items-center gap-3 text-orange-300 bg-orange-900/20 rounded-lg p-4">
              <AlertCircle className="w-5 h-5" />
              <span>Using enhanced fallback responses for feedback</span>
            </div>
          )}
          
          {!apiHealthy && (
            <div className="flex items-center gap-3 text-yellow-300 bg-yellow-900/20 rounded-lg p-4 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>AI feedback service unavailable - using intelligent fallback responses</span>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={!responses.every(r => r.trim().length >= questions[0].minLength) || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              responses.every(r => r.trim().length >= questions[0].minLength) && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Generating Feedback...' : 'Submit Reflections'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}