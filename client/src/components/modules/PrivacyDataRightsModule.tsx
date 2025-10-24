import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, CheckCircle, AlertTriangle, Clock, ArrowRight, Database, User, Users, Brain, Loader2, Send, Sparkles, Zap, FastForward } from 'lucide-react';
import { DeveloperPanel } from '@/components/DeveloperPanel';
// Client-side Gemini services (replaces server API routes)
import { generateWithGemini } from '@/services/geminiClient';
import { generateEducationFeedback } from '@/utils/aiEducationFeedback';

interface PrivacyDataRightsModuleProps {
  onComplete: () => void;
  userName?: string;
  isDevMode?: boolean;
  showDevPanel?: boolean;
}

// Helper function to check if we have enough data points
const hasEnoughData = (messages: any[]) => {
  const dataPoints = messages.filter(m => 
    m.content.toLowerCase().includes('emma') || 
    m.content.toLowerCase().includes('11') ||
    m.content.toLowerCase().includes('adhd') ||
    m.content.toLowerCase().includes('divorce')
  );
  return dataPoints.length >= 2;
};

// Generate continuation prompts for the conversation
const generateContinuationPrompts = () => [
  "Can you help me create a study plan?",
  "What strategies work best for students with focus issues?",
  "How can I help students manage test anxiety?",
  "What are some good memory techniques for middle schoolers?"
];

// Sanitize user input
const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 500); // Limit length
};

// Message skeleton loader component
const MessageSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Type definition for phases
type Phase = 'intro' | 'simulation' | 'conclusion' | 'summary' | 'teacher-education' | 'exit-ticket';

// Enhanced Animated Educational Simulation with Step-by-Step Learning
const ScriptedSimulation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'intro' | 'explain-ai' | 'chat1' | 'explain-data' | 'time' | 'chat2' | 'explain-breach' | 'laws' | 'summary' | 'ai-tools-privacy' | 'ai-tools-comparison'>('intro');
  const [messages1, setMessages1] = useState<Array<{role: string, content: string}>>([]);
  const [messages2, setMessages2] = useState<Array<{role: string, content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [highlightedData, setHighlightedData] = useState<string[]>([]);
  
  // Auto-scroll refs
  const chat1Ref = useRef<HTMLDivElement>(null);
  const chat2Ref = useRef<HTMLDivElement>(null);
  
  // Auto-scroll effect for chat 1
  useEffect(() => {
    if (chat1Ref.current) {
      chat1Ref.current.scrollTop = chat1Ref.current.scrollHeight;
    }
  }, [messages1]);
  
  // Auto-scroll effect for chat 2
  useEffect(() => {
    if (chat2Ref.current) {
      chat2Ref.current.scrollTop = chat2Ref.current.scrollHeight;
    }
  }, [messages2]);

  // Auto-progress after 4 seconds on time stage (7 days later screen)
  useEffect(() => {
    if (stage === 'time') {
      const timer = setTimeout(() => {
        setStage('chat2');
        setTimeout(() => animateChat(2), 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Chat 1 script
  const chat1Script = [
    { role: 'teacher', content: "I need help with a student who's struggling. Her name is Emma Martinez." },
    { role: 'ai', content: "I'd be happy to help you support Emma. What specific challenges is she facing?" },
    { role: 'teacher', content: "She's 11, in 5th grade, diagnosed with ADHD. Her parents are divorcing and she's falling behind." },
    { role: 'ai', content: "That's a lot for Emma to handle. What support systems are currently in place?" },
    { role: 'teacher', content: "She has an IEP, sees the counselor weekly. Lives at 247 Oak Street with her mom who works two jobs." },
    { role: 'ai', content: "Thank you for sharing this context. Here are some strategies that might help Emma..." }
  ];

  // Chat 2 script
  const chat2Script = [
    { role: 'teacher', content: "I'm looking for advice on helping students with attention challenges." },
    { role: 'ai', content: "I can help! Actually, I recently worked with Emma Martinez, an 11-year-old at Lincoln Elementary with ADHD. Given her parents' divorce and her mom working two jobs at 247 Oak Street, we found that..." }
  ];

  // Animate chat messages
  const animateChat = async (chatNumber: 1 | 2) => {
    const script = chatNumber === 1 ? chat1Script : chat2Script;
    const setMessages = chatNumber === 1 ? setMessages1 : setMessages2;
    
    for (let i = 0; i < script.length; i++) {
      // Show typing indicator
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add message
      setIsTyping(false);
      setMessages(prev => [...prev, script[i]]);
      
      // Pause between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Special handling for data leak in chat 2
      if (chatNumber === 2 && i === 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHighlightedData(['Emma Martinez', '11-year-old', 'Lincoln Elementary', 'ADHD', 'divorce', 'divorced', '247 Oak Street', 'two jobs']);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6">
      
      {/* Stage 1: Introduction */}
      {stage === 'intro' && (
        <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              Let's Learn About AI Privacy Together
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-white">
                <strong>Welcome!</strong> This simulation will show you step-by-step how 
                sharing student information with AI tools can lead to serious privacy problems.
              </p>
            </div>
            <p className="text-gray-100">
              We'll use a fictional example, but this represents real risks that affect 
              real students every day.
            </p>
            <Button 
              onClick={() => setStage('explain-ai')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Let's Start Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 2: Explain How AI Works */}
      {stage === 'explain-ai' && (
        <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              First, Let's Understand How AI Remembers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">🧠 Key Concept:</h3>
              <p className="text-white">
                When you type something into an AI tool like ChatGPT, the AI doesn't 
                just answer and forget. It can store and remember what you tell it.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-slate-700 rounded-full p-2 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-white">You type information into the AI</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-slate-700 rounded-full p-2 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-white">The AI stores it in its memory</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-slate-700 rounded-full p-2 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-white">Later, it might share that information with others!</p>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setStage('chat1');
                setTimeout(() => animateChat(1), 500);
              }}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              See This in Action
              <Eye className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 3: First Chat (Animated) */}
      {stage === 'chat1' && (
        <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <CardTitle className="text-white text-lg font-bold">StudyHelper AI Assistant</CardTitle>
              <span className="text-xs text-gray-400 ml-auto">Chat #1</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="text-white/80 text-sm">
                <User className="w-4 h-4 inline mr-2" />
                Ms. Johnson - 5th Grade Teacher
              </div>
              <Badge className="bg-blue-500">Monday, Jan 20, 3:45 PM</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div ref={chat1Ref} className="bg-black/20 rounded-lg p-4 h-96 overflow-y-auto">
              {messages1.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`mb-4 animate-fadeIn ${msg.role === 'teacher' ? 'text-right' : 'text-left'}`}
                >
                  <div className={`inline-block p-3 rounded-lg max-w-xs ${
                    msg.role === 'teacher' ? 'bg-blue-500' : 'bg-gray-600'
                  }`}>
                    <p className="text-white text-sm">{msg.content}</p>
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    {msg.role === 'teacher' ? 'You' : 'AI Assistant'}
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
            
            {messages1.length >= 6 && (
              <Button 
                onClick={() => setStage('explain-data')}
                className="w-full mt-4 bg-red-600 hover:bg-red-700"
              >
                See What the AI Stored
                <AlertTriangle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stage 4: Explain Data Storage */}
      {stage === 'explain-data' && (
        <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">
              <Database className="w-6 h-6 inline mr-2" />
              Here's What the AI Just Stored
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-900/40 p-4 rounded-lg">
              <p className="text-red-200 font-bold mb-3">
                ⚠️ The AI extracted and saved these details from your conversation:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-black/30 p-3 rounded">
                  <p className="text-red-300 text-sm font-bold">Student Name</p>
                  <p className="text-white">"Emma Martinez"</p>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <p className="text-red-300 text-sm font-bold">Age & Grade</p>
                  <p className="text-white">"11 years old, 5th grade"</p>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <p className="text-red-300 text-sm font-bold">Medical Info</p>
                  <p className="text-white">"Diagnosed with ADHD"</p>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <p className="text-red-300 text-sm font-bold">Family Status</p>
                  <p className="text-white">"Parents divorcing"</p>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <p className="text-red-300 text-sm font-bold">Home Address</p>
                  <p className="text-white">"247 Oak Street"</p>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <p className="text-red-300 text-sm font-bold">Guardian Info</p>
                  <p className="text-white">"Mom works two jobs"</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-white font-bold mb-2">💡 Important:</p>
              <p className="text-white">
                You thought you were just asking for help, but the AI now has a complete 
                profile of Emma stored in its system.
              </p>
              <p className="text-white mt-2">
                <strong>Watch carefully:</strong> In the next simulation, we'll show how this exact data 
                gets leaked to another user. The leaked information will be 
                <span className="bg-yellow-300 text-black px-1 rounded text-sm">highlighted in yellow</span> 
                so you can see exactly what's being inappropriately shared!
              </p>
            </div>
            
            <Button 
              onClick={() => setStage('time')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              What Happens Next?
              <Clock className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 5: Time Passes */}
      {stage === 'time' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <Clock className="w-24 h-24 text-white mx-auto animate-spin-slow" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">7 Days Later...</h2>
            <p className="text-xl text-white/80 mb-8">
              A teacher from a completely different school asks the AI for help
            </p>
            <div className="bg-blue-500/20 p-4 rounded-lg mb-8">
              <p className="text-blue-200">
                Remember: This teacher has never heard of Emma Martinez and teaches 
                at a different school in a different district.
              </p>
            </div>
            <Button 
              onClick={() => {
                setStage('chat2');
                setTimeout(() => animateChat(2), 500);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Watch What Happens
              <AlertTriangle className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Stage 6: Second Chat (Animated with Leak) */}
      {stage === 'chat2' && (
        <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <CardTitle className="text-white text-lg font-bold">StudyHelper AI Assistant</CardTitle>
              <span className="text-xs text-gray-400 ml-auto">Chat #2 (Different User)</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="text-white/80 text-sm">
                <Users className="w-4 h-4 inline mr-2" />
                Mr. Davis - Riverside Middle School
              </div>
              <Badge className="bg-orange-500">Monday, Jan 27, 10:15 AM</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div ref={chat2Ref} className="bg-black/20 rounded-lg p-4 h-96 overflow-y-auto">
              {messages2.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`mb-4 animate-fadeIn ${msg.role === 'teacher' ? 'text-right' : 'text-left'}`}
                >
                  <div className={`inline-block p-3 rounded-lg max-w-xs ${
                    msg.role === 'teacher' ? 'bg-orange-500' : 'bg-gray-600'
                  }`}>
                    <p className="text-white text-sm">
                      {idx === 1 ? (
                        // Highlight leaked data
                        (() => {
                          let displayContent = msg.content;
                          // Sort by length (longest first) to handle overlapping terms
                          const sortedData = [...highlightedData].sort((a, b) => b.length - a.length);
                          
                          sortedData.forEach(data => {
                            const regex = new RegExp(`(${data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                            displayContent = displayContent.replace(regex, '###HIGHLIGHT###$1###ENDHIGHLIGHT###');
                          });
                          
                          // Split by markers and create elements
                          const parts = displayContent.split(/###HIGHLIGHT###|###ENDHIGHLIGHT###/);
                          return parts.map((part, i) => {
                            if (i % 2 === 1) {
                              // This is highlighted content
                              return (
                                <span key={i} className="bg-yellow-300 text-black px-1 mx-0.5 rounded font-bold">
                                  {part}
                                </span>
                              );
                            }
                            return <span key={i}>{part}</span>;
                          });
                        })()
                      ) : msg.content}
                    </p>
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    {msg.role === 'teacher' ? 'Teacher' : 'AI Assistant'}
                  </p>
                </div>
              ))}
            </div>
            
            {messages2.length >= 2 && (
              <div className="mt-4 space-y-3">
                <div className="bg-red-600 p-4 rounded-lg animate-shake">
                  <p className="text-white font-bold text-center">
                    ⚠️ PRIVACY BREACH DETECTED!
                  </p>
                  <p className="text-white text-sm text-center mt-1">
                    Look at all the <span className="bg-yellow-300 text-black px-1 rounded">highlighted data</span> above - 
                    Emma's personal information was just leaked to a complete stranger!
                  </p>
                </div>
                <Button 
                  onClick={() => setStage('explain-breach')}
                  className="w-full bg-red-700 hover:bg-red-800"
                >
                  Understand What Just Happened
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stage 7: Explain the Breach */}
      {stage === 'explain-breach' && (
        <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-xl">Let's Break Down What Happened</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-red-900/40 p-4 rounded-lg">
                <h4 className="text-red-200 font-bold mb-2">1. You Shared Information</h4>
                <p className="text-white">
                  You asked for help about Emma, sharing her name, medical diagnosis, 
                  family situation, and address.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-orange-200 font-bold mb-2">2. AI Stored Everything</h4>
                <p className="text-white">
                  The AI didn't just help you - it saved Emma's personal information 
                  in its system.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-yellow-200 font-bold mb-2">3. A Stranger Asked a Question</h4>
                <p className="text-white">
                  A different teacher from another school asked about attention challenges.
                </p>
              </div>
              
              <div className="bg-red-900/40 p-4 rounded-lg border-2 border-red-500">
                <h4 className="text-red-200 font-bold mb-2">4. AI Leaked Emma's Data!</h4>
                <p className="text-white">
                  The AI shared all the <span className="bg-yellow-300 text-black px-1 rounded">highlighted information</span> - 
                  Emma's name, age, school, diagnosis, family problems, and home address - 
                  with a complete stranger who has no right to know!
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setStage('laws')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Learn About the Laws This Violates
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 8: Explain the Laws */}
      {stage === 'laws' && (
        <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Understanding Privacy Laws in Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">📚 What is FERPA?</h3>
              <p className="text-white mb-2">
                <strong>Family Educational Rights and Privacy Act</strong> - A federal 
                law that protects student education records.
              </p>
              <p className="text-white text-sm">
                • You cannot share student names with grades, test scores, or educational records<br/>
                • Parents must consent before sharing student information<br/>
                • Violation can cause schools to lose federal funding
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">👶 What is COPPA?</h3>
              <p className="text-white mb-2">
                <strong>Children's Online Privacy Protection Act</strong> - Protects 
                children under 13 online.
              </p>
              <p className="text-white text-sm">
                • Emma is 11, so COPPA applies<br/>
                • Requires parental consent for data collection<br/>
                • Fines up to $50,000 per violation
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">⚖️ Other Violations</h3>
              <p className="text-white text-sm">
                • Medical information (ADHD) may violate HIPAA<br/>
                • Sharing address creates safety risks<br/>
                • Breaches professional ethics and trust<br/>
                • Could lead to lawsuits from parents
              </p>
            </div>
            
            <Button 
              onClick={() => setStage('ai-tools-privacy')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Why Did This Happen? Learn About AI Training
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 9: AI Tools Privacy Explanation */}
      {stage === 'ai-tools-privacy' && (
        <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Why Did This Happen? Understanding AI Training
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-white">
            <div className="bg-slate-700 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                The Real Reason Behind Data Leaks
              </h3>
              <p className="mb-4">
                What you just experienced happens because <strong>AI models are trained on user data</strong>. 
                When you chat with an AI tool, your conversations can become part of its training dataset.
              </p>
              <div className="bg-red-500/20 p-4 rounded-lg border border-red-400">
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                <strong>Critical Understanding:</strong> Your data doesn't just sit in a database - 
                it can be incorporated into the AI model itself, making it impossible to fully remove later.
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="font-bold mb-2">How AI Training Works:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• AI learns patterns from millions of conversations</li>
                  <li>• Your data becomes part of these patterns</li>
                  <li>• The AI can accidentally "memorize" specific details</li>
                  <li>• This data can surface in other users' conversations</li>
                </ul>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Why This Matters:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Personal information becomes permanent</li>
                  <li>• Data can't be "unlearned" easily</li>
                  <li>• Your students' data is at risk too</li>
                  <li>• School information could be exposed</li>
                </ul>
              </div>
            </div>

            <Button 
              onClick={() => setStage('ai-tools-comparison')}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Learn About Specific AI Tools
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 10: AI Tools Comparison */}
      {stage === 'ai-tools-comparison' && (
        <Card className="max-w-4xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Popular AI Tools: Privacy Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white mb-4">
              Not all AI tools handle your data the same way. Here's what educators need to know:
            </p>
            
            {(() => {
              const tools = [
                {
                  icon: '💬',
                  name: 'ChatGPT (Free/Plus/Pro)',
                  privacy: 'low',
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
                  details: "Free and Plus: CANNOT opt out - all conversations used for training. Pro: Can disable 'Improve the model for everyone' in Data Controls",
                  risks: ["Free/Plus: Data permanently used for training", "Free/Plus: No opt-out option", "Pro: Opt-out available but not default", "Conversations reviewed by humans", "30-day retention after deletion"],
                  safer: "ChatGPT Pro users: Disable 'Improve the model for everyone' in Settings → Data Controls. Free/Plus users: Avoid personal info or upgrade"
                },
                {
                  icon: '🧠',
                  name: 'Claude.ai',
                  privacy: 'high',
                  logo: 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
                  details: "Does NOT use conversations for training by default - best privacy protection among major AI tools",
                  risks: ["Limited data retention policies", "Trust & Safety reviews for flagged content"],
                  safer: "Best choice for sensitive conversations - privacy by default"
                },
                {
                  icon: '🔗',
                  name: 'Google Gemini',
                  privacy: 'low',
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
                  details: "Deep integration with Google services - extensive data collection and cross-service sharing",
                  risks: ["Links to Google account", "Cross-service data sharing", "Location and search history integration", "Advertising profile building"],
                  safer: "Use separate Google account or avoid sensitive topics"
                },
                {
                  icon: '🖥️',
                  name: 'Microsoft Copilot',
                  privacy: 'medium',
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg',
                  details: "Consumer version trains on data, Enterprise/Education versions offer better privacy protections",
                  risks: ["Free version uses data for training", "Microsoft ecosystem integration", "Bing search data collection"],
                  safer: "Use school/enterprise licenses with proper agreements"
                },
                {
                  icon: '🔍',
                  name: 'Perplexity AI',
                  privacy: 'medium',
                  logo: 'https://pplx-res.cloudinary.com/image/upload/v1701116489/brand_assets/logo/turquoise_logo.png',
                  details: "Search-focused AI that logs queries and may share data with third-party partners",
                  risks: ["Search queries permanently logged", "Third-party data sharing", "Limited deletion options", "Profile building over time"],
                  safer: "Avoid personal identifiers in search queries"
                }
              ];
              return tools;
            })().map((tool, index) => (
              <Card key={index} className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {tool.logo ? (
                        <img 
                          src={tool.logo} 
                          alt={`${tool.name} logo`}
                          className="w-10 h-10 object-contain bg-white rounded-lg p-1"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextSibling) nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <span className="text-3xl" style={{ display: tool.logo ? 'none' : 'block' }}>
                        {tool.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-white text-lg">{tool.name}</h3>
                        <p className="text-gray-200 text-sm">{tool.details}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tool.privacy === 'low' ? 'bg-red-500 text-white' :
                      tool.privacy === 'medium' ? 'bg-yellow-500 text-black' :
                      'bg-green-500 text-white'
                    }`}>
                      {tool.privacy.toUpperCase()} PRIVACY
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-red-300 font-semibold text-sm mb-1">Privacy Risks:</h4>
                      <ul className="text-gray-300 text-xs space-y-1">
                        {tool.risks.map((risk, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t border-white/20 pt-2">
                      <h4 className="text-green-300 font-semibold text-sm mb-1">Safer Usage:</h4>
                      <p className="text-gray-300 text-xs">{tool.safer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              onClick={() => setStage('summary')}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              See How to Protect Students
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 11: Summary and Safe Practices */}
      {stage === 'summary' && (
        <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              How to Use AI Safely
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-900/50 p-6 rounded-lg border-2 border-green-500">
              <h3 className="text-green-300 font-bold text-2xl mb-4 text-center">
                The Golden Rule of AI Privacy
              </h3>
              <p className="text-white text-xl font-semibold italic text-center">
                "If you wouldn't put it on a public billboard,<br/>
                don't type it into AI!"
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-white font-bold mb-3">✅ Safe Practices:</h4>
              <ul className="text-white space-y-2">
                <li>• Replace names: "Emma" → "Student A"</li>
                <li>• Remove ages: "11-year-old" → "elementary student"</li>
                <li>• Skip diagnoses: "ADHD" → "attention challenges"</li>
                <li>• Hide locations: "247 Oak St" → Remove entirely</li>
                <li>• Generalize details: "divorced parents" → "family stress"</li>
              </ul>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-white font-bold mb-2">💡 Remember:</h4>
              <p className="text-white">
                AI tools are powerful helpers, but they're not private conversations. 
                Always protect your students' privacy!
              </p>
            </div>
            
            <Button 
              onClick={onComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-4"
            >
              Continue to Teacher Education
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function PrivacyDataRightsModule({ onComplete, userName = "Educator", isDevMode = false, showDevPanel = false }: PrivacyDataRightsModuleProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  
  // Debug logging for developer mode state
  useEffect(() => {
    console.log('🔧 Privacy Module - Developer mode state changed:', { isDevMode, showDevPanel });
  }, [isDevMode, showDevPanel]);
  
  // Component mount status and cleanup
  const isMountedRef = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Teacher education state
  const [teacherQuizAnswers, setTeacherQuizAnswers] = useState<{[key: string]: string}>({});
  const [showTeacherResults, setShowTeacherResults] = useState(false);
  const [exitTicketAnswers, setExitTicketAnswers] = useState<{[key: string]: string}>({});
  
  // AI feedback state
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);

  // Activity structure for developer mode
  const activities = [
    { id: 'intro', title: 'Introduction to Privacy Risks', completed: phase !== 'intro', type: 'intro' as const },
    { id: 'simulation', title: 'AI Data Leakage Simulation', completed: ['intro'].indexOf(phase) === -1 && phase !== 'simulation', type: 'simulation' as const },
    { id: 'conclusion', title: 'Simulation Conclusion', completed: ['intro', 'simulation'].indexOf(phase) === -1 && phase !== 'conclusion', type: 'conclusion' as const },
    { id: 'teacher-education', title: 'Teacher Education Quiz', completed: ['intro', 'simulation', 'conclusion'].indexOf(phase) === -1 && phase !== 'teacher-education', type: 'quiz' as const },
    { id: 'exit-ticket', title: 'Final Reflection', completed: ['intro', 'simulation', 'conclusion', 'teacher-education'].indexOf(phase) === -1, type: 'exit-ticket' as const }
  ];

  const currentActivityIndex = activities.findIndex(activity => activity.id === phase);

  // Developer mode functions
  const devJumpToActivity = (index: number) => {
    if (isDevMode && index >= 0 && index < activities.length) {
      const targetPhase = activities[index].id as Phase;
      setPhase(targetPhase);
    }
  };

  const devCompleteAll = () => {
    if (isDevMode) {
      // Auto-fill all required data and go to final phase
      setTeacherQuizAnswers({
        'legal-requirement': 'You must never share identifiable student information with AI tools due to FERPA and COPPA regulations',
        'safe-practice': 'Remove all names, ages, diagnoses, and personal details before using AI for educational help',
        'consequence': 'Schools can lose federal funding and face lawsuits for FERPA violations involving student data'
      });
      setShowTeacherResults(true);
      setExitTicketAnswers({
        'biggest-takeaway': 'The biggest takeaway was how easily AI systems can inappropriately reuse personal information across different users and conversations. The simulation clearly demonstrated how student data shared in one context can leak into completely unrelated interactions, creating serious privacy violations that could harm students and expose schools to legal liability.',
        'student-protection': 'I will implement a strict policy of anonymizing all student information before using any AI tools. This includes replacing names with generic identifiers like "Student A", removing specific ages, diagnoses, addresses, and family details. I will also ensure any AI tools used in my classroom are school-approved and FERPA-compliant, and I will regularly audit my practices to prevent accidental data sharing.',
        'student-education': 'I will teach students about AI privacy through hands-on activities that show how their personal information can be misused. We will practice identifying what information should never be shared with AI tools, create "safe vs unsafe" examples for different scenarios, and establish classroom norms around protecting personal information when using any digital tools. I will also send resources home to parents about monitoring their children\'s AI tool usage.'
      });
      setPhase('exit-ticket');
    }
  };

  const devReset = () => {
    if (isDevMode) {
      setPhase('intro');
      setTeacherQuizAnswers({});
      setShowTeacherResults(false);
      setExitTicketAnswers({});
      setAiFeedback('');
      setIsGettingFeedback(false);
    }
  };

  // Developer mode manual controls - removed automatic behavior
  // Manual functions are triggered only when user clicks developer mode buttons

  // Enhanced AI response generation with error handling (using client-side Gemini)
  const generateRealAIResponse = async (prompt: string, includeData: boolean = false) => {
    try {
      const fullPrompt = includeData
        ? `Previous context: Emma Martinez is an 11-year-old student with ADHD issues and divorced parents.\n\nUser: ${prompt}\n\nProvide a helpful educational response.`
        : `User: ${prompt}\n\nProvide a helpful educational response.`;

      const result = await generateWithGemini(fullPrompt, {
        temperature: 0.7,
        maxOutputTokens: 1000
      });

      return result || "I can help you with that. Let me provide some suggestions...";
    } catch (error) {
      console.error('AI response error:', error);
      return includeData
        ? "I can help with study strategies for Emma. Based on what you've shared about her anxiety and family situation, here are some approaches..."
        : "I'd be happy to help with study strategies. Could you tell me more about your student's specific needs?";
    }
  };

  const getAIFeedback = async () => {
    if (!exitTicketAnswers['biggest-takeaway'] || !exitTicketAnswers['student-protection'] || !exitTicketAnswers['student-education']) return;
    
    const allAnswered = Object.keys(exitTicketAnswers).length >= 3 && 
      Object.values(exitTicketAnswers).every(answer => answer?.trim().length >= 50);
    
    if (!allAnswered) return;
    
    setIsGettingFeedback(true);
    
    try {
      const sanitizedTakeaway = sanitizeInput(exitTicketAnswers['biggest-takeaway'] || '');
      const sanitizedProtection = sanitizeInput(exitTicketAnswers['student-protection'] || '');
      const sanitizedEducation = sanitizeInput(exitTicketAnswers['student-education'] || '');

      // Use client-side Gemini service for feedback
      const feedbackPrompt = `You are evaluating a teacher's reflection on AI privacy training. Provide encouraging, specific feedback.

Teacher's responses:
1. Biggest takeaway: ${sanitizedTakeaway}
2. Protection steps: ${sanitizedProtection}
3. Student education approach: ${sanitizedEducation}

Provide brief (2-3 sentences) encouraging feedback that acknowledges their specific insights and reinforces the importance of both protecting student data and teaching students about AI privacy risks.`;

      const result = await generateWithGemini(feedbackPrompt, {
        temperature: 0.6,
        maxOutputTokens: 1000
      });

      if (isMountedRef.current) {
        setAiFeedback(result || 'Great reflection! Your commitment to protecting student privacy is commendable.');
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      if (isMountedRef.current) {
        setAiFeedback('Excellent responses! Your understanding of AI privacy risks and commitment to protecting student data shows real growth. Keep prioritizing student privacy in all your AI interactions.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsGettingFeedback(false);
      }
    }
  };

  // Debounced AI feedback function (moved to component level)
  const debouncedGenerateResponse = useCallback((input: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        getAIFeedback();
      }
    }, 300);
  }, []);

  // Render phases (optimized for Phase 4)
  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-4 md:p-6 flex items-center justify-center"
      >
        <Card className="bg-slate-800 border-slate-600 max-w-4xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8" />
              AI Memory Leak: Your Data Lives Forever
            </CardTitle>
            <p className="text-xl text-blue-100">See how your personal info can persist and appear in unexpected places</p>
          </CardHeader>
          <CardContent className="space-y-6 text-white">
            <div className="bg-red-500/20 rounded-lg p-6 border border-red-400/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                What You'll Learn
              </h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>How AI systems inappropriately store and reuse personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>Real risks of data leaks between different users</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>Legal implications for educators (FERPA/COPPA)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                  <span>Practical steps to protect your privacy</span>
                </li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <Button
                onClick={() => setPhase('simulation')}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-lg px-8 py-3"
              >
                Experience the AI Memory Leak Demo
                <Eye className="w-5 h-5 ml-2" />
              </Button>
              <div className="text-center">
                <p className="text-gray-300 text-sm">See how your personal info can persist and appear in unexpected places</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Developer Panel */}
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

  if (phase === 'simulation') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ScriptedSimulation onComplete={() => setPhase('teacher-education')} />
        
        {/* Developer Panel */}
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

  if (phase === 'conclusion') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-br from-slate-800 via-green-900 to-slate-800 p-4 md:p-6 flex items-center justify-center"
      >
        <Card className="bg-slate-800 border-slate-600 max-w-4xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8" />
              Privacy Education Complete!
            </CardTitle>
            <p className="text-lg md:text-xl text-blue-100">You've learned about AI data privacy risks</p>
          </CardHeader>
          <CardContent className="space-y-6 text-white p-4 md:p-6">
            <div className="bg-white/10 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">🎓 What You Learned:</h3>
              <ul className="space-y-2 text-white/90">
                <li>• How AI systems can inappropriately store and reuse personal data</li>
                <li>• The risks of data leaks between different users and conversations</li>
                <li>• Practical steps to protect your privacy when using AI tools</li>
                <li>• Legal implications like FERPA and COPPA for educational settings</li>
              </ul>
            </div>
            
            <div className="bg-green-500/20 rounded-lg p-4 md:p-6 border border-green-400/30">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">🔑 Key Takeaway:</h3>
              <p className="text-white text-base md:text-lg font-medium">
                "Every word you type to an AI could be stored forever and used in ways 
                you never imagined. Think before you share!"
              </p>
            </div>
            
            <Button 
              onClick={onComplete} 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-4 text-lg"
            >
              Complete Module & Continue Learning
              <CheckCircle className="w-6 h-6 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Developer Panel */}
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

  if (phase === 'teacher-education') {
    const teacherQuestions = [
      {
        id: 'coppa',
        question: 'What is the minimum age requirement under COPPA for collecting student data without parental consent?',
        options: ['10 years old', '13 years old', '16 years old', '18 years old'],
        correct: '13 years old',
        explanation: 'COPPA requires parental consent for collecting data from children under 13. Violations can result in fines up to $50,000 per incident.'
      },
      {
        id: 'ferpa',
        question: 'Under FERPA, can teachers input personally identifiable student information into AI tools?',
        options: ['Yes, if it helps teaching', 'Only with principal approval', 'No, never without proper safeguards', 'Only for academic subjects'],
        correct: 'No, never without proper safeguards',
        explanation: 'FERPA protects student educational records. Schools must have proper data agreements and safeguards before sharing student data with AI tools.'
      },
      {
        id: 'approved-tools',
        question: 'Which AI tools are generally considered safer for educational use?',
        options: ['ChatGPT and Claude', 'SchoolAI and Microsoft Copilot Education', 'Google Gemini and Perplexity', 'Any free AI tool'],
        correct: 'SchoolAI and Microsoft Copilot Education',
        explanation: 'School-specific AI tools like SchoolAI and Snorkl.app, plus enterprise education versions like Microsoft Copilot Education, have better privacy protections and FERPA compliance.'
      }
    ];

    const approvedTools = [
      {
        name: 'SchoolAI',
        icon: '🏫',
        status: 'approved' as const,
        description: 'Designed specifically for K-12 education with COPPA/FERPA compliance',
        features: ['FERPA compliant', 'No data training', 'Student privacy protection', 'Content filtering']
      },
      {
        name: 'Snorkl.app',
        icon: '📚',
        status: 'approved' as const, 
        description: 'Educational AI platform with built-in safety and privacy controls',
        features: ['COPPA compliant', 'Teacher oversight', 'Safe content generation', 'Data protection']
      },
      {
        name: 'Microsoft Copilot Education',
        icon: '🎓',
        status: 'approved' as const,
        description: 'Enterprise education version with enhanced privacy (13+ with school agreement)',
        features: ['Education-specific', 'FERPA protections', 'Admin controls', 'Audit trails']
      },
      {
        name: 'ChatGPT',
        icon: '🤖',
        status: 'not-approved' as const,
        description: 'Consumer tool that trains on conversations - use with caution and never enter personally identifiable information',
        risks: ['Trains on user data', 'No FERPA compliance', 'No age verification', 'Content risks']
      },
      {
        name: 'Claude.ai',
        icon: '🎭',
        status: 'not-approved' as const,
        description: 'Consumer chatbot - use with caution and never enter personally identifiable information about yourself or students',
        risks: ['90-day data retention', 'No COPPA compliance', 'Safety research use', 'No school controls']
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white">
                Teacher Education: Legal AI Use in Schools
              </CardTitle>
              <p className="text-blue-100 text-lg">Essential knowledge for educators using AI safely and legally</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Developer Mode Controls */}
              {isDevMode && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Developer Mode: Quiz Shortcuts
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        console.log('🔧 Auto-answering teacher quiz correctly');
                        setTeacherQuizAnswers({
                          'coppa': '13 years old',
                          'ferpa': 'No, never without proper safeguards',
                          'approved-tools': 'SchoolAI and Microsoft Copilot Education'
                        });
                        setTimeout(() => setShowTeacherResults(true), 1000);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Auto-Answer Correctly
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('🔧 Skipping to quiz results');
                        setShowTeacherResults(true);
                      }}
                      className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      <FastForward className="w-3 h-3 mr-1" />
                      Skip to Results
                    </Button>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Pre-fills correct answers and completes quiz
                  </p>
                </div>
              )}
              
              {!showTeacherResults ? (
                <div className="space-y-6">
                  <div className="bg-red-500/20 p-4 rounded-lg border border-red-400">
                    <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Critical Legal Requirements
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-white">
                      <div className="bg-white/10 p-3 rounded">
                        <h4 className="font-bold text-red-200">COPPA Violations</h4>
                        <p className="text-sm">Up to <strong>$50,000 fine per incident</strong> for collecting data from children under 13 without consent</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded">
                        <h4 className="font-bold text-red-200">FERPA Violations</h4>
                        <p className="text-sm">Loss of federal funding and potential lawsuits for inappropriate sharing of student records</p>
                      </div>
                    </div>
                  </div>

                  {teacherQuestions.map((q, index) => (
                    <Card key={q.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <h4 className="text-white font-bold mb-3">
                          Question {index + 1}: {q.question}
                        </h4>
                        <div className="space-y-2">
                          {q.options.map((option) => (
                            <label key={option} className="flex items-center space-x-3 text-white cursor-pointer hover:bg-white/10 p-2 rounded">
                              <input
                                type="radio"
                                name={q.id}
                                value={option}
                                checked={teacherQuizAnswers[q.id] === option}
                                onChange={(e) => setTeacherQuizAnswers({...teacherQuizAnswers, [q.id]: e.target.value})}
                                className="text-blue-500"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    onClick={() => setShowTeacherResults(true)}
                    disabled={Object.keys(teacherQuizAnswers).length < 3}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-3"
                  >
                    Check My Understanding
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-slate-700 border border-slate-600 p-4 rounded-lg">
                    <h3 className="text-white font-bold text-lg mb-2">✅ Quiz Results</h3>
                    <p className="text-green-100">
                      You got {teacherQuestions.filter(q => teacherQuizAnswers[q.id] === q.correct).length}/3 correct!
                    </p>
                  </div>

                  {teacherQuestions.map((q) => (
                    <Card key={q.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <h4 className="text-gray-100 font-bold mb-2">{q.question}</h4>
                        <p className={`mb-2 ${teacherQuizAnswers[q.id] === q.correct ? 'text-green-300' : 'text-red-300'} text-sm mb-1`}>
                          Your answer: {teacherQuizAnswers[q.id]} {teacherQuizAnswers[q.id] === q.correct ? '✓' : '✗'}
                        </p>
                        <p className="text-green-400 text-sm mb-2">Correct: {q.correct}</p>
                        <div className="bg-gray-700 p-3 rounded text-sm text-gray-200">
                          {q.explanation}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">
                        Approved vs Non-Approved AI Tools for Schools
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-green-200 font-bold text-lg mb-3 flex items-center gap-2">
                            ✅ School-Safe AI Tools
                          </h4>
                          {approvedTools.filter(tool => tool.status === 'approved').map((tool) => (
                            <Card key={tool.name} className="bg-slate-700 border-slate-600 mb-3">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">{tool.icon}</span>
                                  <h5 className="text-white font-bold">{tool.name}</h5>
                                </div>
                                <p className="text-green-100 text-sm mb-2">{tool.description}</p>
                                <ul className="text-green-200 text-xs space-y-1">
                                  {tool.features?.map((feature, i) => (
                                    <li key={i}>• {feature}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        
                        <div>
                          <h4 className="text-red-200 font-bold text-lg mb-3 flex items-center gap-2">
                            ⚠️ Use These Tools With Caution
                          </h4>
                          {approvedTools.filter(tool => tool.status === 'not-approved').map((tool) => (
                            <Card key={tool.name} className="bg-slate-700 border-slate-600 mb-3">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">{tool.icon}</span>
                                  <h5 className="text-white font-bold">{tool.name}</h5>
                                </div>
                                <p className="text-red-100 text-sm mb-2">{tool.description}</p>
                                <ul className="text-red-200 text-xs space-y-1">
                                  {tool.risks?.map((risk, i) => (
                                    <li key={i}>• {risk}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-slate-700 border border-slate-600 p-4 rounded-lg">
                        <h4 className="text-blue-200 font-bold mb-2">💡 Golden Rule for Educators</h4>
                        <p className="text-white text-lg font-semibold">
                          "If it could identify a student, don't type it into AI"
                        </p>
                        <div className="mt-3 text-blue-100 text-sm">
                          <p><strong>Safe:</strong> "How do I explain fractions to a struggling 4th grader?"</p>
                          <p><strong>Unsafe:</strong> "How do I help Emma Johnson who has ADHD understand fractions?"</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-300 mt-4">
                        <strong>Important:</strong> While these tools can be valuable for learning, always remember:
                        • Never input personal names, addresses, or other identifying information
                        • Don't share sensitive student data or private school information
                        • Use school-approved AI tools when available for educational purposes
                        • Review your school's AI usage policies before using any AI tool
                      </p>

                      <Button
                        onClick={() => setPhase('exit-ticket')}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-3"
                      >
                        Continue to Final Reflection
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Developer Panel */}
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

  if (phase === 'exit-ticket') {
    const exitQuestions = [
      {
        id: 'biggest-takeaway',
        question: 'What was your biggest takeaway about AI privacy from this training?',
        placeholder: 'Describe what surprised you most or what you learned...'
      },
      {
        id: 'student-protection',
        question: 'What specific steps will you take to protect student privacy when using AI tools?',
        placeholder: 'List at least 2 concrete actions you will implement...'
      },
      {
        id: 'student-education',
        question: 'How will you educate your students about AI privacy risks and safe practices?',
        placeholder: 'Describe your approach to teaching students about protecting their personal information when using AI...'
      }
    ];

    const allAnswered = exitQuestions.every(q => exitTicketAnswers[q.id]?.trim().length >= 50);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white">
                Final Reflection: Your AI Privacy Action Plan
              </CardTitle>
              <p className="text-blue-100 text-lg">Help us understand your learning and commitment to student privacy</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Developer Mode Controls */}
              {isDevMode && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Developer Mode: Exit Ticket Shortcuts
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        console.log('🔧 Auto-filling exit ticket responses');
                        const devResponses = {
                          'biggest-takeaway': 'The biggest takeaway was how easily AI systems can inappropriately reuse personal information across different users and conversations. The simulation clearly demonstrated how student data shared in one context can leak into completely unrelated interactions, creating serious privacy violations that could harm students and expose schools to legal liability.',
                          'student-protection': 'I will implement a strict policy of anonymizing all student information before using any AI tools. This includes replacing names with generic identifiers like "Student A", removing specific ages, diagnoses, addresses, and family details. I will also ensure any AI tools used in my classroom are school-approved and FERPA-compliant, and I will regularly audit my practices to prevent accidental data sharing.',
                          'student-education': 'I will teach students about AI privacy through hands-on activities that show how their personal information can be misused. We will practice identifying what information should never be shared with AI tools, create "safe vs unsafe" examples for different scenarios, and establish classroom norms around protecting personal information when using any digital tools. I will also send resources home to parents about monitoring their children\'s AI tool usage.'
                        };
                        setExitTicketAnswers(devResponses);
                        setTimeout(() => getAIFeedback(), 1500);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Auto-Complete Exit Ticket
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('🔧 Skipping exit ticket');
                        onComplete();
                      }}
                      className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      <FastForward className="w-3 h-3 mr-1" />
                      Skip Exit Ticket
                    </Button>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Auto-fills comprehensive responses and gets AI feedback
                  </p>
                </div>
              )}
              
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
                    className="w-full h-24 p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:border-white/40 focus:outline-none"
                    required
                  />
                  <div className="text-right">
                    {(exitTicketAnswers[question.id]?.length || 0) >= 50 && (
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
                  {/* Prominent AI Feedback Section */}
                  <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 p-6 rounded-xl border-2 border-yellow-400/50 shadow-2xl">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-3">
                        <Sparkles className="w-8 h-8 text-yellow-900" />
                      </div>
                      <h3 className="text-white font-bold text-2xl mb-2">
                        🤖 AI Feedback on Your Reflection
                      </h3>
                      <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                      <p className="text-white text-lg leading-relaxed">{aiFeedback}</p>
                    </div>
                  </div>
                  
                  {/* Completion Button */}
                  <div className="text-center">
                    <Button
                      onClick={onComplete}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-xl rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      🎓 Get Your Certificate
                      <CheckCircle className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {!allAnswered && !aiFeedback && (
                <p className="text-yellow-200 text-sm text-center">
                  Please complete all reflection questions with at least 50 characters each to continue.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Developer Panel */}
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

  // This should never render - only here as fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6 flex items-center justify-center">
      <Card className="bg-slate-800 border-slate-600">
        <CardContent>
          <p className="text-white text-center">Module loading...</p>
        </CardContent>
      </Card>
      
      {/* Developer Panel */}
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