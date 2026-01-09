import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Book, Clock, Brain, Shield, Globe, MessageSquare, Zap, AlertCircle, Copy, Check, User, ArrowUpDown, ExternalLink, FileText, ChevronUp, ChevronDown, Compass, BookOpen, Wrench, Code } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ModuleOutline } from '../components/ModuleOutline';
import { ModuleInventory } from '../components/ModuleInventory';
import { saveModuleOrder, loadModuleOrder, clearModuleOrder, hasCustomModuleOrder } from '../lib/moduleOrderPersistence';

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
    duration: '15 min',
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
  {
    id: 'ancient-compass-ai-ethics',
    title: 'AI Ethics: An Ancient Compass',
    description: 'Explore AI ethics through Catholic Social Teaching principles: Human Dignity, Common Good, and Solidarity.',
    level: 'Intermediate',
    duration: '25 min',
    icon: Compass,
    color: 'bg-indigo-600',
  },
];

export default function HomePage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'alphabetical' | 'level'>('default');
  const [outlineModuleId, setOutlineModuleId] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [customModuleOrder, setCustomModuleOrder] = useState<string[]>([]);
  const { userName, clearUserName, clearModuleName } = useUser();

  // Load custom module order on mount
  useEffect(() => {
    const savedOrder = loadModuleOrder();
    if (savedOrder) {
      setCustomModuleOrder(savedOrder);
    }
  }, []);

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

  const copyProductionUrl = (e: React.MouseEvent, moduleId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `https://AILitStudents.replit.app/module/${moduleId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(`prod-${moduleId}`);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const openModuleOutline = (e: React.MouseEvent, moduleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOutlineModuleId(moduleId);
  };

  const moveModuleUp = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (index === 0) return; // Already at top

    const currentModules = getSortedModules();
    const newOrder = [...currentModules];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];

    const newModuleIds = newOrder.map(m => m.id);
    console.log('Moving up - New order:', newModuleIds);
    setCustomModuleOrder(newModuleIds);
    saveModuleOrder(newModuleIds);
  };

  const moveModuleDown = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const currentModules = getSortedModules();
    if (index === currentModules.length - 1) return; // Already at bottom

    const newOrder = [...currentModules];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];

    const newModuleIds = newOrder.map(m => m.id);
    console.log('Moving down - New order:', newModuleIds);
    setCustomModuleOrder(newModuleIds);
    saveModuleOrder(newModuleIds);
  };

  const resetModuleOrder = () => {
    clearModuleOrder();
    setCustomModuleOrder([]);
    setReorderMode(false);
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
        // Apply custom order if it exists
        if (customModuleOrder.length > 0) {
          return modulesCopy.sort((a, b) => {
            const indexA = customModuleOrder.indexOf(a.id);
            const indexB = customModuleOrder.indexOf(b.id);
            // If module not in custom order, put it at the end
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
        }
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
        <div className="flex justify-center items-center gap-4 mb-8">
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

          {/* Activity Inventory Link */}
          <button
            onClick={() => setShowInventory(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 rounded-lg shadow-sm transition-colors border border-gray-200 hover:border-blue-300"
            title="Browse reusable activity components"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700 hover:text-blue-700">Activity Inventory</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getSortedModules().map((module, index) => {
            const Icon = module.icon;
            const sortedModules = getSortedModules();
            const isFirst = index === 0;
            const isLast = index === sortedModules.length - 1;

            return (
              <div key={module.id} className="relative group" style={{ paddingTop: reorderMode ? '20px' : '0' }}>
                {/* Reorder Arrows - Only visible in reorder mode */}
                {reorderMode && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex gap-1 bg-white rounded-lg shadow-lg p-1.5 border-2 border-blue-300">
                    <button
                      onClick={(e) => {
                        console.log('Up button clicked for index:', index);
                        moveModuleUp(e, index);
                      }}
                      disabled={isFirst}
                      className={`p-1.5 rounded transition-colors ${
                        isFirst
                          ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                          : 'text-blue-700 hover:bg-blue-100 bg-blue-50 cursor-pointer'
                      }`}
                      aria-label={`Move ${module.title} up`}
                      aria-disabled={isFirst}
                      title={isFirst ? 'Already at top' : 'Move up'}
                      type="button"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        console.log('Down button clicked for index:', index);
                        moveModuleDown(e, index);
                      }}
                      disabled={isLast}
                      className={`p-1.5 rounded transition-colors ${
                        isLast
                          ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                          : 'text-blue-700 hover:bg-blue-100 bg-blue-50 cursor-pointer'
                      }`}
                      aria-label={`Move ${module.title} down`}
                      aria-disabled={isLast}
                      title={isLast ? 'Already at bottom' : 'Move down'}
                      type="button"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                )}

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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => openModuleOutline(e, module.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-purple-100 rounded-lg"
                            title="View activity outline"
                          >
                            <FileText className="w-4 h-4 text-purple-600" />
                          </button>
                          <button
                            onClick={(e) => copyModuleUrl(e, module.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
                            title="Copy local link"
                          >
                            {copiedId === module.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={(e) => copyProductionUrl(e, module.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-100 rounded-lg"
                            title="Copy production link"
                          >
                            {copiedId === `prod-${module.id}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <ExternalLink className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          {/* Advanced Settings for Testing */}
          <div className="mt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings (Testing)
            </button>

            {/* Developer Tools Links */}
            <div className="mt-2 flex gap-4 justify-center">
              <Link href="/builder">
                <a className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 underline">
                  <Wrench className="w-3 h-3" />
                  Module Builder (Beta)
                </a>
              </Link>
              <Link href="/export-html">
                <a className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 underline">
                  <Code className="w-3 h-3" />
                  Export HTML (LMS)
                </a>
              </Link>
            </div>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-4">
                {/* Reorder Mode Toggle */}
                <div className="border-b border-gray-300 pb-4">
                  <p className="text-xs text-gray-600 mb-3">
                    Module reordering (developer only):
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setReorderMode(!reorderMode)}
                      className={`px-3 py-2 text-xs rounded transition-colors ${
                        reorderMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-700'
                      }`}
                    >
                      {reorderMode ? '✓ Reorder Mode Active' : 'Enable Reorder Mode'}
                    </button>
                    {hasCustomModuleOrder() && (
                      <button
                        onClick={resetModuleOrder}
                        className="px-3 py-2 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        title="Reset to default order"
                      >
                        Reset Order
                      </button>
                    )}
                  </div>
                  {reorderMode && (
                    <p className="text-xs text-gray-500 mt-2">
                      Use ↑↓ arrows on cards to reorder. Changes save automatically.
                    </p>
                  )}
                </div>

                {/* Name Clearing Section */}
                <div>
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
              </div>
            )}
          </div>
        </div>

        {/* Module Outline Modal */}
        {outlineModuleId && (
          <ModuleOutline
            moduleId={outlineModuleId}
            isOpen={!!outlineModuleId}
            onClose={() => setOutlineModuleId(null)}
          />
        )}

        {/* Module Activity Inventory Modal */}
        <ModuleInventory
          isOpen={showInventory}
          onClose={() => setShowInventory(false)}
        />
      </div>
    </div>
  );
}