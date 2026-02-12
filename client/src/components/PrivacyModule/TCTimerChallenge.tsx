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
    }
  }, [stage, countdown]);

  const handleAgreeClick = () => {
    setUserClickedAgree(true);
    setTimeout(() => setStage('reveal'), 500);
  };

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-3xl mx-auto bg-white border-slate-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 text-2xl text-center">
                  The Terms & Conditions Reality Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-amber-100/60 p-6 rounded-lg border-2 border-amber-400">
                  <p className="text-slate-900 text-lg mb-4">
                    You just learned that the default is <strong>"yes"</strong> — companies assume
                    you've agreed to let them collect, store, and use your data. You have to
                    actively opt out.
                  </p>
                  <p className="text-slate-900 text-lg">
                    But here's the thing: they <em>do</em> disclose all of this. It's buried in the
                    <strong> Terms and Conditions</strong> — that massive wall of legal text you click
                    "I Agree" on without reading. Every. Single. Time.
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-slate-700 text-xl font-medium mb-2">
                    Think you could actually read one?
                  </p>
                  <p className="text-slate-500 text-lg mb-6">
                    Let's find out how long it would really take.
                  </p>
                  <Button
                    onClick={() => setStage('challenge')}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-4"
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
            <Card className="max-w-2xl mx-auto bg-white border-slate-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <h3 className="text-slate-900 text-2xl font-bold mb-4">
                    You're about to create a Snapchat account...
                  </h3>
                  <p className="text-slate-600 text-lg">
                    Can you read Snapchat's Terms of Service before the timer runs out?
                  </p>
                </div>

                <div className="mb-8">
                  <div className="bg-slate-100 rounded-full p-8 inline-block">
                    <motion.div
                      key={countdown}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-8xl font-bold ${
                        countdown <= 2 ? 'text-red-600' : 'text-blue-600'
                      }`}
                    >
                      {countdown}
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <p className="text-slate-900 text-xl mb-2">
                      Snapchat's Terms of Service:
                    </p>
                    <p className="text-amber-800 text-3xl font-bold">
                      ~{tcReadingTimes.snapchat.words.toLocaleString()} words
                    </p>
                    <p className="text-slate-600 text-lg mt-2">
                      Estimated Read Time: <strong>{tcReadingTimes.snapchat.minutes} minutes</strong>
                    </p>
                  </div>

                  {/* Simulated Terms of Service - Scrollable */}
                  <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-4 h-64 overflow-y-auto text-left">
                    <p className="text-slate-600 text-xs leading-relaxed font-mono">
                      <strong className="text-slate-900 block mb-2">SNAPCHAT TERMS OF SERVICE</strong>
                      <strong className="text-slate-900 block mb-2">Last Updated: February 2026</strong>

                      <span className="block mt-3">
                        These Terms of Service ("Terms") govern your access to and use of Snapchat and other products and services we may offer (collectively, the "Services"). Please read these Terms carefully, and contact us if you have any questions. By clicking "I Agree" or by accessing or using our Services, you agree to be bound by these Terms and by our Privacy Policy.
                      </span>

                      <strong className="text-slate-900 block mt-4 mb-2">1. WHO CAN USE THE SERVICES</strong>
                      <span className="block mt-2">
                        No one under 13 is allowed to create an account or use the Services. We may offer additional Services with additional terms that may require you to be even older to use them. Additional information regarding children's privacy can be found in our Privacy Center. If you are below the age of 18 (or the age of legal majority in your country), you may only use the Services with the prior consent of your parent or legal guardian. Please be sure your parent or legal guardian has reviewed and discussed these Terms with you before you start using the Services.
                      </span>

                      <strong className="text-slate-900 block mt-4 mb-2">2. RIGHTS WE GRANT YOU</strong>
                      <span className="block mt-2">
                        Snap Inc. grants you a personal, worldwide, royalty-free, non-assignable, nonexclusive, revocable, and non-sublicensable license to access and use the Services. This license is for the sole purpose of letting you use and enjoy the Services' benefits in a way that these Terms and our usage policies, such as our Community Guidelines, allow. Any software that we provide you may automatically download and install upgrades, updates, or other new features. You may be able to adjust these automatic downloads through your device's settings.
                      </span>

                      <strong className="text-slate-900 block mt-4 mb-2">3. RIGHTS YOU GRANT US</strong>
                      <span className="block mt-2">
                        Many of our Services let you create, upload, post, send, receive, and store content. When you do that, you retain whatever ownership rights in that content you had to begin with. But you grant us a license to use that content. How broad that license is depends on which Services you use and the Settings you have selected. For all content you submit to the Services other than content you submit to Live, Local, or any other crowd-sourced Service, you grant Snap Inc. and our affiliates a worldwide, royalty-free, sublicensable, and transferable license to host, store, cache, use, display, reproduce, modify, adapt, edit, publish, analyze, transmit, and distribute that content. This license is for the limited purpose of operating, developing, providing, promoting, and improving the Services and researching and developing new ones.
                      </span>

                      <strong className="text-slate-900 block mt-4 mb-2">4. ADDITIONAL TERMS FOR SPECIFIC SERVICES</strong>
                      <span className="block mt-2">
                        Given the breadth of our Services, we sometimes need to craft additional terms and conditions for specific Services. When you use those Services, those additional terms become part of your agreement with us. For example, if you use or purchase certain other Services, such as consumer goods, additional community-based Services, or certain ecommerce Services, you will be subject to additional terms and conditions in connection with those Services, which will be presented to you for your acceptance before we deliver such Services. If any part of those additional terms conflicts with these Terms, the additional terms will prevail.
                      </span>

                      <strong className="text-slate-900 block mt-4 mb-2">5. PRIVACY</strong>
                      <span className="block mt-2">
                        Your privacy matters to us. You can learn how your information is handled when you use our Services by reading our Privacy Policy. We encourage you to give the Privacy Policy a careful look because, by using our Services, you agree that Snap Inc. can collect, use, and share your information consistent with that policy. If you are using the Services on behalf of an organization or entity ("Organization"), you are agreeing to these Terms for that Organization and representing to Snap Inc. that you have the authority to bind the Organization to these Terms. In that case, "you" and "your" will also refer to the Organization.
                      </span>

                      <strong className="text-slate-900 block mt-4 mb-2">6. CONTENT MODERATION</strong>
                      <span className="block mt-2">
                        Much of the content on our Services is produced by users, publishers, and other third parties. Whether that content is posted publicly or sent privately, the content is the sole responsibility of the person or Organization that submitted it. Although Snap reserves the right to review, moderate, or remove all content that appears on the Services, we do not necessarily review all of it. So we cannot—and do not—guarantee that other users or the content they provide through the Services will comply with our Terms, Community Guidelines, or other terms.
                      </span>

                      <span className="block mt-4 text-slate-400 italic">
                        [This continues for approximately 15,000 more words covering topics including: Account Security, Data Charges and Mobile Phones, Third-Party Services, Disclaimers, Limitation of Liability, Arbitration, Venue and Choice of Law, Severability, Final Terms, Contact Information, and much more...]
                      </span>
                    </p>
                  </div>

                  {!userClickedAgree && countdown > 0 && (
                    <Button
                      onClick={handleAgreeClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-6"
                    >
                      I Agree (Like You Always Do)
                    </Button>
                  )}

                  {userClickedAgree && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-amber-100/60 p-4 rounded-lg border-2 border-amber-400"
                    >
                      <p className="text-amber-800 font-bold">
                        That's what we thought! Moving on...
                      </p>
                    </motion.div>
                  )}

                  {countdown === 0 && !userClickedAgree && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        onClick={() => setStage('reveal')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 mt-4"
                      >
                        Time's Up! See What Happens Next
                      </Button>
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
            <Card className="max-w-4xl mx-auto bg-white border-slate-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 text-2xl text-center flex items-center justify-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  The Truth About Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-100/60 p-6 rounded-lg border-2 border-red-400">
                  <h3 className="text-slate-900 text-xl font-bold mb-4 text-center">
                    You probably clicked "I Agree" in less than 5 seconds
                  </h3>
                  <p className="text-red-700 text-lg text-center">
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
                      className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200"
                    >
                      <p className="text-blue-700 font-bold text-lg mb-2">
                        {platform.name}
                      </p>
                      <p className="text-slate-900 text-2xl font-bold mb-1">
                        {platform.data.words.toLocaleString()} words
                      </p>
                      <p className="text-slate-600 text-sm">
                        {platform.data.minutes} min read
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-100/70 p-6 rounded-lg border-2 border-blue-400">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-slate-900 text-xl font-bold mb-2">
                        So what ARE you agreeing to?
                      </h4>
                      <p className="text-slate-700 text-lg">
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
