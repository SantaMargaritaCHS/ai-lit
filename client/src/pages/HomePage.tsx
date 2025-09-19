import React, { useState } from 'react';
import { Link } from 'wouter';
import { Book, Clock, Brain, Shield, Globe, MessageSquare, Zap, AlertCircle, Copy, Check, User, ArrowUpDown } from 'lucide-react';
import { useUser } from '../context/UserContext';

const modules = [
  {
    id: 'what-is-ai',
    title: 'What is AI?',
    description: 'Learn about what is ai? through interactive activities.',
    level: 'Beginner',
    duration: '20 min',
    icon: Brain,
    color: 'bg-blue-500',
  },
  {
    id: 'intro-to-gen-ai',
    title: 'Introduction to Generative AI',
    description: 'Learn about introduction to generative ai through interactive activities.',
    level: 'Beginner',
    duration: '20 min',
    icon: Zap,
    color: 'bg-purple-500',
  },
  {
    id: 'responsible-ethical-ai',
    title: 'Responsible and Ethical Use of AI',
    description: 'Learn about principles and practices for using AI technology responsibly and ethically.',
    level: 'Intermediate',
    duration: '20 min',
    icon: Shield,
    color: 'bg-green-600',
  },
  {
    id: 'understanding-llms',
    title: 'Understanding Large Language Models',
    description: 'Learn about understanding large language models through interactive activities.',
    level: 'Intermediate',
    duration: '20 min',
    icon: Book,
    color: 'bg-cyan-500',
  },
  {
    id: 'llm-limitations',
    title: 'Critical Thinking: LLM Limitations',
    description: 'Learn about critical thinking: llm limitations through interactive activities.',
    level: 'Intermediate',
    duration: '20 min',
    icon: AlertCircle,
    color: 'bg-orange-500',
  },
  {
    id: 'privacy-data-rights',
    title: 'Privacy and Data Rights',
    description: 'Learn about privacy and data rights through interactive activities.',
    level: 'Beginner',
    duration: '20 min',
    icon: Shield,
    color: 'bg-green-500',
  },
  {
    id: 'ai-environmental-impact',
    title: 'AI Environmental Impact',
    description: 'Learn about ai environmental impact through interactive activities.',
    level: 'Intermediate',
    duration: '20 min',
    icon: Globe,
    color: 'bg-emerald-500',
  },
  {
    id: 'introduction-to-prompting',
    title: 'Introduction to Prompting',
    description: 'Learn about introduction to prompting through interactive activities.',
    level: 'Beginner',
    duration: '20 min',
    icon: MessageSquare,
    color: 'bg-pink-500',
  },
];

export default function HomePage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'alphabetical' | 'level'>('default');
  const { userName, clearUserName, clearModuleName } = useUser();

  const copyModuleUrl = (e: React.MouseEvent, moduleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/module/${moduleId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(moduleId);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getSortedModules = () => {
    const modulesCopy = [...modules];
    switch (sortOrder) {
      case 'alphabetical':
        return modulesCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'level':
        const levelOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
        return modulesCopy.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
      default:
        return modulesCopy;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Literacy Learning Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interactive modules to help you understand AI and its impact on our world
          </p>
          {userName && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Welcome, <strong>{userName}</strong></span>
              </div>
              <button
                onClick={clearUserName}
                className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                title="Clear stored name (for testing)"
              >
                Clear Name
              </button>
            </div>
          )}
        </div>

        {/* Simple Sort Controls */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white rounded-lg shadow-sm p-2">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Sort by:</span>
            <button
              onClick={() => setSortOrder('default')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                sortOrder === 'default' 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSortOrder('alphabetical')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                sortOrder === 'alphabetical' 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              A-Z
            </button>
            <button
              onClick={() => setSortOrder('level')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                sortOrder === 'level' 
                  ? 'bg-blue-100 text-blue-800 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Level
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getSortedModules().map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.id} className="relative group">
                <Link
                  href={`/module/${module.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                    <div className={`${module.color} h-2`} />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8 text-gray-700" />
                        <span className="text-sm font-medium text-gray-500">
                          {module.level}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{module.duration}</span>
                        </div>
                        <button
                          onClick={(e) => copyModuleUrl(e, module.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
                          title="Copy module link"
                        >
                          {copiedId === module.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">Direct Link Access</h2>
            <p className="text-gray-600 mb-4">
              You can share direct links to any module using the URL format:
            </p>
            <code className="bg-gray-100 px-3 py-1 rounded text-sm">
              https://your-domain.com/module/[module-id]
            </code>
            <p className="text-sm text-gray-500 mt-4">
              Example: https://your-domain.com/module/what-is-ai
            </p>
            <p className="text-xs text-gray-500 mt-2 font-semibold">
              Note: Each module requires its own name entry for proper certificate attribution.
            </p>
          </div>

          {/* Advanced Settings for Testing */}
          <div className="mt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings (Testing)
            </button>
            
            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 mb-3">
                  Clear module-specific names for testing:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => {
                        clearModuleName(module.id);
                        alert(`Cleared name for ${module.title}`);
                      }}
                      className="px-2 py-1 text-xs bg-white hover:bg-red-50 border border-gray-300 rounded"
                      title={`Clear name for ${module.title}`}
                    >
                      Clear {module.id}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      modules.forEach(m => clearModuleName(m.id));
                      clearUserName();
                      alert('Cleared all stored names');
                    }}
                    className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded ml-2"
                  >
                    Clear All Names
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}