import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '../context/UserContext';
import { NameEntry } from '../components/NameEntry';

interface ModulePageProps {
  moduleId: string;
  moduleMap: Record<string, React.ComponentType<any>>;
}

export default function ModulePage({ moduleId, moduleMap }: ModulePageProps) {
  const [, setLocation] = useLocation();
  const { getModuleName, setModuleName } = useUser();
  const Module = moduleMap[moduleId];
  
  // Check for module-specific name
  const moduleUserName = getModuleName(moduleId);

  useEffect(() => {
    // If module doesn't exist, redirect to home
    if (!Module) {
      setLocation('/');
    }
  }, [Module, setLocation]);

  if (!Module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Module Not Found</h1>
          <p className="text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  // If no module-specific name is stored, show the name entry screen
  if (!moduleUserName) {
    const moduleNames = {
      'what-is-ai': 'What is AI?',
      'intro-to-gen-ai': 'Introduction to Generative AI',
      'responsible-ethical-ai': 'Responsible and Ethical Use of AI',
      'understanding-llms': 'Understanding Large Language Models',
      'llm-limitations': 'Critical Thinking: LLM Limitations',
      'privacy-data-rights': 'Privacy and Data Rights',
      'ai-environmental-impact': 'AI Environmental Impact',
      'introduction-to-prompting': 'Introduction to Prompting',
    };
    
    return (
      <NameEntry
        activityTitle={moduleNames[moduleId] || 'AI Learning Module'}
        onNameSubmit={(name) => setModuleName(moduleId, name)}
      />
    );
  }

  return <Module userName={moduleUserName} />;
}