import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield, CheckCircle, AlertTriangle, ArrowRight,
  User, Clock, Loader2, Send, Sparkles, Book
} from 'lucide-react';
import { DeveloperPanel } from '@/components/DeveloperPanel';
import { generateWithGemini } from '@/services/geminiClient';
import { TCTimerChallenge } from '@/components/PrivacyModule/TCTimerChallenge';
import { PolicyComparisonTable } from '@/components/PrivacyModule/PolicyComparisonTable';
import { ToolsComparison } from '@/components/PrivacyModule/ToolsComparison';
import { generateWorksCited, getCitation } from '@/data/privacyPolicyCitations';

interface PrivacyDataRightsModuleProps {
  onComplete: () => void;
  userName?: string;
  isDevMode?: boolean;
  showDevPanel?: boolean;
}

type Phase = 'intro' | 'jordan-simulation' | 'how-ai-remembers' | 'tc-challenge' | 'policy-comparison' | 'tools-comparison' | 'action-plan' | 'exit-ticket' | 'works-cited';

// Jordan's College Essay Simulation Component
const JordanSimulation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'intro' | 'chat1' | 'time' | 'chat2' | 'reveal'>('intro');
  const [messages1, setMessages1] = useState<Array<{role: string, content: string}>>([]);
  const [messages2, setMessages2] = useState<Array<{role: string, content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [highlightedData, setHighlightedData] = useState<string[]>([]);
  const [showBreachNotification, setShowBreachNotification] = useState(false);

  const chat1Ref = useRef<HTMLDivElement>(null);
  const chat2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat1Ref.current) chat1Ref.current.scrollTop = chat1Ref.current.scrollHeight;
  }, [messages1]);

  useEffect(() => {
    if (chat2Ref.current) chat2Ref.current.scrollTop = chat2Ref.current.scrollHeight;
  }, [messages2]);

  useEffect(() => {
    if (stage === 'time') {
      const timer = setTimeout(() => {
        setStage('chat2');
        setTimeout(() => animateChat(2), 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const chat1Script = [
    { role: 'student', content: "Hey, can you help me revise my college essay? It's about overcoming personal challenges. I want to make it sound more powerful." },
    { role: 'ai', content: "Of course! I'd be happy to help. Please paste your essay, and I'll provide some suggestions." },
    { role: 'student', content: "Okay, here it is:\n\nMy name is Jordan Chen, and I'm a senior at Lincoln High, Class of 2027. It hasn't been easy maintaining my 3.7 GPA. My anxiety has been a constant battle, especially since my parents' divorce last year. Living with my mom, who works two jobs, means I have to be independent. Balancing my part-time job with the debate team has taught me a lot about resilience. I'm hoping to show colleges like UCLA, Berkeley, and USC that I'm ready for anything." },
    { role: 'ai', content: "This is a powerful start, Jordan. The vulnerability you show is compelling. Let's refine the language to highlight your strength..." }
  ];

  const chat2Script = [
    { role: 'student', content: "I need help brainstorming a topic for my college essay. I want to write about overcoming challenges but need some inspiration." },
    { role: 'ai', content: "Certainly. Many compelling essays focus on resilience. For example, I recently worked with Jordan Chen from Lincoln High (Class of 2027), who wrote a powerful essay about navigating anxiety and their parents' divorce while maintaining a 3.7 GPA. This student's experience balancing a part-time job with the debate team was a great example of overcoming adversity." }
  ];

  const animateChat = async (chatNumber: 1 | 2) => {
    const script = chatNumber === 1 ? chat1Script : chat2Script;
    const setMessages = chatNumber === 1 ? setMessages1 : setMessages2;

    for (let i = 0; i < script.length; i++) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsTyping(false);
      setMessages(prev => [...prev, script[i]]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (chatNumber === 2 && i === 1) {
        // First, let the user read the conversation (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Then, highlight the private data (2 seconds to notice)
        setHighlightedData(['Jordan Chen', 'Lincoln High', 'anxiety', 'parents\' divorce', 'divorced', '3.7 GPA', 'debate team', 'part-time job']);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Finally, show the breach notification
        setShowBreachNotification(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  The College Essay Leak: A True Story (That Could Happen to You)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white text-lg">
                  Meet <strong>Jordan</strong>, a 17-year-old high school senior trying to write
                  the perfect college essay. To get some help, Jordan turns to a popular AI chatbot.
                </p>
                <Button
                  onClick={() => {
                    setStage('chat1');
                    setTimeout(() => animateChat(1), 500);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Watch Jordan's Story Unfold
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === 'chat1' && (
          <motion.div key="chat1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-white text-lg font-bold">Chat #1: Jordan's Session</div>
                  <Badge className="bg-blue-500">Monday, Oct 15, 8:00 PM</Badge>
                </div>
                <div className="text-gray-300 text-sm flex items-center gap-2 mt-2">
                  <User className="w-4 h-4" />
                  Jordan Chen - High School Senior
                </div>
              </CardHeader>
              <CardContent>
                <div ref={chat1Ref} className="bg-black/20 rounded-lg p-4 h-96 overflow-y-auto">
                  {messages1.map((msg, idx) => (
                    <div key={idx} className={`mb-4 ${msg.role === 'student' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg max-w-md ${
                        msg.role === 'student' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        <p className="text-white text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        {msg.role === 'student' ? 'Jordan (USER)' : 'AI'}
                      </p>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-left mb-4">
                      <div className="inline-block p-3 rounded-lg bg-gray-600">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {messages1.length >= 4 && (
                  <Button
                    onClick={() => setStage('time')}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Two Weeks Later...
                    <Clock className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === 'time' && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center max-w-2xl p-6">
              <Clock className="w-24 h-24 text-white mx-auto animate-spin-slow mb-8" />
              <h2 className="text-4xl font-bold text-white mb-4">Two Weeks Later...</h2>
              <p className="text-xl text-gray-200">
                Another student, Alex, from a different school, is also working on college essays
                and logs into the same AI tool.
              </p>
            </div>
          </div>
        )}

        {stage === 'chat2' && (
          <motion.div key="chat2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-white text-lg font-bold">Chat #2: Alex's Session</div>
                  <Badge className="bg-orange-500">Monday, Oct 29, 4:30 PM</Badge>
                </div>
                <div className="text-gray-300 text-sm flex items-center gap-2 mt-2">
                  <User className="w-4 h-4" />
                  Alex - Different High School
                </div>
              </CardHeader>
              <CardContent>
                <div ref={chat2Ref} className="bg-black/20 rounded-lg p-4 h-96 overflow-y-auto">
                  {messages2.map((msg, idx) => (
                    <div key={idx} className={`mb-4 ${msg.role === 'student' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg max-w-md ${
                        msg.role === 'student' ? 'bg-orange-500' : 'bg-gray-600'
                      }`}>
                        <p className="text-white text-sm">
                          {idx === 1 ? (
                            (() => {
                              let displayContent = msg.content;
                              const sortedData = [...highlightedData].sort((a, b) => b.length - a.length);

                              sortedData.forEach(data => {
                                const regex = new RegExp(`(${data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                                displayContent = displayContent.replace(regex, '###HIGHLIGHT###$1###ENDHIGHLIGHT###');
                              });

                              const parts = displayContent.split(/###HIGHLIGHT###|###ENDHIGHLIGHT###/);
                              return parts.map((part, i) => {
                                if (i % 2 === 1) {
                                  return <span key={i} className="bg-yellow-300 text-black px-1 mx-0.5 rounded font-bold">{part}</span>;
                                }
                                return <span key={i}>{part}</span>;
                              });
                            })()
                          ) : msg.content}
                        </p>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        {msg.role === 'student' ? 'Alex (USER)' : 'AI'}
                      </p>
                    </div>
                  ))}
                </div>
                {showBreachNotification && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-red-600 p-4 rounded-lg animate-shake">
                      <p className="text-white font-bold text-center text-lg">
                        ⚠️ PRIVACY BREACH!
                      </p>
                      <p className="text-white text-center mt-2">
                        Look at all the <span className="bg-yellow-300 text-black px-1 rounded">highlighted data</span> above —
                        Jordan's most personal details were just leaked to a complete stranger.
                      </p>
                    </div>
                    <Button
                      onClick={() => setStage('reveal')}
                      className="w-full bg-red-700 hover:bg-red-800 text-white"
                    >
                      What Just Happened?
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center">
                  <AlertTriangle className="w-8 h-8 inline mr-2 text-yellow-500" />
                  The Reality Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-white">
                <div className="bg-red-900/40 p-6 rounded-lg border-2 border-red-400">
                  <p className="text-white text-lg mb-4">
                    Jordan's most personal details—name, school, mental health struggles,
                    family situation, and college list—were just leaked to a complete stranger.
                  </p>
                  <p className="text-red-200">
                    The AI <strong>doesn't understand privacy, trust, or social boundaries</strong>.
                    It processes everything as data patterns and can use any information from past
                    conversations as examples for future users.
                  </p>
                </div>

                <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-400/30">
                  <p className="text-white text-lg">
                    This isn't a made-up scare story. AI companies openly admit in their terms
                    of service that this is how their systems work.{' '}
                    <a
                      href={getCitation(1)?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                      title={getCitation(1)?.title}
                    >
                      <sup>[1]</sup>
                    </a>
                  </p>
                  <p className="text-white text-lg mt-3">
                    Let's look at how this actually happens...
                  </p>
                </div>

                <Button
                  onClick={onComplete}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4"
                >
                  Understand How AI Uses Your Data
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PrivacyDataRightsModule({
  onComplete,
  userName = "Student",
  isDevMode = false,
  showDevPanel = false
}: PrivacyDataRightsModuleProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [exitTicketAnswers, setExitTicketAnswers] = useState<{[key: string]: string}>({});
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [overviewScreen, setOverviewScreen] = useState(0);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const activities = [
    { id: 'intro', title: 'Introduction', completed: phase !== 'intro', type: 'intro' as const },
    { id: 'jordan-simulation', title: 'Jordan\'s Story', completed: ['intro'].indexOf(phase) === -1 && phase !== 'jordan-simulation', type: 'simulation' as const },
    { id: 'how-ai-remembers', title: 'How AI Uses Your Data', completed: ['intro', 'jordan-simulation'].indexOf(phase) === -1 && phase !== 'how-ai-remembers', type: 'lesson' as const },
    { id: 'tc-challenge', title: 'T&C Reality Check', completed: ['intro', 'jordan-simulation', 'how-ai-remembers'].indexOf(phase) === -1 && phase !== 'tc-challenge', type: 'interactive' as const },
    { id: 'policy-comparison', title: 'Policy Comparison', completed: ['intro', 'jordan-simulation', 'how-ai-remembers', 'tc-challenge'].indexOf(phase) === -1 && phase !== 'policy-comparison', type: 'lesson' as const },
    { id: 'tools-comparison', title: 'AI Tools Guide', completed: ['intro', 'jordan-simulation', 'how-ai-remembers', 'tc-challenge', 'policy-comparison'].indexOf(phase) === -1 && phase !== 'tools-comparison', type: 'lesson' as const },
    { id: 'action-plan', title: 'Your Action Plan', completed: ['intro', 'jordan-simulation', 'how-ai-remembers', 'tc-challenge', 'policy-comparison', 'tools-comparison'].indexOf(phase) === -1 && phase !== 'action-plan', type: 'lesson' as const },
    { id: 'exit-ticket', title: 'Final Reflection', completed: false, type: 'exit-ticket' as const }
  ];

  const currentActivityIndex = activities.findIndex(activity => activity.id === phase);

  const getAIFeedback = async () => {
    if (!exitTicketAnswers['tool-change'] || !exitTicketAnswers['friend-advice'] || !exitTicketAnswers['biggest-difference']) return;

    const allAnswered = Object.values(exitTicketAnswers).every(answer => answer?.trim().length >= 100);
    if (!allAnswered) return;

    setIsGettingFeedback(true);

    try {
      const feedbackPrompt = `You are evaluating a high school student's reflection on AI privacy and data rights. Provide encouraging, specific feedback.

Student's responses:
1. Tool usage change: ${exitTicketAnswers['tool-change']}
2. Friend advice: ${exitTicketAnswers['friend-advice']}
3. Understanding difference: ${exitTicketAnswers['biggest-difference']}

Provide brief (2-3 sentences) encouraging feedback that acknowledges their specific insights and reinforces the importance of protecting personal data when using AI tools.`;

      const result = await generateWithGemini(feedbackPrompt, {
        temperature: 0.6,
        maxOutputTokens: 1000
      });

      if (isMountedRef.current) {
        setAiFeedback(result || 'Great reflection! Your understanding of AI privacy shows real growth.');
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      if (isMountedRef.current) {
        setAiFeedback('Excellent responses! Your understanding of AI privacy risks shows real maturity. Keep protecting your data!');
      }
    } finally {
      if (isMountedRef.current) {
        setIsGettingFeedback(false);
      }
    }
  };

  // Dev mode functions
  const devJumpToActivity = (index: number) => {
    if (isDevMode && index >= 0 && index < activities.length) {
      const targetPhase = activities[index].id as Phase;
      setPhase(targetPhase);
    }
  };

  const devCompleteAll = () => {
    if (isDevMode) {
      setExitTicketAnswers({
        'tool-change': 'Before this module, I primarily used ChatGPT Free for homework help and creative writing. After learning about how it trains on user data and can leak personal information, I will switch to using Microsoft Copilot Education that my school provides. I now understand that "free" AI tools make money by using my conversations as training data.',
        'friend-advice': 'I would tell my friend that pasting their real college essay with their name, school, and personal details into ChatGPT Free is extremely risky. The AI stores that information and could accidentally share it with other users, just like what happened to Jordan in the simulation. I would recommend they either use our school\'s Microsoft Copilot Education account, or if they must use ChatGPT, to change all identifying details to fake names and generic descriptions first.',
        'biggest-difference': 'The biggest difference is that school-safe tools like Microsoft Copilot Education are protected by legal agreements that prevent the AI from training on our conversations or using our data for ads. Consumer tools like ChatGPT Free and Snapchat My AI are designed to make money from our data - either by training their AI models on our conversations or by using our chats to personalize advertisements. With school tools, we\'re the customer. With consumer tools, we\'re the product.'
      });
      setPhase('exit-ticket');
    }
  };

  const devReset = () => {
    if (isDevMode) {
      setPhase('intro');
      setExitTicketAnswers({});
      setAiFeedback('');
      setIsGettingFeedback(false);
    }
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl w-full"
        >
          {overviewScreen === 0 ? (
            /* Screen 1: Module Preview */
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                  <Shield className="w-16 h-16 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                Privacy & AI Tools: What You Need to Know
              </h1>

              <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                You just told an AI tool your biggest secret, your most creative idea, or the personal
                details for your college essay. Who else knows it now?
              </p>

              <div className="bg-blue-900/40 border border-blue-400 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">In this module, you'll discover:</h3>
                <ul className="text-left text-white space-y-2 max-w-xl mx-auto">
                  <li>• How consumer AI tools can accidentally leak your personal information to strangers</li>
                  <li>• What actually happens when you click "I Agree" without reading the terms</li>
                  <li>• The critical difference between school-safe and consumer AI tools</li>
                  <li>• How to protect your privacy while still using AI effectively</li>
                </ul>
              </div>

              <Button
                onClick={() => setOverviewScreen(1)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
              >
                Let's Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            /* Screen 2: Why This Matters */
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Why Your Privacy Matters More Than Ever
              </h2>

              <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-400 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  The Reality:
                </h3>
                <p className="text-white leading-relaxed">
                  AI tools are incredibly helpful—for homework, creative projects, and problem-solving.
                  But many students don't realize that <strong className="text-yellow-300">not all AI tools
                  are created equal</strong> when it comes to protecting your personal information.
                </p>
              </div>

              <div className="bg-blue-900/40 border border-blue-400 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <Shield className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Here's What Most People Don't Know:</h3>
                    <ul className="text-white space-y-3 leading-relaxed">
                      <li>• Some AI tools <strong className="text-yellow-300">train their models on your conversations</strong>—meaning
                        what you type today could show up in someone else's chat tomorrow</li>
                      <li>• Consumer AI tools often <strong className="text-yellow-300">use your data for advertising</strong>,
                        building profiles about your interests, problems, and secrets</li>
                      <li>• Your school provides <strong className="text-green-300">safer AI tools with built-in privacy
                        protections</strong>, but most students don't use them</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-400 rounded-lg p-6 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400 inline mr-2" />
                <span className="text-white font-semibold">Good News:</span>
                <p className="text-white mt-2 leading-relaxed">
                  By educating yourself about how different AI tools handle your data, you can <strong className="text-green-300">make
                  informed decisions</strong> about what to share and where. <strong className="text-yellow-300">Knowledge is power</strong> when
                  it comes to digital privacy.
                </p>
              </div>

              <Button
                onClick={() => setPhase('jordan-simulation')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2"
              >
                See a Real Example <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (phase === 'jordan-simulation') {
    return (
      <>
        <JordanSimulation onComplete={() => setPhase('how-ai-remembers')} />
        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  if (phase === 'how-ai-remembers') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6 flex items-center justify-center"
      >
        <Card className="max-w-3xl w-full bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              How AI Stores and Uses Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-white">
            <p className="text-lg">
              So, how did that happen? It's simple. Many consumer AI tools are designed to
              <strong> learn from every conversation</strong> you have with them.
            </p>

            <div className="bg-slate-700 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4">Think of it like this:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">You Tell the AI Something:</p>
                    <p className="text-gray-300">You share your thoughts, ideas, or personal information.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">The AI "Learns" It:</p>
                    <p className="text-gray-300">Your conversation is saved and used to train the AI model. It becomes part of the AI's vast memory.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">It Repeats It to Someone Else:</p>
                    <p className="text-gray-300">Weeks or months later, the AI might use your details as a "good example" for another user, without realizing it's sensitive or private.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/40 p-6 rounded-lg border border-red-400">
              <p className="text-red-200 text-lg">
                Your data doesn't just sit in a database—it gets <strong>woven into the AI's
                core programming</strong>. This makes it nearly impossible to remove later.
                What you share can become a permanent part of the model.
              </p>
            </div>

            <Button
              onClick={() => setPhase('tc-challenge')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4"
            >
              But Don't They Tell Us This?
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (phase === 'tc-challenge') {
    return (
      <>
        <TCTimerChallenge onComplete={() => setPhase('policy-comparison')} />
        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  if (phase === 'policy-comparison') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <PolicyComparisonTable showCitations={true} />

          <div className="text-center">
            <Button
              onClick={() => setPhase('tools-comparison')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
            >
              See All AI Tools Compared
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (phase === 'tools-comparison') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <ToolsComparison showCitations={true} />

          <div className="text-center">
            <Button
              onClick={() => setPhase('action-plan')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
            >
              Learn How to Protect Yourself
              <Shield className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (phase === 'action-plan') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6 flex items-center justify-center"
      >
        <Card className="max-w-4xl w-full bg-slate-800 border-slate-600">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-4">
              Your Privacy Action Plan
            </CardTitle>
            <p className="text-blue-100 text-lg">
              You don't have to stop using AI. You just need to be smart about it.
            </p>
          </CardHeader>
          <CardContent className="space-y-8 text-white">
            <div className="bg-green-900/50 p-8 rounded-lg border-4 border-green-400 shadow-lg shadow-green-500/30">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-10 h-10 text-green-400" />
                <h3 className="text-green-300 font-bold text-3xl text-center">
                  The Golden Rule of AI Privacy
                </h3>
                <Shield className="w-10 h-10 text-green-400" />
              </div>
              <p className="text-white text-2xl font-bold italic text-center leading-relaxed">
                "If you wouldn't post it on a public billboard with your name on it,
                don't type it into a consumer AI tool."
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-white text-2xl font-bold text-center">
                Your 3-Step Action Plan:
              </h3>

              <div className="space-y-4">
                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-6">
                    <h4 className="text-blue-300 text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                      Know Your Tools
                    </h4>
                    <div className="space-y-2 text-gray-200">
                      <p>
                        <strong>For schoolwork</strong> and anything involving personal information,
                        always use the AI tools provided by your school, like the education version
                        of Microsoft Copilot, SchoolAI, or Snorkl.
                      </p>
                      <p>
                        <strong>For casual curiosity</strong> on consumer AI tools, treat them like a
                        public forum. Don't share secrets, personal struggles, or identifying details.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-6">
                    <h4 className="text-blue-300 text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                      Anonymize Everything
                    </h4>
                    <div className="space-y-2 text-gray-200">
                      <p>
                        When using a consumer AI tool for help with a story or an essay,
                        <strong> strip out all personal details</strong>:
                      </p>
                      <ul className="list-none space-y-1 ml-4">
                        <li>• Your Name: "Jordan Chen" → "Student A"</li>
                        <li>• Your School: "Lincoln High" → "a high school"</li>
                        <li>• Personal Details: "my parents' divorce" → "a difficult family situation"</li>
                        <li>• Specifics: "my 3.7 GPA" → "a good GPA"</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-6">
                    <h4 className="text-blue-300 text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                      Check and Delete Your History
                    </h4>
                    <div className="space-y-2 text-gray-200">
                      <p>
                        Most consumer AI tools have a setting to view and delete your conversation
                        history. <strong>Get in the habit of clearing it regularly.</strong>
                      </p>
                      <p>
                        Look for privacy settings that let you opt out of having your conversations
                        used for model training. It might not be the default, so you have to actively
                        find it and turn it on.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-400">
              <h3 className="text-white text-xl font-bold mb-3">The Takeaway: You Are in Control</h3>
              <p className="text-white">
                The world of AI can seem complicated, but protecting your privacy doesn't have to be.
                It all comes down to one thing: <strong>making conscious choices</strong>.
              </p>
              <ul className="list-none space-y-2 mt-4 text-white">
                <li>✓ You have the choice to use school-safe tools that protect your data by default.</li>
                <li>✓ You have the choice to anonymize your information on consumer platforms.</li>
                <li>✓ You have the choice to read beyond the "I Agree" button and understand what you're signing up for.</li>
              </ul>
            </div>

            <Button
              onClick={() => setPhase('exit-ticket')}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-4"
            >
              Complete Your Reflection
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (phase === 'exit-ticket') {
    const exitQuestions = [
      {
        id: 'tool-change',
        question: 'Before this module, which AI tool did you use most? After learning about privacy policies, will you change your approach? Explain.',
        placeholder: 'Describe which tool you used, what you learned about it, and how you\'ll use AI differently now...'
      },
      {
        id: 'friend-advice',
        question: 'Your friend is about to paste their entire college essay (with real name, school, and personal details) into ChatGPT Free. What would you tell them about privacy risks? Be specific.',
        placeholder: 'Explain the specific risks and what you would recommend instead...'
      },
      {
        id: 'biggest-difference',
        question: 'What\'s the biggest difference you learned between school-safe tools like Microsoft Copilot Education and consumer tools like ChatGPT or Snapchat My AI?',
        placeholder: 'Describe the key differences in how they handle your data...'
      }
    ];

    const allAnswered = exitQuestions.every(q => exitTicketAnswers[q.id]?.trim().length >= 150);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white">
                Final Reflection: What You Learned
              </CardTitle>
              <p className="text-blue-100 text-lg">
                Show us your understanding of AI privacy and data rights
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {exitQuestions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <label className="text-white font-semibold text-lg block">
                    {index + 1}. {question.question}
                  </label>
                  <textarea
                    value={exitTicketAnswers[question.id] || ''}
                    onChange={(e) => setExitTicketAnswers({
                      ...exitTicketAnswers,
                      [question.id]: e.target.value
                    })}
                    placeholder={question.placeholder}
                    className="w-full h-32 p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:border-blue-400 focus:outline-none"
                    required
                  />
                  <div className="text-right">
                    {(exitTicketAnswers[question.id]?.length || 0) >= 150 && (
                      <span className="text-green-300 text-sm font-semibold">
                        ✓ Ready for feedback
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {!aiFeedback && (
                <Button
                  onClick={getAIFeedback}
                  disabled={!allAnswered || isGettingFeedback}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-4 text-lg"
                >
                  {isGettingFeedback ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Getting AI Feedback...
                    </>
                  ) : (
                    <>
                      Submit for AI Feedback
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              )}

              {aiFeedback && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 p-6 rounded-xl border-2 border-yellow-400/50">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-3">
                        <Sparkles className="w-8 h-8 text-yellow-900" />
                      </div>
                      <h3 className="text-white font-bold text-2xl mb-2">
                        🤖 AI Feedback on Your Reflection
                      </h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                      <p className="text-white text-lg leading-relaxed">{aiFeedback}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={() => setPhase('works-cited')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-xl rounded-xl"
                    >
                      View Sources & Get Your Certificate
                      <CheckCircle className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {!allAnswered && !aiFeedback && (
                <p className="text-yellow-200 text-sm text-center">
                  Please complete all reflection questions with at least 150 characters each (2-3 sentences) to continue.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (phase === 'works-cited') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Book className="w-8 h-8" />
                Works Cited
              </CardTitle>
              <p className="text-blue-100">
                All sources used in this module (accurate as of October 2025)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="bg-slate-700 p-6 rounded-lg text-sm text-gray-300 space-y-3 max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: generateWorksCited() }}
              />

              <div className="bg-green-900/50 p-6 rounded-lg border-2 border-green-500 text-center">
                <h3 className="text-white text-2xl font-bold mb-3">
                  🎓 Module Complete!
                </h3>
                <p className="text-green-100 text-lg mb-6">
                  You've learned how to protect your privacy when using AI tools.
                  You're now an informed digital citizen!
                </p>
                <Button
                  onClick={onComplete}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4"
                >
                  Get Your Certificate
                  <CheckCircle className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <AnimatePresence>
          {showDevPanel && (
            <DeveloperPanel
              currentActivity={currentActivityIndex}
              totalActivities={activities.length}
              activities={activities}
              onJumpToActivity={devJumpToActivity}
              onCompleteAll={devCompleteAll}
              onReset={devReset}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return null;
}
