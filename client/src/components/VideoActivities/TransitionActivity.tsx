import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransitionActivity as TransitionActivityType } from '@/types/video-activities';

interface TransitionActivityProps {
  activity: TransitionActivityType;
  onComplete: () => void;
}

export function TransitionActivity({ activity, onComplete }: TransitionActivityProps) {
  const [ready, setReady] = useState(false);
  
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
        <div className="activity-icon transition">
          <ArrowRight className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Ready for What's Next?</h2>
          <p className="text-sm text-gray-600">Let's connect the dots and move forward</p>
        </div>
      </div>
      
      <div className="activity-content">
        {/* Current Topic Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2 text-blue-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            What You Just Learned:
          </h3>
          <p className="text-blue-800">
            {activity.currentTopicSummary}
          </p>
        </div>
        
        {/* Connection Bridge */}
        <div className="my-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1" />
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Connection
            </span>
            <div className="h-px bg-gradient-to-l from-transparent via-purple-400 to-transparent flex-1" />
          </div>
          <p className="text-center text-sm text-gray-600 italic bg-purple-50 p-3 rounded-lg">
            {activity.connectionExplanation}
          </p>
        </div>
        
        {/* Next Topic Preview */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2 text-gray-900">
            Coming Next: {activity.nextTopicPreview.title}
          </h3>
          <p className="text-gray-700 mb-3">
            {activity.nextTopicPreview.description}
          </p>
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-sm font-medium mb-2 text-gray-800">You'll discover:</p>
            <ul className="text-sm space-y-2">
              {activity.nextTopicPreview.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5 font-bold">▸</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Ready Checkbox */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
          <input
            type="checkbox"
            checked={ready}
            onChange={(e) => setReady(e.target.checked)}
            className="w-5 h-5 text-green-600"
          />
          <span className="text-sm font-medium text-green-800">
            I understand the connection and I'm ready to continue learning!
          </span>
        </label>
        
        <Button
          onClick={onComplete}
          disabled={!ready}
          className="continue-button"
        >
          Start Next Video
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}