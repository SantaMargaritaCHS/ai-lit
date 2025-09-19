import { Check, Play, Lock } from 'lucide-react';

interface SessionTabsProps {
  currentSession: number;
  onSessionChange?: (session: number) => void;
}

interface Session {
  id: number;
  name: string;
  description: string;
  status: 'completed' | 'active' | 'locked';
}

const sessions: Session[] = [
  {
    id: 1,
    name: 'Session 1',
    description: 'AI Fundamentals ✓',
    status: 'completed'
  },
  {
    id: 2,
    name: 'Session 2',
    description: 'Neural Networks & Training',
    status: 'active'
  },
  {
    id: 3,
    name: 'Session 3',
    description: 'AI Ethics & Bias',
    status: 'locked'
  },
  {
    id: 4,
    name: 'Session 4',
    description: 'Future of AI',
    status: 'locked'
  }
];

export default function SessionTabs({ currentSession, onSessionChange }: SessionTabsProps) {
  const handleSessionClick = (sessionId: number, status: string) => {
    if (status !== 'locked' && onSessionChange) {
      onSessionChange(sessionId);
    }
  };

  return (
    <section className="mb-8">
      <div className="glass-morphism rounded-2xl p-2 border border-white/20">
        <div className="flex flex-wrap gap-2">
          {sessions.map((session) => {
            const isActive = session.id === currentSession;
            const isCompleted = session.status === 'completed';
            const isLocked = session.status === 'locked';
            
            return (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session.id, session.status)}
                disabled={isLocked}
                className={`
                  flex-1 min-w-fit rounded-xl p-4 transition-all duration-300 border-2
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 animate-glow' 
                    : isCompleted
                    ? 'bg-white/10 hover:bg-white/20 border-transparent hover:border-white/30'
                    : isLocked
                    ? 'bg-white/10 border-transparent opacity-60 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 border-transparent hover:border-white/30'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isCompleted 
                      ? 'bg-green-500' 
                      : isActive 
                      ? 'bg-blue-500 animate-pulse' 
                      : 'bg-gray-500'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="text-white text-sm" />
                    ) : isActive ? (
                      <Play className="text-white text-sm" />
                    ) : (
                      <Lock className="text-white text-sm" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className={`font-semibold ${isLocked ? 'text-gray-300' : 'text-white'}`}>
                      {session.name}
                    </div>
                    <div className={`text-xs ${
                      isCompleted ? 'text-green-200' : 
                      isActive ? 'text-blue-200' : 
                      'text-gray-400'
                    }`}>
                      {session.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
