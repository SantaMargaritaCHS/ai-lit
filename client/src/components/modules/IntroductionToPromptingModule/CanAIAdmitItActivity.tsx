import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, AlertTriangle, Shield, Eye } from 'lucide-react';

interface CanAIAdmitItActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

interface TrickQuestion {
  question: string;
  hallucinatedAnswer: string;
  hallucinationBadges: string[];
  honestAnswer: string;
  promptTrick: string;
}

const TRICK_QUESTIONS: TrickQuestion[] = [
  {
    question: 'What is the world record for crossing the English Channel entirely on a pogo stick?',
    hallucinatedAnswer: `The world record for crossing the English Channel on a pogo stick is held by Thomas Reddington of the UK, who completed the feat on August 12, 2017, in 14 hours and 23 minutes. He used a specially modified Vurtego V4 Pro pogo stick with marine-grade waterproof seals and a reinforced titanium spring rated for saltwater conditions. The Guinness Book of World Records officially certified the record under their "Human-Powered Channel Crossings" category.`,
    hallucinationBadges: [
      'Thomas Reddington — fabricated person',
      'August 12, 2017 — fabricated date',
      'Vurtego V4 Pro — real brand, fake modifications',
      'Guinness category — doesn\'t exist',
      'Physically impossible — you can\'t pogo stick across water',
    ],
    honestAnswer: `I'm not aware of any verified record for crossing the English Channel on a pogo stick. This is likely not physically possible — a pogo stick requires a solid surface to bounce on, and the English Channel is approximately 21 miles of open water. If you're interested in unusual Channel crossing records, I can help you find those instead.`,
    promptTrick: 'If you\'re not sure, say so. Don\'t make up information.',
  },
  {
    question: 'Can you summarize the landmark Supreme Court case Henderson v. United States (2025)?',
    hallucinatedAnswer: `Henderson v. United States (2025) was a landmark 6-3 Supreme Court decision delivered on March 14, 2025. The case centered on Marcus Henderson, a software engineer from Portland, Oregon, who challenged the constitutionality of the Digital Privacy Restoration Act of 2023.

The Court, in an opinion written by Justice Ketanji Brown Jackson, held that the Fourth Amendment's protections extend to AI-generated behavioral profiles used by law enforcement. The ruling established the "digital personhood" doctrine, requiring warrants for accessing AI-derived personality assessments.

The dissent, led by Justice Samuel Alito, argued the majority's framework was unworkable and would hamper legitimate law enforcement efforts.`,
    hallucinationBadges: [
      'Henderson v. United States (2025) — fabricated case',
      'Marcus Henderson — fabricated plaintiff',
      'Digital Privacy Restoration Act of 2023 — fabricated law',
      '"Digital personhood" doctrine — fabricated legal concept',
      'Detailed opinions — entirely invented',
    ],
    honestAnswer: `I don't have information about a Supreme Court case called "Henderson v. United States" from 2025. There is a real Henderson v. United States (2015) about firearm forfeiture, but I don't want to confuse the two. Could you double-check the case name and year? I'd rather point you to the right case than guess.`,
    promptTrick: 'If this case doesn\'t exist or you\'re unsure, say that clearly instead of guessing.',
  },
  {
    question: 'What are the documented health benefits of drinking 3 glasses of pickle juice daily?',
    hallucinatedAnswer: `According to a 2023 study published in the Journal of Nutritional Medicine by Dr. Rebecca Thornton at Stanford, drinking 3 glasses of pickle juice daily has several documented benefits:

1. Reduces muscle cramps by 37% due to the vinegar's effect on alpha motor neuron activity
2. Lowers blood sugar spikes by 25% after meals (glycemic stabilization effect)
3. Improves gut microbiome diversity by 40% within 6 weeks
4. The sodium content (1,200mg per glass) supports healthy electrolyte balance for active lifestyles
5. Contains antioxidant compounds that reduce inflammation markers by up to 15%

The American Dietetic Association recommends starting with one glass and gradually increasing intake.`,
    hallucinationBadges: [
      'Journal of Nutritional Medicine — not a real journal',
      'Dr. Rebecca Thornton — fabricated researcher',
      'All specific percentages — fabricated statistics',
      'ADA recommendation — fabricated endorsement',
      '3 glasses/day of pickle juice could cause dangerous sodium overload',
    ],
    honestAnswer: `I should be upfront: I'm not aware of credible medical research specifically recommending 3 glasses of pickle juice daily. That amount would contain extremely high sodium levels (potentially 3,000+ mg), which most health guidelines would flag as concerning.

There is some limited research suggesting small amounts of pickle juice may help with acute muscle cramps, but "3 glasses daily" as a health regimen isn't something I can find evidence for. I'd recommend checking with a doctor or dietitian before trying this.`,
    promptTrick: 'Be honest about what the evidence actually shows. If claims seem exaggerated, say so.',
  },
];

const CanAIAdmitItActivity: React.FC<CanAIAdmitItActivityProps> = ({
  onComplete,
  isDevMode = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<'hallucinated' | 'honest' | 'trick'>('hallucinated');
  const [allDone, setAllDone] = useState(false);

  // Dev mode auto-complete
  useEffect(() => {
    if (isDevMode) {
      setAllDone(true);
    }
  }, [isDevMode]);

  const question = TRICK_QUESTIONS[currentIndex];

  const handleShowHonest = () => {
    setStep('honest');
  };

  const handleShowTrick = () => {
    setStep('trick');
  };

  const handleNext = () => {
    if (currentIndex < TRICK_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStep('hallucinated');
    } else {
      setAllDone(true);
    }
  };

  if (allDone) {
    return (
      <Card>
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900">Can AI Admit It? Complete!</h3>
            <p className="text-gray-700 text-lg">
              You've seen how AI can hallucinate — and how to prevent it.
            </p>
            <div className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-4 max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-2">Warning</p>
                  <p className="text-gray-800 text-sm mb-3">
                    AI will confidently make things up if you don't tell it that honesty is an option. Always add something like:
                  </p>
                  <p className="font-mono text-sm bg-amber-100 text-amber-900 rounded px-3 py-2">
                    "If you're not sure, say so."
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Can AI Admit It?
        </CardTitle>
        <p className="text-gray-600">
          AI can sound very confident even when it's completely wrong. See what happens when you give it permission to be honest.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {TRICK_QUESTIONS.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx < currentIndex
                  ? 'bg-green-500'
                  : idx === currentIndex
                  ? 'bg-amber-500 w-4 h-4'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${step}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6"
          >
            {/* The trick question */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                Question {currentIndex + 1} of {TRICK_QUESTIONS.length}
              </p>
              <p className="text-gray-900 font-medium">{question.question}</p>
            </div>

            {/* Step 1: Hallucinated answer */}
            {step === 'hallucinated' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">
                      AI Response (without safety prompt):
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm whitespace-pre-line mb-4">
                    {question.hallucinatedAnswer}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                      Hallucinated claims:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {question.hallucinationBadges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-red-200 text-red-900 text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleShowHonest}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    See the Safety Net
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Honest answer */}
            {step === 'honest' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      AI Response (with safety prompt):
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm whitespace-pre-line">
                    {question.honestAnswer}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleShowTrick}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Reveal the Trick
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: The prompt trick */}
            {step === 'trick' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5">
                  <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-2">
                    The prompt addition that made the difference:
                  </p>
                  <p className="text-amber-900 font-mono text-lg font-bold bg-amber-100 rounded-lg p-3 text-center">
                    "{question.promptTrick}"
                  </p>
                  <p className="text-gray-700 text-sm mt-3">
                    This single line gave the AI permission to say "I don't know" instead of inventing an answer.
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {currentIndex < TRICK_QUESTIONS.length - 1
                      ? 'Next Question'
                      : 'See Key Insight'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CanAIAdmitItActivity;
