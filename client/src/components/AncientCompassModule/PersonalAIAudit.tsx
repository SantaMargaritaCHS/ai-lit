import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, CheckCircle2, ChevronRight, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface PersonalAIAuditProps {
  onComplete: () => void;
}

const AUDIT_ITEMS = [
  {
    id: 'awareness',
    label: 'I know when I\'m interacting with AI vs. humans online',
    category: 'Awareness'
  },
  {
    id: 'privacy',
    label: 'I understand how apps collect and use my data',
    category: 'Privacy'
  },
  {
    id: 'fact-check',
    label: 'I fact-check AI-generated content before trusting it',
    category: 'Critical Thinking'
  },
  {
    id: 'learning-tool',
    label: 'I use AI as a tool to learn, not to complete work for me',
    category: 'Academic Integrity'
  },
  {
    id: 'algorithms',
    label: 'I\'ve thought about how AI algorithms influence what I see',
    category: 'Digital Literacy'
  },
  {
    id: 'deepfakes',
    label: 'I could recognize AI-generated images or deepfakes',
    category: 'Media Literacy'
  },
  {
    id: 'explain',
    label: 'I could explain one ethical concern about AI to a friend',
    category: 'Ethical Understanding'
  }
];

export default function PersonalAIAudit({ onComplete }: PersonalAIAuditProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [improvementArea, setImprovementArea] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleCheckChange = (id: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const uncheckedItems = AUDIT_ITEMS.filter(item => !checkedItems[item.id]);

  const handleComplete = () => {
    if (improvementArea.trim() && actionPlan.trim().split(/\s+/).length >= 10) {
      setCompleted(true);
      onComplete();
    }
  };

  const actionPlanWords = actionPlan.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minWords = 10;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" />
            Personal AI Audit
          </CardTitle>
          <p className="text-gray-700 mt-2">
            Take stock of your current relationship with AI. Check all that apply, then identify one area to improve.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Checklist */}
          <div className="space-y-4">
            {AUDIT_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 rounded-lg border bg-white hover:bg-gray-50 transition-all"
              >
                <Checkbox
                  id={item.id}
                  checked={checkedItems[item.id] || false}
                  onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
                  className="mt-0.5"
                />
                <label
                  htmlFor={item.id}
                  className="flex-1 cursor-pointer text-gray-900"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-gray-600 block mt-0.5">
                    {item.category}
                  </span>
                </label>
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-gray-900">
                You checked {checkedCount} out of {AUDIT_ITEMS.length} items
              </p>
            </div>
            <p className="text-sm text-gray-800">
              {checkedCount === AUDIT_ITEMS.length
                ? 'Excellent! You have strong AI literacy. Now let\'s plan how to maintain and deepen these skills.'
                : 'Great self-reflection! Everyone has areas to grow. Let\'s identify one specific way to improve.'}
            </p>
          </div>

          {/* Improvement Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Identify ONE area to improve:
                </h4>
                {uncheckedItems.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-gray-700 mb-2">Suggested areas based on your audit:</p>
                    {uncheckedItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setImprovementArea(item.label)}
                        className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        • {item.label}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={improvementArea}
                  onChange={(e) => setImprovementArea(e.target.value)}
                  placeholder="E.g., 'I want to get better at recognizing AI-generated images'"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {improvementArea.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h4 className="font-semibold text-gray-900">
                  Your Action Plan:
                </h4>
                <p className="text-sm text-gray-700">
                  Write a specific action plan. What will you do <strong>this week</strong> to improve in this area?
                </p>
                <Textarea
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  placeholder="Example: 'This week I'll turn on data privacy settings in my top 3 apps and research how to spot deepfakes using online tutorials.'"
                  rows={4}
                  className="w-full text-gray-900"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className={`${actionPlanWords >= minWords ? 'text-green-600' : 'text-gray-600'}`}>
                    {actionPlanWords} / {minWords} words minimum
                  </span>
                  {actionPlanWords >= minWords && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready to continue
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Continue Button */}
          {improvementArea.trim() && actionPlanWords >= minWords && (
            <Button
              onClick={handleComplete}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Continue to Exit Ticket
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
