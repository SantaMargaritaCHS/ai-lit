import { useState, useEffect } from 'react';
import { Target, Lightbulb, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ApplicationActivity as ApplicationActivityType } from '@/types/video-activities';

interface ApplicationActivityProps {
  activity: ApplicationActivityType;
  onComplete: (response: string) => void;
}

export function ApplicationActivity({ activity, onComplete }: ApplicationActivityProps) {
  const [response, setResponse] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  
  // Add effect to prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);
  
  return (
    <div className="reflection-modal-overlay">
      <div className="reflection-modal-content">
        <div className="p-6">
      <div className="activity-header">
        <div className="activity-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Apply Your Knowledge</h2>
          <p className="text-sm text-gray-600">Put what you've learned into practice</p>
        </div>
      </div>
      
      <div className="activity-content">
        {/* Scenario */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2 text-blue-900">Scenario:</h3>
          <p className="text-blue-800">{activity.scenario}</p>
        </div>
        
        {/* Task */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-gray-900">Your Task:</h3>
          <p className="text-gray-700">{activity.task}</p>
        </div>
        
        {/* Examples */}
        {activity.examples && activity.examples.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="text-green-600 text-sm hover:underline transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              {showExamples ? 'Hide examples' : 'See examples to get started'}
            </button>
            
            {showExamples && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
                <p className="text-sm font-medium mb-2 text-green-900">Example approaches:</p>
                <ul className="text-sm space-y-1 text-green-800">
                  {activity.examples.map((example, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Hints */}
        {activity.hints && activity.hints.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-orange-600 text-sm hover:underline transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-4 h-4" />
              {showHints ? 'Hide hints' : 'Need some hints?'}
            </button>
            
            {showHints && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2">
                <p className="text-sm font-medium mb-2 text-orange-900">Helpful hints:</p>
                <ul className="text-sm space-y-1 text-orange-800">
                  {activity.hints.map((hint, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">💡</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Response Area */}
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Describe your approach and solution..."
          className="w-full min-h-[150px] mb-4 bg-gray-50 border-gray-200"
        />
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {response.length} characters
          </div>
          {response.trim().length > 20 && (
            <div className="text-green-600 text-sm font-medium">✓ Good progress</div>
          )}
        </div>
        
        <Button
          onClick={() => onComplete(response)}
          disabled={!response.trim() || response.trim().length < 20}
          className="continue-button"
        >
          Submit Application
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}