import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react';

interface PatternDetectiveActivityProps {
  onComplete: () => void;
}

export default function PatternDetectiveActivity({ onComplete }: PatternDetectiveActivityProps) {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [revealedPatterns, setRevealedPatterns] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const educationPatterns = [
    {
      id: 'attendance',
      title: 'Student Attendance vs. Grades',
      description: 'Look at this data from a fictional classroom',
      data: [
        { label: 'Student A', attendance: 95, grade: 'A', color: 'bg-green-500' },
        { label: 'Student B', attendance: 85, grade: 'B', color: 'bg-blue-500' },
        { label: 'Student C', attendance: 70, grade: 'C', color: 'bg-yellow-500' },
        { label: 'Student D', attendance: 60, grade: 'D', color: 'bg-red-500' }
      ],
      pattern: 'Higher attendance correlates with better grades',
      aiPerspective: 'AI would predict: If attendance = 90%, likely grade = A or B',
      criticalThinking: 'But does attendance cause better grades, or do motivated students both attend more AND study harder?'
    },
    {
      id: 'reading',
      title: 'Reading Level vs. Vocabulary Size',
      description: 'Data from literacy assessments',
      data: [
        { label: 'Grade 3', readingLevel: 3, vocabulary: 3000, color: 'bg-purple-500' },
        { label: 'Grade 5', readingLevel: 5, vocabulary: 5000, color: 'bg-indigo-500' },
        { label: 'Grade 8', readingLevel: 8, vocabulary: 10000, color: 'bg-pink-500' },
        { label: 'Grade 12', readingLevel: 12, vocabulary: 20000, color: 'bg-emerald-500' }
      ],
      pattern: 'Higher reading levels correlate with larger vocabularies',
      aiPerspective: 'AI would predict: Reading level 10 → vocabulary ≈ 15,000 words',
      criticalThinking: 'Does a larger vocabulary improve reading, or does more reading build vocabulary? (Probably both!)'
    },
    {
      id: 'screen_time',
      title: 'Daily Screen Time vs. Sleep Quality',
      description: 'Survey data from teenagers',
      data: [
        { label: 'Low (2h)', screenTime: 2, sleepQuality: 'Excellent', color: 'bg-green-500' },
        { label: 'Medium (4h)', screenTime: 4, sleepQuality: 'Good', color: 'bg-yellow-500' },
        { label: 'High (6h)', screenTime: 6, sleepQuality: 'Fair', color: 'bg-orange-500' },
        { label: 'Very High (8h)', screenTime: 8, sleepQuality: 'Poor', color: 'bg-red-500' }
      ],
      pattern: 'More screen time correlates with worse sleep quality',
      aiPerspective: 'AI would predict: 7 hours screen time → Poor sleep quality',
      criticalThinking: 'Is it the screen time itself, or the late-night usage? What about content type?'
    }
  ];

  const revealPattern = (index: number) => {
    if (!revealedPatterns.includes(index)) {
      setRevealedPatterns([...revealedPatterns, index]);
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const isPatternRevealed = (index: number) => revealedPatterns.includes(index);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6 text-green-600" />
            Pattern Detective: How AI Learns
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI systems learn by finding patterns in data. Let's practice finding patterns 
            like an AI would - but remember, AI doesn't understand what these patterns mean!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {educationPatterns.map((pattern, index) => (
            <div key={pattern.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{pattern.title}</h3>
                <Badge variant="outline">
                  Pattern {index + 1} of {educationPatterns.length}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pattern.description}
              </p>

              {/* Data Visualization */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pattern.data.map((item, idx) => (
                  <div key={idx} className="text-center p-4 border rounded-lg">
                    <div className={`w-8 h-8 ${item.color} rounded-full mx-auto mb-2`}></div>
                    <div className="text-sm font-semibold">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Object.entries(item)
                        .filter(([key]) => !['label', 'color'].includes(key))
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' | ')
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* Pattern Reveal Button */}
              {!isPatternRevealed(index) && (
                <Button 
                  onClick={() => revealPattern(index)}
                  variant="outline"
                  className="w-full"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Reveal the Pattern AI Would Find
                </Button>
              )}

              {/* Revealed Pattern */}
              {isPatternRevealed(index) && (
                <div className="space-y-3">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pattern Found:</strong> {pattern.pattern}
                    </AlertDescription>
                  </Alert>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      AI's Perspective:
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {pattern.aiPerspective}
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Critical Thinking Required:
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {pattern.criticalThinking}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {revealedPatterns.length === educationPatterns.length && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Key Learning:</strong> AI is excellent at finding correlations 
                  (things that happen together) but cannot understand causation (what actually causes what). 
                  This is why human judgment is still essential!
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">AI vs. Human Understanding</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-blue-600 mb-2">What AI Sees:</h5>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Numbers and patterns</li>
                      <li>Statistical relationships</li>
                      <li>Predictions based on data</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-600 mb-2">What Humans Add:</h5>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Context and meaning</li>
                      <li>Ethical considerations</li>
                      <li>Common sense reasoning</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button onClick={handleComplete} className="w-full">
                {completed ? (
                  <>Pattern Detective Complete!</>
                ) : (
                  <>
                    Continue to Reflection <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}