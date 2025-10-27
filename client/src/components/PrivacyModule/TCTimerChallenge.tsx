import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tcReadingTimes } from '@/data/privacyPolicyCitations';

interface TCTimerChallengeProps {
  onComplete: () => void;
}

type Stage = 'intro' | 'challenge' | 'reveal';

export const TCTimerChallenge: React.FC<TCTimerChallengeProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<Stage>('intro');
  const [countdown, setCountdown] = useState(5);
  const [userClickedAgree, setUserClickedAgree] = useState(false);

  // Challenge countdown
  useEffect(() => {
    if (stage === 'challenge' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'challenge' && countdown === 0) {
      setTimeout(() => setStage('reveal'), 1000);
    }
  }, [stage, countdown]);

  const handleAgreeClick = () => {
    setUserClickedAgree(true);
    setTimeout(() => setStage('reveal'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-3xl bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  The Terms & Conditions Reality Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-400/30">
                  <p className="text-white text-lg mb-4">
                    "But wait," you might say, "don't they have to tell us they're doing this?"
                  </p>
                  <p className="text-white text-lg">
                    They do. It's buried in the <strong>Terms and Conditions</strong>—that super
                    long, boring document you click "I Agree" on without reading.
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-blue-100 text-xl mb-6">
                    Let's be honest: How long do you <em>actually</em> spend reading those terms?
                  </p>
                  <Button
                    onClick={() => setStage('challenge')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
                  >
                    Take the Challenge
                    <Clock className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === 'challenge' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-2xl bg-slate-800 border-slate-600">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <h3 className="text-white text-2xl font-bold mb-4">
                    You're about to create a Snapchat account...
                  </h3>
                  <p className="text-blue-100 text-lg">
                    Can you read Snapchat's Terms of Service before the timer runs out?
                  </p>
                </div>

                <div className="mb-8">
                  <div className="bg-black/30 rounded-full p-8 inline-block">
                    <motion.div
                      key={countdown}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-8xl font-bold ${
                        countdown <= 2 ? 'text-red-400' : 'text-blue-400'
                      }`}
                    >
                      {countdown}
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-700 p-6 rounded-lg">
                    <p className="text-white text-xl mb-2">
                      📄 Snapchat's Terms of Service:
                    </p>
                    <p className="text-yellow-300 text-3xl font-bold">
                      ~{tcReadingTimes.snapchat.words.toLocaleString()} words
                    </p>
                    <p className="text-gray-300 text-lg mt-2">
                      Estimated Read Time: <strong>{tcReadingTimes.snapchat.minutes} minutes</strong>
                    </p>
                  </div>

                  {!userClickedAgree && countdown > 0 && (
                    <Button
                      onClick={handleAgreeClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-6"
                    >
                      ✓ I Agree (Like You Always Do)
                    </Button>
                  )}

                  {userClickedAgree && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400"
                    >
                      <p className="text-yellow-300 font-bold">
                        That's what we thought! Moving on...
                      </p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-4xl bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center flex items-center justify-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  The Truth About Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-900/40 p-6 rounded-lg border-2 border-red-400">
                  <h3 className="text-white text-xl font-bold mb-4 text-center">
                    You probably clicked "I Agree" in less than 5 seconds
                  </h3>
                  <p className="text-red-200 text-lg text-center">
                    But it would take you <strong>60 minutes</strong> to actually read Snapchat's terms.
                    That's longer than a TV episode!
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'Snapchat', data: tcReadingTimes.snapchat },
                    { name: 'Microsoft', data: tcReadingTimes.microsoft },
                    { name: 'ChatGPT', data: tcReadingTimes.chatgpt }
                  ].map((platform) => (
                    <div
                      key={platform.name}
                      className="bg-slate-700 p-4 rounded-lg text-center border border-slate-600"
                    >
                      <p className="text-blue-300 font-bold text-lg mb-2">
                        {platform.name}
                      </p>
                      <p className="text-white text-2xl font-bold mb-1">
                        {platform.data.words.toLocaleString()} words
                      </p>
                      <p className="text-gray-300 text-sm">
                        {platform.data.minutes} min read
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-400/30">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white text-xl font-bold mb-2">
                        So what ARE you agreeing to?
                      </h4>
                      <p className="text-blue-100 text-lg">
                        Let's look at the <strong>actual language</strong> from these policies.
                        We've pulled the real quotes so you can see for yourself what you're
                        signing up for.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onComplete}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4"
                >
                  See What You Actually Agreed To
                  <AlertTriangle className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
