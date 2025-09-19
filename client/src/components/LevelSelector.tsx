import React, { useState } from 'react';
import { Brain, Database, Eye, AlertTriangle, CheckCircle, Star, Shield, Lightbulb, Network, Cpu, BookOpen, Users, ChevronDown, ChevronRight, History, Code } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

interface LevelSelectorProps {
  onSelectModule: (moduleId: string) => void;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: number;
  estimatedTime: string;
  xpReward: number;
  color: string;
}

interface Session {
  id: number;
  title: string;
  description: string;
  modules: Module[];
  color: string;
  icon: React.ComponentType<any>;
}

const sessions: Session[] = [
  {
    id: 1,
    title: 'Session 1: AI Fundamentals & Applications',
    description: 'Master the core concepts of AI, from basic understanding to advanced applications',
    color: 'from-blue-500 to-purple-600',
    icon: Brain,
    modules: [
      {
        id: 'algorithms',
        title: 'From Movie Picks to AI Algorithms',
        description: 'Learn what algorithms are and how they power AI through movie recommendations and hands-on coding',
        icon: Code,
        difficulty: 1,
        estimatedTime: '25 min',
        xpReward: 100,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'ai-history',
        title: 'The History of AI',
        description: 'Journey through AI\'s fascinating timeline from 1950 to today with interactive activities',
        icon: History,
        difficulty: 1,
        estimatedTime: '20 min',
        xpReward: 80,
        color: 'from-indigo-500 to-purple-600'
      },
      {
        id: 'nature-of-ai',
        title: 'The Nature of AI',
        description: 'Learn what AI really is, how it works, and what it can and can\'t do',
        icon: Cpu,
        difficulty: 1,
        estimatedTime: '15 min',
        xpReward: 75,
        color: 'from-cyan-500 to-blue-500'
      },
      {
        id: 'how-ai-learns',
        title: 'How AI Learns',
        description: 'Interactive games teaching machine learning fundamentals and AI training concepts',
        icon: Lightbulb,
        difficulty: 2,
        estimatedTime: '12 min',
        xpReward: 70,
        color: 'from-cyan-500 to-teal-500'
      },
      {
        id: 'neural-network',
        title: 'Neural Network Simulator',
        description: 'Journey through a neural network and learn how AI makes decisions step by step',
        icon: Network,
        difficulty: 2,
        estimatedTime: '18 min',
        xpReward: 80,
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 'ai-training',
        title: 'AI Training Lab',
        description: 'Train your own AI model to classify text and learn how AI pattern-matching works',
        icon: Database,
        difficulty: 2,
        estimatedTime: '20 min',
        xpReward: 75,
        color: 'from-purple-500 to-blue-500'
      },
      {
        id: 'pattern-recognition',
        title: 'Pattern Recognition',
        description: 'Help AI identify patterns in data through hands-on challenges',
        icon: Eye,
        difficulty: 2,
        estimatedTime: '18 min',
        xpReward: 60,
        color: 'from-green-500 to-teal-500'
      },
      {
        id: 'hallucination-detection',
        title: 'Spot AI Hallucinations',
        description: 'Learn to identify when AI makes mistakes or creates false information',
        icon: AlertTriangle,
        difficulty: 3,
        estimatedTime: '15 min',
        xpReward: 80,
        color: 'from-orange-500 to-red-500'
      },
      {
        id: 'bias-exploration',
        title: 'Understanding AI Bias',
        description: 'Explore different types of bias in AI systems and how to recognize them',
        icon: Star,
        difficulty: 3,
        estimatedTime: '20 min',
        xpReward: 90,
        color: 'from-pink-500 to-purple-500'
      }
    ]
  },
  {
    id: 2,
    title: 'Session 2: Large Language Models',
    description: 'Deep dive into understanding Large Language Models and how they process language',
    color: 'from-emerald-500 to-teal-600',
    icon: BookOpen,
    modules: [
      {
        id: 'intro-llms',
        title: 'Introduction to LLMs',
        description: 'Discover what Large Language Models are and how they understand text',
        icon: Brain,
        difficulty: 1,
        estimatedTime: '15 min',
        xpReward: 50,
        color: 'from-blue-500 to-cyan-500'
      }
    ]
  },
  {
    id: 3,
    title: 'Session 3: Advanced Topics',
    description: 'Coming soon - Advanced AI concepts and real-world applications',
    color: 'from-orange-500 to-red-600',
    icon: Users,
    modules: []
  },
  {
    id: 4,
    title: 'Session 4: Future Applications',
    description: 'Coming soon - Exploring the future of AI and emerging technologies',
    color: 'from-violet-500 to-purple-600',
    icon: Star,
    modules: []
  }
];

export function LevelSelector({ onSelectModule }: LevelSelectorProps) {
  const { state } = useGame();
  const { user } = useAuth();
  const [collapsedSessions, setCollapsedSessions] = useState<Set<number>>(new Set());

  const toggleSessionCollapse = (sessionId: number) => {
    const newCollapsed = new Set(collapsedSessions);
    if (newCollapsed.has(sessionId)) {
      newCollapsed.delete(sessionId);
    } else {
      newCollapsed.add(sessionId);
    }
    setCollapsedSessions(newCollapsed);
  };

  const getModuleProgress = (moduleId: string) => {
    return state.moduleProgress[moduleId];
  };

  const getSessionProgress = (session: Session) => {
    if (session.modules.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = session.modules.filter(module => {
      const progress = getModuleProgress(module.id);
      return progress?.completed || false;
    }).length;
    
    return {
      completed,
      total: session.modules.length,
      percentage: Math.round((completed / session.modules.length) * 100)
    };
  };

  const renderModule = (module: Module, sessionId: number) => {
    const IconComponent = module.icon;
    const progress = getModuleProgress(module.id);
    const isCompleted = progress?.completed || false;

    return (
      <div
        key={module.id}
        className="relative overflow-hidden rounded-xl border border-white/20 hover:border-white/40 cursor-pointer hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${module.color} opacity-20`} />
        
        <div className="relative bg-white/10 backdrop-blur-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${module.color}`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-lg font-bold text-white">{module.title}</h4>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <p className="text-blue-200 text-sm mb-2">{module.description}</p>
                
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-blue-300">
                    {Array.from({ length: module.difficulty }, (_, i) => (
                      <Star key={i} className="w-3 h-3 inline-block text-yellow-400 fill-current" />
                    ))}
                  </span>
                  <span className="text-blue-300">⏱️ {module.estimatedTime}</span>
                  <span className="text-blue-300">⚡ {module.xpReward} XP</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              {isCompleted && progress && (
                <div className="mb-1">
                  <div className="text-green-400 font-semibold text-sm">Score: {progress.score}%</div>
                </div>
              )}
              
              <button
                onClick={() => onSelectModule(module.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm bg-gradient-to-r ${module.color} text-white hover:shadow-lg transform hover:scale-105`}
              >
                {isCompleted ? 'Play Again' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <h2 className="text-4xl font-bold text-white">AI Learning Sessions</h2>
          {user?.isAdmin && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full flex items-center space-x-1">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">ADMIN</span>
            </div>
          )}
        </div>
        <p className="text-xl text-blue-200">
          Structured learning paths to master AI concepts step by step!
        </p>
      </div>

      <div className="space-y-8">
        {sessions.map((session) => {
          const SessionIcon = session.icon;
          const sessionProgress = getSessionProgress(session);
          const isComingSoon = session.modules.length === 0;
          const isCollapsed = collapsedSessions.has(session.id);

          return (
            <div
              key={session.id}
              className={`relative overflow-hidden rounded-2xl border border-white/20 ${
                isComingSoon ? 'opacity-60' : ''
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${session.color} opacity-10`} />
              
              <div className="relative bg-white/10 backdrop-blur-lg">
                {/* Session Header - Always Visible */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${session.color}`}>
                        <SessionIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{session.title}</h3>
                        <p className="text-blue-200">{session.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {!isComingSoon && (
                        <div className="text-right">
                          <div className="text-white font-semibold text-lg">
                            {sessionProgress.completed}/{sessionProgress.total} Complete
                          </div>
                          <div className="text-blue-300 text-sm">
                            {sessionProgress.percentage}% Progress
                          </div>
                        </div>
                      )}
                      
                      {!isComingSoon && (
                        <button
                          onClick={() => toggleSessionCollapse(session.id)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
                          aria-label={isCollapsed ? 'Expand session' : 'Collapse session'}
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar - Always Visible for Active Sessions */}
                  {!isComingSoon && (
                    <div className="w-full bg-white/20 rounded-full h-3 mt-4">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${session.color}`}
                        style={{ width: `${sessionProgress.percentage}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Session Content - Collapsible */}
                {!isCollapsed && (
                  <div className="px-6 pb-6">
                    {isComingSoon ? (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">🚧</div>
                        <h4 className="text-xl font-semibold text-white mb-2">Coming Soon!</h4>
                        <p className="text-blue-200">
                          This session is being developed and will be available in a future update.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {session.modules.map((module) => renderModule(module, session.id))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Overview */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Session-Based Learning</h3>
        </div>
        <div className="text-blue-100 space-y-2">
          <p>• <strong>Session 1:</strong> Core AI concepts, learning methods, and practical applications</p>
          <p>• <strong>Session 2:</strong> Specialized focus on Large Language Models and text processing</p>
          <p>• <strong>Sessions 3 & 4:</strong> Advanced topics and future applications (coming soon)</p>
          <p>• Complete modules in any order within each session</p>
          <p>• Track your progress across different areas of AI knowledge</p>
          <p>• <strong>💡 Tip:</strong> Click the arrow buttons to collapse/expand sessions for a cleaner view</p>
        </div>
      </div>

      {user?.isAdmin && (
        <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Admin Note</h3>
          </div>
          <div className="text-yellow-100 space-y-2">
            <p>• Added new AI History module with video content and interactive timeline</p>
            <p>• Session 1 contains all modules except Introduction to LLMs as requested</p>
            <p>• Session 2 focuses specifically on Large Language Models</p>
            <p>• AI History module includes drag-and-drop timeline and AI-powered challenges</p>
            <p>• Students can access all available modules within each session</p>
            <p>• Collapsible functionality helps manage screen space and focus</p>
          </div>
        </div>
      )}
    </div>
  );
}