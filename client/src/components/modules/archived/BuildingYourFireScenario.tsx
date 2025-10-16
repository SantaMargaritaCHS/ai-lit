/**
 * ARCHIVED: Building Your Fire - Complex Story-Driven Scenario
 *
 * This is an excellent, deep interactive scenario that was too complex for the
 * Intro to Gen AI module's flow. Preserved here for potential future use.
 *
 * Features:
 * - 6-scene branching narrative about using AI responsibly
 * - Real-time capability tracking (confidence, understanding, skills, satisfaction, energy)
 * - Virtue-focused choices (not right/wrong but "building fire" vs "outsourcing thinking")
 * - Multiple outcomes based on personal growth journey
 * - Solar panel presentation scenario as the throughline
 *
 * Philosophy: "AI provides the spark ⚡, YOU build the fire 🔥"
 *
 * Archived: 2025-10-15
 * Original location: IntroToGenAIModule.tsx renderScenarioReflection()
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { InteractiveActivity } from '../../ModuleActivityWrapper';

interface BuildingYourFireScenarioProps {
  onComplete: () => void;
  moduleId?: string;
}

// The Learning Journey - Story-Driven Scenario Data
const SCENARIO_SCENES = {
  scene1: {
    title: "The Starting Point",
    time: "Sunday, 7:00 PM",
    setup: "You have a solar panel presentation due tomorrow. Your friend texts: 'I used ChatGPT to write mine in 20 minutes! Want me to send you what it made?'",
    reflection: "This is your first decision point. What matters most to you?",
    choices: [
      {
        id: 'surface',
        text: "Yes! Send it over - I'll just change it a bit",
        emoji: "📱",
        path: 'surface',
        effects: { confidence: -1, understanding: -1, skillGrowth: 0, satisfaction: -1 },
        virtue: "Taking the easy path",
        inner: "Part of you knows you're missing a chance to learn..."
      },
      {
        id: 'struggle',
        text: "No thanks, I want to figure this out myself",
        emoji: "💭",
        path: 'struggle',
        effects: { confidence: +1, understanding: 0, skillGrowth: +1, energy: -1 },
        virtue: "Choosing independence",
        inner: "You feel determined but a bit overwhelmed..."
      },
      {
        id: 'smart',
        text: "Thanks, but I'll use AI as my starting point to learn",
        emoji: "💡",
        path: 'smart',
        effects: { confidence: 0, understanding: +1, skillGrowth: +1, satisfaction: +1 },
        virtue: "Seeking balanced growth",
        inner: "You're curious to see what you can build..."
      }
    ]
  },
  scene2: {
    surface: {
      title: "The Hollow Victory",
      time: "7:30 PM",
      situation: "You're looking at the AI-generated presentation. It looks perfect, but the words feel foreign...",
      reflection: "Something doesn't feel right. These aren't your thoughts.",
      choices: [
        {
          id: 'just_memorize',
          text: "Just memorize what it says",
          emoji: "🎭",
          effects: { confidence: -2, understanding: -1, satisfaction: -2 },
          virtue: "Going through the motions",
          inner: "You feel like an actor reading someone else's script..."
        },
        {
          id: 'try_understand',
          text: "Try to understand what it means",
          emoji: "🤔",
          effects: { understanding: +1, skillGrowth: +1, energy: -1 },
          virtue: "Seeking meaning",
          inner: "You realize you want to actually know this stuff..."
        },
        {
          id: 'start_over',
          text: "This feels wrong - start fresh",
          emoji: "🔄",
          effects: { confidence: +2, satisfaction: +2, energy: -2 },
          virtue: "Choosing authenticity",
          inner: "You want to build something that's truly yours..."
        }
      ]
    },
    struggle: {
      title: "The Learning Moment",
      time: "8:30 PM",
      situation: "You're stuck on explaining how photovoltaic cells work. The blank page stares back...",
      reflection: "This is hard, but you can feel yourself learning.",
      choices: [
        {
          id: 'push_through',
          text: "Keep researching until it clicks",
          emoji: "🔬",
          effects: { understanding: +3, skillGrowth: +2, energy: -2, confidence: +2 },
          virtue: "Embracing the challenge",
          inner: "Suddenly it makes sense! You feel genuinely excited..."
        },
        {
          id: 'ask_ai_explain',
          text: "Ask AI to explain, then build on it",
          emoji: "🤝",
          effects: { understanding: +2, skillGrowth: +1, confidence: +1 },
          virtue: "Using tools wisely",
          inner: "AI gives you the spark, now you build the fire..."
        },
        {
          id: 'simplify_approach',
          text: "Explain it simply in your own words",
          emoji: "💬",
          effects: { confidence: +1, satisfaction: +1, understanding: +1 },
          virtue: "Finding your voice",
          inner: "Your explanation is basic but it's YOURS..."
        }
      ]
    },
    smart: {
      title: "The Builder's Choice",
      time: "8:00 PM",
      situation: "AI gave you a framework. Now you need to fill it with your understanding...",
      reflection: "You have the blueprint. Time to build.",
      choices: [
        {
          id: 'deep_research',
          text: "Research each concept thoroughly",
          emoji: "📚",
          effects: { understanding: +3, skillGrowth: +3, energy: -2, satisfaction: +2 },
          virtue: "Pursuing mastery",
          inner: "Each source adds depth to your understanding..."
        },
        {
          id: 'add_examples',
          text: "Add your own examples and connections",
          emoji: "🔗",
          effects: { confidence: +2, satisfaction: +2, skillGrowth: +2 },
          virtue: "Making it personal",
          inner: "You connect it to things you already know..."
        },
        {
          id: 'verify_facts',
          text: "Fact-check and improve AI's suggestions",
          emoji: "✔️",
          effects: { understanding: +2, confidence: +1, skillGrowth: +2 },
          virtue: "Building on foundations",
          inner: "You're not just accepting - you're improving..."
        }
      ]
    }
  },
  scene3: {
    title: "The Moment of Doubt",
    time: "9:00 PM",
    groupChat: [
      { sender: "Alex", text: "Done already! ChatGPT is amazing 🎉" },
      { sender: "Maya", text: "Same! Took 15 minutes" },
      { sender: "Jake", text: "Why work harder when you can work smarter?" },
      { sender: "Sarah", text: "What about you? Done yet?" }
    ],
    reflection: "Your friends are done. You're still working. Are you being foolish?",
    choices: [
      {
        id: 'proud_path',
        text: "Still working - building something I understand",
        emoji: "🔥",
        effects: { confidence: +2, satisfaction: +2, social: 'respected' },
        virtue: "Standing by your values",
        inner: "You feel proud of choosing the harder path...",
        response: "Sarah: 'Respect! That takes guts'"
      },
      {
        id: 'question_self',
        text: "Maybe I'm making this too hard...",
        emoji: "😔",
        effects: { confidence: -1, satisfaction: -1 },
        virtue: "Experiencing doubt",
        inner: "You wonder if you're wasting time...",
        response: "Jake: 'Just use AI! No one cares how you made it'"
      },
      {
        id: 'share_method',
        text: "I'm using AI to help me learn, not do it for me",
        emoji: "💡",
        effects: { confidence: +1, skillGrowth: +1, social: 'inspiring' },
        virtue: "Leading by example",
        inner: "You realize you can help others see a better way...",
        response: "Maya: 'Wait, how does that work?'"
      }
    ]
  },
  scene4: {
    title: "The Final Push",
    time: "10:30 PM",
    situation: "You're getting close to finishing. How will you wrap this up?",
    reflection: "This is where your choices culminate...",
    choices: [
      {
        id: 'polish_perfect',
        text: "Spend extra time making it excellent",
        emoji: "✨",
        effects: { satisfaction: +3, confidence: +2, energy: -2 },
        virtue: "Pursuing excellence",
        inner: "You want to be proud of what you create..."
      },
      {
        id: 'good_enough',
        text: "It's solid enough - time to rest",
        emoji: "✅",
        effects: { energy: +1, satisfaction: +1, confidence: +1 },
        virtue: "Knowing your limits",
        inner: "You've done honest work and that's enough..."
      },
      {
        id: 'last_minute_ai',
        text: "Use AI to quickly improve weak parts",
        emoji: "🚀",
        effects: { confidence: -1, understanding: -1, energy: 0 },
        virtue: "Tempted at the finish line",
        inner: "You're so close... but this would undo everything..."
      }
    ]
  },
  scene5: {
    title: "Presentation Day",
    time: "8:00 AM - First Period",
    teacherQuestion: "Tell me about what you learned creating this.",
    reflection: "Ms. Chen isn't asking about facts. She's asking about YOUR journey.",
    paths: {
      surface: {
        situation: "You memorized the AI content, but do you understand it?",
        choices: [
          {
            id: 'admit_struggle',
            text: "Honestly, I didn't learn as much as I could have",
            emoji: "😔",
            outcome: 'hollow_realization'
          },
          {
            id: 'fake_confidence',
            text: "I learned... a lot about solar panels",
            emoji: "😅",
            outcome: 'empty_words'
          }
        ]
      },
      struggle: {
        situation: "You worked hard. You can speak from experience.",
        choices: [
          {
            id: 'share_journey',
            text: "I struggled at first, but then it clicked when I...",
            emoji: "💡",
            outcome: 'authentic_growth'
          },
          {
            id: 'focus_learning',
            text: "I learned that understanding takes time and effort",
            emoji: "🌱",
            outcome: 'wisdom_gained'
          }
        ]
      },
      smart: {
        situation: "You used AI as a tool. You can explain the balance.",
        choices: [
          {
            id: 'explain_method',
            text: "I used AI to spark ideas, then built my understanding",
            emoji: "🔥",
            outcome: 'balanced_success'
          },
          {
            id: 'share_insights',
            text: "AI helped me see connections I wouldn't have found alone",
            emoji: "🤝",
            outcome: 'collaborative_growth'
          }
        ]
      }
    }
  }
};

export default function BuildingYourFireScenario({ onComplete, moduleId = 'archived' }: BuildingYourFireScenarioProps) {
  const [scenarioStep, setScenarioStep] = useState(0);
  const [scenarioPath, setScenarioPath] = useState<'surface' | 'struggle' | 'smart' | null>(null);
  const [scenarioChoices, setScenarioChoices] = useState<{[key: string]: string}>({});
  const [confidenceLevel, setConfidenceLevel] = useState(2);
  const [understandingDepth, setUnderstandingDepth] = useState(1);
  const [skillGrowth, setSkillGrowth] = useState(0);
  const [personalSatisfaction, setPersonalSatisfaction] = useState(2);
  const [energyLevel, setEnergyLevel] = useState(4);
  const [scenarioShowFeedback, setScenarioShowFeedback] = useState(false);

  // Helper to render capability meters
  const renderCapabilityMeter = (label: string, value: number, max: number, icon: string, color: string) => (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">{value}/{max}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color}`}
            animate={{ width: `${(value / max) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );

  // Apply choice effects to capabilities
  const applyChoiceEffects = (effects: any) => {
    if (effects.confidence !== undefined) setConfidenceLevel(prev => Math.max(0, Math.min(5, prev + effects.confidence)));
    if (effects.understanding !== undefined) setUnderstandingDepth(prev => Math.max(0, Math.min(5, prev + effects.understanding)));
    if (effects.skillGrowth !== undefined) setSkillGrowth(prev => Math.max(0, Math.min(5, prev + effects.skillGrowth)));
    if (effects.satisfaction !== undefined) setPersonalSatisfaction(prev => Math.max(0, Math.min(5, prev + effects.satisfaction)));
    if (effects.energy !== undefined) setEnergyLevel(prev => Math.max(0, Math.min(5, prev + effects.energy)));
  };

  // Handle choice selection with feedback
  const handleChoiceSelect = (choiceId: string, choice: any) => {
    setScenarioChoices(prev => ({ ...prev, [`scene${scenarioStep}`]: choiceId }));
    applyChoiceEffects(choice.effects);

    if (choice.path) {
      setScenarioPath(choice.path);
    }

    setScenarioShowFeedback(true);

    // Auto-advance after showing feedback
    setTimeout(() => {
      setScenarioShowFeedback(false);
      if (scenarioStep < 5) {
        setScenarioStep(scenarioStep + 1);
      } else {
        setScenarioStep(6); // Go to outcomes
      }
    }, 3500);
  };

  // Reset scenario
  const handleReset = () => {
    setScenarioStep(0);
    setScenarioPath(null);
    setScenarioChoices({});
    setConfidenceLevel(2);
    setUnderstandingDepth(1);
    setSkillGrowth(0);
    setPersonalSatisfaction(2);
    setEnergyLevel(4);
    setScenarioShowFeedback(false);
  };

  // Intro screen (step 0)
  if (scenarioStep === 0) {
    return (
      <InteractiveActivity
        id="building-fire-scenario"
        name="The Learning Journey: Building Your Fire"
        moduleId={moduleId}
        onComplete={onComplete}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-400 dark:border-orange-600">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3 justify-center text-gray-900 dark:text-gray-100">
                <Flame className="w-10 h-10 text-orange-500" />
                The Learning Journey
                <Sparkles className="w-10 h-10 text-yellow-500" />
              </CardTitle>
              <p className="text-center text-gray-700 dark:text-gray-300 text-lg mt-3">
                A story about building your own capabilities
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Core Question */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border-2 border-purple-400 dark:border-purple-600">
                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 text-center">
                  The Essential Question
                </h3>
                <p className="text-gray-800 dark:text-gray-200 text-lg text-center italic">
                  "When faced with a challenge, do you outsource your thinking or build your capabilities?"
                </p>
              </div>

              {/* Scenario Setup */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg border-2 border-blue-400 dark:border-blue-600">
                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span className="text-3xl">📚</span>
                  Your Situation
                </h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4 text-lg">
                  It's Sunday evening. You have a presentation on solar panels due tomorrow morning.
                </p>
                <p className="text-gray-800 dark:text-gray-200 mb-4">
                  Your friend just texted: <em>"I used ChatGPT to write mine in 20 minutes! Want me to send you what it made?"</em>
                </p>
                <p className="text-gray-800 dark:text-gray-200 font-semibold">
                  This is where your journey begins...
                </p>
              </div>

              {/* What You'll Track */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border-2 border-gray-300 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Your Personal Growth Metrics
                </h4>
                <div className="space-y-3">
                  {renderCapabilityMeter("Confidence in Your Abilities", confidenceLevel, 5, "💪", "bg-blue-500")}
                  {renderCapabilityMeter("Depth of Understanding", understandingDepth, 5, "🧠", "bg-purple-500")}
                  {renderCapabilityMeter("Skills You've Built", skillGrowth, 5, "📈", "bg-green-500")}
                  {renderCapabilityMeter("Personal Satisfaction", personalSatisfaction, 5, "⭐", "bg-yellow-500")}
                  {renderCapabilityMeter("Mental Energy", energyLevel, 5, "⚡", "bg-orange-500")}
                </div>
              </div>

              {/* Philosophy */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
                <p className="text-center text-gray-900 dark:text-gray-100 font-medium">
                  <span className="text-2xl">⚡</span>
                  <strong className="text-orange-600 dark:text-orange-400 mx-2">AI provides the spark</strong>
                  <span className="text-2xl">🔥</span>
                  <strong className="text-red-600 dark:text-red-400 mx-2">YOU build the fire</strong>
                </p>
                <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Your choices will shape not just your project, but who you become
                </p>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  onClick={() => setScenarioStep(1)}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg px-8 py-6"
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </InteractiveActivity>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <p className="text-gray-600 dark:text-gray-400 text-center">
        This scenario continues with 5 more scenes and multiple outcomes.
        See the SCENARIO_SCENES data structure above for the complete implementation.
      </p>
      <Button onClick={onComplete} className="mx-auto mt-4 block bg-blue-600 hover:bg-blue-700 text-white">
        Complete Activity
      </Button>
    </div>
  );
}
