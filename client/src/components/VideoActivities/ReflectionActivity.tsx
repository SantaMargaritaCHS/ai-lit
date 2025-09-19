import { useState, useEffect } from 'react';
import { Brain, Sparkles, Loader2, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ReflectionActivity as ReflectionActivityType } from '@/types/video-activities';
import { useDeveloperMode } from '@/hooks/useDeveloperMode';

interface ReflectionActivityProps {
  activity: ReflectionActivityType;
  onComplete: (response: string) => void;
  onReplay?: () => void;
}

export function ReflectionActivity({ activity, onComplete, onReplay }: ReflectionActivityProps) {
  const [response, setResponse] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { isDevMode } = useDeveloperMode();

  // Add effect to prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Developer mode auto-fill responses based on activity type
  const getDevResponse = () => {
    if (activity.id === 'daily-ai-reflection') {
      return "I used voice assistant for setting alarms, got Netflix recommendations based on viewing history, and used GPS navigation with traffic predictions.";
    } else if (activity.id === 'ai-definition-check') {
      return "AI is like a smart computer system that learns from data to recognize patterns and make decisions, similar to how humans learn but much faster and with more data.";
    }
    return "This is a developer mode auto-generated response for testing purposes.";
  };

  const handleDevSkip = () => {
    const devResponse = getDevResponse();
    setResponse(devResponse);
    setAiFeedback("Great understanding! Your explanation shows you've grasped the key concepts of AI as pattern recognition and learning systems.");
    setShowFeedback(true);
    // Auto-complete after showing feedback
    setTimeout(() => onComplete(devResponse), 1000);
  };
  
  return (
    <div className="reflection-modal-overlay">
      <div className="reflection-modal-content">
        <div className="p-6">
      {/* Developer Mode Controls */}
      {isDevMode && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Developer Mode: Reflection Shortcuts</h3>
          <div className="flex gap-2">
            <Button 
              onClick={handleDevSkip}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              <Zap className="w-3 h-3 mr-1" />
              Auto-Fill & Complete
            </Button>
            <Button 
              onClick={() => {
                const devResponse = getDevResponse();
                setResponse(devResponse);
              }}
              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
              size="sm"
            >
              Fill Response Only
            </Button>
          </div>
          <p className="text-xs text-red-600 mt-1">Pre-fills appropriate response for this reflection</p>
        </div>
      )}

      <div className="activity-header">
        <div className="activity-icon reflection">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pause & Reflect</h2>
          <p className="text-sm text-gray-600">Take a moment to think deeply</p>
        </div>
      </div>
      
      <div className="activity-content">
        <p className="text-lg mb-4 text-gray-800">{activity.prompt}</p>
        
        {/* Show replay button for AI definition question */}
        {onReplay && activity.id === 'ai-definition-check' && (
          <div className="mb-4">
            <Button
              onClick={onReplay}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Replay Video from Last Segment
            </Button>
          </div>
        )}
        
        {activity.guidingQuestions && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-200">
            <p className="text-sm font-medium mb-2 text-blue-900">Consider these questions:</p>
            <ul className="list-disc list-inside text-sm space-y-1 text-blue-800">
              {activity.guidingQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Show textarea only if no feedback yet */}
        {!showFeedback && (
          <>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Share your thoughts and insights..."
              className="w-full min-h-[120px] mb-4 bg-gray-50 border-gray-200"
            />
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                {response.length} characters
                {activity.minResponseLength && ` (minimum: ${activity.minResponseLength})`}
              </div>
              {activity.minResponseLength && response.length >= activity.minResponseLength && (
                <div className="text-green-600 text-sm font-medium">✓ Ready to continue</div>
              )}
            </div>
          </>
        )}
        
        {/* Display AI Feedback - Replace textarea content */}
        {showFeedback && aiFeedback && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 mb-3">AI Comments</h4>
                <p className="text-purple-800 leading-relaxed">{aiFeedback}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={async () => {
            if (!showFeedback && activity.aiGenerated) {
              // Get AI feedback automatically when submitting
              setIsLoadingFeedback(true);
              try {
                const feedbackResponse = await fetch('/api/ai-feedback', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    activityType: 'reflection',
                    activityTitle: activity.title || 'AI concepts',
                    question: activity.prompt,
                    answer: response
                  })
                });
                const data = await feedbackResponse.json();
                setAiFeedback(data.feedback || 'Great reflection! Keep thinking about AI in your daily life.');
                setShowFeedback(true);
                setIsLoadingFeedback(false);
                
                // No auto-continue - user must click Continue button
              } catch (error) {
                console.error('Failed to get AI feedback:', error);
                setAiFeedback('Thank you for your thoughtful reflection! AI literacy is an important skill to develop.');
                setShowFeedback(true);
                setIsLoadingFeedback(false);
                
                // No auto-continue - user must click Continue button
              }
            } else {
              onComplete(response);
            }
          }}
          disabled={activity.minResponseLength ? response.length < activity.minResponseLength : !response.trim()}
          className="continue-button w-full"
        >
          {isLoadingFeedback ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting AI Comments...
            </>
          ) : (
            showFeedback ? 'Continue Learning' : 'Submit'
          )}
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}